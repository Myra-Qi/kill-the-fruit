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
let lastMouse = null;
let score = 0;

canvas.addEventListener("mousemove", (event) => {
  const point = {
    x: event.clientX,
    y: event.clientY,
    time: performance.now()
  };

  trail.push(point);

  if (lastMouse) {
    cutFruits(lastMouse, point);
  }

  lastMouse = point;
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
  const now = performance.now();

  while (trail.length && now - trail[0].time > 150) {
    trail.shift();
  }
}

ctx.fillStyle = "white";
ctx.font = "28px sans-serif";
ctx.fillText(`Score: ${score}`, 24, 40);

ctx.font = "80px sans-serif";

for (const fruit of fruits) {
  ctx.fillText(fruit.emoji, fruit.x, fruit.y);
}

  for (const fruit of fruits) {
    ctx.fillText(fruit.emoji, fruit.x, fruit.y);
  }

  ctx.beginPath();

  for (let i = 0; i < trail.length; i++) {
    const point = trail[i];

    if (i === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  }

  ctx.strokeStyle = "white";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.stroke();


function gameLoop() {
  update();
  draw();

  requestAnimationFrame(gameLoop);
}
setInterval(spawnFruit, 800);

function lineHitsFruit(start, end, fruit) {
  const radius = 40;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const fx = start.x - fruit.x;
  const fy = start.y - fruit.y;
  const lengthSquared = dx * dx + dy * dy;
  let t=0;
  if (lengthSquared > 0) {
    t = -(fx * dx + fy * dy) / lengthSquared;
    t = Math.max(0, Math.min(1, t));
  }
  const closestX = start.x + t * dx;
  const closestY = start.y + t * dy;

  const distanceX = closestX - fruit.x;
  const distanceY = closestY - fruit.y;
  return distanceX * distanceX + distanceY * distanceY
    <= radius * radius;

}
function cutFruits(start, end) {
  for (let i = fruits.length - 1; i >= 0; i--) {
    const fruit = fruits[i];

    if (lineHitsFruit(start, end, fruit)) {
      fruits.splice(i, 1);
      score += 1;
    }
  }
}
gameLoop();