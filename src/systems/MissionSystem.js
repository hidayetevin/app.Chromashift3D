
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
        this.missions = [
            { id: 'score_10', desc: "Score 10 Points in one run", target: 10, current: 0, claimed: false, type: 'score' },
            { id: 'collect_5', desc: "Collect 5 Stars", target: 5, current: 0, claimed: false, type: 'collect' }
        ];

        // Ensure we save the new missions
        this.save();
    }

    onEvent(eventType, value) {
        let updated = false;
        this.missions.forEach(mission => {
            if (!mission.claimed && mission.type === eventType) {

                // For 'score', we usually want "reach X in one run" OR "accumulate X". 
                // Description says "in one run", so we check if value >= target.
                // If it was "accumulate", we would do mission.current += value.

                if (eventType === 'score') {
                    if (value > mission.current) {
                        mission.current = value;
                        if (mission.current >= mission.target) {
                            this.completeMission(mission);
                        }
                        updated = true;
                    }
                } else if (eventType === 'collect') {
                    // Accumulative
                    mission.current += value;
                    if (mission.current >= mission.target) {
                        this.completeMission(mission);
                    }
                    updated = true;
                }
            }
        });

        if (updated) this.save();
    }

    completeMission(mission) {
        console.log(`Mission Completed: ${mission.desc}`);
        mission.claimed = true; // Auto-claim logic for now, or just mark done
        // Show notification? UIManager.showNotification(...)
        // Giving reward?
        // Game.starsCollected += 10?
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
