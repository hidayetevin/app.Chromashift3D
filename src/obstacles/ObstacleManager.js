import * as THREE from 'three';
import ObstaclePool from './ObstaclePool.js';

class ObstacleManager {
    constructor(scene) {
        this.pool = new ObstaclePool(scene, 20);
        this.nextSpawnY = 5; // Start spawning a bit higher than 0
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
        let type = 'ring';
        // Difficulty Logic
        if (score > 30) type = Math.random() > 0.5 ? 'gate' : 'ring';
        if (score > 60) type = ['ring', 'gate', 'tunnel'][Math.floor(Math.random() * 3)];

        // Rotation Speed
        let rotationSpeed = 50 + (score * 2);

        const obs = this.pool.get(type, this.nextSpawnY, rotationSpeed);

        // Dynamic Distance scaling? Or fixed?
        // Fixed is safer for Tap-To-Jump rhythm
        this.nextSpawnY += 8;
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
