const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.font = "80px sans-serif";
ctx.fillText("🍉", 300, 300);