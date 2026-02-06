export const GAME_CONFIG = {
    gravity: -20, // Increased from -9.8 for snappier feel
    bounceHeight: 2.2, // Reduced from 3.5 per user request
    jumpForce: 10,   // Velocity impulse
    baseSpeed: 2.0,
    maxSpeed: 4.5,
    laneWidth: 5,
};

export const COLORS = {
    RED: 0xFF3B30,
    BLUE: 0x007AFF,
    YELLOW: 0xFFCC00,
    GREEN: 0x34C759
};

export const SHAPES = {
    CIRCLE: 'circle',
    SQUARE: 'square',
    TRIANGLE: 'triangle'
};

export const PERFORMANCE = {
    MAX_DRAW_CALLS: 50,
    MAX_TRIANGLES: 10000,
    MAX_PARTICLES: 100,
    TARGET_FPS: 60,
    MIN_FPS: 30, // Trigger low performance mode
    MAX_POOL_SIZE: 20
};

export const UI_LAYERS = {
    HUD: 'hud',
    POPUP: 'popup',
    OVERLAY: 'overlay'
};
