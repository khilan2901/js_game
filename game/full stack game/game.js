const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;

const speedInput = document.getElementById('speed');
let gamespeed = 10;

const img1 = new Image(); img1.src = 'layer-1.png';
const img2 = new Image(); img2.src = 'layer-2.png';
const img3 = new Image(); img3.src = 'layer-3.png';
const img4 = new Image(); img4.src = 'layer-4.png';
const img5 = new Image(); img5.src = 'layer-5.png';
const player = new Image(); player.src = 'shadow_dog.png';

const spriteWidth = 575;
const spriteHeight = 523;
let x = 1;
let frameRow = 3;
let maxFrame = 8;
let frameCount = 0;
let playerx = 0;
let keys = {};
let wtask = false;

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

speedInput.addEventListener('input', function (e) {
  gamespeed = e.target.value;
  [layer1, layer2, layer3, layer4, layer5].forEach(layer => {
    layer.speed = gamespeed * layer.speedModifier;
  });
});

function tosetanimation(row, frameCount) {
  frameRow = row;
  maxFrame = frameCount;
}

function updateFrame() {
  x++;
  if (x > maxFrame) x = 1;
}
let playerY = layer5.y + layer5.height / 2;
function todrawplayer() {
  ctx.drawImage(
    player,
    x * spriteWidth,
    frameRow * spriteHeight,
    spriteWidth,
    spriteHeight,
    playerx,
    layer5.y + layer5.height / 2,
    spriteWidth / 2,
    spriteHeight / 2
  );
}
//to animate player jumping

function playerjump(){
  setTimeout(() => {
  tosetanimation(1,6);
  playerY -= 100; // Adjust the jump height as needed
}, 5000);

  setTimeout(() => {
  tosetanimation(2,6);
}, 1000);
}

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  [layer1, layer2, layer3, layer4, layer5].forEach(layer => {
    layer.update();
    layer.draw();
  });

  if (frameCount % 10 === 0) updateFrame();
  frameCount++;

  let moving = false;

  if (keys['d']) {
    playerx += 5;
    moving = true;
  }
  if (keys['a']) {
    playerx -= 5;
    moving = true;
  }

  if (keys['w']) {
   
      playerjump();
      playerx += 5;
      playerY += 5;
      
  }

  if (moving) {
    if (!wtask) {
      wtask = true;
      tosetanimation(6, 6);
    }
  } else {
    if (wtask) {
      wtask = false;
      tosetanimation(3, 8);
    }
  }

  todrawplayer();
  requestAnimationFrame(animate);
}

tosetanimation(3, 8);
animate();
/*
function op(a,b) {
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.width = 600;
  canvas.height = canvas.height = 600;

  const player = new Image();
  player.src = 'shadow_dog.png';
  let x = 1;
  const spriteWidth = 575;
  const spriteHeight = 523;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      player,
      x * spriteWidth,
      a * spriteHeight,
      spriteWidth,
      spriteHeight,
      0,
      0,
      spriteWidth,
      spriteHeight
    );
    requestAnimationFrame(animate);
  }
  //setinterval makes animation every 90ms it means it operates every 90ms only after 90ms anther excution of it is done 

  setInterval(() => {
    x++;
    if (x > b) {
      x = 1;
    }
  }, 90);

  animate();
}

document.addEventListener('DOMContentLoaded', () => {
    const btn1 = document.getElementById('ani1');
    const btn2 = document.getElementById('ani2');
    const btn3 = document.getElementById('ani3');
    const btn4 = document.getElementById('ani4');
    const btn5 = document.getElementById('ani5');
    const btn6 = document.getElementById('ani6');
    const btn7 = document.getElementById('ani7');
    const btn8 = document.getElementById('ani8');
    const btn9 = document.getElementById('ani9');
    const btn10 = document.getElementById('ani10');

    btn1.addEventListener('click', () => op(0, 6));
    btn2.addEventListener('click', () => op(1, 6));
    btn3.addEventListener('click', () => op(2, 6));
    btn4.addEventListener('click', () => op(3, 8));
    btn5.addEventListener('click', () => op(4, 9));
    btn6.addEventListener('click', () => op(5, 4));
    btn7.addEventListener('click', () => op(6, 6));
    btn8.addEventListener('click', () => op(7, 6));
    btn9.addEventListener('click', () => op(8, 10));
    btn10.addEventListener('click', () => op(9, 3));
});
//1-6
//2-6
//3-6
//4-8
//5-10
//6-4
//7-6
//8-6
//9-11
//10-3
//5,9,10


*/
