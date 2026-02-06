# CHROMASHIFT 3D – FULL AI PRODUCTION PROMPT
## Version 2.0 - COMPLETE TECHNICAL SPECIFICATION
## (Three.js – Mobile – Color Switch Evolution)

You are an expert **hyper-casual mobile game developer** and **Three.js engineer**.
Your task is to build a complete, production-ready MVP of a mobile game called **Chromashift 3D** by strictly following this document.

---

## 1. PROJECT GOAL

Create a **Color Switch-style precision casual game** with the following innovations:
- Color + Shape matching (dual mechanic)
- Vertical progression with theme transitions
- Visual environment evolution
- Mobile performance optimization (60 FPS target)

### Target Platforms
- **Android:** 8.0+ (API Level 26)
- **iOS:** 12.0+
- **WebView Wrapper:** Cordova / Capacitor

### Target Devices
- Mid-range smartphones (2GB RAM minimum)
- GPU: Mali-G71 / Adreno 505 or better

---

## 2. CORE GAME RULES

### 2.1 Basic Rules
1. Player controls a bouncing object (ball)
2. Player input is **single tap only** (no swipe, no hold)
3. Each tap cycles the player:
   - Color (R→B→Y→G→R cycle)
   - Shape (Circle→Square→Triangle→Circle)
4. Obstacles require **exact color + shape match**
5. Mismatch results in **instant game over**
6. Difficulty increases gradually (speed + complexity)

### 2.2 Win/Lose Conditions
- **Success:** Color AND shape match obstacle segment
- **Fail Cases:**
  - Wrong color + correct shape = FAIL
  - Correct color + wrong shape = FAIL
  - Wrong color + wrong shape = FAIL
- **Scoring:** +1 point per obstacle passed

---

## 3. PLAYER SYSTEM

### 3.1 Shapes
Implement 3 distinct shapes:
1. **Circle**
   - Geometry: SphereGeometry(radius: 0.5, segments: 16)
   - Mass: 1.0 (reference)

2. **Square**
   - Geometry: BoxGeometry(1, 1, 1)
   - Mass: 1.0

3. **Triangle**
   - Geometry: TetrahedronGeometry(radius: 0.6)
   - Mass: 1.0

### 3.2 Colors
Use these exact hex codes:
- **Red:** #FF3B30
- **Blue:** #007AFF
- **Yellow:** #FFCC00
- **Green:** #34C759

### 3.3 Player Logic

#### Tap Behavior
```javascript
onTap() {
  // Color cycle
  currentColorIndex = (currentColorIndex + 1) % 4;
  player.material.color.setHex(COLORS[currentColorIndex]);
  
  // Shape cycle
  currentShapeIndex = (currentShapeIndex + 1) % 3;
  morphToShape(SHAPES[currentShapeIndex], duration: 0.2);
  
  // Feedback
  playSound('tap');
  triggerHaptic('light');
}
```

#### Shape Morphing Animation
- **Duration:** 0.2 seconds
- **Type:** Vertex interpolation (smooth morph)
- **Easing:** ease-out-quad
- **VFX:** Small particle burst (5-8 particles)

```javascript
function morphToShape(targetShape, duration) {
  const startGeometry = player.geometry;
  const endGeometry = targetShape.geometry;
  
  // Tween vertices
  tween({
    from: startGeometry.vertices,
    to: endGeometry.vertices,
    duration: duration,
    easing: 'easeOutQuad',
    onUpdate: (interpolatedVertices) => {
      player.geometry.vertices = interpolatedVertices;
      player.geometry.verticesNeedUpdate = true;
    }
  });
  
  // Particle effect
  emitParticles(player.position, count: 6, color: player.color);
}
```

### 3.4 Player Movement (Bouncing Physics)

#### Manual Physics Implementation
```javascript
// Physics constants
const GRAVITY = -9.8;
const BOUNCE_HEIGHT = 2.5;
const BOUNCE_DURATION = 0.8;

// Bounce cycle
function updatePlayer(deltaTime) {
  // Apply gravity
  player.velocity.y += GRAVITY * deltaTime;
  
  // Update position
  player.position.y += player.velocity.y * deltaTime;
  
  // Ground collision (y = 0)
  if (player.position.y <= 0) {
    player.position.y = 0;
    
    // Bounce with fixed velocity
    player.velocity.y = calculateBounceVelocity(BOUNCE_HEIGHT);
    
    // SFX
    playSound('bounce');
  }
  
  // Camera follow
  camera.position.y = lerp(camera.position.y, player.position.y + 5, 0.1);
}

function calculateBounceVelocity(targetHeight) {
  // v = sqrt(2 * g * h)
  return Math.sqrt(2 * Math.abs(GRAVITY) * targetHeight);
}
```

