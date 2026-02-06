import * as THREE from 'three';
import { COLORS, SHAPES } from '../utils/Constants.js';

const geometryCache = {};

// 1. TUBE GEOMETRY (Cylinder) to match Ring style
// Radius 0.3 matches the Torus tube radius
function getTubeGeometry(length) {
    const radius = 0.3;
    const key = `tube_${length}`;
    if (geometryCache[key]) return geometryCache[key];

    // Cylinder oriented along Y axis by default.
    const geometry = new THREE.CylinderGeometry(radius, radius, length, 16);
    // Rotate to lie on Z axis or X axis? Or keep vertical and rotate mesh?
    // Let's keep typical cylinder orientation (Y-up) and rotate mesh.

    geometryCache[key] = geometry;
    return geometry;
}

// 2. JOINT GEOMETRY (Sphere) for corners
function getJointGeometry() {
    const key = 'joint_sphere';
    if (geometryCache[key]) return geometryCache[key];

    // Radius same as tube
    const geometry = new THREE.SphereGeometry(0.3, 16, 16);
    geometryCache[key] = geometry;
    return geometry;
}

function createMaterial(color) {
    return new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.2,
        emissive: color,
        emissiveIntensity: 0.2
    });
}

class Obstacle {
    constructor(type) {
        this.type = type;
        this.mesh = new THREE.Group();
        this.segments = [];
        this.active = false;
        this.passed = false;
        this.ringHolder = null;
        this.innerRing = null;

        this.rotationSpeed = 0;

        if (type) {
            this.initType(type);
        }
    }

    initType(type, playerColor) {
        this.type = type;

        // Dispose only non-shared
        this.mesh.children.forEach(c => {
            // In full impl, check if geometry is in cache before dispose if dynamic
        });
        this.mesh.clear();
        this.segments = [];
        this.ringHolder = null;
        this.innerRing = null;
        this.leftRing = null;
        this.rightRing = null;

        if (type === 'fan') {
            this.createFan(playerColor);
        } else if (type === 'square') {
            this.createSquare();
        } else if (type === 'triangle') {
            this.createTriangle(playerColor);
        } else if (type === 'pentagon') { // Changed from hexagon
            this.createPentagon(playerColor);
        } else if (type === 'double_circle') {
            this.createDoubleCircle();
        } else if (type === 'vertical_double_circle') { // New Type
            this.createVerticalDoubleCircle();
        } else {
            this.createRing();
        }
    }

    createFan(playerColor) {
        let targetColor = playerColor || COLORS.RED;
        const otherColors = [COLORS.RED, COLORS.BLUE, COLORS.YELLOW, COLORS.GREEN].filter(c => c !== targetColor);
        otherColors.sort(() => Math.random() - 0.5);
        const selectedColors = [targetColor, otherColors[0], otherColors[1]].sort(() => Math.random() - 0.5);

        // Fan uses bars radiating from center.
        // Length 3.0.
        const tubeGeom = getTubeGeometry(3.0);
        const jointGeom = getJointGeometry(); // Center hub

        // Add Center Hub
        const hub = new THREE.Mesh(jointGeom, createMaterial(0xFFFFFF)); // White hub? or dark?
        this.mesh.add(hub);

        for (let i = 0; i < 3; i++) {
            const mat = createMaterial(selectedColors[i]);
            const blade = new THREE.Mesh(tubeGeom, mat);
            const angle = i * ((Math.PI * 2) / 3);

            // Cylinder is Y-up. We want it radiating on XY plane.
            // Rotate 'blade' to point outward.

            // Position: Center is 0, Length 3. Center of cylinder at 1.5 distance?
            blade.position.x = Math.cos(angle) * 1.5;
            blade.position.y = Math.sin(angle) * 1.5;

            // Angle 0: pos(1.5, 0). Cylinder Y-axis. 
            // We want Cylinder along X-axis. Rotate Z -90 (or +270).
            // Basic rotation: Z = angle - PI/2
            blade.rotation.z = angle - (Math.PI / 2);

            blade.userData = {
                color: selectedColors[i],
                shape: SHAPES.SQUARE,
                size: { x: 0.6, y: 3.0, z: 0.6 } // Corrected: Cylinder Y is length
            };
            this.mesh.add(blade);
            this.segments.push(blade);

            // End Cap (Joint) for visual polish
            const cap = new THREE.Mesh(jointGeom, mat);
            cap.position.x = Math.cos(angle) * 3.0;
            cap.position.y = Math.sin(angle) * 3.0;
            this.mesh.add(cap);
        }
    }

