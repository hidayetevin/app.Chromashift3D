import Obstacle from './Obstacle.js';

class ObstaclePool {
    constructor(scene, size = 20) {
        this.scene = scene;
        this.pool = [];
        this.activeObstacles = [];

        for (let i = 0; i < size; i++) {
            const obs = new Obstacle('ring'); // Default type
            obs.mesh.visible = false;
            this.scene.add(obs.mesh);
            this.pool.push(obs);
        }
    }

    get(type, yPos, rotationSpeed) {
        let obs = null;
        if (this.pool.length > 0) {
            obs = this.pool.pop();
        } else {
            // Expand pool if empty
            obs = new Obstacle('ring');
            this.scene.add(obs.mesh);
        }

        obs.initType(type); // Re-initialize type geometry
        obs.reset();

        obs.mesh.position.set(0, yPos, 0);
        obs.mesh.visible = true;
        obs.rotationSpeed = rotationSpeed;

        this.activeObstacles.push(obs);

        return obs;
    }

    returnToPool(obs) {
        obs.mesh.visible = false;
        const idx = this.activeObstacles.indexOf(obs);
        if (idx > -1) this.activeObstacles.splice(idx, 1);
        this.pool.push(obs);
    }
}

export default ObstaclePool;
