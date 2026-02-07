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

        // Power-ups State
        this.hasShield = false;
        this.isRainbowMode = false;

        // Shield Mesh (Hidden by default)
        const shieldGeo = new THREE.SphereGeometry(0.55, 32, 32); // Slightly larger than player
        const shieldMat = new THREE.MeshBasicMaterial({
            color: 0x00FFFF,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        this.shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
        this.shieldMesh.visible = false;
        this.mesh.add(this.shieldMesh);

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

    setColor(color) {
        // Find key: Value -> Key (e.g. 0xFF0000 -> 'RED')
        // Actually, COLORS is exported object. Let's iterate keys.
        const key = Object.keys(COLORS).find(k => COLORS[k] === color);

        if (key) {
            const index = this.colorKeys.indexOf(key);
            if (index !== -1) {
                this.currentColorIndex = index;
                this.updateAppearance();
            }
        }
    }

    updateAppearance() {
        const colorKey = this.colorKeys[this.currentColorIndex];
        const newColor = COLORS[colorKey];

        this.mesh.material.color.setHex(newColor);
        this.mesh.material.emissive.setHex(newColor);
        this.glowLight.color.setHex(newColor);

        ParticleSystem.emit(this.mesh.position, newColor, 15);

        // Trigger visual pulse effect
        this.triggerColorChangeEffect(newColor);
    }

    triggerColorChangeEffect(color) {
        // Create expanding sphere (Pulse Effect)
        // Start same size as player (radius 0.3) but scaled down to 0.1 initially
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8, // Start very visible
            side: THREE.FrontSide,
            depthWrite: false, // Don't write to depth buffer (better for transparent overlap)
            blending: THREE.AdditiveBlending // Glowy effect
        });

        const effectMesh = new THREE.Mesh(geometry, material);
        effectMesh.position.set(0, 0, 0);
        // Start from inside (tiny)
        effectMesh.scale.set(0.1, 0.1, 0.1);

        this.mesh.add(effectMesh);

        // Tween: Expand
        new Tween(effectMesh.scale)
            .to({ x: 8, y: 8, z: 8 }, 1200)
            .easing(Easing.Quadratic.Out)
            .start();

        // Tween: Fade Out
        new Tween(material)
            .to({ opacity: 0 }, 1200)
            .easing(Easing.Quadratic.Out)
            .onComplete(() => {
                this.mesh.remove(effectMesh);
                geometry.dispose();
                material.dispose();
            })
            .start();
    }

    setShield(active) {
        this.hasShield = active;
        this.shieldMesh.visible = active;
    }

    setRainbowMode(active) {
        this.isRainbowMode = active;
        if (active) {
            this.mesh.material.emissive.setHex(0xFFFFFF);
            this.mesh.material.color.setHex(0xFFFFFF);
        } else {
            this.updateAppearance();
        }
    }
}

export default Player;
