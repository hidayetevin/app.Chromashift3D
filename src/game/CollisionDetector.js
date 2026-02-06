import * as THREE from 'three';

class CollisionDetector {
    check(player, obstacles) {
        // EXACT RADIUS (No padding/shrink)
        // Player Sphere Radius is 0.3 (defined in Player.js)
        const playerRadius = 0.3;

        // Obstacle Thickness Estimations:
        // Fan (Box): 0.5 thickness -> 0.25 effective "radius" from center line per axis
        // Ring (Torus): Tube radius is 0.3.
        const obstacleRadius = 0.3;

        const playerPos = player.position;
        const playerState = player.getCurrentState(); // { color, shape }

        for (let obs of obstacles) {
            // Optimization
            if (Math.abs(obs.mesh.position.y - playerPos.y) > 3) continue;

            for (let segment of obs.segments) {
                const segmentPos = new THREE.Vector3();
                segment.getWorldPosition(segmentPos);

                const dist = playerPos.distanceTo(segmentPos);

                // STRICT TOUCH CHECK
                // If distance between centers is less than sum of radii -> TOUCH
                if (dist < (playerRadius + obstacleRadius)) {
                    return {
                        hit: true,
                        obstacle: obs,
                        segment: segment,
                        matchColor: segment.userData.color === playerState.color
                    };
                }
            }
        }
        return null;
    }
}

export default new CollisionDetector();
