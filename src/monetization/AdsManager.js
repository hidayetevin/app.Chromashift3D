import { AdMob, BannerAdPosition, RewardAdPluginEvents, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import { App } from '@capacitor/app';
import Analytics from '../analytics/Analytics.js';
import RewardSystem from './RewardSystem.js';

// USING TEST IDS FOR DEVELOPMENT
// Replace with Real IDs for Production
const TEST_IDS = {
    banner: 'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded: 'ca-app-pub-3940256099942544/5224354917'
};

class AdsManager {
    constructor() {
        this.isInitialized = false;
        this.lastInterstitialTime = 0;
        this.interstitialCooldown = 30000; // 30s cooldown

        this.states = {
            interstitial: 'IDLE',
            rewarded: 'IDLE'
        };

        this.adIds = TEST_IDS;
    }

    async init() {
        try {
            await AdMob.initialize({
                requestTrackingAuthorization: true,
                initializeForTesting: true // Set to false in production
            });
            this.isInitialized = true;
            console.log('AdMob Initialized');

            this.setupListeners();
            this.showBanner();
            this.prepareInterstitial();
            this.prepareRewarded();
        } catch (error) {
            console.warn('AdMob Init Failed (Web Mode?):', error);
        }
    }

    setupListeners() {
        // Interstitial
        AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
            this.states.interstitial = 'READY';
        });
        AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
            this.states.interstitial = 'IDLE';
            this.prepareInterstitial();
        });
        AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, () => {
            this.states.interstitial = 'ERROR';
            setTimeout(() => this.prepareInterstitial(), 15000);
        });

        // Rewarded
        AdMob.addListener(RewardAdPluginEvents.Loaded, () => {
            this.states.rewarded = 'READY';
        });
        AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
            this.states.rewarded = 'IDLE';
            this.prepareRewarded();
        });
        AdMob.addListener(RewardAdPluginEvents.FailedToLoad, () => {
            this.states.rewarded = 'ERROR';
            setTimeout(() => this.prepareRewarded(), 15000);
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
        if (!this.isInitialized) return;

        const now = Date.now();
        if (!force && now - this.lastInterstitialTime < this.interstitialCooldown) {
            console.log('Interstitial Cooldown Active');
            return;
        }

        if (this.states.interstitial === 'READY') {
            await AdMob.showInterstitial();
            this.lastInterstitialTime = now;
            Analytics.track('ad_impression', { type: 'interstitial' });
        } else {
            console.log('Interstitial Not Ready');
            this.prepareInterstitial();
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

        if (this.states.rewarded !== 'READY') {
            console.log('Rewarded Ad Not Ready');
            this.prepareRewarded();
            return false;
        }

        return new Promise((resolve) => {
            let earned = false;
            const onReward = AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
                earned = true;
            });
            const onDismiss = AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
                onReward.remove();
                onDismiss.remove();
                if (earned) {
                    RewardSystem.grantReward(rewardType);
                    Analytics.track('rewarded_ad_complete', { type: rewardType });
                    resolve(true);
                } else {
                    resolve(false);
                }
            });

            AdMob.showRewardVideoAd().catch(() => {
                onReward.remove();
                onDismiss.remove();
                resolve(false);
            });
        });
    }
}

export default new AdsManager();
