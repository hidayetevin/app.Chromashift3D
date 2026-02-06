import * as THREE from 'three';
import { PERFORMANCE } from '../utils/Constants.js';

class SceneManager {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('webgl2', { alpha: false });

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            powerPreference: 'high-performance',
            context: this.context
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = false; // Performance optimization (Section 14.1)

        document.getElementById('game-container').appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();

        // Initial setup - will be overridden by ThemeManager
        this.scene.background = new THREE.Color(0x111111);
        this.scene.fog = new THREE.Fog(0x111111, 15, 50);

        this.setupLights();

        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    setupLights() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(this.ambientLight);

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directionalLight.position.set(10, 20, 10);
        this.scene.add(this.directionalLight);
    }

    onWindowResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // Camera update handled in CameraController
    }

    render(camera) {
        this.renderer.render(this.scene, camera);
    }
}

export default new SceneManager();
