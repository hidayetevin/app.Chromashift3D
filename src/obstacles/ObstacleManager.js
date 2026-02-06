import * as THREE from 'three';
import ObstaclePool from './ObstaclePool.js';

class ObstacleManager {
    constructor(scene) {
        this.pool = new ObstaclePool(scene, 20);
        this.nextSpawnY = 15; // Start spawning much higher (was 5)
        this.obstaclesSinceSwitch = 0;
    }

    update(deltaTime, player, score) {
        if (!player) return;

        const playerPosition = player.position;
        const playerColor = player.getCurrentState()?.color;

        // Rotate Obstacles (STATIC position, DYNAMIC rotation)
        this.pool.activeObstacles.forEach(obs => {
            obs.update(deltaTime);
        });

        // Spawn Logic (Infinite Vertical)
        if (playerPosition.y > this.nextSpawnY - 20) {
            this.spawnNext(score, playerColor);
        }

        // Cleanup old obstacles (below player)
        this.pool.activeObstacles.forEach(obs => {
            if (obs.mesh.position.y < playerPosition.y - 15) {
                this.pool.returnToPool(obs);
            }
        });
    }

    spawnNext(score, playerColor) {
        let type = '';
        let spawnX = 0;
        let rotationSpeed = 50 + (score * 2);

        // Check for Color Switch Event
        if (this.obstaclesSinceSwitch >= 5) {
            type = 'color_switcher';
            this.obstaclesSinceSwitch = 0;
            // Switcher is always centered
            spawnX = 0;
            rotationSpeed = 100;
        } else {
            // Normal Obstacle logic
            this.obstaclesSinceSwitch++;

            const types = ['ring', 'fan', 'square', 'triangle', 'pentagon', 'double_circle', 'vertical_double_circle'];
            type = types[Math.floor(Math.random() * types.length)];

            // Custom Positioning Logic per User Request:
            if (type === 'fan' || type === 'pentagon') {
                const offset = (Math.random() > 0.5 ? 1.2 : -1.2);
                spawnX = offset;
            }
        }

        let spawnY = this.nextSpawnY;

        const obs = this.pool.get(type, spawnY, rotationSpeed, playerColor);
        obs.mesh.position.x = spawnX; // Apply X offset

        // Increase gap
        this.nextSpawnY += 15;
    }

    // Helper to clear obstacles (e.g. for Revive)
    clearGeneratedObstaclesNear(yPos) {
        this.pool.activeObstacles.forEach(obs => {
            if (Math.abs(obs.mesh.position.y - yPos) < 10) {
                this.pool.returnToPool(obs);
                // Reset spawn Y if needed? No, just clear hole.
            }
        });
    }

    getObstacles() {
        return this.pool.activeObstacles;
    }
}

export default ObstacleManager;
