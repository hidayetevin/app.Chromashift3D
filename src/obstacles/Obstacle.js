import * as THREE from 'three';
import { COLORS, SHAPES } from '../utils/Constants.js';

// Helper to create geometries
const geoms = {
    // New Geometry: Bar for Cross/Windmill
    bar: new THREE.BoxGeometry(3, 0.5, 0.5)
};

class Obstacle {
    constructor(type) {
        this.type = type;
        this.mesh = new THREE.Group();
        this.segments = [];
        this.active = false;
        this.passed = false;

        this.rotationSpeed = 0;

        this.initType(type);
    }

    initType(type) {
        // Clear existing
        this.mesh.children.forEach(c => {
            if (c.geometry) c.geometry.dispose();
        });
        this.mesh.clear();
        this.segments = [];

        // For MVP, strictly use the 'cross' type for "Color Switch" feel
        // The rotation makes it a dynamic barrier.
        // User asked for "Halka" (Ring), but logically to collide at center it needs to be a Cross or small Ring.
        // Let's make it a "Thick Ring" with small hole? 
        // Or a "Fan/Propeller".
        // Let's stick to "Fan" (Cross) as it guarantees collision at x=0, z=0 if bars are long enough.

        this.createFan();
    }

    createFan() {
        // 4 Blades: Red, Blue, Yellow, Green
        const colors = [COLORS.RED, COLORS.BLUE, COLORS.YELLOW, COLORS.GREEN];
        const shapes = [SHAPES.CIRCLE, SHAPES.SQUARE, SHAPES.TRIANGLE, SHAPES.CIRCLE];

        for (let i = 0; i < 4; i++) {
            // Create a blade
            const blade = new THREE.Mesh(
                geoms.bar,
                new THREE.MeshLambertMaterial({ color: colors[i] })
            );

            // Position blade so one end is at center
            // Bar is length 3. Center is at 0.
            // We want it to stick out from 0 to 3.
            // So shift geometry or mesh.

            // Rotate around Z to form cross
            // 0 deg, 90 deg, 180 deg, 270 deg
            const angle = i * (Math.PI / 2);

            blade.position.x = Math.cos(angle) * 1.5; // Offset center
            blade.position.y = Math.sin(angle) * 1.5;
            blade.rotation.z = angle;

            blade.userData = { color: colors[i], shape: shapes[i] };

            this.mesh.add(blade);
            this.segments.push(blade);
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
