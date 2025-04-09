const canvas = document.getElementById("pongCanvas");
const scoreText = document.getElementById("score");
const startButton = document.getElementById("startButton");
const hitSound = new Audio("assets/sonarping-38269.mp3");

const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Paddle
const paddleWidth = 10, paddleHeight = 80;
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let paddleSpeed = 5;

// Ball
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 8;
let ballSpeedX = 5, ballSpeedY = 5;
let speedIncrement = 0.05;

// Players Score
let playerScore = 0;
let aiScore = 0;

// Input
document.addEventListener("mousemove", (e) => {
    let rect = canvas.getBoundingClientRect();
    playerY = e.clientY - rect.top - paddleHeight / 2;
});

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawBall(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
}

function updateScore() {
    scoreText.innerText = `Player: ${playerScore} | AI: ${aiScore}`;
}

let gameOver = false;

function update() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    if (aiY + paddleHeight / 2 < ballY) {
        aiY += paddleSpeed;
    } else {
        aiY -= paddleSpeed;
    }

    if (ballX - ballRadius < paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) {
        playerScore++;
        hitSound.play().catch(error => console.log("Audio play blocked:", error));
        updateScore();
        ballSpeedX = -ballSpeedX;
    }

    if (ballX + ballRadius > canvas.width - paddleWidth && ballY > aiY && ballY < aiY + paddleHeight) {
        aiScore++;
        updateScore();
        ballSpeedX = -ballSpeedX;
    }

    if (ballX - ballRadius < 0) {
        gameOver = true;
    } else if (ballX + ballRadius > canvas.width) {
        resetBall();
    }
}

function draw() {
    drawRect(0, 0, canvas.width, canvas.height, "black");
    drawRect(0, playerY, paddleWidth, paddleHeight, "white");
    drawRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight, "white");
    drawBall(ballX, ballY, ballRadius, "white");
}

let animationId = 0;

function gameLoop() {
    if (!gameOver) {
        update();
        draw();
        animationId = requestAnimationFrame(gameLoop);
    } else {
        cancelAnimationFrame(animationId);
        alert("Game Over");
    }
}

startButton.addEventListener("click", () => {
    startButton.style.display = "none";
    canvas.style.display = "block";
    scoreText.style.display = "block";
    gameLoop();
});
