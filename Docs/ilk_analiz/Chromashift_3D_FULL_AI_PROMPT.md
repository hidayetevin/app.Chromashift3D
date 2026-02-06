
# CHROMASHIFT 3D – FULL AI PRODUCTION PROMPT
## (Three.js – Mobile – Color Switch Evolution)

You are an expert **hyper-casual mobile game developer** and **Three.js engineer**.
Your task is to build a complete, production-ready MVP of a mobile game called **Chromashift 3D** by strictly following this document.

---
## 1. PROJECT GOAL
Create a **Color Switch–style precision casual game** with the following innovations:
- Color + Shape matching
- Vertical progression
- Visual theme transitions
- Mobile performance optimization

Target platforms:
- Android APK
- iOS IPA (via WebView wrapper)

---
## 2. CORE GAME RULES
1. Player controls a bouncing object (ball)
2. Player input is **single tap only**
3. Each tap cycles the player:
   - Color
   - Shape
4. Obstacles require **exact color + shape match**
5. Mismatch results in **instant game over**
6. Difficulty increases gradually

---
## 3. PLAYER SYSTEM
### Shapes
- Circle
- Square
- Triangle

### Colors
- Red
- Blue
- Yellow
- Green

### Player Logic
- On tap:
  - Change to next color
  - Change to next shape
- Maintain smooth animation
- Visual feedback on change

---
## 4. OBSTACLE SYSTEM
### Types
- Rotating rings
- Shape gates
- Narrow color tunnels

### Properties
- Required color
- Required shape
- Rotation speed
- Vertical spacing

### Generation
- Procedural spawning
- Difficulty-based parameters

---
## 5. THEME & ENVIRONMENT SYSTEM
Implement **vertical theme transitions** based on score or height.

### Themes
1. Grass & Sky
   - Green ground
   - Blue sky
2. Cloud World
   - Moving clouds
   - Soft fog
3. Space
   - Dark background
   - Stars
   - Neon colors
4. Void
   - Minimal lighting
   - Dark fog

### Transition Rules
- Smooth color fades
- Lighting interpolation
- Background changes

---
## 6. CAMERA SYSTEM
- Vertical follow camera
- Slight tilt angle
- Smooth lerp movement
- Minor shake on failure

---
## 7. GAME LOOP
1. Start game
2. Spawn obstacles
3. Player progresses upward
4. Increase speed over time
5. Detect collisions
6. Handle success/failure
7. Restart or continue

---
## 8. DIFFICULTY SCALING
- Increase obstacle speed
- Reduce gap sizes
- Introduce mixed obstacles
- Faster rotations

---
## 9. UI / UX
### Screens
- Start screen
- In-game HUD (score only)
- Game over screen

### UI Rules
- Minimal UI
- No distraction during gameplay
- Big readable text

---
## 10. MONETIZATION PLACEHOLDERS
- Rewarded Ad:
  - Continue after death
- Interstitial Ad:
  - Every 2–3 deaths

(No SDK integration required yet, just placeholders)

---
## 11. PERFORMANCE REQUIREMENTS
- Target 60 FPS on mid-range Android
- Low poly geometries
- Minimal draw calls
- Object pooling
- No heavy shaders

---
## 12. FILE STRUCTURE
/src
  /core
    Game.js
    SceneManager.js
  /player
    Player.js
  /obstacles
    ObstacleManager.js
  /environment
    ThemeManager.js
  /ui
    UIManager.js
  main.js

---
## 13. TECHNOLOGY CONSTRAINTS
- Use Three.js only
- No external heavy libraries
- Mobile-first mindset
- Clean, modular code

---
## 14. OUTPUT EXPECTATION
You must:
- Produce runnable Three.js code
- Follow this architecture exactly
- Comment important logic
- Keep code clean and readable

Do NOT:
- Add extra mechanics
- Change controls
- Overcomplicate visuals

---
## 15. SUCCESS CRITERIA
- Game is playable within 5 seconds
- Controls feel responsive
- Visual theme progression is obvious
- Game is fun within first 30 seconds

END OF PROMPT
