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
        this.gameState = 'MENU'; // MENU, PLAYING, GAMEOVER
        this.score = 0;
        this.gameTime = 0;
        this.lastFrameTime = 0;
        this.hasRevived = false;
    }

    init() {
        console.log('Core Game Init');
        ParticleSystem.init(SceneManager.scene);
        this.player = new Player(SceneManager.scene);
        this.obstacleManager = new ObstacleManager(SceneManager.scene);

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

        // Reset Logic if restarting logic needed (e.g. reset player pos)

        UIManager.hideStartScreen();
        UIManager.updateScore(0);
        UIManager.showTutorial("Tap to Jump!");
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
            const deltaTime = Math.min((timestamp - this.lastFrameTime) / 1000, 0.1); // Cap delta
            this.lastFrameTime = timestamp;

            if (this.gameState === 'PLAYING') {
                this.update(deltaTime);
            }

            ThemeManager.update(deltaTime);
            ParticleSystem.update(deltaTime);
            updateTween(timestamp);
            if (this.player) {
                CameraController.update(this.player.position.y, deltaTime);
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
        this.obstacleManager.update(deltaTime, this.player, this.score);
        ThemeManager.checkTransition(this.score);

        const collision = CollisionDetector.check(this.player, this.obstacleManager.getObstacles());

        if (collision) {
            // Check Collision Type

            if (collision.type === 'switch') {
                // Color Switcher Logic
                if (!collision.obstacle.passed) {
                    collision.obstacle.passed = true;
                    // Switch Color
                    // Ensure new color is different from current? Often good practice.
                    const newColor = this.player.switchRandomColor();

                    // Hide the switcher or play effect
                    collision.obstacle.mesh.visible = false;

                    AudioManager.playSuccess(); // Reuse success sound for feedback
                    // Improve: Particle effect burst here
                }
            }
            else if (collision.matchColor) {
                // Success
                if (!collision.obstacle.passed) {
                    this.score++;
                    collision.obstacle.passed = true;
                    UIManager.updateScore(this.score);
                    AudioManager.playSuccess();

                    // Little boost or feedback?
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

        Analytics.track('game_over', { score: this.score });

        if (!this.hasRevived) {
            // Offer Revive
            const userWantsRevive = confirm(`Score: ${this.score}\nWatch Ad to Continue?`);
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
        } else {
            this.showFinalGameOver();
        }
    }

    showFinalGameOver() {
        AdsManager.showInterstitial();
        UIManager.showGameOver(this.score);
    }

    reviveGame() {
        console.log('Reviving...');
        this.hasRevived = true;
        this.gameState = 'PLAYING';

        this.obstacleManager.clearGeneratedObstaclesNear(this.player.position.y); // Use the helper

        UIManager.hideGameOver();
    }
}

export default new Game();
