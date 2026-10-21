const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

// 画布尺寸
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// 游戏状态
const fruits = [];
const trail = [];

let lastMouse = null;
let score = 0;

// 水果配置
const FRUITS = ["🍉", "🍎", "🍊", "🍌"];
const FRUIT_RADIUS = 28;
const FRUIT_FONT_SIZE = 80;

// 生成水果
function spawnFruit() {
  const fruit = {
    x: 50 + Math.random() * Math.max(1, canvas.width - 100),
    y: canvas.height + 50,
    vx: (Math.random() - 0.5) * 6,
    vy: -10 - Math.random() * 5,
    gravity: 0.4,
    emoji: FRUITS[Math.floor(Math.random() * FRUITS.length)],
    radius: FRUIT_RADIUS,
  };

  fruits.push(fruit);
}

// 鼠标移动：记录轨迹并检测切割
canvas.addEventListener("mousemove", (event) => {
  const point = {
    x: event.clientX,
    y: event.clientY,
    time: performance.now(),
  };

  trail.push(point);

  if (lastMouse) {
    cutFruits(lastMouse, point);
  }

  lastMouse = point;
});

// 鼠标离开画布后，避免下一次移动时连接一条很长的切割线
canvas.addEventListener("mouseleave", () => {
  lastMouse = null;
});

// 判断线段是否碰到水果的圆形碰撞范围
function lineHitsFruit(start, end, fruit) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  // 水果中心的近似位置
  const centerX = fruit.x;
  const centerY = fruit.y - FRUIT_FONT_SIZE * 0.35;

  const fx = start.x - centerX;
  const fy = start.y - centerY;

  const lengthSquared = dx * dx + dy * dy;

  let t = 0;

  if (lengthSquared > 0) {
    t = -(fx * dx + fy * dy) / lengthSquared;
    t = Math.max(0, Math.min(1, t));
  }

  const closestX = start.x + t * dx;
  const closestY = start.y + t * dy;

  const distanceX = closestX - centerX;
  const distanceY = closestY - centerY;

  return (
    distanceX * distanceX + distanceY * distanceY
    <= fruit.radius * fruit.radius
  );
}

// 切水果
function cutFruits(start, end) {
  for (let i = fruits.length - 1; i >= 0; i--) {
    const fruit = fruits[i];

    if (lineHitsFruit(start, end, fruit)) {
      fruits.splice(i, 1);
      score += 1;
    }
  }
}

// 更新游戏状态
function update() {
  // 更新水果位置
  for (let i = fruits.length - 1; i >= 0; i--) {
    const fruit = fruits[i];

    fruit.x += fruit.vx;
    fruit.y += fruit.vy;
    fruit.vy += fruit.gravity;

    // 水果落出屏幕后删除
    if (fruit.y > canvas.height + 100) {
      fruits.splice(i, 1);
    }
  }

  // 删除过期的鼠标轨迹
  const now = performance.now();

  while (trail.length > 0 && now - trail[0].time > 150) {
    trail.shift();
  }
}

// 绘制游戏画面
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制分数
  ctx.fillStyle = "white";
  ctx.font = "28px sans-serif";
  ctx.fillText(`Score: ${score}`, 24, 40);

  // 绘制水果
  ctx.font = `${FRUIT_FONT_SIZE}px sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  for (const fruit of fruits) {
    ctx.fillText(fruit.emoji, fruit.x, fruit.y);
  }

  // 绘制鼠标切割轨迹
  if (trail.length > 1) {
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
    ctx.lineJoin = "round";
    ctx.stroke();
  }
}

// 游戏主循环
function gameLoop() {
  update();
  draw();

  requestAnimationFrame(gameLoop);
}

// 定时生成水果
setInterval(spawnFruit, 800);

// 启动游戏
gameLoop();