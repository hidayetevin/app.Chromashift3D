class UIManager {
    constructor() {
        this.screens = {
            start: document.getElementById('start-screen'),
            hud: document.getElementById('ui-layer'),
            tutorial: document.getElementById('tutorial-overlay'),
            score: document.getElementById('score'),
            bestScore: document.getElementById('best-score'),
            bestHud: document.getElementById('best-val'),
            settings: document.getElementById('settings-overlay')
        };

        this.currentLanguage = localStorage.getItem('chromashift_lang') || 'EN';
        this.setupEventListeners();
        this.updateTexts();
    }

    setupEventListeners() {
        // Settings Button
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.screens.settings.style.display = 'flex';
            });
        }

        // Settings Close
        const settingsCloseBtn = document.getElementById('settings-close-btn');
        if (settingsCloseBtn) {
            settingsCloseBtn.addEventListener('click', () => {
                this.screens.settings.style.display = 'none';
            });
        }

        // Language Buttons
        document.getElementById('lang-tr').addEventListener('click', () => this.setLanguage('TR'));
        document.getElementById('lang-en').addEventListener('click', () => this.setLanguage('EN'));

        // Sound Toggle
        const soundToggle = document.getElementById('sound-toggle');
        soundToggle.addEventListener('change', (e) => {
            // Logic for sound can be added to AudioManager
            console.log("Sound enabled:", e.target.checked);
        });
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('chromashift_lang', lang);
        this.updateTexts();

        // Update UI Active states
        document.getElementById('lang-tr').classList.toggle('active', lang === 'TR');
        document.getElementById('lang-en').classList.toggle('active', lang === 'EN');
    }

    updateTexts() {
        const texts = {
            TR: {
                start: "BAŞLA",
                settings: "AYARLAR",
                sound: "SES",
                language: "DİL",
                close: "KAPAT",
                gameOver: "OYUN BİTTİ",
                score: "SKOR",
                best: "EN İYİ",
                revive: "DEVAM?",
                reviveMsg: (s) => `Skor: ${s}\nReklam izleyerek devam etmek ister misin?`,
                continue: "DEVAM",
                giveup: "VAZGEÇ",
                tutorial: "Zıplamak için tıkla!"
            },
            EN: {
                start: "TAP TO START",
                settings: "SETTINGS",
                sound: "SOUND",
                language: "LANGUAGE",
                close: "CLOSE",
                gameOver: "GAME OVER",
                score: "SCORE",
                best: "BEST",
                revive: "REVIVE?",
                reviveMsg: (s) => `Score: ${s}\nWatch a short ad to continue from here?`,
                continue: "CONTINUE",
                giveup: "GIVE UP",
                tutorial: "Tap to Jump!"
            }
        };

        const t = texts[this.currentLanguage];

        // Apply translations
        document.getElementById('start-btn').innerText = t.start;
        document.getElementById('settings-btn').innerText = t.settings;
        document.getElementById('settings-title').innerText = t.settings;
        document.getElementById('label-sound').innerText = t.sound;
        document.getElementById('label-language').innerText = t.language;
        document.getElementById('settings-close-btn').innerText = t.close;

        // Update tutorial and game over labels if they exist
        const goTitle = document.querySelector('.game-over-title');
        if (goTitle) goTitle.innerText = t.gameOver;
    }

    showStartScreen(bestScore = 0) {
        this.screens.start.style.display = 'flex';
        this.screens.tutorial.style.display = 'none';
        this.updateBestScore(bestScore);
    }

    hideStartScreen() {
        this.screens.start.style.opacity = '0';
        setTimeout(() => {
            this.screens.start.style.display = 'none';
        }, 400);
    }

    updateScore(score) {
        if (this.screens.score) this.screens.score.innerText = score;
    }

    updateBestScore(best) {
        if (this.screens.bestScore) this.screens.bestScore.innerText = best;
        if (this.screens.bestHud) this.screens.bestHud.innerText = best;
    }

    showTutorial(text) {
        if (this.screens.tutorial) {
            this.screens.tutorial.innerText = text;
            this.screens.tutorial.style.display = 'block';
            setTimeout(() => {
                this.screens.tutorial.style.display = 'none';
            }, 3000);
        }
    }

    showGameOver(score, bestScore) {
        let goScreen = document.getElementById('game-over-screen');
        if (!goScreen) {
            goScreen = document.createElement('div');
            goScreen.id = 'game-over-screen';
            goScreen.innerHTML = `
                <h1 class="game-over-title">GAME OVER</h1>
                <div class="stat-container">
                    <span class="stat-label">SCORE</span>
                    <span id="go-score" class="stat-value">0</span>
                    <div style="margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
                        <span class="stat-label">BEST</span>
                        <span id="go-best" class="stat-value" style="font-size: 24px; color: var(--accent);">0</span>
                    </div>
                </div>
                <button id="restart-btn" class="glow-button">TRY AGAIN</button>
            `;
            document.body.appendChild(goScreen);

            document.getElementById('restart-btn').addEventListener('click', () => {
                window.location.reload();
            });
        }

        document.getElementById('go-score').innerText = score;
        document.getElementById('go-best').innerText = bestScore;
        goScreen.style.display = 'flex';
    }

    /**
     * Shows a custom game-themed confirmation modal.
     * @param {string} title - Title of the modal.
     * @param {string} text - Description/Message.
     * @param {string} confirmText - Label for confirm button.
     * @param {string} cancelText - Label for cancel button.
     * @returns {Promise<boolean>} - Resolves to true if confirmed, false otherwise.
     */
    showConfirm(title, text, confirmText = "YES", cancelText = "NO") {
        return new Promise((resolve) => {
            let overlay = document.getElementById('custom-modal-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'custom-modal-overlay';
                overlay.className = 'modal-overlay';
                overlay.innerHTML = `
                    <div class="modal-content">
                        <div id="modal-title" class="modal-title"></div>
                        <div id="modal-text" class="modal-text"></div>
                        <div class="modal-buttons">
                            <button id="modal-cancel-btn" class="modal-btn modal-btn-cancel"></button>
                            <button id="modal-confirm-btn" class="modal-btn modal-btn-confirm"></button>
                        </div>
                    </div>
                `;
                document.body.appendChild(overlay);
            }

            const titleEl = document.getElementById('modal-title');
            const textEl = document.getElementById('modal-text');
            const confirmBtn = document.getElementById('modal-confirm-btn');
            const cancelBtn = document.getElementById('modal-cancel-btn');

            titleEl.innerText = title;
            textEl.innerText = text;
            confirmBtn.innerText = confirmText;
            cancelBtn.innerText = cancelText;

            overlay.style.display = 'flex';

            const cleanup = (result) => {
                overlay.style.display = 'none';
                confirmBtn.onclick = null;
                cancelBtn.onclick = null;
                resolve(result);
            };

            confirmBtn.onclick = () => cleanup(true);
            cancelBtn.onclick = () => cleanup(false);
        });
    }
}

export default new UIManager();
