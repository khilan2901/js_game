const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = (canvas.width = 800);
const CANVAS_HEIGHT = (canvas.height = 700);
const speedInput = document.getElementById('speed');
speedInput.addEventListener('input', function (e) {
  gamespeed = e.target.value;
  layer1.speed = gamespeed;
  layer2.speed = gamespeed;
  layer3.speed = gamespeed;
  layer4.speed = gamespeed;
  layer5.speed = gamespeed;
});
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

let gamespeed = 10;

class layer {
  constructor(image, speedModifier) {
    this.x = 0;
    this.y = 0;
    this.width = image.width;
    this.height = image.height;
    this.image = image;
    this.speedModifier = speedModifier;
    this.speed = gamespeed * this.speedModifier;
  }
  update() {
    this.x -= this.speed;
    if (this.x < -this.width) {
      this.x = 0;
    }
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y);
    ctx.drawImage(this.image, this.x + this.width, this.y);
  }
}
layer1 = new layer(img1, 1);
layer2 = new layer(img2, 0.4);
layer3 = new layer(img3, 0.6);
layer4 = new layer(img4, 0.8);
layer5 = new layer(img5, 1.0);

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  layer1.update();
  layer1.draw();
  layer2.update();
  layer2.draw();
  layer3.update();
  layer3.draw();
  layer4.update();
  layer4.draw();
  layer5.update();
  layer5.draw();

  requestAnimationFrame(animate);
}
animate();
