/** @type {HTMLCanvasElement} */
const mycanvas = document.getElementById("mycanvas");
const ctx = mycanvas.getContext("2d");
const canvasWidth = mycanvas.width = 2001;
const canvasHeight = mycanvas.height = 1000;

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
