import * as THREE from 'three';
import ObstaclePool from './ObstaclePool.js';
import { COLORS } from '../utils/Constants.js';

class ObstacleManager {
    constructor(scene) {
        this.pool = new ObstaclePool(scene, 20);
        this.nextSpawnY = 15; // Start spawning much higher (was 5)
        this.obstaclesSinceSwitch = 0;
        this.futurePlayerColor = null; // Track expected player color for future obstacles

        this.setNextSwitchThreshold(); // Set initial random threshold

        // Stars
        this.activeStars = [];
        this.starGeometry = new THREE.TetrahedronGeometry(0.3); // Low poly star
        this.starMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 }); // Gold
    }

    setNextSwitchThreshold() {
        // Random integer between 3 and 7 (inclusive)
        this.switchThreshold = Math.floor(Math.random() * (7 - 3 + 1)) + 3;
    }

    update(deltaTime, player, score) {
        if (!player) return;

        const playerPosition = player.position;
        const playerColor = player.getCurrentState()?.color;

        // Init future color if not set (first frame or reset)
        if (!this.futurePlayerColor && playerColor) {
            this.futurePlayerColor = playerColor;
        }

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

        // Update Stars (Rotation and cleanup)
        for (let i = this.activeStars.length - 1; i >= 0; i--) {
            const star = this.activeStars[i];
            star.rotation.y += deltaTime * 2;
            star.rotation.x += deltaTime;

            if (star.position.y < playerPosition.y - 15) {
                // Remove and recycle (simple remove for now, pool later if needed)
                if (star.parent) star.parent.remove(star);
                this.activeStars.splice(i, 1);
            }
        }
    }

    spawnNext(score, playerColor) {
        // Use futurePlayerColor for generation to ensure compatibility with pending switches
        const generationColor = this.futurePlayerColor || playerColor || COLORS.RED;

        let type = '';
        let spawnX = 0;
        let rotationSpeed = 50 + (score * 2);

        // Check for Color Switch Event
        if (this.obstaclesSinceSwitch >= this.switchThreshold) {
            type = 'color_switcher';
            this.obstaclesSinceSwitch = 0;
            this.setNextSwitchThreshold(); // Plan next interval
            // Switcher is always centered
            spawnX = 0;
            rotationSpeed = 100;
        } else {
            // Normal Obstacle logic
            this.obstaclesSinceSwitch++;

            const types = ['ring', 'fan', 'square', 'triangle', 'pentagon', 'double_circle', 'vertical_double_circle', 'sliding_bar'];
            type = types[Math.floor(Math.random() * types.length)];

            // Custom Positioning Logic per User Request:
            if (type === 'fan') {
                const offset = (Math.random() > 0.5 ? 1.2 : -1.2);
                spawnX = offset;
            }
        }

        let spawnY = this.nextSpawnY;

        const obs = this.pool.get(type, spawnY, rotationSpeed, generationColor);
        obs.mesh.position.x = spawnX; // Apply X offset

        if (type === 'color_switcher') {
            // Determine the target color for this switch
            const available = Object.values(COLORS).filter(c => c !== generationColor);
            const nextColor = available[Math.floor(Math.random() * available.length)];

            // Attach to mesh userData for CollisionDetector/Game to use
            obs.mesh.userData.switchTarget = nextColor;

            // Update future color so NEXT obstacles use this new color
            this.futurePlayerColor = nextColor;
        }

        // Star Spawning (30% Chance, not on switchers)
        if (type !== 'color_switcher' && Math.random() < 0.3) {
            const star = new THREE.Mesh(this.starGeometry, this.starMaterial);
            // Center of obstacle
            star.position.set(spawnX, spawnY, 0);
            // Add custom data for collision
            star.userData = { type: 'star', active: true };

            this.pool.scene.add(star);
            this.activeStars.push(star);
        }

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

    getStars() {
        return this.activeStars;
    }
}

export default ObstacleManager;



