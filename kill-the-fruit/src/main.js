const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fruits = [];
function spawnFruit() {
  const fruit = {
    x: Math.random() * canvas.width,
    y: canvas.height + 50,
    vx: (Math.random() - 0.5) * 6,
    vy: -10 - Math.random() * 5,
    gravity: 0.4,
    emoji: "🍉"
  };

  fruits.push(fruit);
}

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