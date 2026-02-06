import * as THREE from 'three';
import { Tween, Easing } from '@tweenjs/tween.js';
import { COLORS, SHAPES } from '../utils/Constants.js';
import ParticleSystem from '../systems/ParticleSystem.js';

class Player {
    constructor(scene) {
        this.scene = scene;

        // Setup Geometry mapping
        this.geometries = {
            [SHAPES.CIRCLE]: new THREE.SphereGeometry(0.3, 32, 32), // Reduced from 0.5
            [SHAPES.SQUARE]: new THREE.BoxGeometry(0.5, 0.5, 0.5), // Reduced relative size
            [SHAPES.TRIANGLE]: new THREE.TetrahedronGeometry(0.4) // Reduced relative size
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
        // Return active properties for checking
        return {
            color: COLORS[this.colorKeys[this.currentColorIndex]],
            shape: SHAPES[this.shapeKeys[this.currentShapeIndex]]
        };
    }

    switchRandomColor() {
        const currentColor = this.getCurrentState().color;
        const available = [COLORS.RED, COLORS.BLUE, COLORS.YELLOW, COLORS.GREEN].filter(c => c !== currentColor);
        const newColor = available[Math.floor(Math.random() * available.length)];

        // Find the key for the new color
        const key = Object.keys(COLORS).find(k => COLORS[k] === newColor);

        if (key) {
            this.currentColorIndex = this.colorKeys.indexOf(key);
            this.updateAppearance();
        }

        return newColor;
    }

    updateAppearance() {
        const colorKey = this.colorKeys[this.currentColorIndex];
        const newColor = COLORS[colorKey];

        this.mesh.material.color.setHex(newColor);
        this.mesh.material.emissive.setHex(newColor);
        this.glowLight.color.setHex(newColor);

        ParticleSystem.emit(this.mesh.position, newColor, 15);
    }
}

export default Player;
