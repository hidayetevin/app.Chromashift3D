class AudioManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        const saved = localStorage.getItem('chromashift_sound');
        this.enabled = saved !== null ? saved === 'true' : true;
    }

    setEnabled(value) {
        this.enabled = value;
        localStorage.setItem('chromashift_sound', value);
    }

    shouldPlay() {
        return this.enabled && this.ctx.state !== 'suspended';
    }

    playTone(freq, type, duration) {
        if (!this.enabled) return;

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playTap() {
        this.playTone(400, 'sine', 0.1);
    }

    playMorph() {
        this.playTone(600, 'triangle', 0.15);
    }

    playBounce() {
        this.playTone(150, 'sine', 0.2);
    }

    playSuccess() {
        this.playTone(800, 'sine', 0.1);
        setTimeout(() => this.playTone(1200, 'sine', 0.2), 100);
    }

    playFail() {
        this.playTone(150, 'sawtooth', 0.5);
        this.playTone(100, 'sawtooth', 0.5);
    }
}

export default new AudioManager();