#### Player Bounds
- X position: Clamped to [-5, 5] (prevent off-screen)
- Y position: Min 0, Max unlimited (vertical progression)

---

## 4. OBSTACLE SYSTEM

### 4.1 Obstacle Types

#### Type 1: Rotating Ring
```javascript
{
  type: 'ring',
  radius: 3,
  segments: 4, // 4 colored segments
  colors: [RED, BLUE, YELLOW, GREEN],
  shapes: [CIRCLE, SQUARE, TRIANGLE, CIRCLE],
  rotationSpeed: 60, // degrees per second
  thickness: 0.3
}
```

#### Type 2: Shape Gate
```javascript
{
  type: 'gate',
  width: 4,
  requiredColor: BLUE,
  requiredShape: TRIANGLE,
  gapSize: 1.2, // player pass-through width
  rotationSpeed: 0 // static
}
```

#### Type 3: Narrow Tunnel
```javascript
{
  type: 'tunnel',
  segments: 2, // left and right options
  colors: [RED, BLUE],
  shapes: [CIRCLE, SQUARE],
  gapSize: 1.5,
  rotationSpeed: 45
}
```

### 4.2 Obstacle Generation

#### Procedural Spawning
```javascript
function spawnObstacle(score, speed) {
  // Difficulty scaling
  let obstacleType;
  let rotationSpeed;
  
  if (score < 10) {
    // Easy: Color-only rings
    obstacleType = 'ring';
    rotationSpeed = 60;
  } else if (score < 30) {
    // Medium: Color + shape
    obstacleType = random(['ring', 'gate']);
    rotationSpeed = 60 + (score / 20) * 15;
  } else {
    // Hard: All types
    obstacleType = random(['ring', 'gate', 'tunnel']);
    rotationSpeed = Math.min(120, 60 + (score / 20) * 15);
  }
  
  const obstacle = createObstacle(obstacleType, rotationSpeed);
  obstacle.position.y = player.position.y + SPAWN_DISTANCE;
  
  return obstacle;
}
```

#### Spawn Parameters
- **Initial Gap:** 3 units between obstacles
- **Minimum Gap:** 1.8 units (at max difficulty)
- **Spawn Distance:** 20 units ahead of player
- **Despawn Distance:** 10 units behind player (pool return)

### 4.3 Object Pooling
```javascript
class ObstaclePool {
  constructor(size = 20) {
    this.pool = [];
    this.activeObstacles = [];
    
    // Pre-create obstacles
    for (let i = 0; i < size; i++) {
      this.pool.push(this.createObstacle());
    }
  }
  
  get() {
    if (this.pool.length > 0) {
      const obstacle = this.pool.pop();
      this.activeObstacles.push(obstacle);
      return obstacle;
    }
    // Fallback: create new
    return this.createObstacle();
  }
  
  return(obstacle) {
    obstacle.visible = false;
    const index = this.activeObstacles.indexOf(obstacle);
    this.activeObstacles.splice(index, 1);
    this.pool.push(obstacle);
  }
}
```

---

## 5. COLLISION SYSTEM (CRITICAL)

### 5.1 Collision Detection Method
Use **Bounding Sphere** collision (Three.js built-in):

```javascript
function checkCollision(player, obstacle) {
  // Create bounding spheres
  const playerBounds = new THREE.Sphere(
    player.position,
    player.geometry.boundingSphere.radius * 0.8 // 80% hitbox
  );
  
  // Check each obstacle segment
  for (let segment of obstacle.segments) {
    const segmentBounds = new THREE.Sphere(
      segment.position,
      segment.radius
    );
    
    if (playerBounds.intersectsSphere(segmentBounds)) {
      return {
        hit: true,
        segment: segment
      };
    }
  }
  
  return { hit: false };
}
```

### 5.2 Collision Logic (Precise Implementation)
```javascript
function onCollision(player, segment) {
  // Tolerance window: ±0.15 units
  const TOLERANCE = 0.15;
  
  // Check color match
  const colorMatch = player.color === segment.color;
  
  // Check shape match
  const shapeMatch = player.shape === segment.shape;
  
  if (colorMatch && shapeMatch) {
    // SUCCESS
    score++;
    playSound('success');
    segment.markAsPassed(); // Prevent re-collision
    
  } else {
    // FAILURE
    const failReason = !colorMatch ? 'wrong_color' : 'wrong_shape';
    gameOver(failReason);
    playSound('fail');
    cameraShake(duration: 0.3, intensity: 0.5);
  }
}
```