    createSquare() {
        const colors = [COLORS.RED, COLORS.BLUE, COLORS.YELLOW, COLORS.GREEN];
        const sideLength = 4.4;
        const halfSide = sideLength / 2;
        const tubeGeom = getTubeGeometry(sideLength);
        const jointGeom = getJointGeometry();

        // Corners: (h, h), (-h, h), (-h, -h), (h, -h)
        // Bars between them.

        for (let i = 0; i < 4; i++) {
            const mat = createMaterial(colors[i]);
            const bar = new THREE.Mesh(tubeGeom, mat);

            let pos = new THREE.Vector3();
            let rotZ = 0;

            if (i === 0) { pos.set(0, halfSide, 0); rotZ = Math.PI / 2; } // Horizontal (Cyl is Y, Rot Z 90 -> X)
            if (i === 1) { pos.set(halfSide, 0, 0); rotZ = 0; } // Vertical (Cyl is Y)
            if (i === 2) { pos.set(0, -halfSide, 0); rotZ = Math.PI / 2; }
            if (i === 3) { pos.set(-halfSide, 0, 0); rotZ = 0; }

            bar.position.copy(pos);
            bar.rotation.z = rotZ;

            bar.userData = {
                color: colors[i],
                shape: SHAPES.SQUARE,
                size: { x: 0.6, y: 4.4, z: 0.6 } // Corrected: Cylinder Y is length
            };
            this.mesh.add(bar);
            this.segments.push(bar);
        }

        // Add 4 Corner Joints (Neutral Silver)
        const corners = [
            { x: halfSide, y: halfSide },
            { x: halfSide, y: -halfSide },
            { x: -halfSide, y: -halfSide },
            { x: -halfSide, y: halfSide }
        ];

        const jointMat = createMaterial(0xDDDDDD); // Silver joints
        corners.forEach(p => {
            const joint = new THREE.Mesh(jointGeom, jointMat);
            joint.position.set(p.x, p.y, 0);
            this.mesh.add(joint);
        });
    }

    createTriangle(playerColor) {
        let targetColor = playerColor || COLORS.RED;
        const otherColors = [COLORS.RED, COLORS.BLUE, COLORS.YELLOW, COLORS.GREEN].filter(c => c !== targetColor);
        otherColors.sort(() => Math.random() - 0.5);
        const selectedColors = [targetColor, otherColors[0], otherColors[1]].sort(() => Math.random() - 0.5);

        // Increased size to provide more inner space
        const sideLength = 6.5;
        const tubeGeom = getTubeGeometry(sideLength);
        const jointGeom = getJointGeometry();
        const jointMat = createMaterial(0xDDDDDD);

        const height = (Math.sqrt(3) / 2) * sideLength;
        const circumRadius = 2 * height / 3; // Distance from center to vertex

        // Angles: 90, 330 (-30), 210
        const angles = [Math.PI / 2, -Math.PI / 6, 7 * Math.PI / 6];
        const vertices = angles.map(a => ({
            x: Math.cos(a) * circumRadius,
            y: Math.sin(a) * circumRadius
        }));

        // Edge 0: V0 -> V1
        // Edge 1: V1 -> V2
        // Edge 2: V2 -> V0

        const edges = [
            { start: vertices[0], end: vertices[1], color: selectedColors[0] },
            { start: vertices[1], end: vertices[2], color: selectedColors[1] },
            { start: vertices[2], end: vertices[0], color: selectedColors[2] }
        ];

        edges.forEach((edge, i) => {
            const mat = createMaterial(edge.color);
            const bar = new THREE.Mesh(tubeGeom, mat);

            // Position: Midpoint
            const midX = (edge.start.x + edge.end.x) / 2;
            const midY = (edge.start.y + edge.end.y) / 2;
            bar.position.set(midX, midY, 0);

            const dx = edge.end.x - edge.start.x;
            const dy = edge.end.y - edge.start.y;
            const angle = Math.atan2(dy, dx);
            // Rotate Y-axis cylinder to match this angle.
            // Z rotation = angle - PI/2
            bar.rotation.z = angle - Math.PI / 2;

            bar.userData = {
                color: edge.color,
                shape: SHAPES.TRIANGLE,
                size: { x: 0.6, y: sideLength, z: 0.6 } // Corrected: Cylinder Y is length
            };
            this.mesh.add(bar);
            this.segments.push(bar);
        });

        // Add 3 Corner Joints
        vertices.forEach(v => {
            const joint = new THREE.Mesh(jointGeom, jointMat);
            joint.position.set(v.x, v.y, 0);
            this.mesh.add(joint);
        });
    }

