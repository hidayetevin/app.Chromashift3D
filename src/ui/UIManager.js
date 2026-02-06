class UIManager {
    constructor() {
        this.screens = {
            start: document.getElementById('start-screen'),
            hud: document.getElementById('ui-layer'), // General container
            tutorial: document.getElementById('tutorial-overlay'),
            score: document.getElementById('score')
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => {
            // Handled in main.js
        });
    }

    showStartScreen() {
        this.screens.start.style.display = 'flex';
        this.screens.tutorial.style.display = 'none';
    }

    hideStartScreen() {
        this.screens.start.style.display = 'none';
    }

    updateScore(score) {
        if (this.screens.score) this.screens.score.innerText = score;
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
        // Create dynamic Game Over div if not exists
        let goScreen = document.getElementById('game-over-screen');
        if (!goScreen) {
            goScreen = document.createElement('div');
            goScreen.id = 'game-over-screen';
            Object.assign(goScreen.style, {
                position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center', color: 'white', zIndex: '100'
            });
            goScreen.innerHTML = `
                <h1>GAME OVER</h1>
                <h2>Score: <span id='go-score'></span></h2>
                <button id='restart-btn' style='padding:15px 30px; font-size:20px; background:#34C759; border:none; border-radius:10px; color:white; margin-top:20px;'>TRY AGAIN</button>
            `;
            document.body.appendChild(goScreen);

            document.getElementById('restart-btn').addEventListener('click', () => {
                window.location.reload();
            });
        }

        document.getElementById('go-score').innerText = score;
        goScreen.style.display = 'flex';
    }
}

export default new UIManager();