### 5.3 Edge Case Handling

#### Case 1: Stuck Between Two Obstacles
```javascript
// Mark last passed obstacle to prevent re-collision
obstacle.passed = true;

function checkCollision(player, obstacle) {
  if (obstacle.passed) {
    return { hit: false }; // Ignore passed obstacles
  }
  // ... normal collision check
}
```

#### Case 2: Rapid Tap Spam
```javascript
let lastTapTime = 0;
const TAP_DEBOUNCE = 0.1; // 100ms

function onTap() {
  const now = Date.now() / 1000;
  if (now - lastTapTime < TAP_DEBOUNCE) {
    return; // Ignore spam
  }
  lastTapTime = now;
  
  // ... normal tap logic
}
```

#### Case 3: Collision During Morph
```javascript
// Player is invulnerable during shape morph
if (player.isMorphing) {
  return { hit: false };
}
```

---

## 6. THEME & ENVIRONMENT SYSTEM

### 6.1 Theme Definitions

#### Theme 1: Grass & Sky (Score 0-19)
```javascript
{
  name: 'Grass & Sky',
  background: new THREE.Color(0x87CEEB), // Sky blue
  fog: {
    color: 0x87CEEB,
    near: 10,
    far: 50
  },
  lighting: {
    ambient: 0xFFFFFF,
    intensity: 0.6,
    directional: {
      color: 0xFFFFFF,
      intensity: 0.8,
      position: [10, 20, 10]
    }
  },
  ground: {
    color: 0x228B22, // Forest green
    visible: true
  }
}
```

#### Theme 2: Cloud World (Score 20-49)
```javascript
{
  name: 'Cloud World',
  background: new THREE.Color(0xE0F7FF),
  fog: {
    color: 0xE0F7FF,
    near: 15,
    far: 60
  },
  lighting: {
    ambient: 0xFFFFFF,
    intensity: 0.8,
    directional: {
      color: 0xFFE4B5,
      intensity: 0.6,
      position: [15, 25, 15]
    }
  },
  ground: {
    visible: false // Clouds = no ground
  },
  particles: 'clouds' // Floating cloud sprites
}
```

#### Theme 3: Space (Score 50-99)
```javascript
{
  name: 'Space',
  background: new THREE.Color(0x0A0A1F),
  fog: {
    color: 0x0A0A1F,
    near: 5,
    far: 40
  },
  lighting: {
    ambient: 0x3A3A7F,
    intensity: 0.4,
    directional: {
      color: 0x8080FF,
      intensity: 0.5,
      position: [20, 30, 20]
    }
  },
  stars: true, // Background stars
  ground: {
    visible: false
  }
}
```

#### Theme 4: Void (Score 100-149)
```javascript
{
  name: 'Void',
  background: new THREE.Color(0x0D0015),
  fog: {
    color: 0x1A0025,
    near: 3,
    far: 30
  },
  lighting: {
    ambient: 0x2A0040,
    intensity: 0.3,
    directional: {
      color: 0x6A00A0,
      intensity: 0.4,
      position: [25, 35, 25]
    }
  },
  ground: {
    visible: false
  },
  vignette: true // Dark edge vignette
}
```

#### Theme 5: Beyond Void (Score 150+)
```javascript
{
  name: 'Beyond Void',
  background: new THREE.Color(0x1A0030),
  fog: {
    color: 0x3A0060,
    near: 2,
    far: 25
  },
  lighting: {
    ambient: 0x4A0080,
    intensity: 0.25,
    directional: {
      color: 0x8A00C0,
      intensity: 0.35,
      position: [30, 40, 30]
    }
  },
  psychedelic: true, // Color shift animation
  distortion: 0.02 // Vertex displacement
}
```

### 6.2 Theme Transition Logic
```javascript
function checkThemeTransition(score) {
  let newTheme;
  
  if (score >= 150) newTheme = 'BeyondVoid';
  else if (score >= 100) newTheme = 'Void';
  else if (score >= 50) newTheme = 'Space';
  else if (score >= 20) newTheme = 'Cloud';
  else newTheme = 'Grass';
  
  if (newTheme !== currentTheme) {
    transitionToTheme(newTheme, duration: 3.0);
    showThemeUnlock(newTheme);
    playSound('theme_transition');
  }
}
```

