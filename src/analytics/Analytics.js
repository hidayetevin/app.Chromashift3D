import { FirebaseAnalytics } from '@capacitor-firebase/analytics';

class Analytics {
    constructor() {
        this.isEnabled = true;
        this.isSupported = false; // Assume false initially
        this.eventQueue = [];
        this.isOffline = !navigator.onLine;

        window.addEventListener('online', () => {
            this.isOffline = false;
            this.flushQueue();
        });

        window.addEventListener('offline', () => {
            this.isOffline = true;
        });
    }

    async init() {
        try {
            await FirebaseAnalytics.setEnabled({ enabled: true });
            console.log('Firebase Analytics initialized');
            this.isSupported = true;
            this.flushQueue();
        } catch (error) {
            console.warn('Analytics init failed (Web Mode?): Disabling analytics.');
            this.isSupported = false;
        }
    }

    track(eventName, params = {}) {
        if (!this.isEnabled || !this.isSupported) return;

        const eventData = {
            name: eventName,
            params: {
                ...params,
                timestamp: Date.now()
            }
        };

        if (this.isOffline) {
            this.eventQueue.push(eventData);
            // console.log('[Analytics - Offline Queue]', eventName, params);
            return;
        }

        // Use Promise to handle potential async errors without crashing
        Promise.resolve().then(() => {
            return FirebaseAnalytics.logEvent(eventData);
        }).then(() => {
            // console.log('[Analytics - Sent]', eventName, params);
        }).catch(error => {
            // Suppress repeated errors in dev log
            // console.warn('[Analytics - Fail]', error);
            this.eventQueue.push(eventData);
        });
    }

    flushQueue() {
        if (this.eventQueue.length === 0) return;

        console.log(`[Analytics] Flushing ${this.eventQueue.length} events...`);
        const queue = [...this.eventQueue];
        this.eventQueue = [];

        queue.forEach(event => {
            this.track(event.name, event.params);
        });
    }
}

export default new Analytics();
