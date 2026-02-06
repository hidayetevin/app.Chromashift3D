class SaveSystem {
    constructor() {
        this.storage = this.detectStorage();
        this.memoryFallback = {};
    }

    detectStorage() {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return 'localStorage';
        } catch (e) {
            console.warn('LocalStorage unavailable, using memory fallback');
            return 'memory';
        }
    }

    set(key, value) {
        try {
            if (this.storage === 'localStorage') {
                localStorage.setItem(key, JSON.stringify(value));
            } else {
                this.memoryFallback[key] = value;
            }
        } catch (e) {
            console.error('SaveSystem Write Error:', e);
            this.memoryFallback[key] = value;
        }
    }

    get(key, defaultValue = null) {
        try {
            let value;
            if (this.storage === 'localStorage') {
                const item = localStorage.getItem(key);
                value = item ? JSON.parse(item) : undefined;
            } else {
                value = this.memoryFallback[key];
            }
            return value !== undefined ? value : defaultValue;
        } catch (e) {
            console.error('SaveSystem Read Error:', e);
            return defaultValue;
        }
    }

    remove(key) {
        if (this.storage === 'localStorage') {
            localStorage.removeItem(key);
        } else {
            delete this.memoryFallback[key];
        }
    }
}

export default new SaveSystem();
