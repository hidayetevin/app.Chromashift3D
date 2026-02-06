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
        this.innerRing = null; // For double circle

        this.rotationSpeed = 0;

        // Note: We don't call initType here if we expect 'playerColor' to be passed later.
        // But for initial pool creation, we might not have it.
        // ObstaclePool calls initType explicitly.
        // So we can leave it empty or init default.
        if (type) {
            this.initType(type);
        }
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
        this.innerRing = null;

        if (type === 'fan') {
            this.createFan(playerColor);
        } else if (type === 'square') {
            this.createSquare();
        } else if (type === 'triangle') {
            this.createTriangle(playerColor);
        } else if (type === 'hexagon') {
            this.createHexagon();
        } else if (type === 'double_circle') {
            this.createDoubleCircle();
        } else {
            this.createRing();
        }
    }

    createFan(playerColor) {
        // We ALWAYS need the player's current color to be present in the fan blades
        let targetColor = playerColor;
        if (!targetColor) targetColor = COLORS.RED;

        const otherColors = [COLORS.RED, COLORS.BLUE, COLORS.YELLOW, COLORS.GREEN].filter(c => c !== targetColor);

        // Shuffle other colors
        for (let i = otherColors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [otherColors[i], otherColors[j]] = [otherColors[j], otherColors[i]];
        }

        // Pick 2 random colors to accompany
        const selectedColors = [targetColor, otherColors[0], otherColors[1]];

        // Shuffle FINAL selection
        for (let i = selectedColors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [selectedColors[i], selectedColors[j]] = [selectedColors[j], selectedColors[i]];
        }

        for (let i = 0; i < 3; i++) {
            const blade = new THREE.Mesh(geoms.bar, new THREE.MeshLambertMaterial({ color: selectedColors[i] }));
            const angle = i * ((Math.PI * 2) / 3);

            blade.position.x = Math.cos(angle) * 1.5;
            blade.position.y = Math.sin(angle) * 1.5;
            blade.rotation.z = angle;
            blade.userData = {
                color: selectedColors[i],
                shape: SHAPES.SQUARE,
                size: { x: 3.0, y: 0.5, z: 0.5 }
            };
            this.mesh.add(blade);
            this.segments.push(blade);
        }
    }

    createSquare() {
        const colors = [COLORS.RED, COLORS.BLUE, COLORS.YELLOW, COLORS.GREEN];
        // Increased offset (2.2)
        const offset = 2.2;
        const longBarGeom = new THREE.BoxGeometry(4.4, 0.5, 0.5);

        for (let i = 0; i < 4; i++) {
            const bar = new THREE.Mesh(longBarGeom, new THREE.MeshLambertMaterial({ color: colors[i] }));
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
                size: { x: 4.4, y: 0.5, z: 0.5 }
            };
            this.mesh.add(bar);
            this.segments.push(bar);
        }
    }

    createTriangle(playerColor) {
        // Ensure player color is present
        let targetColor = playerColor;
        if (!targetColor) targetColor = COLORS.RED;

        const otherColors = [COLORS.RED, COLORS.BLUE, COLORS.YELLOW, COLORS.GREEN].filter(c => c !== targetColor);

        // Shuffle other colors
        for (let i = otherColors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [otherColors[i], otherColors[j]] = [otherColors[j], otherColors[i]];
        }

        // Pick 2 random colors to accompany
        const selectedColors = [targetColor, otherColors[0], otherColors[1]];

        // Shuffle FINAL selection
        for (let i = selectedColors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [selectedColors[i], selectedColors[j]] = [selectedColors[j], selectedColors[i]];
        }

        // Approx side length
        const sideLength = 5.0;
        const height = (Math.sqrt(3) / 2) * sideLength;
        const inRadius = height * (1 / 3);
        const barGeom = new THREE.BoxGeometry(sideLength, 0.5, 0.5);

        for (let i = 0; i < 3; i++) {
            const bar = new THREE.Mesh(barGeom, new THREE.MeshLambertMaterial({ color: selectedColors[i] }));

            const r = inRadius + 0.5;
            const theta = i * (Math.PI * 2 / 3);

            bar.position.x = Math.cos(theta) * r;
            bar.position.y = Math.sin(theta) * r;
            bar.rotation.z = theta + (Math.PI / 2);

            bar.userData = {
                color: selectedColors[i],
                shape: SHAPES.TRIANGLE,
                size: { x: sideLength, y: 0.5, z: 0.5 }
            };
            this.mesh.add(bar);
            this.segments.push(bar);
        }
    }

    createHexagon() {
        const colors = [COLORS.RED, COLORS.BLUE, COLORS.YELLOW, COLORS.GREEN];
        const hexColors = [];
        for (let i = 0; i < 6; i++) hexColors.push(colors[i % 4]);
        hexColors.sort(() => Math.random() - 0.5);

        const sideLength = 2.5;
        const apothem = (sideLength / (2 * Math.tan(Math.PI / 6)));
        const barGeom = new THREE.BoxGeometry(sideLength + 0.2, 0.5, 0.5);

        for (let i = 0; i < 6; i++) {
            const bar = new THREE.Mesh(barGeom, new THREE.MeshLambertMaterial({ color: hexColors[i] }));
            const theta = i * (Math.PI / 3);

            bar.position.x = Math.cos(theta) * apothem;
            bar.position.y = Math.sin(theta) * apothem;
            bar.rotation.z = theta + (Math.PI / 2);

            bar.userData = {
                color: hexColors[i],
                shape: SHAPES.SQUARE,
                size: { x: sideLength + 0.2, y: 0.5, z: 0.5 }
            };
            this.mesh.add(bar);
            this.segments.push(bar);
        }
    }

    createDoubleCircle() {
        const radius = 2.5;
        this.createRingGeometry(radius);

        this.innerRing = new THREE.Group();
        this.mesh.add(this.innerRing);

        const innerRadius = 1.4;
        this.createRingGeometry(innerRadius, this.innerRing);
    }

    createRingGeometry(radius, parentGroup = null) {
        const tube = 0.3;
        const radialSegments = 16;
        const tubularSegments = 32;
        const arc = Math.PI / 2;
        const colors = [COLORS.RED, COLORS.BLUE, COLORS.YELLOW, COLORS.GREEN];
        // Fixed pattern or random? Standard ring uses specific order usually but let's randomize
        colors.sort(() => Math.random() - 0.5);

        for (let i = 0; i < 4; i++) {
            const geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc);
            const material = new THREE.MeshLambertMaterial({ color: colors[i] });
            const segment = new THREE.Mesh(geometry, material);
            segment.rotation.z = i * (Math.PI / 2);
            segment.userData = { color: colors[i] };

            if (parentGroup) {
                parentGroup.add(segment);
            } else {
                this.mesh.add(segment);
            }
            this.segments.push(segment);
        }
    }

    createRing() {
        // Standard single ring wrapper for createRingGeometry or standalone
        // To keep back-compat and exact logic:
        this.createRingGeometry(2.2);
    }

    reset() {
        this.mesh.rotation.set(0, 0, 0);
        this.passed = false;
        this.mesh.visible = true;
        if (this.innerRing) {
            this.innerRing.rotation.set(0, 0, 0);
        }
    }

    update(deltaTime) {
        if (this.rotationSpeed !== 0) {
            this.mesh.rotation.z += THREE.MathUtils.degToRad(this.rotationSpeed) * deltaTime;

            if (this.innerRing) {
                // Rotate inner ring in opposite direction locally
                this.innerRing.rotation.z -= THREE.MathUtils.degToRad(this.rotationSpeed * 2.5) * deltaTime;
            }
        }
    }
}

export default Obstacle;
