class UIManager {
    constructor() {
        this.screens = {
            start: document.getElementById('start-screen'),
            hud: document.getElementById('ui-layer'),
            tutorial: document.getElementById('tutorial-overlay'),
            score: document.getElementById('score'),
            bestScore: document.getElementById('best-score'),
            bestHud: document.getElementById('best-val'),
            settings: document.getElementById('settings-overlay'),
            pause: document.getElementById('pause-overlay'),
            stars: document.getElementById('star-val')
        };

        this.currentLanguage = localStorage.getItem('chromashift_lang') || 'EN';

        // Sync Sound Toggle with global state
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            import('../audio/AudioManager.js').then(module => {
                soundToggle.checked = module.default.enabled;
            });
        }

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
            import('../audio/AudioManager.js').then(module => {
                module.default.setEnabled(e.target.checked);
            });
        });

        // Pause Button
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                import('../core/Game.js').then(game => game.default.pause());
            });
        }

        // Resume Button
        document.getElementById('resume-btn').addEventListener('click', () => {
            import('../core/Game.js').then(game => game.default.resume());
        });

        // Restart Game Button (from Pause)
        document.getElementById('restart-game-btn').addEventListener('click', () => {
            window.location.reload(); // Simple approach for now
        });

        // Quit Button
        document.getElementById('quit-btn').addEventListener('click', () => {
            window.location.reload(); // Returns to main menu by default
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
                tutorial: "Zıplamak için tıkla!",
                pause: "DURAKLATILDI",
                resume: "DEVAM ET",
                restart: "YENİDEN BAŞLA",
                quit: "OYUNDAN ÇIK"
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
                tutorial: "Tap to Jump!",
                pause: "PAUSED",
                resume: "RESUME",
                restart: "RESTART",
                quit: "QUIT GAME"
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

        // Pause translations
        document.getElementById('pause-title').innerText = t.pause;
        document.getElementById('resume-btn').innerText = t.resume;
        document.getElementById('restart-game-btn').innerText = t.restart;
        document.getElementById('quit-btn').innerText = t.quit;

        // Update tutorial and game over labels if they exist
        const goTitle = document.querySelector('.game-over-title');
        if (goTitle) goTitle.innerText = t.gameOver;

        // Ensure language buttons reflect the current state
        const trBtn = document.getElementById('lang-tr');
        const enBtn = document.getElementById('lang-en');
        if (trBtn && enBtn) {
            trBtn.classList.toggle('active', this.currentLanguage === 'TR');
            enBtn.classList.toggle('active', this.currentLanguage === 'EN');
        }
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

    updateStars(count) {
        if (this.screens.stars) this.screens.stars.innerText = count;
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
        goScreen.style.display = 'flex';
    }

    hideGameOver() {
        const goScreen = document.getElementById('game-over-screen');
        if (goScreen) goScreen.style.display = 'none';
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

    showComboText() {
        // Create pool or just create/remove for now (optimization later if needed)
        const comboEl = document.createElement('div');
        comboEl.className = 'combo-text';
        comboEl.innerText = "PERFECT!";
        // Random slight rotation
        const rot = (Math.random() * 20) - 10;
        comboEl.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(0)`;

        document.body.appendChild(comboEl);

        // Animate (using CSS or JS? CSS is easiest for simple keyframes, but here we want dynamic control)
        // Let's use simple Web Animations API or just class trigger
        requestAnimationFrame(() => {
            comboEl.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(1.5)`;
            comboEl.style.opacity = '1';
        });

        // Fade out
        setTimeout(() => {
            comboEl.style.opacity = '0';
            comboEl.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(2)`;
            setTimeout(() => {
                comboEl.remove();
            }, 500);
        }, 1000);
    }
}

export default new UIManager();
