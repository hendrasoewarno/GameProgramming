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
ballImg.src = "assets/ball.svg"; // Ganti dengan path gambar bola

const paddleImg = new Image();
paddleImg.src = "assets/paddle.svg"; // Ganti dengan path gambar paddle

// Paddle
const paddleWidth = 10, paddleHeight = 160;
let player1Y = (canvas.height - paddleHeight) / 2;
let player2Y = (canvas.height - paddleHeight) / 2;
let paddleSpeed = paddleHeight/5/2;

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
            this.y > player1Y &&
            this.y < player1Y + paddleHeight
        ) {
            player1Score++;
            hitSound.play().catch(error => console.log("Audio play blocked:", error));
            updateScore();
            this.speedX = -this.speedX;
        }

        if (
            this.x + this.radius > canvas.width - paddleWidth &&
            this.y > player2Y &&
            this.y < player2Y + paddleHeight
        ) {
            player2Score++;
            updateScore();
            this.speedX = -this.speedX;
        }

        // Check if ball goes out of bounds
		// Player1 side
        if (this.x - this.radius < 0) {
            gameOver = true;
		// Player2 side
        } else if (this.x + this.radius > canvas.width) {
            gameOver = true;
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
let player1Score = 0;
let player2Score = 0;

// Keyboard Input Handling
document.addEventListener("keydown", (e) => {
	// Player1 Move
    if (e.key === "w" || e.key === "W") {
        player1Y -= paddleSpeed * 5;
    }
    if (e.key === "z" || e.key === "Z") {
        player1Y += paddleSpeed * 5;
    }	
	// Player2 Move
    if (e.key === "ArrowUp") {
        player2Y -= paddleSpeed*5;
    }
    if (e.key === "ArrowDown") {
		player2Y += paddleSpeed*5;        
    }
});

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function updateScore() {
    scoreText.innerText = `Player 1: ${player1Score} | Player 2: ${player2Score}`;
}

let gameOver = false;

function update() {
    balls.forEach(ball => ball.update());

    // AI movement
    //if (player2Y + paddleHeight / 2 < balls[0].y) {
    //    player2Y += paddleSpeed;
    //} else {
    //    player2Y -= paddleSpeed;
    //}
}

function draw() {
    drawRect(0, 0, canvas.width, canvas.height, "black");
    ctx.drawImage(paddleImg, 0, player1Y, paddleWidth, paddleHeight);
    ctx.drawImage(paddleImg, canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight);

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