    createPentagon(playerColor) {
        let targetColor = playerColor || COLORS.RED;
        const otherColors = [COLORS.RED, COLORS.BLUE, COLORS.YELLOW, COLORS.GREEN].filter(c => c !== targetColor);
        // Shuffle other colors
        otherColors.sort(() => Math.random() - 0.5);

        // Requirement: Player color must be on two adjacent columns.
        // Array: [Target, Target, Other1, Other2, Other3]
        let pentColors = [targetColor, targetColor, ...otherColors];

        // Randomly rotate the array so the "double gate" isn't always at the start angle
        const shift = Math.floor(Math.random() * 5);
        // Rotate array
        pentColors = [...pentColors.slice(shift), ...pentColors.slice(0, shift)];

        const sideLength = 3.2; // Slightly larger side for Pentagon to match size
        const tubeGeom = getTubeGeometry(sideLength);
        const jointGeom = getJointGeometry();
        const jointMat = createMaterial(0xDDDDDD);

        const numSides = 5;
        const angleStep = (Math.PI * 2) / numSides;

        for (let i = 0; i < numSides; i++) {
            const angle = i * angleStep;

            // Distance from center to the midpoint of the edge (Apothem)
            const apothem = sideLength / (2 * Math.tan(Math.PI / numSides));

            const mat = createMaterial(pentColors[i]);
            const bar = new THREE.Mesh(tubeGeom, mat);

            bar.position.x = Math.cos(angle) * apothem;
            bar.position.y = Math.sin(angle) * apothem;
            // Cylinder is Y-aligned. Rotate it to be tangent.
            bar.rotation.z = angle + Math.PI / 2;

            bar.userData = {
                color: pentColors[i],
                shape: SHAPES.SQUARE,
                size: { x: 0.6, y: sideLength, z: 0.6 }
            };
            this.mesh.add(bar);
            this.segments.push(bar);

            // Vertex Joint (between this edge and next)
            const vertexAngle = angle + (angleStep / 2);
            // Distance from center to vertex (Circumradius)
            const radius = sideLength / (2 * Math.sin(Math.PI / numSides));

            const vx = Math.cos(vertexAngle) * radius;
            const vy = Math.sin(vertexAngle) * radius;

            const joint = new THREE.Mesh(jointGeom, jointMat);
            joint.position.set(vx, vy, 0);
            this.mesh.add(joint);
        }
    }

    createVerticalDoubleCircle() {
        const radius = 2.42; // Increased by 10% from 2.2

        // Colors
        const colorsTop = [COLORS.RED, COLORS.BLUE, COLORS.YELLOW, COLORS.GREEN].sort(() => Math.random() - 0.5);

        const colorsBottom = new Array(4);
        colorsBottom[1] = colorsTop[3]; // Contact point: Bottom's Top (1) matches Top's Bottom (3)
        colorsBottom[0] = colorsTop[0]; // Arbitrary non-contact
        colorsBottom[2] = colorsTop[2];
        colorsBottom[3] = colorsTop[1];

        // Top Ring
        this.topRing = new THREE.Group();
        this.topRing.position.y = 2.42;
        // Align so segment centers are cardinal. 
        // 0 is Right. 1 is Top. 2 is Left. 3 is Bottom.
        // Rotation -PI/4 puts centers at (45, 135, 225, 315).
        // Wait, standard Ring 0 is Right (0 deg).
        // If we want contact at 270 (Top Ring Bottom) and 90 (Bottom Ring Top).
        // Segment 3 center is at 270. Segment 1 center is at 90.
        // We DON'T need -PI/4 rotation for cardinal alignment if the segments are already cardinal?
        // createRingGeometry: segment.rotation.z = i * PI/2.
        // i=0: 0 deg (Right). i=1: 90 (Top). i=2: 180 (Left). i=3: 270 (Bottom).
        // This is perfectly cardinal!
        // The previous "Fix" rotated by -45 because the visual mesh might have been offset?
        // Or because the user wanted "intersection" (X=0) to be a color center.
        // For Side-by-Side: Intersection is Left's Right (0 deg) and Right's Left (180 deg).
        // These ARE centers. Why did I rotate?
        // Ah, maybe the TorusGeometry starts at a different angle? 
        // Torus is X-Z plane? No, usually X-Y flat.
        // Let's assume standard behavior: Torus logic in createRingGeometry creates 4 arcs.
        // Each arc PI/2. Center of Arc 0 is at 45 degrees?
        // So YES, we need -45 deg rotation to align centers to axes.

        this.topRing.rotation.z = -Math.PI / 4;
        this.mesh.add(this.topRing);
        this.createRingGeometry(radius, this.topRing, colorsTop);

        // Bottom Ring
        this.bottomRing = new THREE.Group();
        this.bottomRing.position.y = -2.42;
        this.bottomRing.rotation.z = -Math.PI / 4;
        this.mesh.add(this.bottomRing);
        this.createRingGeometry(radius, this.bottomRing, colorsBottom);
    }

