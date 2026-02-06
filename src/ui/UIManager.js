class UIManager {
    constructor() {
        this.screens = {
            start: document.getElementById('start-screen'),
            hud: document.getElementById('ui-layer'),
            tutorial: document.getElementById('tutorial-overlay'),
            score: document.getElementById('score'),
            bestScore: document.getElementById('best-score'),
            bestHud: document.getElementById('best-val')
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => {
            // Logic handled in main.js
        });
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
}

export default new UIManager();
