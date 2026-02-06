import { expect } from 'expect';
import * as THREE from 'three';
import PhysicsEngine from '../src/game/PhysicsEngine.js';
import CollisionDetector from '../src/game/CollisionDetector.js';

// Mock Classes
const mockPlayer = {
    position: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    getCurrentState: () => ({ color: 0xFF0000, shape: 'CIRCLE' }) // Red Circle
};

const mockObstacle = {
    passed: false,
    mesh: { position: new THREE.Vector3(0, 2, 0) },
    segments: [
        {
            getWorldPosition: (target) => target.set(0, 2, 0), // Segment at obstacle center
            userData: { color: 0xFF0000, shape: 'CIRCLE' } // Matching Color/Shape
        }
    ]
};

console.log("---------------------------------------------------");
console.log("🧪 CHROMASHIFT 3D - LOGIC TEST SUITE");
console.log("---------------------------------------------------");

// TEST 1: Physics Jump
console.log("\n[TEST 1] Physics Jump Mechanics...");
const initialY = mockPlayer.position.y;
PhysicsEngine.jump(mockPlayer);
if (mockPlayer.velocity.y === 8) {
    console.log("✅ PASS: Player velocity set to 8 (Jump)");
} else {
    console.error("❌ FAIL: Player velocity is " + mockPlayer.velocity.y);
}

// Emulate 1 frame of movement
PhysicsEngine.update(mockPlayer, 0.1);
if (mockPlayer.position.y > initialY) {
    console.log(`✅ PASS: Player moved UP to Y=${mockPlayer.position.y.toFixed(2)}`);
} else {
    console.error("❌ FAIL: Player did not move up.");
}


// TEST 2: Collision Detection (Match)
console.log("\n[TEST 2] Collision Detection (Matching Segment)...");
// Move player close to obstacle segment
mockPlayer.position.set(0, 2, 0);

// We need a real obstacle structure for the detector to work fully, 
// strictly checking the properties CollisionDetector accesses.
const resultMatch = CollisionDetector.check(mockPlayer, [mockObstacle]);

if (resultMatch && resultMatch.hit && resultMatch.matchColor) {
    console.log("✅ PASS: Correctly detected collision with MATCHING color.");
} else {
    console.error("❌ FAIL: Did not detect matching collision.", resultMatch);
}


// TEST 3: Collision Detection (Wrong Color)
console.log("\n[TEST 3] Collision Detection (Wrong Color)...");
// Change segment color to BLUE
mockObstacle.segments[0].userData.color = 0x0000FF;

const resultFail = CollisionDetector.check(mockPlayer, [mockObstacle]);

if (resultFail && resultFail.hit && !resultFail.matchColor) {
    console.log("✅ PASS: Correctly detected collision with WRONG color.");
} else {
    console.error("❌ FAIL: Logic error in wrong color detection.", resultFail);
}

console.log("\n---------------------------------------------------");
console.log("🏁 TESTS COMPLETED");
console.log("---------------------------------------------------");
