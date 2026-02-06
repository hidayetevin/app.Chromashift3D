import * as THREE from 'three';

class CollisionDetector {
    check(player, obstacles) {
        // Player Params
        const playerRadius = 0.3;
        const playerPos = player.position;
        const playerState = player.getCurrentState(); // { color, shape }

        for (let obs of obstacles) {
            // Optimization: Skip objects too far away on Y axis
            if (Math.abs(obs.mesh.position.y - playerPos.y) > 5) continue;

            if (obs.type === 'ring') {
                // RING COLLISION LOGIC
                // Ring geometry: Radius 2.2, Tube 0.3
                const ringRadius = 2.5;
                const tubeRadius = 0.3;

                // Distance from player to obstacle center
                // Player usually at X=0, but accounting for potential offsets
                const dx = playerPos.x - obs.mesh.position.x;
                const dy = playerPos.y - obs.mesh.position.y;
                const distToCenter = Math.sqrt(dx * dx + dy * dy);

                // Collision happens if player is touching the tube
                // Distance from player center to the tube's centerline is |distToCenter - ringRadius|
                // Hit check: distToTube < (playerRadius + tubeRadius)
                const distToTube = Math.abs(distToCenter - ringRadius);

                if (distToTube < (playerRadius + tubeRadius)) {
                    // COLLISION DETECTED

                    // Determine which segment (color) is being touched
                    // 1. Calculate angle of player relative to center
                    let angle = Math.atan2(dy, dx);

                    // 2. Adjust for obstacle rotation to find angle in local static space
                    let localAngle = angle - obs.mesh.rotation.z;

                    // 3. Normalize angle to 0 - 2PI range
                    localAngle = localAngle % (2 * Math.PI);
                    if (localAngle < 0) localAngle += 2 * Math.PI;

                    // 4. Find segment index (4 segments, each 90 degrees / PI/2)
                    // Segment 0: 0-90, Segment 1: 90-180, etc.
                    const segmentIndex = Math.floor(localAngle / (Math.PI / 2)) % 4;
                    const segment = obs.segments[segmentIndex];

                    if (segment) {
                        return {
                            hit: true,
                            obstacle: obs,
                            segment: segment,
                            matchColor: segment.userData.color === playerState.color
                        };
                    }
                }

            } else {
                // EXISTING LOGIC FOR OTHER OBSTACLES (e.g. Fan)
                // For 'fan', segments are physically offset from center, so this works better.
                const obstacleRadius = 0.3; // Generic approximate radius for block/box parts

                for (let segment of obs.segments) {
                    const segmentPos = new THREE.Vector3();
                    segment.getWorldPosition(segmentPos);

                    const dist = playerPos.distanceTo(segmentPos);

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
        }
        return null;
    }
}

export default new CollisionDetector();
