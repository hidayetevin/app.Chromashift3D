import SaveSystem from './SaveSystem.js';
import Analytics from '../analytics/Analytics.js';
import RewardSystem from '../monetization/RewardSystem.js';

class RetentionSystem {
    constructor() {
        this.loginStreak = SaveSystem.get('login_streak', 0);
        this.lastLoginDate = SaveSystem.get('last_login_date', null);
    }

    checkDailyLogin() {
        const today = new Date().toDateString();

        if (this.lastLoginDate === today) {
            console.log('Already claimed daily login today');
            return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();

        if (this.lastLoginDate === yesterdayString) {
            // Consecutive login
            this.loginStreak++;
        } else {
            // Broken streak
            this.loginStreak = 1;
        }

        SaveSystem.set('login_streak', this.loginStreak);
        SaveSystem.set('last_login_date', today);

        Analytics.track('daily_login', { streak: this.loginStreak });
        this.grantDailyReward();
    }

    grantDailyReward() {
        console.log(`Granting Daily Reward for Day ${this.loginStreak}`);
        // Simple cyclical reward
        const rewardType = this.loginStreak % 7 === 0 ? 'skin' : 'coins';
        RewardSystem.grantReward(rewardType);

        // Return info for UI
        return {
            streak: this.loginStreak,
            reward: rewardType
        };
    }
}

export default new RetentionSystem();
