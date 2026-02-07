# New Features Analysis & Implementation Plan

## Overview
This document outlines the technical analysis and implementation strategy for the requested new features. The goal is to integrate these features seamlessly without disrupting the existing core gameplay loop or performance.

---

## 1. Combo Effects (Matrix Effect)
**Concept:** If the player passes 3 obstacles in quick succession (e.g., < 1.0s between each), trigger a "PERFECT!" visual and a temporary slow-motion effect.

### Technical Implementation:
- **Game.js**:
    - Add `lastObstacleTime` (timestamp) and `comboCount` (integer) tracking variables.
    - Inside `update()` where score increases:
        - Check `currentTime - lastObstacleTime`.
        - If < Threshold, increment `comboCount`. Else reset `comboCount = 1`.
        - If `comboCount >= 3`:
            - Trigger `activateSlowMotion()`.
            - Trigger `UIManager.showComboText()`.
            - Reset `comboCount = 0` (or keep increasing for higher combos).
    - **Time Scale Logic**: Introduce a `timeScale` variable (default 1.0) in `Game.js`. Multiply `deltaTime` by this value before passing it to `update` methods.
- **UIManager.js**:
    - Add a floating text element or a centralized "PERFECT!" overlay animation.

### Risks & Mitigations:
- **Risk:** Slow motion affecting physics (gravity) differently if not using fixed timesteps.
    - *Mitigation:* `PhysicsEngine` currently uses `deltaTime`. Scaling `deltaTime` is the correct approach for slow-mo, provided `deltaTime` isn't clamped too aggressively.
- **Risk:** UI animations running in slow motion.
    - *Mitigation:* UI animations (CSS) won't be affected by JS `deltaTime`. `Tween.js` updates might need to use unscaled time if independent, but usually, we want world tweens to slow down too.

---

## 2. Collectibles (Stars/Diamonds)
**Concept:** Gold stars placed in challenging spots (e.g., center of rotating rings) to be collected for future currency.

### Technical Implementation:
- **ObstacleManager.js**:
    - When spawning obstacles (e.g., Ring), possibly spawn a `Star` object at the center.
    - Need a new `StarPool` or integrate into `ObstaclePool` with a new type `'star'`.
- **CollisionDetector.js**:
    - Add logic to check collision with Stars.
    - Stars should be "Triggers" (no physical bounce/stop, just collect & disappear).
- **SaveSystem.js** (or new `CurrencyManager`):
    - Track `totalStars`.
- **UI**:
    - HUD update to show star count.

### Risks & Mitigations:
- **Risk:** Performance drop due to more objects.
    - *Mitigation:* Use simple geometry (Plane or low-poly Tetrahedron) for stars and reuse them via pooling. Use simple distance checks.

---

## 3. Power-Up: Shield
**Concept:** A one-time protection that saves the player from a collision.

### Technical Implementation:
- **Player.js**:
    - Add `hasShield` boolean state.
    - Add visual indicator (transparent sphere mesh around player).
- **Game.js / CollisionDetector.js**:
    - When `CollisionDetector` returns a "Hit":
        - Check `player.hasShield`.
        - If true: 
            - Ignore "Game Over".
            - Deactivate Shield (`player.setShield(false)`).
            - Play "Shield Break" effect/sound.
            - Destroy the obstacle segment (optional) or bounce player back? (Ideally just pass through or bounce safe).
- **Acquisition**:
    - Can be a pickup item (like Stars) or a pre-game purchase/reward.

### Risks & Mitigations:
- **Risk:** Collision loop (shield breaks, but player is still touching obstacle next frame -> dies).
    - *Mitigation:* Add a brief "Invulnerability" window (0.5s) after shield breaks.

---

## 4. Power-Up: Color Magnet (Rainbow)
**Concept:** Player turns rainbow-colored for 5 seconds and can pass through ANY color obstacle.

### Technical Implementation:
- **Player.js**:
    - Add `isRainbowMode` boolean.
    - Change material to a shader or cycle vertex colors rapidly.
- **CollisionDetector.js**:
    - In collision checks, if `player.isRainbowMode` is true, force `matchColor = true`.
- **Game.js**:
    - Handle duration timer. After 5s, revert to original color and disable mode.

### Risks & Mitigations:
- **Risk:** Timer runs out *inside* an obstacle.
    - *Mitigation:* Check for "safe" exit or extend timer slightly if currently colliding? Or just accept the risk as part of gameplay (flashing warning before expiry).

---

## 5. Daily Missions
**Concept:** Simple tasks reset daily (e.g., "Score 50").

### Technical Implementation:
- **MissionSystem.js** (New Module):
    - Define Mission Types: `SCORE`, `COLLECT`, `GAMES_PLAYED`.
    - Function `checkDailyReset()`: Checks date vs last login date. If new day, generate new missions.
- **Game.js**:
    - Send events to `MissionSystem` (e.g., `MissionSystem.onEvent('score', 1)`).
- **SaveSystem**:
    - Persist current mission progress.

### Risks & Mitigations:
- **Risk:** Clock manipulation by user.
    - *Mitigation:* Non-critical for a casual game, can rely on local device time or minimal server check (offline focused, so device time is acceptable).

---

## Architecture Updates Summary
- **No breaking changes** expected for Core Loop.
- `Game.js` loop will be cleanly modified to support `timeScale`.
- `CollisionDetector.js` will be enhanced, not rewritten.
- New modules (`MissionSystem`, `CurrencyManager`) will stay decoupled.