### 6.3 Smooth Theme Transition
```javascript
function transitionToTheme(newTheme, duration) {
  const startTheme = currentTheme;
  const endTheme = THEMES[newTheme];
  
  tween({
    duration: duration,
    onUpdate: (t) => {
      // Background color lerp
      scene.background.lerpColors(
        startTheme.background,
        endTheme.background,
        t
      );
      
      // Fog lerp
      scene.fog.color.lerpColors(
        startTheme.fog.color,
        endTheme.fog.color,
        t
      );
      scene.fog.near = lerp(startTheme.fog.near, endTheme.fog.near, t);
      scene.fog.far = lerp(startTheme.fog.far, endTheme.fog.far, t);
      
      // Lighting lerp
      ambientLight.intensity = lerp(
        startTheme.lighting.intensity,
        endTheme.lighting.intensity,
        t
      );
      
      // Camera FOV slight change
      camera.fov = lerp(60, 65, t);
      camera.updateProjectionMatrix();
    },
    onComplete: () => {
      currentTheme = newTheme;
      camera.fov = 60; // Reset
    }
  });
}
```

---

## 7. CAMERA SYSTEM

### 7.1 Camera Setup
```javascript
const camera = new THREE.PerspectiveCamera(
  60, // FOV
  window.innerWidth / window.innerHeight, // aspect
  0.1, // near
  1000 // far
);

camera.position.set(0, 5, 12);
camera.lookAt(0, 0, 0);
camera.rotation.x = -5 * Math.PI / 180; // 5° downward tilt
```

### 7.2 Camera Follow
```javascript
function updateCamera(player, deltaTime) {
  // Smooth Y follow (lerp)
  const targetY = player.position.y + 5;
  camera.position.y = lerp(camera.position.y, targetY, 0.1);
  
  // Always look at player
  camera.lookAt(player.position);
}
```

### 7.3 Camera Shake (On Death)
```javascript
function cameraShake(duration, intensity) {
  const startPos = camera.position.clone();
  const startTime = Date.now() / 1000;
  
  function shake() {
    const elapsed = (Date.now() / 1000) - startTime;
    if (elapsed > duration) {
      camera.position.copy(startPos);
      return;
    }
    
    // Random offset
    const offset = new THREE.Vector3(
      (Math.random() - 0.5) * intensity,
      (Math.random() - 0.5) * intensity,
      (Math.random() - 0.5) * intensity
    );
    
    // Decay over time
    const decay = 1 - (elapsed / duration);
    camera.position.copy(startPos).add(offset.multiplyScalar(decay));
    
    requestAnimationFrame(shake);
  }
  
  shake();
}
```

---

## 8. GAME LOOP & STATE MANAGEMENT

### 8.1 Game States
```javascript
const GAME_STATE = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameover',
  AD_PLAYING: 'ad_playing'
};
```

### 8.2 Main Game Loop
```javascript
let gameState = GAME_STATE.MENU;
let score = 0;
let gameTime = 0;
let speed = 2.0; // Base speed

function gameLoop(deltaTime) {
  switch (gameState) {
    case GAME_STATE.PLAYING:
      updateGame(deltaTime);
      break;
    case GAME_STATE.MENU:
      updateMenu();
      break;
    case GAME_STATE.GAME_OVER:
      // Freeze game, show UI
      break;
  }
  
  renderer.render(scene, camera);
  requestAnimationFrame(gameLoop);
}

function updateGame(deltaTime) {
  // Update time
  gameTime += deltaTime;
  
  // Update speed (every 10 seconds, +10%)
  speed = 2.0 * (1.0 + Math.floor(gameTime / 10) * 0.1);
  speed = Math.min(speed, 4.5); // Cap at 4.5
  
  // Update player
  updatePlayer(deltaTime);
  
  // Update obstacles
  updateObstacles(deltaTime, speed);
  
  // Check collisions
  checkAllCollisions();
  
  // Check theme transition
  checkThemeTransition(score);
  
  // Spawn new obstacles
  if (needsNewObstacle()) {
    spawnObstacle(score, speed);
  }
}
```

---

## 9. DIFFICULTY SCALING

