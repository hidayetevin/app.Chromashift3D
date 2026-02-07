# New Feature Prompts

These prompts are designed to implement the requested features modularly. You can copy and paste these one by one to implement the features.

## Prompt 1: Combo Effects (Matrix Style) & Time Scale

**Goal:** Implement a "Combo" system where passing 3 obstacles quickly triggers a "PERFECT!" effect and slow motion.

**Instructions:**
1.  **Modify `Game.js`**:
    -   Add `comboCount` (int) and `lastScoreTime` (float) to the constructor.
    -   Add `timeScale` (float, default 1.0) to control game speed.
    -   In `update(deltaTime)`, wrap the entire update logic (physics, obstacles, theme) to use `deltaTime * this.timeScale`.
    -   In `update()`, when `score` increases:
        -   Check if `(this.gameTime - this.lastScoreTime) < 1.0` (1 second threshold).
        -   If true, increment `comboCount`. Else reset to 1.
        -   Update `lastScoreTime = this.gameTime`.
        -   If `comboCount >= 3`, call a new method `triggerComboEffect()`.
    -   Add `triggerComboEffect()` method:
        -   Set `this.timeScale = 0.5`.
        -   Use `setTimeout` (or a tween) to reset `timeScale` back to 1.0 after 2 seconds (real time).
        -   Call `UIManager.showComboText()`.
    -   Reset `comboCount` to 0 in `gameOver` and `start`.

2.  **Modify `UIManager.js`**:
    -   Add `showComboText()` method.
    -   Create a "PERFECT!" DOM element (or reuse a pool) that pops up in the center, scales up, and fades out. CSS class `.combo-text` using `position: absolute`.

3.  **Modify `style.css`**:
    -   Add `.combo-text` style (Neon font, big size, centered, pointer-events: none).

---

## Prompt 2: Collectibles (Stars)

**Goal:** Add "Stars" that spawn within obstacles (e.g., inside rings) to be collected for currency.

**Instructions:**
1.  **Modify `ObstacleManager.js`**:
    -   In `spawnNext()`, add a 30% chance to spawn a `Star`.
    -   If spawning a star, create a simple `THREE.Mesh` (Yellow/Gold color, maybe `TetrahedronGeometry` for low poly star look).
    -   Place the star at the center of the obstacle (e.g., `obs.mesh.position`).
    -   Store stars in a separate array `activeStars` or modify `ObstaclePool` to handle them.
    -   Add updates to rotate the star (visual appeal).

2.  **Modify `CollisionDetector.js`**:
    -   Add a check for intersections with `activeStars`.
    -   Stars are "Triggers": If player intersects, return specific collision type `{ hit: true, type: 'star', object: starMesh }`.

3.  **Modify `Game.js`**:
    -   In `update()`, handle collision type `'star'`:
        -   Play "collect" sound (AudioManager).
        -   Hide/Remove star mesh.
        -   Increment `this.starsCollected`.
        -   Save to storage (`SaveSystem.set('stars', totalStars)`).
        -   Trigger UI update.

4.  **Modify `UIManager.js`**:
    -   Add a Star Icon and Counter to the HUD (`#hud`).
    -   Update `updateScore` or add `updateStars(count)` to reflect changes.

---

## Prompt 3: Power-ups (Shield & Color Magnet)

**Goal:** Implement consumable items that protect the player.

**Instructions:**
1.  **Modify `Player.js`**:
    -   Add `this.hasShield = false`.
    -   Add `this.isRainbowMode = false`.
    -   Add `setShield(active)`: Toggles a transparent sphere mesh around the player.
    -   Add `setRainbowMode(active)`: Toggles a shader or rapid color cycling effect on the player material.

2.  **Modify `CollisionDetector.js`**:
    -   In `check()`:
        -   **Magnet Logic**: If `player.isRainbowMode`, ensure `matchColor` is ALWAYS `true` regardless of the segment color.
        -   **Shield Logic**: This needs to be handled in `Game.js` mostly, or `CollisionDetector` can return a special flag. Let's keep `CollisionDetector` returning the crash, and `Game.js` deciding to ignore it.

3.  **Modify `Game.js`**:
    -   In `update()`, when `collision.hit` is true and `!collision.matchColor` (normally death):
        -   Check `if (this.player.hasShield)`:
            -   `this.player.setShield(false)`.
            -   Play "Shield Break" sound.
            -   **Ignore the death** (return/continue).
            -   Add a small "invulnerability" timer (0.5s) to prevent immediate re-collision with the same object.
    -   Add methods `activateShield()` and `activateMagnet()`.
    -   Magnet should automatically expire after 5 seconds (`setTimeout(() => player.setRainbowMode(false), 5000)`).

4.  **Integration**:
    -   For testing, bind keys (e.g., 'S' for Shield, 'M' for Magnet) or add cheat buttons in Settings.

---

## Prompt 4: Daily Missions [IMPLEMENTED]

**Goal:** Simple automated tasks that reset every 24 hours.

**Instructions:**
1.  **Create `src/systems/MissionSystem.js`**:
    -   Class `MissionSystem`.
    -   On `init()`, check `localStorage.getItem('lastLoginDate')`.
    -   If date differs from `new Date().toDateString()`, generate new missions.
    -   Missions array: `[{ id: 'score_50', desc: "Score 50 pts", target: 50, current: 0, claimed: false }]`.
    -   Event listener method `onEvent(eventType, value)` (e.g., eventType = 'score', 'collect').

2.  **Modify `Game.js`**:
    -   In `update()`, when scoring, call `MissionSystem.onEvent('score', this.score)`.
    -   When collecting item, `MissionSystem.onEvent('collect', 1)`.

3.  **Modify `UIManager.js`**:
    -   Add a "Missions" button to the Start Screen.
    -   Create a simple Modal to list active missions and status.
    -   Show a notification if a mission is completed.

4.  **Modify `SaveSystem.js`**:
    -   Use it to persist `currentMissions` and `lastLoginDate`.
