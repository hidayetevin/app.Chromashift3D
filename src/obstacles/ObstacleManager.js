import * as THREE from 'three';
import ObstaclePool from './ObstaclePool.js';

class ObstacleManager {
    constructor(scene) {
        this.pool = new ObstaclePool(scene, 20);
        this.nextSpawnY = 15; // Start spawning much higher (was 5)
    }

    update(deltaTime, playerPosition, score) {
        // Rotate Obstacles (STATIC position, DYNAMIC rotation)
        this.pool.activeObstacles.forEach(obs => {
            obs.update(deltaTime);
        });

        // Spawn Logic (Infinite Vertical)
        if (playerPosition.y > this.nextSpawnY - 20) {
            this.spawnNext(score);
        }

        // Cleanup old obstacles (below player)
        this.pool.activeObstacles.forEach(obs => {
            if (obs.mesh.position.y < playerPosition.y - 15) {
                this.pool.returnToPool(obs);
            }
        });
    }

    spawnNext(score) {
        // Difficulty Logic: Simply toggle types for variety
        let type = Math.random() > 0.5 ? 'ring' : 'fan';

        let spawnY = this.nextSpawnY;
        let spawnX = 0; // Default X

        // Custom Positioning Logic per User Request:
        // "Çarpı türü engelleri topun çapı kadar sağa veya sola kaydır"
        // - Player Radius ~ 0.5. Diameter = 1.0.
        // - Offset = +/- 1.0 on X Axis.

        if (type === 'fan') {
            // Updated diameter offset based on new radius 0.3 -> Diameter 0.6
            const offset = (Math.random() > 0.5 ? 0.6 : -0.6);
            spawnX = offset;
        } else {
            // Ring type stays as is (Centered at X=0)
        }

        // Rotation Speed
        let rotationSpeed = 50 + (score * 2);

        const obs = this.pool.get(type, spawnY, rotationSpeed);
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
