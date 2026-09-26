const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fruit = {
  x: canvas.width / 2,
  y: canvas.height - 100,

  vx: 2,
  vy: -12,

  gravity: 0.4,

  emoji: "🍉"
};

function update() {
  fruit.x += fruit.vx;
  fruit.y += fruit.vy;

  fruit.vy += fruit.gravity;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "80px sans-serif";
  ctx.fillText(fruit.emoji, fruit.x, fruit.y);
}

function gameLoop() {
  update();
  draw();

  requestAnimationFrame(gameLoop);
}

gameLoop();