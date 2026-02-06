import * as THREE from 'three';
import SceneManager from '../core/SceneManager.js';

export const THEMES = {
    GRASS: { // Re-purposed as "NEON DARK" (Default)
        name: 'Neon Dark',
        background: new THREE.Color(0x111111), // Dark Grey/Black
        fog: { color: 0x111111, near: 15, far: 50 },
        lighting: { ambient: 0x404040, intensity: 1.5, directional: 0xffffff, dirIntensity: 0.5 },
        threshold: 0
    },
    CLOUD: {
        name: 'Cloud World',
        background: new THREE.Color(0xE0F7FF),
        fog: { color: 0xE0F7FF, near: 15, far: 60 },
        lighting: { ambient: 0xffffff, intensity: 0.8, directional: 0xffe4b5, dirIntensity: 0.6 },
        threshold: 20
    },
    SPACE: {
        name: 'Space',
        background: new THREE.Color(0x0A0A1F),
        fog: { color: 0x0A0A1F, near: 5, far: 40 },
        lighting: { ambient: 0x3a3a7f, intensity: 0.4, directional: 0x8080ff, dirIntensity: 0.5 },
        threshold: 50
    },
    VOID: {
        name: 'Void',
        background: new THREE.Color(0x0D0015),
        fog: { color: 0x1A0025, near: 3, far: 30 },
        lighting: { ambient: 0x2a0040, intensity: 0.3, directional: 0x6a00a0, dirIntensity: 0.4 },
        threshold: 100
    },
    BEYOND: {
        name: 'Beyond Void',
        background: new THREE.Color(0x1A0030),
        fog: { color: 0x3A0060, near: 2, far: 25 },
        lighting: { ambient: 0x4a0080, intensity: 0.25, directional: 0x8a00c0, dirIntensity: 0.35 },
        threshold: 150
    }
};

class ThemeManager {
    constructor() {
        this.currentTheme = THEMES.GRASS;
        this.targetTheme = THEMES.GRASS;
        this.transitionTime = 0;
        this.transitionDuration = 3.0;
        this.isTransitioning = false;
    }

    checkTransition(score) {
        let newTheme = THEMES.GRASS;
        if (score >= 150) newTheme = THEMES.BEYOND;
        else if (score >= 100) newTheme = THEMES.VOID;
        else if (score >= 50) newTheme = THEMES.SPACE;
        else if (score >= 20) newTheme = THEMES.CLOUD;

        if (newTheme !== this.currentTheme && newTheme !== this.targetTheme) {
            this.transitionTo(newTheme);
        }
    }

    transitionTo(theme) {
        console.log(`Transitioning to theme: ${theme.name}`);
        this.targetTheme = theme;
        this.isTransitioning = true;
        this.transitionTime = 0;
        // Play sound here
    }

    update(deltaTime) {
        if (!this.isTransitioning) return;

        this.transitionTime += deltaTime;
        const t = Math.min(this.transitionTime / this.transitionDuration, 1.0);

        // Lerp Background
        SceneManager.scene.background.lerpColors(this.currentTheme.background, this.targetTheme.background, t);

        // Lerp Fog
        SceneManager.scene.fog.color.lerpColors(this.currentTheme.fog.color, this.targetTheme.fog.color, t);
        SceneManager.scene.fog.near = THREE.MathUtils.lerp(this.currentTheme.fog.near, this.targetTheme.fog.near, t);
        SceneManager.scene.fog.far = THREE.MathUtils.lerp(this.currentTheme.fog.far, this.targetTheme.fog.far, t);

        // Lerp Lighting
        SceneManager.ambientLight.intensity = THREE.MathUtils.lerp(this.currentTheme.lighting.intensity, this.targetTheme.lighting.intensity, t);
        SceneManager.directionalLight.intensity = THREE.MathUtils.lerp(this.currentTheme.lighting.dirIntensity, this.targetTheme.lighting.dirIntensity, t);
        SceneManager.directionalLight.color.lerpHSL(new THREE.Color(this.targetTheme.lighting.directional), t); // Approx lerp

        if (t >= 1.0) {
            this.currentTheme = this.targetTheme;
            this.isTransitioning = false;
        }
    }
}

export default new ThemeManager();
