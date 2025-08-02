// 🌟 Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 2400;
const CANVAS_HEIGHT = canvas.height = 720;

// 🐶 Player Sprite setup (unchanged)
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

// 🌄 Background layers (unchanged)
const speedInput = document.getElementById('speed');
let gamespeed = 10;

const img1 = new Image(); img1.src = 'layer-1.png';
const img2 = new Image(); img2.src = 'layer-2.png';
const img3 = new Image(); img3.src = 'layer-3.png';
const img4 = new Image(); img4.src = 'layer-4.png';
const img5 = new Image(); img5.src = 'layer-5.png';
const player = new Image(); player.src = 'shadow_dog.png';

// 🦴 Enemy Sprite setup
const enemyImage = new Image();
enemyImage.src = "enemy1.png"; // Ensure this image path is correct

const ENEMY_SPRITE_WIDTH = 293;
const ENEMY_SPRITE_HEIGHT = 155;
const ENEMY_SPRITE_COUNT = 6;

// Three enemy objects with different properties
const enemies = [
  {
    width: ENEMY_SPRITE_WIDTH,
    height: ENEMY_SPRITE_HEIGHT,
    x: 400,
    y: 100,
    dx: 2,
    amplitude: 100,
    periodSpeed: 0.07,
    angle: 0,
    frame: 0,
    lastFrameTime: 0,
    frameInterval: 80
  },
  {
    width: ENEMY_SPRITE_WIDTH,
    height: ENEMY_SPRITE_HEIGHT,
    x: 1200,
    y: 200,
    dx: 3,
    amplitude: 200,
    periodSpeed: 0.04,
    angle: 1,
    frame: 0,
    lastFrameTime: 0,
    frameInterval: 60
  },
  {
    width: ENEMY_SPRITE_WIDTH,
    height: ENEMY_SPRITE_HEIGHT,
    x: 1800,
    y: 300,
    dx: 1.5,
    amplitude: 150,
    periodSpeed: 0.09,
    angle: 2,
    frame: 0,
    lastFrameTime: 0,
    frameInterval: 100
  }
];

class Layer {
  constructor(image, speedModifier) {
    this.x = 0;
    this.image = image;
    this.speedModifier = speedModifier;
    this.speed = gamespeed * speedModifier;
    this.width = 2400;
    this.height = 720;
    this.y = CANVAS_HEIGHT - this.height;
  }
  update() {
    this.x -= this.speed;
    if (this.x < -this.width) this.x = 0;
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
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

function setAnimation(row, frameCount) {
  frameRow = row;
  maxFrame = frameCount;
  x = 1;
}
function updateFrame() {
  x++;
  if (x > maxFrame) x = 1;
}
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
function drawEnemies(timestamp) {
  enemies.forEach(enemy => {
    // Animate enemy frames based on time
    if (!enemy.lastFrameTime) enemy.lastFrameTime = timestamp;
    if (timestamp - enemy.lastFrameTime > enemy.frameInterval) {
      enemy.frame = (enemy.frame + 1) % ENEMY_SPRITE_COUNT;
      enemy.lastFrameTime = timestamp;
    }

    // Sinusoidal movement
    enemy.y = 200 + Math.sin(enemy.angle) * enemy.amplitude;
    enemy.x += enemy.dx;
    if (enemy.x > CANVAS_WIDTH - enemy.width || enemy.x < 0) {
      enemy.dx *= -1;
    }
    enemy.angle += enemy.periodSpeed;

    ctx.drawImage(
      enemyImage,
      enemy.frame * ENEMY_SPRITE_WIDTH, 0,
      ENEMY_SPRITE_WIDTH, ENEMY_SPRITE_HEIGHT,
      enemy.x, enemy.y,
      enemy.width, enemy.height
    );
  });
}

// --- Collision Detection (AABB) ---
function isColliding(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

// 🧠 Key tracking (unchanged)
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  if (e.key === 'w' && !isJumping && !isSitting) {
    velocityY = jumpStrength;
    isJumping = true;
    setAnimation(3, 8);
  }
  if (e.key === 's' && !isJumping) {
    isSitting = true;
    setAnimation(6, 6);
  }
  if (keys['x']) {
    setAnimation(4, 10);
  }
});
window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
  if (e.key === 's') {
    isSitting = false;
    setAnimation(3, 8);
  }
});

let gameOver = false;

// 🕹️ Game loop
function animate(timestamp = 0) {
  if (gameOver) {
    ctx.font = "110px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    return; // Stop the game loop
  }

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  [layer1, layer2, layer3, layer4, layer5].forEach((layer) => {
    layer.update();
    layer.draw();
  });

  if (frameCount % 10 === 0) updateFrame();
  frameCount++;

  let moving = false;
  if (keys['d'] && !isSitting) {
    playerX += 5;
    moving = true;
  }
  if (keys['a'] && !isSitting) {
    playerX -= 5;
    moving = true;
  }
  if (isJumping) {
    playerY += velocityY;
    velocityY += gravity;
    if (playerY >= groundLevel) {
      playerY = groundLevel;
      velocityY = 0;
      isJumping = false;
      setAnimation(3, 8);
    }
  }
  if (!isSitting && !isJumping) {
    if (moving) {
      if (!isRunning) {
        isRunning = true;
        setAnimation(3, 8);
      }
    } else if (isRunning) {
      isRunning = false;
      setAnimation(3, 8);
    }
  }
  playerX = Math.max(0, Math.min(playerX, CANVAS_WIDTH - spriteWidth * playerScale));

  drawPlayer();
  drawEnemies(timestamp);

  // --- Collision check ---
  const playerRect = {
    x: playerX,
    y: playerY,
    width: spriteWidth * playerScale,
    height: spriteHeight * playerScale
  };
  for (const enemy of enemies) {
    const enemyRect = {
      x: enemy.x,
      y: enemy.y,
      width: enemy.width,
      height: enemy.height
    };
    if (isColliding(playerRect, enemyRect)) {
      gameOver = true;
      break;
    }
  }

  requestAnimationFrame(animate);
}

// 🚀 Start game when all images are loaded
let imagesLoaded = 0;
[player, enemyImage, img1, img2, img3, img4, img5].forEach(img => {
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 7) {
      setAnimation(3, 8);
      animate();
    }
  };
});
