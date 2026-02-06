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

    createHexagon() {
        const colors = [COLORS.RED, COLORS.BLUE, COLORS.YELLOW, COLORS.GREEN];
        const hexColors = [];
        for (let i = 0; i < 6; i++) hexColors.push(colors[i % 4]);
        hexColors.sort(() => Math.random() - 0.5);

        const sideLength = 2.5;
        const tubeGeom = getTubeGeometry(sideLength);
        const jointGeom = getJointGeometry();
        const jointMat = createMaterial(0xDDDDDD);

        for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3;
            // Radius to center of edge = apothem
            const apothem = (sideLength / (2 * Math.tan(Math.PI / 6)));

            const mat = createMaterial(hexColors[i]);
            const bar = new THREE.Mesh(tubeGeom, mat);

            bar.position.x = Math.cos(angle) * apothem;
            bar.position.y = Math.sin(angle) * apothem;
            bar.rotation.z = angle + Math.PI / 2; // Tangent

            bar.userData = {
                color: hexColors[i],
                shape: SHAPES.SQUARE,
                size: { x: 0.6, y: sideLength, z: 0.6 } // Corrected: Cylinder Y is length
            };
            this.mesh.add(bar);
            this.segments.push(bar);

            // Vertex Joint
            const vertexAngle = angle + Math.PI / 6;
            const vx = Math.cos(vertexAngle) * sideLength;
            const vy = Math.sin(vertexAngle) * sideLength;

            const joint = new THREE.Mesh(jointGeom, jointMat);
            joint.position.set(vx, vy, 0);
            this.mesh.add(joint);
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
        const colors = [COLORS.RED, COLORS.BLUE, COLORS.YELLOW, COLORS.GREEN].sort(() => Math.random() - 0.5);

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
        if (this.innerRing) {
            this.innerRing.rotation.set(0, 0, 0);
        }
    }

    update(deltaTime) {
        if (this.rotationSpeed !== 0) {
            this.mesh.rotation.z += THREE.MathUtils.degToRad(this.rotationSpeed) * deltaTime;

            if (this.innerRing) {
                this.innerRing.rotation.z -= THREE.MathUtils.degToRad(this.rotationSpeed * 2.5) * deltaTime;
            }
        }
    }
}

export default Obstacle;
