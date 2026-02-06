import * as THREE from 'three';
import ObstaclePool from './ObstaclePool.js';

class ObstacleManager {
    constructor(scene) {
        this.pool = new ObstaclePool(scene, 20);
        this.nextSpawnY = 15; // Start spawning much higher (was 5)
    }

    update(deltaTime, player, score) {
        const playerPosition = player.position;
        const playerColor = player.getCurrentState().color;

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
        // Difficulty Logic: Pick random type
        const rand = Math.random();
        let type = 'ring';
        if (rand < 0.33) type = 'fan';
        else if (rand < 0.66) type = 'square';

        let spawnY = this.nextSpawnY;
        let spawnX = 0; // Default X

        // Custom Positioning Logic per User Request:
        // "Çarpı ve Kare türü engelleri topun çapı kadar sağa veya sola kaydır"
        // Ring stays generally in center.

        if (['fan', 'square'].includes(type)) {
            // Increased offset for wider variance
            const offset = (Math.random() > 0.5 ? 1.2 : -1.2);
            spawnX = offset;
        } else {
            // Ring type stays as is (Centered at X=0)
        }

        // Rotation Speed
        let rotationSpeed = 50 + (score * 2);

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
