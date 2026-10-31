
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
const particles = [];
const scorePopups = [];
let misses = 0;

let lastMouse = null;
let score = 0;
let bestScore = Number(localStorage.getItem("bestScore")) || 0;

const FRUITS = ["🍉", "🍎", "🍊", "🍌"];
const FRUIT_RADIUS = 38;
const FRUIT_FONT_SIZE = 80;
const SLICE_DELAY = 100;
const TRAIL_DURATION = 150;

// 生成水果
function spawnFruit() {
  const margin = FRUIT_RADIUS + 10;

  const fruit = {
    // x 现在表示水果的水平中心
    x: margin + Math.random() *
      Math.max(1, canvas.width - margin * 2),

    // y 仍然是文字基线
    y: canvas.height + 50,

    vx: (Math.random() - 0.5) * 6,
    vy: -15 - Math.random() * 5,
    gravity: 0.35,

    emoji: FRUITS[
      Math.floor(Math.random() * FRUITS.length)
    ],

    radius: FRUIT_RADIUS,

    sliced: false,
    sliceTime: 0,
  };

  fruits.push(fruit);
}

// 将鼠标坐标转换为 Canvas 内部坐标
function getCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();

  return {
    x: (event.clientX - rect.left) *
      (canvas.width / rect.width),

    y: (event.clientY - rect.top) *
      (canvas.height / rect.height),

    time: performance.now(),
  };
}

// 鼠标移动：记录轨迹并检测切割
canvas.addEventListener("mousemove", (event) => {
  const point = getCanvasPoint(event);

  trail.push(point);

  if (lastMouse) {
    cutFruits(lastMouse, point);
  }

  lastMouse = point;
});

// 鼠标离开画布后，重置上一点
canvas.addEventListener("mouseleave", () => {
  lastMouse = null;
});

// 判断线段是否碰到水果的圆形碰撞范围
function lineHitsFruit(start, end, fruit) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  // 水果水平居中绘制，y 为文字基线
  const centerX = fruit.x;
  const centerY = fruit.y - FRUIT_FONT_SIZE * 0.5;

  // 起点相对于圆心的位置
  const fx = start.x - centerX;
  const fy = start.y - centerY;

  const lengthSquared = dx * dx + dy * dy;

  let t = 0;

  // 求线段上距离圆心最近的位置
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

function createParticles(x, y) {
  for (let i = 0; i < 12; i++) {
    const particle = {
      x: x,
      y: y,

      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,

      life: 30,
      maxLife: 30,

      size: 3 + Math.random() * 4,
      color: ["orange", "yellow", "red"][
        Math.floor(Math.random() * 3)
      ],
    };

    particles.push(particle);
  }
}

// 切水果
function cutFruits(start, end) {
  for (let i = fruits.length - 1; i >= 0; i--) {
    const fruit = fruits[i];

    // 已切中的水果不能重复计分
    if (fruit.sliced) {
      continue;
    }

    if (lineHitsFruit(start, end, fruit)) {
      fruit.sliced = true;
      createParticles(fruit.x, fruit.y);
      fruit.sliceTime = performance.now();

      score += 1;
      if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
      }
      createScorePopup(fruit.x, fruit.y);
    }
  }
}

function createScorePopup(x, y) {
  const popup = {
    x: x,
    y: y,
    life: 30,
    maxLife: 30,
  };

  scorePopups.push(popup);
}



function update() {
  const now = performance.now();

  // 1. 更新水果位置
  for (let i = fruits.length - 1; i >= 0; i--) {
    const fruit = fruits[i];

    // 已切中的水果：等待一小段时间后删除
    if (fruit.sliced) {
      if (now - fruit.sliceTime > 65) {
        fruits.splice(i, 1);
      }
      continue;
    }

    fruit.x += fruit.vx;
    fruit.y += fruit.vy;
    fruit.vy += fruit.gravity;

    // 水果落出屏幕后删除
    if (fruit.y > canvas.height + 100) {
      fruits.splice(i, 1);
      misses += 1;
    }
  }

  // 2. 更新粒子
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];

    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.15;

    particle.life -= 1;

    if (particle.life <= 0) {
      particles.splice(i, 1);
    }
  }


  // 更新加分飘字
  for (let i = scorePopups.length - 1; i >= 0; i--) {
    const popup = scorePopups[i];

    popup.y -= 1;
    popup.life -= 1;

    if (popup.life <= 0) {
      scorePopups.splice(i, 1);
    }
  }


  // 3. 删除过期的鼠标轨迹
  while (
    trail.length > 0 &&
    now - trail[0].time > TRAIL_DURATION
  ) {
    trail.shift();
  }
}



// 绘制游戏画面
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制分数
  ctx.fillStyle = "black";
  ctx.font = "28px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(`Score: ${score}`, 24, 40);
  // 绘制漏切次数
  ctx.fillText(`Misses: ${misses}`, 24, 80);
  ctx.fillText(`Best: ${bestScore}`, 24, 120);

  // 绘制水果
  ctx.font = `${FRUIT_FONT_SIZE}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  for (const fruit of fruits) {
    ctx.fillText(fruit.emoji, fruit.x, fruit.y);
  }

  // 绘制粒子
  for (const particle of particles) {
    ctx.globalAlpha = particle.life / particle.maxLife;

    ctx.fillStyle = particle.color;

    ctx.beginPath();
    ctx.arc(
      particle.x,
      particle.y,
      particle.size,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }


  // 绘制加分飘字
  for (const popup of scorePopups) {
    ctx.globalAlpha = popup.life / popup.maxLife;

    ctx.fillStyle = "#ffa200";
    ctx.font = "bold 30px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("+1", popup.x, popup.y - 20);
  }

  // 恢复透明度，避免影响后续绘制
  ctx.globalAlpha = 1;

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
