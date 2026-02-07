# New Features Analysis & Implementation Plan

## Overview
This document outlines the technical analysis and implementation strategy for the requested new features. Features marked with [x] have been fully implemented.

---

## 1. Combo Effects (Matrix Effect) [x]
**Concept:** If the player passes 3 obstacles in quick succession, trigger slow-motion.
- **Implementation Status:** Completed.
- **Technical Details:**
    - Uses `timeScale` in `Game.js` to slow down world updates.
    - UIManager shows "PERFECT!" text with CSS animations.
    - Time window: 1.0s.

---

## 2. Collectibles (Stars) [x]
**Concept:** Gold stars placed to be collected for currency.
- **Implementation Status:** Completed.
- **Technical Details:**
    - Stars spawn with 30% probability in obstacle centers.
    - `CollisionDetector` handles 'star' type collection.
    - `UIManager` displays star count in HUD.

---

## 3. Power-Ups [ ]
**Concept:** Shield and Color Magnet.
- **Status:** Planned / Under Development.
- **Features:** 
    - Shield protects from one crash.
    - Rainbow/Magnet mode allows passing through any color.

---

## 4. Daily Missions [x]
**Concept:** Manual claim system for rewards.
- **Implementation Status:** Completed.
- **Technical Details:**
    - **MissionSytem.js**: Logic for SCORE and COLLECT missions.
    - **Manual Claiming**: Missions are not auto-claimed. Player must click "CLAIM" / "ÖDÜL AL".
    - **Replacement**: Once claimed, a new mission is generated instantly.
    - **Rewards**: Random 1-3 stars.
    - **Ad Integration**: Interstitial ads are shown before the claim reward is granted.
    - **TR/EN Support**: Full translation for mission statuses and descriptions.

---

## 5. Monetization & Ads [x]
**Concept:** Robust AdMob integration for Banner, Interstitial, and Rewarded ads.
- **Implementation Status:** Completed.
- **Key Features:**
    - **Fail-Safe Logic**: Guards against ad load failures, plugin initialization issues, and early dismissals.
    - **Watchdog Timeout**: 120s safety timeout to ensure game flow doesn't hang on ad screens.
    - **Dynamic Rewarding**: Interstitial ads used in Mission claims; Rewarded ads used for game revives.
    - **Async Listeners**: Properly managed Capacitor AdMob listeners with cleanup logic.

---

## Architecture Updates
- **AdsManager.js**: Centralized robust ad management.
- **MissionSystem.js**: Decoupled mission logic with event-based tracking.
- **UIManager.js**: Enhanced with dynamic modals and star collection animations.
