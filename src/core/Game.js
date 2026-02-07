import * as THREE from 'three';
import { update as updateTween } from '@tweenjs/tween.js';
import SceneManager from './SceneManager.js';
import CameraController from '../environment/CameraController.js';
import ThemeManager from '../environment/ThemeManager.js';
import Player from '../player/Player.js';
import PhysicsEngine from '../game/PhysicsEngine.js';
import ObstacleManager from '../obstacles/ObstacleManager.js';
import CollisionDetector from '../game/CollisionDetector.js';
import AudioManager from '../audio/AudioManager.js';
import Analytics from '../analytics/Analytics.js';
import AdsManager from '../monetization/AdsManager.js';
import UIManager from '../ui/UIManager.js';
import { GAME_CONFIG } from '../utils/Constants.js';
import ParticleSystem from '../systems/ParticleSystem.js';

class Game {
    constructor() {
        this.gameState = 'MENU'; // MENU, PLAYING, PAUSED, GAMEOVER
        this.score = 0;
        this.gameTime = 0;
        this.lastFrameTime = 0;
        this.hasRevived = false;

        // Load High Score
        this.bestScore = parseInt(localStorage.getItem('chromashift_best') || '0');
        this.starsCollected = parseInt(localStorage.getItem('chromashift_stars') || '0');

        // Combo & Time
        this.comboCount = 0;
        this.lastScoreTime = 0;
        this.timeScale = 1.0;
        this.baseTimeScale = 1.0;
    }

    init() {
        console.log('Core Game Init');
        ParticleSystem.init(SceneManager.scene);
        this.player = new Player(SceneManager.scene);
        this.obstacleManager = new ObstacleManager(SceneManager.scene);

        // UI Initial state
        // UI Initial state
        UIManager.showStartScreen(this.bestScore);
        UIManager.updateStars(this.starsCollected);

        // Input
        document.addEventListener('touchstart', (e) => this.handleInput(e), { passive: false });
        document.addEventListener('mousedown', (e) => this.handleInput(e));

        // Loop
        requestAnimationFrame((t) => this.loop(t));
    }

    start() {
        if (this.gameState === 'PLAYING') return;

        this.gameState = 'PLAYING';
        this.hasRevived = false;
        this.score = 0;
        this.gameTime = 0;
        this.comboCount = 0;
        this.timeScale = 1.0;

        // Reset Logic if restarting logic needed (e.g. reset player pos)

        UIManager.hideStartScreen();
        UIManager.updateScore(0);

        // Show pause button during gameplay
        document.getElementById('pause-btn').style.display = 'flex';

        const lang = UIManager.currentLanguage;
        const tutorialText = lang === 'TR' ? "Zıplamak için tıkla!" : "Tap to Jump!";
        UIManager.showTutorial(tutorialText);
    }

    pause() {
        if (this.gameState !== 'PLAYING') return;
        this.gameState = 'PAUSED';
        UIManager.screens.pause.style.display = 'flex';
        // Clear pause button while paused? (Optional)
        document.getElementById('pause-btn').style.display = 'none';
    }

    resume() {
        if (this.gameState !== 'PAUSED') return;
        this.gameState = 'PLAYING';
        UIManager.screens.pause.style.display = 'none';
        document.getElementById('pause-btn').style.display = 'flex';
        // Force update last frame time to prevent large delta jump
        this.lastFrameTime = performance.now();
    }

    handleInput(e) {
        // Prevent double firing on touch devices (touchstart + mousedown)
        if (e.type === 'touchstart') {
            this.lastTouchTime = Date.now();
        } else if (e.type === 'mousedown') {
            // Ignore mousedown if it happened shortly after a touchstart
            if (Date.now() - (this.lastTouchTime || 0) < 500) {
                return;
            }
        }

        // Prevent browser zooming/scrolling on interaction
        if (e.cancelable && e.target === SceneManager.renderer?.domElement) {
            e.preventDefault();
        }
        // Note: preventDefault on 'touchstart' needs { passive: false } which we added.

        if (this.gameState === 'PLAYING') {
            PhysicsEngine.jump(this.player);
            AudioManager.playTap();
        }
    }

    loop(timestamp) {
        if (this.gameState === 'ERROR') return;

        try {
            let deltaTime = Math.min((timestamp - this.lastFrameTime) / 1000, 0.1); // Cap delta
            this.lastFrameTime = timestamp;

            // Apply Time Scale
            deltaTime *= this.timeScale;

            if (this.gameState === 'PLAYING') {
                this.update(deltaTime);
                ThemeManager.update(deltaTime);
                ParticleSystem.update(deltaTime);
                updateTween(timestamp);
                if (this.player) {
                    CameraController.update(this.player.position.y, deltaTime);
                }
            }

            SceneManager.render(CameraController.camera);

            requestAnimationFrame((t) => this.loop(t));
        } catch (error) {
            console.error("Game Loop Error:", error);
            this.gameState = 'ERROR';
        }
    }

