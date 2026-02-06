import * as THREE from 'three';

class CameraController {
    constructor() {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 12);
        this.camera.lookAt(0, 0, 0);
        // Tilt downward 5 degrees
        this.camera.rotation.x = -5 * (Math.PI / 180);

        this.originalPosition = this.camera.position.clone();
        this.targetY = 0;

        // Shake State
        this.shakeTimer = 0;
        this.shakeIntensity = 0;

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        });
    }

    update(playerY, deltaTime) {
        // Smooth Y follow
        this.targetY = playerY + 5;
        this.originalPosition.y = THREE.MathUtils.lerp(this.originalPosition.y, this.targetY, 0.1);

        // Base Follow
        this.camera.position.copy(this.originalPosition);

        // Apply Shake Offset
        if (this.shakeTimer > 0) {
            this.shakeTimer -= deltaTime;
            const damp = this.shakeTimer; // decay
            const x = (Math.random() - 0.5) * this.shakeIntensity * damp;
            const y = (Math.random() - 0.5) * this.shakeIntensity * damp;
            const z = (Math.random() - 0.5) * this.shakeIntensity * damp;

            this.camera.position.add(new THREE.Vector3(x, y, z));
        }

        // Keep looking at player X=0 (relative to shaken position or original?)
        // Usually LookAt overrides rotation.
        // For simple shake, we modify position, then lookAt might counter it if target is fixed.
        // Let's modify LookAt target slightly too if needed, but for now just position shake is enough if LookAt is updated after.

        this.camera.lookAt(0, this.originalPosition.y - 5, 0);
    }

    shake(duration = 0.3, intensity = 0.5) {
        this.shakeTimer = duration;
        this.shakeIntensity = intensity;
    }
}

export default new CameraController();
