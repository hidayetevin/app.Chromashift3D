
class MissionSystem {
    constructor() {
        this.missions = [];
        this.lastLoginDate = '';
    }

    init() {
        this.load();

        const today = new Date().toDateString();
        if (this.lastLoginDate !== today) {
            console.log("New day detected, resetting missions...");
            this.generateMissions();
            this.lastLoginDate = today;
            this.save();
        } else {
            console.log("Missions loaded for today.");
        }
    }

    generateMissions() {
        // Simple randomized missions
        // Initial Set
        this.missions = [];
        this.missions.push(this.generateSingleMission());
        this.missions.push(this.generateSingleMission());

        // Ensure we save the new missions
        this.save();
    }

    onEvent(eventType, value) {
        let updated = false;
        let completedMissions = [];

        this.missions.forEach(mission => {
            if (!mission.claimed && mission.type === eventType) {

                let missionCompleted = false;

                // For 'score', we usually want "reach X in one run" OR "accumulate X". 
                // Description says "in one run", so we check if value >= target.
                // If it was "accumulate", we would do mission.current += value.

                if (eventType === 'score') {
                    if (value > mission.current) {
                        mission.current = value;
                        if (mission.current >= mission.target) {
                            missionCompleted = true;
                        }
                        updated = true;
                    }
                } else if (eventType === 'collect') {
                    // Accumulative
                    mission.current += value;
                    if (mission.current >= mission.target) {
                        missionCompleted = true;
                    }
                    updated = true;
                }

                if (missionCompleted && !mission.completed) {
                    this.completeMission(mission);
                    completedMissions.push(mission);
                    updated = true;
                }
            }
        });

        if (updated) this.save();
        return completedMissions;
    }

    completeMission(mission) {
        console.log(`Mission Completed: ${mission.desc}`);
        mission.completed = true;
        // We do NOT set claimed here anymore. Waiting for user interaction.
    }

    claimAndReplace(missionId) {
        const idx = this.missions.findIndex(m => m.id === missionId);
        if (idx === -1) return null;

        const mission = this.missions[idx];
        if (!mission.completed) return null; // Can't claim not completed

        // Claimed!
        const reward = mission.reward;

        // Remove old mission and add new one
        this.missions.splice(idx, 1);

        const newMission = this.generateSingleMission();
        // Ensure unique ID just in case
        newMission.id = newMission.id + '_' + Date.now();
        this.missions.push(newMission);

        this.save();
        return { reward, newMission };
    }

    generateSingleMission() {
        // Pool of potential missions
        const types = ['score', 'collect'];
        const type = types[Math.floor(Math.random() * types.length)];

        let mission = {};
        if (type === 'score') {
            const targets = [10, 20, 30, 50];
            const target = targets[Math.floor(Math.random() * targets.length)];
            mission = {
                id: `score_${target}`,
                desc: `Score ${target} Points in one run`,
                target: target,
                current: 0,
                completed: false,
                claimed: false, // Legacy prop just in case
                type: 'score',
                reward: Math.floor(Math.random() * 3) + 1
            };
        } else {
            const targets = [5, 10, 15];
            const target = targets[Math.floor(Math.random() * targets.length)];
            mission = {
                id: `collect_${target}`,
                desc: `Collect ${target} Stars`,
                target: target,
                current: 0,
                completed: false,
                claimed: false,
                type: 'collect',
                reward: Math.floor(Math.random() * 3) + 1
            };
        }
        return mission;
    }

    save() {
        const data = {
            missions: this.missions,
            lastLoginDate: this.lastLoginDate
        };
        localStorage.setItem('chromashift_missions', JSON.stringify(data));
    }

    load() {
        const dataStr = localStorage.getItem('chromashift_missions');
        if (dataStr) {
            try {
                const data = JSON.parse(dataStr);
                this.missions = data.missions || [];
                this.lastLoginDate = data.lastLoginDate || '';
            } catch (e) {
                console.error("Failed to load missions", e);
            }
        }
    }

    getMissions() {
        return this.missions;
    }
}

export default new MissionSystem();
