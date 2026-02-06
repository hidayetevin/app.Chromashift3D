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

    initType(type) {
        this.type = type;
        // Clear children
        this.mesh.children.forEach(c => {
            if (c.geometry) c.geometry.dispose();
        });
        this.mesh.clear();
        this.segments = [];
        this.ringHolder = null;

        if (type === 'fan') {
            this.createFan();
        } else {
            this.createRing();
        }
    }

    createFan() {
        // Create a copy of colors and shuffle to pick 3 random unique colors
        const allColors = [COLORS.RED, COLORS.BLUE, COLORS.YELLOW, COLORS.GREEN];
        // Fisher-Yates shuffle
        for (let i = allColors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allColors[i], allColors[j]] = [allColors[j], allColors[i]];
        }

        const selectedColors = allColors.slice(0, 3);

        for (let i = 0; i < 3; i++) {
            const blade = new THREE.Mesh(geoms.bar, new THREE.MeshLambertMaterial({ color: selectedColors[i] }));
            // 3 blades -> 120 degrees apart (360/3 = 120 deg = 2PI/3 rad)
            const angle = i * ((Math.PI * 2) / 3);

            blade.position.x = Math.cos(angle) * 1.5;
            blade.position.y = Math.sin(angle) * 1.5;
            blade.rotation.z = angle;
            blade.userData = { color: selectedColors[i], shape: SHAPES.CIRCLE };
            this.mesh.add(blade);
            this.segments.push(blade);
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
