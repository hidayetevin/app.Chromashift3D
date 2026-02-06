import { FirebaseAnalytics } from '@capacitor-firebase/analytics';

class Analytics {
    constructor() {
        this.isEnabled = true;
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
            this.flushQueue();
        } catch (error) {
            console.warn('Analytics init failed (Web Mode?):', error);
            // We might be on web, so we just log to console
        }
    }

    track(eventName, params = {}) {
        const eventData = {
            name: eventName,
            params: {
                ...params,
                timestamp: Date.now()
            }
        };

        if (this.isOffline) {
            this.eventQueue.push(eventData);
            console.log('[Analytics - Offline Queue]', eventName, params);
            return;
        }

        try {
            FirebaseAnalytics.logEvent(eventData);
            console.log('[Analytics - Sent]', eventName, params);
        } catch (error) {
            // Fallback or ignore
            console.warn('[Analytics - Fail]', error);
            this.eventQueue.push(eventData);
        }
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
