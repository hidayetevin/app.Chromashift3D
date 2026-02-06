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

            if (obs.type === 'ring' || obs.type === 'double_circle' || obs.type === 'vertical_double_circle') {
                // RING COLLISION LOGIC
                // Ring geometry: Radius 2.2, Tube 0.3
                const ringRadius = 2.5; // Radius of the ring itself
                const tubeRadius = 0.3;

                // Targets to check:
                // If single ring: Center is obs.mesh.position
                // If double ring: Left/Right or Top/Bottom Centers
                let centers = [];

                if (obs.type === 'double_circle') {
                    // Left Ring Center (Local X = -2.2)
                    // Right Ring Center (Local X = 2.2)
                    // We need World Positions. Assumes mesh is at (0, Y, 0) and not rotated globally.
                    // If mesh is rotated, we need to transform. double_circle mesh is NOT rotated in update(), only children.

                    const leftPos = obs.mesh.position.clone().add(new THREE.Vector3(-2.2, 0, 0));
                    const rightPos = obs.mesh.position.clone().add(new THREE.Vector3(2.2, 0, 0));

                    // Helper to identify which ring for rotation check
                    centers.push({ pos: leftPos, ringObj: obs.leftRing });
                    centers.push({ pos: rightPos, ringObj: obs.rightRing });
                } else if (obs.type === 'vertical_double_circle') {
                    // Top Ring Center (Local Y = 2.42)
                    // Bottom Ring Center (Local Y = -2.42)
                    const topPos = obs.mesh.position.clone().add(new THREE.Vector3(0, 2.42, 0));
                    const bottomPos = obs.mesh.position.clone().add(new THREE.Vector3(0, -2.42, 0));

                    centers.push({ pos: topPos, ringObj: obs.topRing });
                    centers.push({ pos: bottomPos, ringObj: obs.bottomRing });
                } else {
                    centers.push({ pos: obs.mesh.position, ringObj: obs.mesh });
                }

                for (let center of centers) {
                    const centerPos = center.pos;
                    const ringObj = center.ringObj;

                    // Distance from player to ring center
                    const dx = playerPos.x - centerPos.x;
                    const dy = playerPos.y - centerPos.y;
                    const distToCenter = Math.sqrt(dx * dx + dy * dy);

                    // Collision happens if player is touching the tube
                    // Hit check: distToTube < (playerRadius + tubeRadius)
                    // Ring Radius: 2.2 for normal, 2.42 for vertical_double (large)
                    const actualRingRadius = obs.type === 'vertical_double_circle' ? 2.42 : 2.2;
                    const distToTube = Math.abs(distToCenter - actualRingRadius);

                    if (distToTube < (playerRadius + tubeRadius)) {
                        // COLLISION DETECTED

                        // Determine which segment (color) is being touched
                        // 1. Calculate angle of player relative to center
                        let angle = Math.atan2(dy, dx);

                        // 2. Adjust for rotation to find angle in local space
                        // ringObj is the specific group rotating (mesh, or leftRing/rightRing)
                        let localAngle = angle - ringObj.rotation.z;

                        // 3. Normalize angle to 0 - 2PI range
                        localAngle = localAngle % (2 * Math.PI);
                        if (localAngle < 0) localAngle += 2 * Math.PI;

                        // 4. Find segment index (4 segments, each 90 degrees / PI/2)
                        // Segment 0: 0-90, Segment 1: 90-180, etc.
                        const segmentIndex = Math.floor(localAngle / (Math.PI / 2)) % 4;

                        // Need to access segments. Obstacle.js pushes all segments to `obs.segments`.
                        // But we don't know which segment belongs to which ring easily unless we stored it.
                        // Wait, obs.segments is a flat list. Double Circle has 8 segments.
                        // 0-3: Left Ring (created first), 4-7: Right Ring.

                        let targetSegment = null;
                        if (obs.type === 'double_circle') {
                            if (ringObj === obs.leftRing) {
                                targetSegment = obs.segments[segmentIndex]; // 0-3
                            } else {
                                targetSegment = obs.segments[4 + segmentIndex]; // 4-7
                            }
                        } else if (obs.type === 'vertical_double_circle') {
                            if (ringObj === obs.topRing) {
                                targetSegment = obs.segments[segmentIndex]; // 0-3
                            } else {
                                targetSegment = obs.segments[4 + segmentIndex]; // 4-7
                            }
                        } else {
                            targetSegment = obs.segments[segmentIndex];
                        }

                        if (targetSegment) {
                            return {
                                hit: true,
                                obstacle: obs,
                                segment: targetSegment,
                                matchColor: targetSegment.userData.color === playerState.color
                            };
                        }
                    }
                }

            } else if (obs.type === 'color_switcher') {
                // Color Switcher Logic (Sensor)
                // It is a 2x2 grid of 0.5 cubes. Total size ~1.0 box centered at obs.position.
                // Simple AABB or Distance Check

                const dx = Math.abs(playerPos.x - obs.mesh.position.x);
                const dy = Math.abs(playerPos.y - obs.mesh.position.y);

                // Switcher Half-Size approx 0.5. Player Radius 0.3.
                // If overlap
                if (dx < (0.5 + playerRadius - 0.1) && dy < (0.5 + playerRadius - 0.1)) {
                    // Check if already triggered?
                    // Game.js should handle "once" logic or we disable obstacle here?
                    // Ideally CollisionDetector is pure. But we need to signal.

                    return {
                        hit: true,
                        obstacle: obs,
                        type: 'switch', // Special type
                        matchColor: true // Always safe to touch
                    };
                }

            } else {
                // BOX COLLISION LOGIC For 'fan' and 'square' (Oriented Bounding Box - OBB)

                for (let segment of obs.segments) {
                    // Update matrix world to be sure
                    segment.updateMatrixWorld();

                    // Get geometric properties
                    // Default size if not set: 3 x 0.5 x 0.5
                    const size = segment.userData.size || { x: 3, y: 0.5, z: 0.5 };
                    const halfSize = new THREE.Vector3(size.x / 2, size.y / 2, size.z / 2);

                    // Transform player position into local space of the segment
                    const localPlayerPos = playerPos.clone();
                    segment.worldToLocal(localPlayerPos);

                    // AABB Collision Check in Local Space (simplifies OBB check)
                    // Check if player's sphere intersects the local AABB of the bar

                    // Find closest point on the AABB to the sphere center
                    const closestPoint = new THREE.Vector3();
                    closestPoint.copy(localPlayerPos);
                    closestPoint.clamp(
                        halfSize.clone().negate(), // min (-x, -y, -z)
                        halfSize                   // max (+x, +y, +z)
                    );

                    // Distance from closest point to sphere center
                    const distance = localPlayerPos.distanceTo(closestPoint);

                    if (distance < playerRadius) {
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
