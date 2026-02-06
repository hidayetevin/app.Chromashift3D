import * as THREE from 'three';

class CollisionDetector {
    check(player, obstacles) {
        const playerRadius = 0.5 * 0.8; // 80% hitbox (Section 5.1)
        const playerPos = player.position;
        const playerState = player.getCurrentState(); // { color, shape }

        for (let obs of obstacles) {
            if (obs.passed) continue;

            // Optimization: Skip if Y distance is too large
            if (Math.abs(obs.mesh.position.y - playerPos.y) > 3) continue;

            // Check segments
            for (let segment of obs.segments) {
                // Get World Position of segment
                const segmentPos = new THREE.Vector3();
                segment.getWorldPosition(segmentPos);

                // Distance Check (Sphere Collision)
                const dist = playerPos.distanceTo(segmentPos);

                // Ring segment collision is tricky with just point distance.
                // Assuming Torus radius ~3. Tube ~0.3.
                // If player is within the tube...

                // Simplified for MVP: Distance < threshold
                if (dist < (playerRadius + 0.3)) {
                    return {
                        hit: true,
                        obstacle: obs,
                        segment: segment,
                        matchColor: segment.userData.color === playerState.color,
                        matchShape: segment.userData.shape === playerState.shape // Assuming shapes are mapped/compared by KEY or Value
                    };
                }
            }
        }

        return null; // No collision
    }
}

export default new CollisionDetector();