    createDoubleCircle() {
        const radius = 2.2;

        // Generate synchronized colors
        // Left Colors: Random
        const colorsL = [COLORS.RED, COLORS.BLUE, COLORS.YELLOW, COLORS.GREEN].sort(() => Math.random() - 0.5);

        // Right Colors: Synced to match at intersection (X=0)
        // Left Ring rotates +theta, Right Ring rotates -theta.
        // Left Contact Point: 0 deg. Right Contact Point: 180 deg.
        // Requirement: L(-theta) == R(PI + theta)
        // Implies: R[0]=L[2], R[1]=L[1], R[2]=L[0], R[3]=L[3]
        const colorsR = new Array(4);
        colorsR[0] = colorsL[2];
        colorsR[1] = colorsL[1];
        colorsR[2] = colorsL[0];
        colorsR[3] = colorsL[3];

        // Left Ring Group
        this.leftRing = new THREE.Group();
        this.leftRing.position.x = -2.2;
        this.leftRing.rotation.z = -Math.PI / 4; // Align segments cardinally
        this.mesh.add(this.leftRing);
        this.createRingGeometry(radius, this.leftRing, colorsL);

        // Right Ring Group
        this.rightRing = new THREE.Group();
        this.rightRing.position.x = 2.2;
        this.rightRing.rotation.z = -Math.PI / 4; // Align segments cardinally
        this.mesh.add(this.rightRing);
        this.createRingGeometry(radius, this.rightRing, colorsR);
    }

    createRingGeometry(radius, parentGroup = null, fixedColors = null) {
        const tube = 0.3;
        const radialSegments = 16;
        const tubularSegments = 32;
        const arc = Math.PI / 2;

        // Use fixed colors if provided, otherwise random shuffle
        const colors = fixedColors ? fixedColors : [COLORS.RED, COLORS.BLUE, COLORS.YELLOW, COLORS.GREEN].sort(() => Math.random() - 0.5);

        for (let i = 0; i < 4; i++) {
            const geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc);
            const material = createMaterial(colors[i]);
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
        this.createRingGeometry(2.2);
    }

    reset() {
        this.mesh.rotation.set(0, 0, 0);
        this.passed = false;
        this.mesh.visible = true;
        if (this.innerRing) this.innerRing.rotation.set(0, 0, 0);
        // Reset to aligned position -PI/4
        if (this.leftRing) this.leftRing.rotation.set(0, 0, -Math.PI / 4);
        if (this.rightRing) this.rightRing.rotation.set(0, 0, -Math.PI / 4);
        if (this.topRing) this.topRing.rotation.set(0, 0, -Math.PI / 4);
        if (this.bottomRing) this.bottomRing.rotation.set(0, 0, -Math.PI / 4);
    }

    update(deltaTime) {
        if (this.rotationSpeed !== 0) {
            if (this.type === 'double_circle') {
                // Rotate rings locally (Side by Side)
                if (this.leftRing) this.leftRing.rotation.z += THREE.MathUtils.degToRad(this.rotationSpeed) * deltaTime;
                if (this.rightRing) this.rightRing.rotation.z -= THREE.MathUtils.degToRad(this.rotationSpeed) * deltaTime; // Counter-rotate
            } else if (this.type === 'vertical_double_circle') {
                // Vertical Stack
                if (this.topRing) this.topRing.rotation.z += THREE.MathUtils.degToRad(this.rotationSpeed) * deltaTime;
                if (this.bottomRing) this.bottomRing.rotation.z -= THREE.MathUtils.degToRad(this.rotationSpeed) * deltaTime;
            } else {
                // Standard rotation for other obstacles
                this.mesh.rotation.z += THREE.MathUtils.degToRad(this.rotationSpeed) * deltaTime;

                if (this.innerRing) {
                    this.innerRing.rotation.z -= THREE.MathUtils.degToRad(this.rotationSpeed * 2.5) * deltaTime;
                }
            }
        }
    }
}

export default Obstacle;
