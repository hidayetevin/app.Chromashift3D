import * as THREE from 'three';
import { PERFORMANCE } from '../utils/Constants.js';

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = PERFORMANCE.MAX_PARTICLES || 50;
        this.scene = null;

        // geometry/material cache
        this.geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    }

    init(scene) {
        this.scene = scene;
    }

    emit(position, color, count = 8) {
        if (!this.scene) return;

        for (let i = 0; i < count; i++) {
            if (this.particles.length >= this.maxParticles) {
                // Remove oldest (first)
                this.removeParticle(0);
            }

            const mesh = new THREE.Mesh(this.geometry, this.material.clone());
            mesh.material.color.setHex(color);
            mesh.position.copy(position);

            // Random velocity
            const speed = 2 + Math.random() * 2;
            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * speed,
                (Math.random() - 0.5) * speed,
                (Math.random() - 0.5) * speed
            );

            this.scene.add(mesh);

            this.particles.push({
                mesh: mesh,
                velocity: velocity,
                life: 1.0 // seconds
            });
        }
    }

    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.life -= deltaTime;

            if (p.life <= 0) {
                this.removeParticle(i);
                continue;
            }

            // Move
            p.mesh.position.addScaledVector(p.velocity, deltaTime);

            // Rotate
            p.mesh.rotation.x += deltaTime * 2;
            p.mesh.rotation.y += deltaTime * 2;

            // Shrink
            const scale = p.life; // 1.0 -> 0.0
            p.mesh.scale.set(scale, scale, scale);
        }
    }

    removeParticle(index) {
        const p = this.particles[index];
        if (p && p.mesh) {
            this.scene.remove(p.mesh);
            // Material handled by GC mostly, but for strict memory mgmt:
            p.mesh.material.dispose();
        }
        this.particles.splice(index, 1);
    }
}

export default new ParticleSystem();
