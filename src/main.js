import './style.css'; // Optional if we add css
import ErrorHandler from './systems/ErrorHandler.js';
import AdsManager from './monetization/AdsManager.js';
import Analytics from './analytics/Analytics.js';
import RetentionSystem from './systems/RetentionSystem.js';
import Game from './core/Game.js';

async function bootstrap() {
    console.log('Bootstrapping Chromashift 3D...');

    // 1. Init System Services
    try {
        await Analytics.init();
        await AdsManager.init();
        RetentionSystem.checkDailyLogin();
    } catch (e) {
        console.error('System Init Failed:', e);
    }

    // 2. Init Game Core
    Game.init();

    // 3. UI Bindings
    const startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('click', () => {
        Game.start();
        Analytics.track('game_start');
    });

    console.log('Ready to Play!');
}

window.addEventListener('DOMContentLoaded', bootstrap);
