import * as THREE from 'three';

class CameraController {
    constructor() {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.baseDistance = 12;
        this.minVisibleWidth = 9.0; // Ensure at least 9 units of width are visible

        this.updateCameraDistance();

        this.camera.position.set(0, 5, this.currentDistance);
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

            this.updateCameraDistance();

            // Update Z in originalPosition so the update loop uses the new distance
            this.originalPosition.z = this.currentDistance;
        });
    }

    updateCameraDistance() {
        // Calculate required distance to see 'minVisibleWidth' at Z=0
        const aspect = window.innerWidth / window.innerHeight;
        const vFOV = THREE.MathUtils.degToRad(this.camera.fov);

        // visibleWidth = 2 * dist * tan(vFOV/2) * aspect
        // dist = visibleWidth / (2 * tan(vFOV/2) * aspect)
        const requiredDist = this.minVisibleWidth / (2 * Math.tan(vFOV / 2) * aspect);

        // Don't get closer than baseDistance (maintain height visibility on wide screens)
        this.currentDistance = Math.max(this.baseDistance, requiredDist);
    }

    update(playerY, deltaTime) {
        // Smooth Y follow
        this.targetY = playerY + 5;
        this.originalPosition.y = THREE.MathUtils.lerp(this.originalPosition.y, this.targetY, 0.1);

        // Base Follow
        this.camera.position.copy(this.originalPosition);
        // Ensure Z is up to date (though originalPosition.z is updated on resize, safe to enforce)
        // this.camera.position.z = this.currentDistance; // originalPosition.z already has it

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
        this.camera.lookAt(0, this.originalPosition.y - 5, 0);
    }

    shake(duration = 0.3, intensity = 0.5) {
        this.shakeTimer = duration;
        this.shakeIntensity = intensity;
    }
}

export default new CameraController();
