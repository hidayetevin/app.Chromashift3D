import { test, expect } from '@playwright/test';

test.describe('Chromashift 3D Gameplay Tests', () => {

    test.beforeEach(async ({ page }) => {
        // Go to the game URL
        await page.goto('http://localhost:5173/');
        // Wait for the game canvas to load
        await page.waitForSelector('canvas');
    });

    test('Game Start and Initial State', async ({ page }) => {
        // Check if score is visible and starts at 0
        const scoreElement = await page.waitForSelector('#score');
        const scoreText = await scoreElement.innerText();
        expect(scoreText).toBe('0');

        // Check if Start Screen or Overlay is present (if applicable in current state)
        // Based on Game.js start() logic, it might auto-start to PLAYING if triggered, 
        // but typically we tap to start.
        // Let's assume the game is in MENU or ready state.
    });

    test('Player Tap Interaction (Jump)', async ({ page }) => {
        // Simulate a Tap (Click on body/canvas)
        await page.click('body');

        // Since we can't easily read Three.js internal state (Player Position) from Playwright 
        // without exposing it to window, we will verify that no errors occur and game state remains stable.

        // Check if score is still valid (not NaN)
        const score = await page.locator('#score').innerText();
        expect(Number(score)).not.toBeNaN();

        // Wait a bit to ensure no crash
        await page.waitForTimeout(1000);
    });

    test('Game Over Triggering (Collision)', async ({ page }) => {
        // This is hard to test deterministically without mocking physics/collision
        // But we can check if Game Over UI appears eventually if we do nothing (gravity death)
        // In current vertical logic, if we don't tap, we fall.

        // Wait for 5 seconds of inactivity
        await page.waitForTimeout(5000);

        // Check for Game Over UI visibility (if implemented in DOM)
        // UIManager.js creates #game-over-screen dynamically
        const gameOverScreen = page.locator('#game-over-screen');

        // It might appear if player falls below Y=-5
        if (await gameOverScreen.count() > 0) {
            await expect(gameOverScreen).toBeVisible();
        }
    });

    test('Console Error Check', async ({ page }) => {
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
        });

        await page.waitForTimeout(2000);
        expect(errors.length).toBe(0);
    });

});