### 9.1 Speed Formula
```javascript
// Every 10 seconds, speed increases by 10%
const baseSpeed = 2.0;
const speedMultiplier = 1.0 + (Math.floor(gameTime / 10) * 0.1);
const currentSpeed = Math.min(baseSpeed * speedMultiplier, 4.5);

// Examples:
// 0s: 2.0 units/s
// 10s: 2.2 units/s
// 30s: 2.6 units/s
// 60s: 3.2 units/s
// 100s+: 4.5 units/s (CAP)
```

### 9.2 Rotation Speed Formula
```javascript
const baseRotation = 60; // degrees/second
const rotationSpeed = baseRotation + (score / 20) * 15;
const maxRotation = 120;

currentRotation = Math.min(rotationSpeed, maxRotation);

// Examples:
// Score 0: 60°/s
// Score 20: 75°/s
// Score 50: 97.5°/s
// Score 100+: 120°/s (CAP)
```

### 9.3 Gap Size Reduction
```javascript
const baseGap = 3.0;
const minGap = 1.8;
const gapReduction = Math.min((score / 100) * (baseGap - minGap), baseGap - minGap);

currentGap = baseGap - gapReduction;

// Examples:
// Score 0: 3.0 units
// Score 50: 2.4 units
// Score 100+: 1.8 units (MIN)
```

---

## 10. REWARDED AD CONTINUE SYSTEM (DETAILED)

### 10.1 Continue Mechanism (3-Stage Process)

#### Stage 1: Ad Completion
```javascript
function onRewardedAdComplete() {
  gameState = GAME_STATE.AD_PLAYING;
  
  // Fade screen to black
  fadeScreen(0.3, () => {
    showContinueText("Continuing...");
    
    // Proceed to Stage 2 after 0.5s
    setTimeout(setupRespawn, 500);
  });
}
```

#### Stage 2: Respawn Setup
```javascript
function setupRespawn() {
  // Save current state
  const savedState = {
    y: player.position.y,
    color: player.currentColor,
    shape: player.currentShape,
    score: score
  };
  
  // Remove last 2 passed obstacles
  removeLastPassedObstacles(2);
  
  // Freeze upcoming obstacles
  freezeObstacles(duration: 2.0);
  
  // Respawn player
  player.respawn(savedState);
  
  // Visual feedback
  createRespawnEffect(player.position);
  
  // Proceed to Stage 3
  setTimeout(resumeGame, 500);
}
```

#### Stage 3: Resume Game
```javascript
function resumeGame() {
  // Show countdown
  showCountdown(3, () => {
    // Unfreeze obstacles (slow resume)
    unfreezeObstacles(duration: 2.0);
    
    // Enable player control
    player.controlsEnabled = true;
    
    // Mark continue as used
    player.continueUsed = true;
    
    // Return to playing state
    gameState = GAME_STATE.PLAYING;
  });
}
```

### 10.2 Freeze/Unfreeze Obstacles
```javascript
function freezeObstacles(duration) {
  obstacles.forEach(obs => {
    obs.frozen = true;
    obs.savedVelocity = obs.velocity;
    obs.velocity = 0;
    
    // Visual: Grayscale + semi-transparent
    obs.material.opacity = 0.5;
    obs.material.transparent = true;
    obs.material.color.setHex(0x808080);
  });
}

function unfreezeObstacles(duration) {
  obstacles.forEach(obs => {
    // Tween from 0 to savedVelocity over duration
    tween({
      from: 0,
      to: obs.savedVelocity,
      duration: duration,
      onUpdate: (v) => {
        obs.velocity = v;
      },
      onComplete: () => {
        obs.frozen = false;
        obs.material.opacity = 1.0;
        obs.material.color.setHex(obs.originalColor);
      }
    });
  });
}
```

### 10.3 Visual Feedback
```javascript
// Respawn effect
function createRespawnEffect(position) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.5, 0.1, 16, 32),
    new THREE.MeshBasicMaterial({ color: 0x00FFFF })
  );
  ring.position.copy(position);
  scene.add(ring);
  
  // Pulse out animation
  tween({
    from: 1.0,
    to: 3.0,
    duration: 1.0,
    onUpdate: (scale) => {
      ring.scale.set(scale, scale, scale);
      ring.material.opacity = 1.0 - (scale - 1.0) / 2.0;
    },
    onComplete: () => {
      scene.remove(ring);
    }
  });
}

// Green border (safe mode)
function showSafeBorder() {
  // Add green glow to screen edges
  // Duration: 2 seconds
}
```

---

## 11. UI / UX IMPLEMENTATION

### 11.1 Screen Layout

