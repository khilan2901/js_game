let a,b;
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