    update(deltaTime) {
        this.gameTime += deltaTime;

        PhysicsEngine.update(this.player, deltaTime);

        // Boundary Check: Ensure player stays within camera view (Safe Area)
        // Camera focus point is camera.y - 5. 
        // Half-height of view is approx 7-8 units. 
        const cameraFocusY = CameraController.camera.position.y - 5;
        const verticalOffset = Math.abs(this.player.position.y - cameraFocusY);

        if (verticalOffset > 8.5) {
            console.log("Out of safe area - Game Over");
            this.gameOver();
            return;
        }

        this.obstacleManager.update(deltaTime, this.player, this.score);
        ThemeManager.checkTransition(this.score);

        const collision = CollisionDetector.check(this.player, this.obstacleManager.getObstacles());
        const starCollision = CollisionDetector.checkStars(this.player, this.obstacleManager.getStars());

        if (starCollision) {
            // Collect Star
            const star = starCollision.object;
            if (star.parent) star.parent.remove(star);
            // Remove from active array in Manager
            const idx = this.obstacleManager.getStars().indexOf(star);
            if (idx > -1) this.obstacleManager.getStars().splice(idx, 1);

            this.starsCollected++;
            localStorage.setItem('chromashift_stars', this.starsCollected.toString());

            UIManager.updateStars(this.starsCollected);
            AudioManager.playSuccess(); // Or a custom 'ding'
        }

        if (collision) {
            // Check Collision Type

            if (collision.type === 'switch') {
                // Color Switcher Logic
                if (!collision.obstacle.passed) {
                    collision.obstacle.passed = true;

                    // Retrieve pre-determined target color if available
                    // Note: 'collision.obstacle' is the Obstacle instance. 
                    // 'userData' is on 'obstacle.mesh' or 'obstacle.segments'? 
                    // ObstacleManager set it on 'obs.mesh.userData.switchTarget'.

                    const targetColor = collision.obstacle.mesh.userData.switchTarget;

                    if (targetColor) {
                        this.player.setColor(targetColor);
                        console.log('Switched to Target Color');
                    } else {
                        // Fallback (should not happen with new Manager logic)
                        this.player.switchRandomColor();
                        console.warn('Fallback Random Switch');
                    }

                    // Hide the switcher or play effect
                    collision.obstacle.mesh.visible = false;

                    AudioManager.playSuccess(); // Reuse success sound for feedback
                    // Improve: Particle effect burst here
                }
            }
            else if (collision.matchColor) {
                // Success
                // Success
                if (!collision.obstacle.passed) {
                    this.score++;
                    collision.obstacle.passed = true;
                    UIManager.updateScore(this.score);
                    AudioManager.playSuccess();

                    // Combo Logic
                    const now = this.gameTime;
                    if (now - this.lastScoreTime < 1.0) { // 1 second threshold
                        this.comboCount++;
                    } else {
                        this.comboCount = 1;
                    }
                    this.lastScoreTime = now;

                    if (this.comboCount >= 3) {
                        this.triggerComboEffect();
                        this.comboCount = 0; // Reset or keep incrementing? Let's reset for now to require another 3 streak
                    }
                }
            } else {
                // Wrong Color -> Game Over
                this.gameOver();
            }
        }
    }

    gameOver() {
        if (this.gameState === 'GAMEOVER') return;

        // Camera Shake
        CameraController.shake(0.4, 0.8);

        this.gameState = 'GAMEOVER';
        console.log('Game Over');
        AudioManager.playFail();

        // Hide pause button on game over
        document.getElementById('pause-btn').style.display = 'none';

        Analytics.track('game_over', { score: this.score });

        if (!this.hasRevived) {
            // Offer Revive with Custom Modal
            const lang = UIManager.currentLanguage;
            const title = lang === 'TR' ? "DEVAM?" : "REVIVE?";
            const msg = lang === 'TR' ?
                `Skor: ${this.score}\nKaldığın yerden devam etmek için kısa bir reklam izlemek ister misin?` :
                `Score: ${this.score}\nWatch a short ad to continue from here?`;
            const btnContinue = lang === 'TR' ? "DEVAM ET" : "CONTINUE";
            const btnGiveUp = lang === 'TR' ? "VAZGEÇ" : "GIVE UP";

            UIManager.showConfirm(title, msg, btnContinue, btnGiveUp).then(userWantsRevive => {
                if (userWantsRevive) {
                    AdsManager.showRewarded('continue').then(success => {
                        if (success) {
                            this.reviveGame();
                        } else {
                            // Ad failed
                            this.showFinalGameOver();
                        }
                    });
                } else {
                    this.showFinalGameOver();
                }
            });
        } else {
            this.showFinalGameOver();
        }
    }

    showFinalGameOver() {
        // Reset effects
        this.timeScale = 1.0;
        this.comboCount = 0;

        // Handle High Score
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('chromashift_best', this.bestScore.toString());
        }

        AdsManager.showInterstitial();
        UIManager.showGameOver(this.score, this.bestScore);
    }

    triggerComboEffect() {
        // Slow Motion
        this.timeScale = 0.5;
        UIManager.showComboText();

        // Restore speed after 2 seconds (Real Time, so use setTimeout)
        setTimeout(() => {
            if (this.gameState === 'PLAYING') {
                this.timeScale = 1.0;
            }
        }, 2000);
    }

    reviveGame() {
        console.log('Reviving...');
        this.hasRevived = true;
        this.gameState = 'PLAYING';

        // Reset Physics to prevent immediate death
        if (this.player) {
            this.player.velocity.set(0, 0, 0);

            // Give a small jump boost to help player recover
            PhysicsEngine.jump(this.player);

            // Clear obstacles in a wider range to give player space
            this.obstacleManager.clearGeneratedObstaclesNear(this.player.position.y);

            // Ensure camera focus is updated
            CameraController.update(this.player.position.y, 0);
        }

        UIManager.hideGameOver();
        // Force update the UI score one more time to be sure
        UIManager.updateScore(this.score);

        // Ensure pause button is visible again
        document.getElementById('pause-btn').style.display = 'flex';
    }
}

export default new Game();