#### Main Menu
```html
<div id="mainMenu">
  <h1>CHROMASHIFT 3D</h1>
  <button id="playButton">PLAY</button>
  <div id="bestScore">Best: <span id="bestScoreValue">0</span></div>
  <button id="settingsButton">⚙️</button>
</div>
```

#### In-Game HUD
```html
<div id="gameHUD">
  <div id="scoreDisplay">0</div>
  <div id="nextTheme">Next: Cloud 20 ☁️</div>
  <div id="bestScoreHUD">Best: 0 🏆</div>
</div>
```

#### Game Over Screen
```html
<div id="gameOver">
  <h2>GAME OVER</h2>
  <div id="finalScore">Score: <span>0</span></div>
  <div id="bestScoreFinal">Best: <span>0</span></div>
  
  <!-- First death: Show continue -->
  <button id="continueButton" class="rewarded">
    ▶️ CONTINUE (Watch Ad)
  </button>
  
  <button id="restartButton">🔁 RESTART</button>
  <button id="homeButton">🏠 HOME</button>
</div>
```

### 11.2 UI Styling Guidelines
```css
/* Minimal, bold, readable */
#scoreDisplay {
  font-size: 64px;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}

/* Touch-friendly buttons */
button {
  min-height: 60px;
  min-width: 200px;
  font-size: 24px;
  border-radius: 12px;
  /* ... */
}
```

---

## 12. AUDIO SYSTEM

### 12.1 Music Implementation
```javascript
// Single loop music with theme-based filtering
const music = new Audio('assets/audio/main_loop.mp3');
music.loop = true;
music.volume = 0.6;

// Theme-based filter modulation
function applyMusicFilter(theme) {
  // Use Web Audio API for filtering
  const audioContext = new AudioContext();
  const source = audioContext.createMediaElementSource(music);
  const filter = audioContext.createBiquadFilter();
  
  switch (theme) {
    case 'Grass':
      filter.type = 'lowpass';
      filter.frequency.value = 2000;
      filter.Q.value = 1.0;
      break;
    case 'Cloud':
      // Add reverb
      break;
    case 'Space':
      filter.type = 'lowpass';
      filter.frequency.value = 1000;
      break;
    case 'Void':
      filter.type = 'lowpass';
      filter.frequency.value = 500;
      // Heavy reverb
      break;
  }
  
  source.connect(filter);
  filter.connect(audioContext.destination);
}
```

### 12.2 SFX Implementation
```javascript
const sounds = {
  tap: new Audio('assets/audio/tap.mp3'),
  bounce: new Audio('assets/audio/bounce.mp3'),
  success: new Audio('assets/audio/success.mp3'),
  fail: new Audio('assets/audio/fail.mp3'),
  checkpoint: new Audio('assets/audio/checkpoint.mp3'),
  theme_transition: new Audio('assets/audio/theme_change.mp3')
};

function playSound(name) {
  if (sounds[name]) {
    sounds[name].currentTime = 0;
    sounds[name].volume = 0.8;
    sounds[name].play();
  }
}
```

---

## 13. ANALYTICS INTEGRATION (PLACEHOLDER)

### 13.1 Event Tracking
```javascript
// Analytics wrapper (Firebase/Unity Analytics)
const Analytics = {
  logEvent: function(eventName, params) {
    // Placeholder for SDK integration
    console.log('[Analytics]', eventName, params);
    
    // Future: firebase.analytics().logEvent(eventName, params);
  }
};

// Track events
Analytics.logEvent('session_start', {
  device: navigator.userAgent,
  timestamp: Date.now()
});

Analytics.logEvent('player_death', {
  score: score,
  time: gameTime,
  reason: 'wrong_color' // or 'wrong_shape'
});

Analytics.logEvent('theme_reached', {
  theme: 'Space',
  score: 50,
  time: gameTime
});

Analytics.logEvent('rewarded_ad_watched', {
  score: score,
  continue_used: true
});
```

### 13.2 Required Events
1. `session_start` - Game launch
2. `session_end` - Game close (duration, score)
3. `player_death` - Death event (score, time, reason)
4. `theme_reached` - Theme unlock (theme_id, score)
5. `checkpoint_passed` - Every 10th obstacle
6. `rewarded_ad_offered` - Continue button shown
7. `rewarded_ad_watched` - Ad completed
8. `rewarded_ad_skipped` - Restart instead
9. `interstitial_shown` - Interstitial display

---

## 14. PERFORMANCE OPTIMIZATION

