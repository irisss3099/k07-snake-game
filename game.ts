#!/usr/bin/env node

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
const scoreBoard = document.getElementById("scoreBoard") as HTMLDivElement;

const gridSize = 20;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const snake: { x: number; y: number }[] = [];
let direction = "LEFT";
let food = { x: 0, y: 0 };
let score = 0;
let gameLoop: number |  NodeJS.Timeout;;

function init() {
  for (let i = 0; i < 6; i++) {
    snake.push({ x: canvasWidth / 2 + i * gridSize, y: canvasHeight / 2 });
  }
  generateFood();
  score = 0;
  scoreBoard.innerText = `Score: ${score}`;
  direction = "LEFT";
  if (gameLoop) clearInterval(gameLoop);
  gameLoop = setInterval(update, 200);
}

function update() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  // Move snake
  const head = { ...snake[0] };
  switch (direction) {
    case "RIGHT":
      head.x += gridSize;
      break;
    case "LEFT":
      head.x -= gridSize;
      break;
    case "UP":
      head.y -= gridSize;
      break;
    case "DOWN":
      head.y += gridSize;
      break;
  }

  // Check for collision with food
  if (head.x === food.x && head.y === food.y) {
    snake.unshift(head);
    score += 100;
    scoreBoard.innerText = `Score: ${score}`;
    generateFood();
  } else {
    snake.pop();
    snake.unshift(head);
  }

  // Check for collision with walls or itself
  if (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight || snakeCollision(head)) {
    clearInterval(gameLoop);
    scoreBoard.innerText = `Game Over! Score: ${score}`;
    return;
  }

  // Draw food
  context.fillStyle = "lightgreen";
  context.fillRect(food.x, food.y, gridSize, gridSize);

  // Draw snake
  context.fillStyle = "white";
  snake.forEach(segment => {
    context.fillRect(segment.x, segment.y, gridSize, gridSize);
  });
}

function snakeCollision(head: { x: number; y: number }) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }
  return false;
}

function generateFood() {
  food.x = Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize;
  food.y = Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize;

  // Ensure food does not spawn on the snake
  while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    food.x = Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize;
  }
}

window.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp":
      if (direction !== "DOWN") direction = "UP";
      break;
    case "ArrowDown":
      if (direction !== "UP") direction = "DOWN";
      break;
    case "ArrowLeft":
      if (direction !== "RIGHT") direction = "LEFT";
      break;
    case "ArrowRight":
      if (direction !== "LEFT") direction = "RIGHT";
      break;
    case "p":
      clearInterval(gameLoop);
      break;
    case " ":
      gameLoop = setInterval(update, 200);
      break;
  }
});

init();