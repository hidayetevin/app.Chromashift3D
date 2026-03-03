import { AdMob, BannerAdPosition, RewardAdPluginEvents, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import { App } from '@capacitor/app';
import Analytics from '../analytics/Analytics.js';
import RewardSystem from './RewardSystem.js';

// USING TEST IDS FOR DEVELOPMENT
// Replace with Real IDS for Production
const PROD_IDS = {
    banner: 'ca-app-pub-4190858087915294/4062394583',
    interstitial: 'ca-app-pub-4190858087915294/2533690499',
    rewarded: 'ca-app-pub-4190858087915294/3990350195'
};

class AdsManager {
    constructor() {
        this.isInitialized = false;
        this.interstitialCooldown = 30000; // 30s cooldown

        // Load persisted tracking data
        this.lastInterstitialTime = parseInt(localStorage.getItem('chromashift_ad_time') || '0');
        this.restartCount = parseInt(localStorage.getItem('chromashift_restarts') || '0');

        this.states = {
            interstitial: 'IDLE',
            rewarded: 'IDLE'
        };

        this.retryCount = {
            interstitial: 0,
            rewarded: 0
        };

        // Ad Pool Architecture
        // Note: Capacitor AdMob API natively supports holding max 1 preloaded ad per ID in memory
        this.pool = {
            interstitial: { ready: 0, max: 1 },
            rewarded: { ready: 0, max: 1 }
        };

        this.adIds = PROD_IDS;
    }

    refillPool(type) {
        if (!this.isInitialized) return;

        if (type === 'interstitial' && this.pool.interstitial.ready < this.pool.interstitial.max) {
            console.log('Ad Pool: Refilling Interstitial...');
            this.prepareInterstitial();
        } else if (type === 'rewarded' && this.pool.rewarded.ready < this.pool.rewarded.max) {
            console.log('Ad Pool: Refilling Rewarded...');
            this.prepareRewarded();
        }
    }

    async init() {
        try {
            await AdMob.initialize({
                requestTrackingAuthorization: true,
                initializeForTesting: false // Disabled for production
            });
            this.isInitialized = true;
            console.log('AdMob Initialized');

            this.setupListeners();

            // Stagger downloads so they don't block logic on slower devices
            this.showBanner();

            // Interstitial: start filling pool 1 second after startup
            setTimeout(() => {
                this.refillPool('interstitial');
            }, 1000);

            // Rewarded: start filling pool 2 seconds after startup
            setTimeout(() => {
                this.refillPool('rewarded');
            }, 2000);
        } catch (error) {
            console.warn('AdMob Init Failed (Web Mode?):', error);
        }
    }

    setupListeners() {
        // Interstitial
        AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
            this.states.interstitial = 'READY';
            this.pool.interstitial.ready = 1;
            this.retryCount.interstitial = 0; // Reset retries on success
            console.log(`Ad Pool Update: Interstitial Ready (${this.pool.interstitial.ready}/${this.pool.interstitial.max})`);
        });
        AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
            this.states.interstitial = 'IDLE';
            this.pool.interstitial.ready = 0;
            this.refillPool('interstitial'); // Immediately queue refill
        });
        AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, () => {
            this.states.interstitial = 'ERROR';
            this.pool.interstitial.ready = 0;
            const waitTime = Math.min(5000 * Math.pow(2, this.retryCount.interstitial), 60000);
            this.retryCount.interstitial++;
            setTimeout(() => this.refillPool('interstitial'), waitTime);
        });

        // Rewarded
        AdMob.addListener(RewardAdPluginEvents.Loaded, () => {
            this.states.rewarded = 'READY';
            this.pool.rewarded.ready = 1;
            this.retryCount.rewarded = 0; // Reset retries on success
            console.log(`Ad Pool Update: Rewarded Ready (${this.pool.rewarded.ready}/${this.pool.rewarded.max})`);
        });
        AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
            this.states.rewarded = 'IDLE';
            this.pool.rewarded.ready = 0;
            this.refillPool('rewarded'); // Immediately queue refill
        });
        AdMob.addListener(RewardAdPluginEvents.FailedToLoad, () => {
            this.states.rewarded = 'ERROR';
            this.pool.rewarded.ready = 0;
            const waitTime = Math.min(5000 * Math.pow(2, this.retryCount.rewarded), 60000);
            this.retryCount.rewarded++;
            setTimeout(() => this.refillPool('rewarded'), waitTime);
        });
    }

    async showBanner() {
        if (!this.isInitialized) return;
        try {
            await AdMob.showBanner({
                adId: this.adIds.banner,
                position: BannerAdPosition.BOTTOM,
                margin: 0
            });
        } catch (e) {
            console.warn('Banner Error:', e);
        }
    }

    async prepareInterstitial() {
        if (!this.isInitialized || this.states.interstitial === 'LOADING') return;
        this.states.interstitial = 'LOADING';
        try {
            await AdMob.prepareInterstitial({ adId: this.adIds.interstitial });
        } catch (e) {
            console.warn('Prepare Interstitial Error:', e);
            this.states.interstitial = 'ERROR';
        }
    }

    async showInterstitial(force = false) {
        if (!this.isInitialized) return false;

        const now = Date.now();

        if (!force) {
            // Wait at least 30 seconds since the last ad
            if (now - this.lastInterstitialTime < this.interstitialCooldown) {
                console.log('Interstitial Cooldown Active');
                return false;
            }

            // Increment restart/transition count
            this.restartCount++;
            localStorage.setItem('chromashift_restarts', this.restartCount.toString());

            // Show exactly on every 3rd try (never on the 1st restart)
            const INTERSTITIAL_FREQUENCY = 3;
            if (this.restartCount % INTERSTITIAL_FREQUENCY !== 0) {
                console.log(`Interstitial skipped. Transition count: ${this.restartCount}`);
                return false;
            }
        }

        // Consume from Pool
        if (this.pool.interstitial.ready > 0) {
            return new Promise(async (resolve) => {
                let resolved = false;
                const finish = (shown) => {
                    if (resolved) return;
                    resolved = true;
                    resolve(shown);
                };

                let dismissHandler = null;
                let failedHandler = null;

                try {
                    dismissHandler = await AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
                        if (dismissHandler) dismissHandler.remove();
                        if (failedHandler) failedHandler.remove();
                        finish(true);
                    });

                    failedHandler = await AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, () => {
                        if (dismissHandler) dismissHandler.remove();
                        if (failedHandler) failedHandler.remove();
                        finish(false);
                    });

                    await AdMob.showInterstitial();
                    this.lastInterstitialTime = now;
                    localStorage.setItem('chromashift_ad_time', this.lastInterstitialTime.toString());
                    Analytics.track('ad_impression', { type: 'interstitial' });

                    // Watchdog: resolve after 2 minutes anyway
                    setTimeout(() => finish(false), 120000);
                } catch (e) {
                    console.error("Ad Show Failed", e);
                    if (dismissHandler) dismissHandler.remove();
                    if (failedHandler) failedHandler.remove();
                    finish(false);
                }
            });
        } else {
            console.log('Ad Pool: Interstitial empty, proceeding without ad. Triggering refill.');
            this.refillPool('interstitial');
            return false;
        }
    }

    async prepareRewarded() {
        if (!this.isInitialized || this.states.rewarded === 'LOADING') return;
        this.states.rewarded = 'LOADING';
        try {
            await AdMob.prepareRewardVideoAd({ adId: this.adIds.rewarded });
        } catch (e) {
            console.warn('Prepare Rewarded Error:', e);
            this.states.rewarded = 'ERROR';
        }
    }

    async showRewarded(rewardType) {
        // Offline/Dev Fallback
        if (!this.isInitialized) {
            console.log('AdMob Not Init - Granting Free Reward');
            RewardSystem.grantReward(rewardType);
            return true;
        }

        // Consume from pool
        if (this.pool.rewarded.ready === 0) {
            console.warn('Ad Pool: Rewarded empty - Failing gracefully. Triggering refill.');
            this.refillPool('rewarded');
            return false;
        }

        return new Promise(async (resolve) => {
            let earned = false;
            let resolved = false;

            const finish = (result) => {
                if (resolved) return;
                resolved = true;
                resolve(result);
            };

            let rewardListener = null;
            let dismissListener = null;
            let failedListener = null;

            try {
                rewardListener = await AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
                    earned = true;
                });

                dismissListener = await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
                    if (rewardListener) rewardListener.remove();
                    if (dismissListener) dismissListener.remove();
                    if (failedListener) failedListener.remove();

                    if (earned) {
                        RewardSystem.grantReward(rewardType);
                        Analytics.track('rewarded_ad_complete', { type: rewardType });
                        finish(true);
                    } else {
                        finish(false);
                    }
                });

                failedListener = await AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => {
                    if (rewardListener) rewardListener.remove();
                    if (dismissListener) dismissListener.remove();
                    if (failedListener) failedListener.remove();
                    finish(false);
                });

                await AdMob.showRewardVideoAd();

                // Watchdog
                setTimeout(() => finish(false), 120000);
            } catch (e) {
                console.error("Rewarded Ad Error", e);
                if (rewardListener) rewardListener.remove();
                if (dismissListener) dismissListener.remove();
                if (failedListener) failedListener.remove();
                finish(false);
            }
        });
    }
}

export default new AdsManager();