### 14.1 Rendering Optimizations
```javascript
// Frustum culling (automatic in Three.js)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Geometry optimization
const geometry = new THREE.SphereGeometry(0.5, 16, 16); // Low poly

// Material optimization
const material = new THREE.MeshLambertMaterial({
  color: 0xFF3B30,
  flatShading: true // Faster rendering
});

// No shadows (performance)
renderer.shadowMap.enabled = false;
```

### 14.2 Object Pooling (Already Covered)
- Pool size: 20 obstacles
- Pre-instantiate at start
- Reuse instead of destroy/create

### 14.3 FPS Monitoring
```javascript
let fps = 60;
let lastFrameTime = Date.now();

function monitorFPS() {
  const now = Date.now();
  fps = 1000 / (now - lastFrameTime);
  lastFrameTime = now;
  
  // Low performance mode
  if (fps < 30) {
    // Reduce quality
    renderer.setPixelRatio(1);
    // Disable particles
    particlesEnabled = false;
  }
}
```

---

## 15. FILE STRUCTURE (Exact)

```
Chromashift3D/
├── index.html
├── main.js
├── src/
│   ├── core/
│   │   ├── Game.js          // Main game class
│   │   ├── SceneManager.js  // Three.js scene setup
│   │   ├── PhysicsEngine.js // Manual physics implementation
│   │   └── GameState.js     // State management
│   ├── player/
│   │   ├── Player.js        // Player object
│   │   ├── PlayerController.js // Input handling
│   │   └── ShapeMorph.js    // Morph animation logic
│   ├── obstacles/
│   │   ├── ObstacleManager.js  // Spawning & despawning
│   │   ├── ObstaclePool.js     // Object pooling
│   │   ├── ObstacleTypes.js    // Ring, Gate, Tunnel classes
│   │   └── CollisionDetector.js // Collision system
│   ├── environment/
│   │   ├── ThemeManager.js     // Theme switching
│   │   ├── CameraController.js // Camera follow & shake
│   │   └── BackgroundEffects.js // Stars, clouds, fog
│   ├── ui/
│   │   ├── UIManager.js        // UI state handling
│   │   ├── HUD.js              // In-game HUD
│   │   ├── MainMenu.js         // Menu screen
│   │   └── GameOverScreen.js   // Game over UI
│   ├── audio/
│   │   ├── AudioManager.js     // Music & SFX control
│   │   └── FilterEffects.js    // Theme-based audio filters
│   ├── analytics/
│   │   └── AnalyticsTracker.js // Event logging
│   └── ads/
│       └── AdManager.js        // Rewarded & interstitial placeholders
├── assets/
│   ├── audio/
│   │   ├── main_loop.mp3
│   │   ├── tap.mp3
│   │   ├── bounce.mp3
│   │   ├── success.mp3
│   │   ├── fail.mp3
│   │   ├── checkpoint.mp3
│   │   └── theme_change.mp3
│   ├── textures/
│   │   └── (minimal, if any)
│   └── fonts/
│       └── (web fonts via Google Fonts)
└── README.md
```

---

## 16. DEVELOPMENT CHECKLIST

### Phase 1: Core Mechanics (Week 1)
- [ ] Scene setup (Three.js + camera)
- [ ] Player object (sphere, color, shape)
- [ ] Manual physics (bounce)
- [ ] Tap input (color + shape cycle)
- [ ] Shape morph animation (0.2s)

### Phase 2: Obstacles (Week 2)
- [ ] Obstacle types (ring, gate, tunnel)
- [ ] Procedural spawning
- [ ] Object pooling
- [ ] Collision detection (bounding sphere)
- [ ] Collision logic (color + shape match)

### Phase 3: Progression (Week 3)
- [ ] Scoring system
- [ ] Speed scaling (every 10s)
- [ ] Rotation scaling (score-based)
- [ ] Theme system (5 themes)
- [ ] Theme transitions (3s smooth)

### Phase 4: Polish (Week 4)
- [ ] UI (menu, HUD, game over)
- [ ] Audio (music + SFX)
- [ ] Music filtering (theme-based)
- [ ] Camera shake (death)
- [ ] Particle effects (morph, respawn)

### Phase 5: Monetization (Week 5)
- [ ] Rewarded ad placeholder
- [ ] Continue mechanism (3-stage)
- [ ] Interstitial placeholder
- [ ] Analytics hooks
- [ ] Testing & QA

### Phase 6: Deployment (Week 6)
- [ ] Cordova/Capacitor wrapper
- [ ] APK build (Android)
- [ ] IPA build (iOS)
- [ ] Performance testing
- [ ] Final polish

