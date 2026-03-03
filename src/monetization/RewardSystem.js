import SaveSystem from '../systems/SaveSystem.js';

class RewardSystem {
    grantReward(type) {
        console.log('Granting Reward:', type);

        // Example rewards
        switch (type) {
            case 'continue':
                // Logic handled by Game state, but we log it
                break;
            case 'stars_10':
                let currentStars = parseInt(localStorage.getItem('chromashift_stars') || '0');
                currentStars += 10;
                localStorage.setItem('chromashift_stars', currentStars.toString());
                import('../ui/UIManager.js').then(ui => {
                    ui.default.updateStars(currentStars);
                    // Also trigger a notification if needed
                });
                break;
            case 'coins':
                const coins = SaveSystem.get('coins', 0);
                SaveSystem.set('coins', coins + 50);
                break;
            case 'skin':
                // Unlock logic
                break;
        }
    }
}

export default new RewardSystem();
