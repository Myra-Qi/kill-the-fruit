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
    emoji: ["🍉", "🍎", "🍊", "🍌"][Math.floor(Math.random() * 4)]
  };

  fruits.push(fruit);
}

const trail = [];

canvas.addEventListener("mousemove", (event) => {
  trail.push({
    x: event.clientX,
    y: event.clientY,
    time: performance.now()
  });
});

function update() {
  for (let i = fruits.length - 1; i >= 0; i--) {
    const fruit = fruits[i];

    fruit.x += fruit.vx;
    fruit.y += fruit.vy;
    fruit.vy += fruit.gravity;

    if (fruit.y > canvas.height + 100) {
      fruits.splice(i, 1);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "80px sans-serif";

  for (const fruit of fruits) {
    ctx.fillText(fruit.emoji, fruit.x, fruit.y);
  }
}

function gameLoop() {
  update();
  draw();

  requestAnimationFrame(gameLoop);
}
setInterval(spawnFruit, 800);

gameLoop();