---

## 17. SUCCESS CRITERIA

### Gameplay
- [ ] Game is playable within 5 seconds
- [ ] Controls feel responsive (<100ms input lag)
- [ ] Collision accuracy >99%
- [ ] No crashes after 10+ consecutive runs

### Performance
- [ ] 60 FPS on mid-range Android (Galaxy A50)
- [ ] 60 FPS on iPhone 8
- [ ] <50 draw calls per frame
- [ ] <100MB memory usage

### Visual
- [ ] Theme progression is obvious
- [ ] Transitions are smooth (no frame drops)
- [ ] Shape morphing is clear
- [ ] UI is readable at 1.5m distance

### Retention
- [ ] Game is fun within first 30 seconds
- [ ] "One more run" feeling after death
- [ ] Theme unlock motivation is clear

---

## 18. DO NOT DO (Critical Constraints)

### ❌ Prohibited Features
1. **Extra mechanics** (no power-ups, no multi-touch)
2. **Complex shaders** (performance cost)
3. **Heavy libraries** (keep bundle <5MB)
4. **Swipe controls** (tap only)
5. **Dynamic shadows** (too expensive)
6. **Network features** (offline-first)
7. **Complex UI** (minimal only)

### ❌ Prohibited Behaviors
1. **Ads during gameplay** (breaks flow)
2. **Forced tutorials** (learn by playing)
3. **Pay-to-win** (no IAP in MVP)
4. **Over-complexity** (hyper-casual = simple)

---

## 19. TESTING PLAN

### Test Devices (Minimum)
- **Android:** Samsung Galaxy A50 (mid-range)
- **iOS:** iPhone 8 (minimum spec)

### Test Scenarios
1. **Gameplay Loop**
   - [ ] 10 consecutive runs without crash
   - [ ] Collision accuracy test (100 obstacles)
   - [ ] Speed scaling validation (0-100s)

2. **Continue Mechanism**
   - [ ] Rewarded ad → respawn correct state
   - [ ] Second death → no continue button
   - [ ] Freeze/unfreeze obstacles smooth

3. **Theme Transitions**
   - [ ] All 5 themes transition smoothly
   - [ ] No frame drops during transition
   - [ ] Music filter changes correctly

4. **Performance**
   - [ ] 60 FPS on target devices
   - [ ] No memory leaks (10+ runs)
   - [ ] Loading time <3 seconds

---

## 20. FINAL OUTPUT EXPECTATIONS

### What You Must Deliver
1. **Runnable Three.js code** (fully functional game)
2. **Modular architecture** (clean, organized files)
3. **Commented code** (important logic explained)
4. **Performance optimized** (60 FPS target)
5. **Mobile-ready** (touch controls, responsive)

### What You Should NOT Deliver
1. Incomplete features (finish core loop first)
2. Over-engineered code (KISS principle)
3. Unoptimized assets (keep bundle small)
4. Undocumented hacks (explain complex logic)

---

## 21. SUMMARY

### Core Philosophy
> **Simple to learn, hard to master, visually rewarding, monetization-friendly.**

### Key Success Factors
1. **Instant playability** (no tutorial needed)
2. **Smooth 60 FPS** (performance is king)
3. **Rewarding progression** (themes = milestones)
4. **Natural monetization** (ads fit gameplay flow)
5. **"One more run"** (retention loop)

### Technical Pillars
1. Manual physics (control + performance)
2. Object pooling (memory efficiency)
3. Bounding sphere collision (accuracy + speed)
4. Theme-based progression (visual variety)
5. Smart difficulty scaling (keep players engaged)

---

**END OF PRODUCTION PROMPT**

---

**Document Version:** 2.0  
**Technology:** Three.js (r160+)  
**Target Platforms:** Android 8.0+ / iOS 12+  
**Expected Development Time:** 4-6 weeks  
**Status:** Production Ready ✅

---

## QUICK START GUIDE FOR AI

```javascript
// 1. Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// 2. Create player
const player = createPlayer({ color: RED, shape: CIRCLE });

// 3. Create obstacles
const obstaclePool = new ObstaclePool(20);

// 4. Input handling
document.addEventListener('touchstart', onTap);

// 5. Game loop
function animate(deltaTime) {
  updatePlayer(deltaTime);
  updateObstacles(deltaTime);
  checkCollisions();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// 6. Start
animate(0);
```

**Now build the complete game following this specification exactly.**
