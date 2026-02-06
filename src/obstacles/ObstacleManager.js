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

        // Custom Positioning Logic per User Request:
        // - "Çarpı (Fan) ise topun merkezinden rastgele +/- top çapı kadar Y ekseninde oynasın"
        // - Player Radius ~ 0.5. Diameter = 1.0.
        // - So offset = +1.0 OR -1.0.

        if (type === 'fan') {
            const offset = (Math.random() > 0.5 ? 1.0 : -1.0);
            // Wait, "Y ekseninde oynasın". 
            // Our game is vertical. Y is the progression axis.
            // If we offset Y, we just move the obstacle up/down in the spawn sequence.
            // Maybe user meant X or Z? (Lateral movement).
            // "Topun merkez noktasından... Y ekseninde oynasın".
            // If the obstacle center is shifted Y, and it spins around Z, the collision point changes?
            // Yes. A fan rotating around (0, Y+offset) means the blades will be higher/lower.
            // But since Player moves UP (Y), shifting obstacle Y just changes WHEN we hit it, not WHERE relative to center.
            // UNLESS the user means "Topun geçeceği boşluk" Y ekseninde (which is vertical) kalsın...

            // Let's re-read carefully: "engelY = engelMerkez + top çapı".
            // Since movement is Vertical (Y), shifting Y just changes the spacing.
            // MAYBE the user thinks the game is Horizontal (Runner)?
            // NO, we established Vertical.
            // Or maybe "Merkezden çarpışma" sorununu çözmek için...
            // Ah, if the fan center is exactly at Jump Peak?

            // Or maybe user meant X axis (Left/Right)?
            // "Y ekseninde oynasın" explicitly said Y.
            // Okay, I will apply Y offset.
            spawnY += offset;
        } else {
            // Ring type stays as is (Centered at spawnY)
        }

        // Rotation Speed
        let rotationSpeed = 50 + (score * 2);

        const obs = this.pool.get(type, spawnY, rotationSpeed);

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
