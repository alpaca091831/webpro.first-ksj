const canvas = document.querySelector("#game");
const context = canvas.getContext("2d");
const startButton = document.querySelector("#start-button");
const restartButton = document.querySelector("#restart-button");
const scoreText = document.querySelector("#score");
const timeText = document.querySelector("#time");
const targetCountText = document.querySelector("#target-count");
const gameStatus = document.querySelector("#game-status");

const imageSources = ["../images/trust_gym.jpg", "../images/road.jpg", "../images/store.jpg"];
const images = imageSources.map((source) => {
  const image = new Image();
  image.src = source;
  return image;
});

const gameDuration = 60;
let score = 0;
let timeLeft = gameDuration;
let targetLimit = 0;
let targetsShown = 0;
let target = null;
let gameRunning = false;
let timerId;
let targetTimerId;
let hideTargetTimerId;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function chooseTarget() {
  const radius = Math.min(canvas.width, canvas.height) * 0.09;
  target = {
    image: images[Math.floor(Math.random() * images.length)],
    x: randomBetween(radius, canvas.width - radius),
    y: randomBetween(radius, canvas.height - radius),
    radius
  };
  draw();
  clearTimeout(hideTargetTimerId);
  hideTargetTimerId = setTimeout(() => {
    target = null;
    draw();
  }, 720);
}

function drawCampusBackground() {
  context.fillStyle = "#dcebd8";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "#b4cda9";
  context.lineWidth = 54;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(-20, 430);
  context.quadraticCurveTo(220, 250, 440, 350);
  context.quadraticCurveTo(650, 450, 880, 130);
  context.stroke();

  context.strokeStyle = "#f7f0d0";
  context.lineWidth = 36;
  context.beginPath();
  context.moveTo(-20, 430);
  context.quadraticCurveTo(220, 250, 440, 350);
  context.quadraticCurveTo(650, 450, 880, 130);
  context.stroke();

  context.fillStyle = "#c6d8e2";
  context.fillRect(70, 70, 180, 105);
  context.fillRect(610, 310, 170, 105);
  context.fillStyle = "#466477";
  context.font = "bold 18px Malgun Gothic, sans-serif";
  context.textAlign = "left";
  context.fillText("캠퍼스 안내도", 88, 105);
  context.fillText("탐방 구역", 628, 345);

  context.fillStyle = "#6d9b63";
  for (let index = 0; index < 18; index += 1) {
    const x = 25 + ((index * 137) % 810);
    const y = 35 + ((index * 83) % 450);
    context.beginPath();
    context.arc(x, y, 10, 0, Math.PI * 2);
    context.fill();
  }
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawCampusBackground();

  if (!target) {
    context.fillStyle = "#365568";
    context.font = "bold 22px Malgun Gothic, sans-serif";
    context.textAlign = "center";
    context.fillText("사진을 찾아 캠퍼스를 탐방해 보세요", canvas.width / 2, canvas.height / 2);
    return;
  }

  context.save();
  context.beginPath();
  context.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
  context.clip();
  context.drawImage(target.image, target.x - target.radius, target.y - target.radius, target.radius * 2, target.radius * 2);
  context.restore();

  context.beginPath();
  context.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
  context.lineWidth = 4;
  context.strokeStyle = "#ffffff";
  context.stroke();
}

function endGame() {
  gameRunning = false;
  clearInterval(timerId);
  clearTimeout(targetTimerId);
  clearTimeout(hideTargetTimerId);
  target = null;
  draw();
  startButton.hidden = true;
  restartButton.disabled = false;
  gameStatus.textContent = `게임 종료! ${score}점을 얻었습니다. 사진은 ${targetsShown}개 등장했습니다.`;
}

function showNextTarget() {
  if (!gameRunning || targetsShown >= targetLimit) {
    return;
  }

  targetsShown += 1;
  targetCountText.textContent = targetLimit - targetsShown;
  chooseTarget();

  if (targetsShown < targetLimit) {
    targetTimerId = setTimeout(showNextTarget, 60000 / targetLimit);
  }
}

function startGame() {
  clearInterval(timerId);
  clearTimeout(targetTimerId);
  clearTimeout(hideTargetTimerId);
  score = 0;
  timeLeft = gameDuration;
  targetLimit = Math.floor(randomBetween(58, 63));
  targetsShown = 0;
  gameRunning = true;
  startButton.disabled = true;
  startButton.hidden = true;
  restartButton.disabled = false;
  scoreText.textContent = score;
  timeText.textContent = timeLeft;
  targetCountText.textContent = targetLimit;
  gameStatus.textContent = "탐방 중입니다! 나타난 장소 사진을 찾아 클릭하세요.";
  showNextTarget();

  timerId = setInterval(() => {
    timeLeft -= 1;
    timeText.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function resizeCanvas() {
  canvas.style.width = "100%";
  canvas.style.height = "auto";
}

canvas.addEventListener("click", (event) => {
  if (!gameRunning || !target) {
    return;
  }

  const bounds = canvas.getBoundingClientRect();
  const x = (event.clientX - bounds.left) * (canvas.width / bounds.width);
  const y = (event.clientY - bounds.top) * (canvas.height / bounds.height);

  if (Math.hypot(x - target.x, y - target.y) <= target.radius) {
    score += 1;
    scoreText.textContent = score;
    target = null;
    draw();
  }
});

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
draw();
