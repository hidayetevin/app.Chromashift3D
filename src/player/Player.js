import * as THREE from 'three';
import { Tween, Easing } from '@tweenjs/tween.js';
import { COLORS, SHAPES } from '../utils/Constants.js';
import ParticleSystem from '../systems/ParticleSystem.js';

class Player {
    constructor(scene) {
        this.scene = scene;

        // Setup Geometry mapping
        this.geometries = {
            [SHAPES.CIRCLE]: new THREE.SphereGeometry(0.5, 32, 32),
            [SHAPES.SQUARE]: new THREE.BoxGeometry(0.9, 0.9, 0.9),
            [SHAPES.TRIANGLE]: new THREE.TetrahedronGeometry(0.7)
        };

        // Initial State
        this.colorKeys = ['RED', 'BLUE', 'YELLOW', 'GREEN'];
        this.shapeKeys = ['CIRCLE', 'SQUARE', 'TRIANGLE'];

        this.currentColorIndex = 0;
        this.currentShapeIndex = 0;

        // Material
        const material = new THREE.MeshStandardMaterial({
            color: COLORS.RED,
            roughness: 0.2,
            metalness: 0.1,
            emissive: COLORS.RED,
            emissiveIntensity: 0.4
        });

        this.mesh = new THREE.Mesh(
            this.geometries[SHAPES.CIRCLE],
            material
        );

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = false;
        this.mesh.position.y = 1;

        // Glow Light
        this.glowLight = new THREE.PointLight(COLORS.RED, 1, 10);
        this.glowLight.position.set(0, 0, 0);
        this.mesh.add(this.glowLight);

        this.scene.add(this.mesh);

        this.velocity = new THREE.Vector3(0, 0, 0);
    }

    // Cycle Color and Shape on Tap (Legacy name, maybe used for powerups or just manually called)
    // For now, Game.js calls PhysicsEngine.jump, NOT this.
    // BUT we might want to manually change color?
    cycle() {
        // ... (Logic for cycling if needed)
    }

    // Helper to flash/animate on Jump
    animateJump() {
        new Tween(this.mesh.scale)
            .to({ x: 1.3, y: 0.8, z: 1.3 }, 100)
            .easing(Easing.Quadratic.Out)
            .yoyo(true)
            .repeat(1)
            .start();
    }

    morphTo(shapeType) {
        this.mesh.geometry.dispose();
        this.mesh.geometry = this.geometries[shapeType];
    }

    get position() {
        return this.mesh.position;
    }

    getCurrentState() {
        return {
            color: COLORS[this.colorKeys[this.currentColorIndex]],
            shape: SHAPES[this.shapeKeys[this.currentShapeIndex]]
        };
    }
}

export default Player;
