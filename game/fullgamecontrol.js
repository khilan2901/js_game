// 🌟 Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = (canvas.width = 800);
const CANVAS_HEIGHT = (canvas.height = 700);

// 🐶 Sprite setup
const spriteWidth = 575;
const spriteHeight = 523;
const playerScale = 0.5;

let playerX = 100;
let playerY = CANVAS_HEIGHT - spriteHeight * playerScale - 50;
let velocityY = 0;
let gravity = 0.5;
let isJumping = false;
let jumpStrength = -15;
let groundLevel = CANVAS_HEIGHT - spriteHeight * playerScale - 50;

let x = 1;
let frameRow = 3;
let maxFrame = 8;
let frameCount = 0;
let keys = {};
let isRunning = false;
let isSitting = false;

// 🌄 Background layers
const speedInput = document.getElementById('speed');
let gamespeed = 10;

const img1 = new Image();
img1.src = 'layer-1.png';
const img2 = new Image();
img2.src = 'layer-2.png';
const img3 = new Image();
img3.src = 'layer-3.png';
const img4 = new Image();
img4.src = 'layer-4.png';
const img5 = new Image();
img5.src = 'layer-5.png';
const player = new Image();
player.src = 'shadow_dog.png';

class Layer {
  constructor(image, speedModifier) {
    this.x = 0;
    this.image = image;
    this.speedModifier = speedModifier;
    this.speed = gamespeed * speedModifier;
    this.width = image.width;
    this.height = image.height;
    this.y = CANVAS_HEIGHT - image.height;
  }

  update() {
    this.x -= this.speed;
    if (this.x < -this.width) this.x = 0;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y);
    ctx.drawImage(this.image, this.x + this.width, this.y);
  }
}

let layer1 = new Layer(img1, 1);
let layer2 = new Layer(img2, 0.4);
let layer3 = new Layer(img3, 0.6);
let layer4 = new Layer(img4, 0.8);
let layer5 = new Layer(img5, 1.0);

speedInput.addEventListener('input', (e) => {
  gamespeed = e.target.value;
  [layer1, layer2, layer3, layer4, layer5].forEach((layer) => {
    layer.speed = gamespeed * layer.speedModifier;
  });
});

// 🔁 Animation setup
function setAnimation(row, frameCount) {
  frameRow = row;
  maxFrame = frameCount;
  x = 1; // Reset animation frame when changing animation
}

function updateFrame() {
  x++;
  if (x > maxFrame) x = 1;
}

// 🎮 Draw player sprite
function drawPlayer() {
  ctx.drawImage(
    player,
    x * spriteWidth,
    frameRow * spriteHeight,
    spriteWidth,
    spriteHeight,
    playerX,
    playerY,
    spriteWidth * playerScale,
    spriteHeight * playerScale
  );
}

// 🧠 Key tracking
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;

  if (e.key === 'w' && !isJumping && !isSitting) {
    velocityY = jumpStrength;
    isJumping = true;
    setAnimation(3, 8); // Jump animation
  }

  if (e.key === 's' && !isJumping) {
    isSitting = true;
    setAnimation(6, 6); // Sit animation
  }

  if (keys['x']) {
    setAnimation(4, 10); // Jump animation
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;

  if (e.key === 's') {
    isSitting = false;
    setAnimation(3, 8); // Return to idle when releasing 's'
  }
});

// 🕹️ Game loop
function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  [layer1, layer2, layer3, layer4, layer5].forEach((layer) => {
    layer.update();
    layer.draw();
  });

  // 🎞️ Update sprite animation frame
  if (frameCount % 10 === 0) updateFrame();
  frameCount++;

  // ➡️ Left/right movement
  let moving = false;
  if (keys['d'] && !isSitting) {
    playerX += 5;
    moving = true;
  }
  if (keys['a'] && !isSitting) {
    playerX -= 5;
    moving = true;
  }

  // 🌀 Apply gravity and jumping
  if (isJumping) {
    playerY += velocityY;
    velocityY += gravity;

    // 🧱 Ground collision
    if (playerY >= groundLevel) {
      playerY = groundLevel;
      velocityY = 0;
      isJumping = false;
      setAnimation(3, 8); // back to run or idle
    }
  }

  // 🎭 Switch animations based on movement
  if (!isSitting && !isJumping) {
    if (moving) {
      if (!isRunning) {
        isRunning = true;
        setAnimation(3, 8); // Run animation
      }
    } else if (isRunning) {
      isRunning = false;
      setAnimation(3, 8); // Idle animation
    }
  }

  // Keep player within canvas bounds
  playerX = Math.max(
    0,
    Math.min(playerX, CANVAS_WIDTH - spriteWidth * playerScale)
  );

  drawPlayer();
  requestAnimationFrame(animate);
}

// 🚀 Start game
setAnimation(3, 8); // Start with idle animation
animate();

/*

const enemyImage = new Image();
enemyImage.onload = () => {
  requestAnimationFrame(animate);
};
enemyImage.src = "enemy1.png"; // Ensure this image path is correct

const SPRITE_WIDTH = 293;   // width of one frame
const SPRITE_HEIGHT = 155;  // height of one frame
const SPRITE_COUNT = 6;     // total frames

const enemy1 = {
  width: SPRITE_WIDTH,
  height: SPRITE_HEIGHT,
  z: 0, // initial horizontal position
  dx: 2 // horizontal speed
};

let angle = 0; // persistent angle for sine wave
let frame = 0; // current frame index
let lastFrameTime = 0;
const frameInterval = 80; // ms between frames (lower = faster animation)

function animate(timestamp) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Center of canvas
  const centerX = canvasWidth / 2 - enemy1.width / 2;

  // Larger amplitude and faster period
  const amplitude = 100; // Increase this for higher wave
  const periodSpeed = 0.07; // Increase for faster cycles (smaller period)

  // Sinusoidal path: x moves horizontally, y oscillates in sine wave
  let y = (canvasHeight / 2 - enemy1.height / 2) - (Math.sin(angle) * amplitude);

  // Animate sprite frames at a fixed interval using timestamp
  if (!lastFrameTime) lastFrameTime = timestamp;
  if (timestamp - lastFrameTime > frameInterval) {
    frame = (frame + 1) % SPRITE_COUNT;
    lastFrameTime = timestamp;
  }

  ctx.drawImage(
    enemyImage,
    frame * SPRITE_WIDTH, 0,         // sx, sy: top-left of current frame
    SPRITE_WIDTH, SPRITE_HEIGHT,     // sWidth, sHeight: size of one frame
    enemy1.z, y,                     // dx, dy: where to draw on canvas
    enemy1.width, enemy1.height      // dWidth, dHeight: size on canvas
  );

  // Move horizontally and update angle for sine wave
  enemy1.z += enemy1.dx;
  angle += periodSpeed;

  requestAnimationFrame(animate);
}

*/