import * as THREE from 'three';
import { COLORS, SHAPES } from '../utils/Constants.js';

// Helper to create geometries
const geoms = {
    bar: new THREE.BoxGeometry(3, 0.5, 0.5)
};

class Obstacle {
    constructor(type) {
        this.type = type;
        this.mesh = new THREE.Group();
        this.segments = [];
        this.active = false;
        this.passed = false;
        this.ringHolder = null;

        this.rotationSpeed = 0;

        this.initType(type);
    }

    initType(type, playerColor) {
        this.type = type;
        // Clear children
        this.mesh.children.forEach(c => {
            if (c.geometry) c.geometry.dispose();
        });
        this.mesh.clear();
        this.segments = [];
        this.ringHolder = null;

        if (type === 'fan') {
            this.createFan(playerColor);
        } else if (type === 'square') {
            this.createSquare();
        } else {
            this.createRing();
        }
    }

    createFan(playerColor) {
        // We ALWAYS need the player's current color to be present in the fan blades
        // effectively making it passable.

        let targetColor = playerColor;
        // If playerColor is somehow undefined (first spawn etc), pick Red default
        if (!targetColor) targetColor = COLORS.RED;

        const otherColors = [COLORS.RED, COLORS.BLUE, COLORS.YELLOW, COLORS.GREEN].filter(c => c !== targetColor);

        // Shuffle other colors
        for (let i = otherColors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [otherColors[i], otherColors[j]] = [otherColors[j], otherColors[i]];
        }

        // Pick 2 random colors to accompany the target color
        const selectedColors = [targetColor, otherColors[0], otherColors[1]];

        // Shuffle the FINAL selection so the target color isn't always the first blade
        for (let i = selectedColors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [selectedColors[i], selectedColors[j]] = [selectedColors[j], selectedColors[i]];
        }

        for (let i = 0; i < 3; i++) {
            const blade = new THREE.Mesh(geoms.bar, new THREE.MeshLambertMaterial({ color: selectedColors[i] }));
            // 3 blades -> 120 degrees apart (360/3 = 120 deg = 2PI/3 rad)
            const angle = i * ((Math.PI * 2) / 3);

            blade.position.x = Math.cos(angle) * 1.5;
            blade.position.y = Math.sin(angle) * 1.5;
            blade.rotation.z = angle;
            blade.userData = {
                color: selectedColors[i],
                shape: SHAPES.SQUARE, // Fan usually considered 'sharp' but let's stick to simple logic
                size: { x: 3.0, y: 0.5, z: 0.5 } // Store dimensions for collision
            };
            this.mesh.add(blade);
            this.segments.push(blade);
        }
    }

    createSquare() {
        const colors = [COLORS.RED, COLORS.BLUE, COLORS.YELLOW, COLORS.GREEN];
        // Square Logic: 4 bars arranged in a square shape
        // Center offset to make room for player
        const offset = 2.0;

        for (let i = 0; i < 4; i++) {
            const bar = new THREE.Mesh(geoms.bar, new THREE.MeshLambertMaterial({ color: colors[i] }));

            // 0: Top, 1: Right, 2: Bottom, 3: Left
            let x = 0, y = 0, rot = 0;

            if (i === 0) { y = offset; rot = 0; }
            if (i === 1) { x = offset; rot = Math.PI / 2; }
            if (i === 2) { y = -offset; rot = 0; }
            if (i === 3) { x = -offset; rot = Math.PI / 2; }

            bar.position.set(x, y, 0);
            bar.rotation.z = rot;

            bar.userData = {
                color: colors[i],
                shape: SHAPES.SQUARE,
                size: { x: 3.0, y: 0.5, z: 0.5 }
            };

            this.mesh.add(bar);
            this.segments.push(bar);
        }
    }

    createRing() {
        // Standard Ring logic
        const radius = 2.2; // Increased by 10% (was 2.0)
        const tube = 0.3;
        const radialSegments = 16;
        const tubularSegments = 32;
        const arc = Math.PI / 2;
        const colors = [COLORS.RED, COLORS.BLUE, COLORS.YELLOW, COLORS.GREEN];

        for (let i = 0; i < 4; i++) {
            const geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc);
            const material = new THREE.MeshLambertMaterial({ color: colors[i] });
            const segment = new THREE.Mesh(geometry, material);
            segment.rotation.z = i * (Math.PI / 2);
            segment.userData = { color: colors[i] };
            this.mesh.add(segment);
            this.segments.push(segment);
        }
    }

    reset() {
        this.mesh.rotation.set(0, 0, 0);
        this.passed = false;
        this.mesh.visible = true;
    }

    update(deltaTime) {
        if (this.rotationSpeed !== 0) {
            this.mesh.rotation.z += THREE.MathUtils.degToRad(this.rotationSpeed) * deltaTime;
        }
    }
}

export default Obstacle;
