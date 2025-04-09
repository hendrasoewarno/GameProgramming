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

// Load images
const ballImg = new Image();
ballImg.src = "data:image/svg+xml,<svg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'><circle cx='25' cy='25' r='20' fill='white' stroke='black' stroke-width='2'/></svg>";

const paddleImg = new Image();
paddleImg.src = "data:image/svg+xml,<svg width='15' height='80' viewBox='0 0 15 80' xmlns='http://www.w3.org/2000/svg'><rect x='0' y='0' width='15' height='80' fill='white' stroke='black' stroke-width='2'/></svg>";

// Paddle
const paddleWidth = 10, paddleHeight = 80;
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let paddleSpeed = 5;

// Ball Class
class Ball {
    constructor(x, y, radius, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    draw() {
        ctx.drawImage(ballImg, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = -this.speedX;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Collision with top and bottom walls
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
            this.speedY = -this.speedY;
        }

        // Ball collision with paddles
        if (
            this.x - this.radius < paddleWidth &&
            this.y > playerY &&
            this.y < playerY + paddleHeight
        ) {
            playerScore++;
            hitSound.play().catch(error => console.log("Audio play blocked:", error));
            updateScore();
            this.speedX = -this.speedX;
        }

        if (
            this.x + this.radius > canvas.width - paddleWidth &&
            this.y > aiY &&
            this.y < aiY + paddleHeight
        ) {
            aiScore++;
            updateScore();
            this.speedX = -this.speedX;
        }

        // Check if ball goes out of bounds
        if (this.x - this.radius < 0) {
            gameOver = true;
        } else if (this.x + this.radius > canvas.width) {
            this.reset();
        }
    }
}

// Create two ball objects
let balls = [
    new Ball(canvas.width / 2, canvas.height / 2, 8, 5, 5),
    new Ball(canvas.width / 2, canvas.height / 2, 8, -5, -5)
];

let speedIncrement = 0.05;

// Players Score
let playerScore = 0;
let aiScore = 0;

// Input
//document.addEventListener("mousemove", (e) => {
//    let rect = canvas.getBoundingClientRect();
//    playerY = e.clientY - rect.top - paddleHeight / 2;
//});


// Keyboard Input Handling
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
        playerY -= paddleSpeed*5;
    }
    if (e.key === "ArrowDown") {
		playerY += paddleSpeed*5;        
    }
});

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function updateScore() {
    scoreText.innerText = `Player: ${playerScore} | AI: ${aiScore}`;
}

let gameOver = false;

function update() {
    balls.forEach(ball => ball.update());

    // AI movement
    if (aiY + paddleHeight / 2 < balls[0].y) {
        aiY += paddleSpeed;
    } else {
        aiY -= paddleSpeed;
    }
}

function draw() {
    drawRect(0, 0, canvas.width, canvas.height, "black");
    ctx.drawImage(paddleImg, 0, playerY, paddleWidth, paddleHeight);
    ctx.drawImage(paddleImg, canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight);

    balls.forEach(ball => ball.draw());
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
