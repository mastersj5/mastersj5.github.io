const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

// Set initial canvas size
let initialWidth = document.documentElement.clientWidth;
let initialHeight = document.documentElement.clientHeight;
canvas.width = initialWidth;
canvas.height = initialHeight;

// Store initial paddle dimensions
let initialPaddleWidth = 20, initialPaddleHeight = 130;

let paddleWidth = 20, paddleHeight = 130;
let scoreFontSize = 60;
let infoFontSize = 20; // Font size for mode/pause info

let leftPaddle = {
    x: 5, // Added small gap from edge
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 3.5 // Slightly increased speed for responsiveness/AI
};

let rightPaddle = {
    x: canvas.width - paddleWidth - 5, // Added small gap from edge
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 3.5 // Slightly increased speed
};

let ballRadius = 15;
let ballSpeed = 3; // Slightly increased base speed

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    speed: ballSpeed,
    dx: ballSpeed,
    dy: ballSpeed
};

let lastScoredSide = 'right'; // Initialize to 'right' so the ball initially goes to the left

// --- Game State Variables ---
let gameState = 'playing'; // 'playing', 'paused', 'gameOver', 'start'
let gameMode = 'twoPlayer'; // 'twoPlayer', 'vsAI'
const winningScore = 10;
let winner = null; // Stores 'Left' or 'Right' when game is over

// --- AI Difficulty ---
let aiDifficulty = 'Medium'; // Default difficulty
const difficultyLevels = ['Easy', 'Medium', 'Hard', 'Impossible'];
const difficultySettings = {
    // Multiplier applied to AI paddle speed (dy), Error margin in pixels added randomly to target Y
    'Easy':   { speedMultiplier: 0.3, errorMargin: 50 },
    'Medium': { speedMultiplier: 0.5, errorMargin: 25 },
    'Hard':   { speedMultiplier: 0.8, errorMargin: 10 },
    'Impossible': { speedMultiplier: 1.0, errorMargin: 0 } // Uses full AI paddle speed (dy), no error
};

// Resize the canvas to fill browser window dynamically
window.addEventListener('resize', () => {
    let newWidth = document.documentElement.clientWidth;
    let newHeight = document.documentElement.clientHeight;
    let widthRatio = newWidth / initialWidth;
    let heightRatio = newHeight / initialHeight;

    let oldCanvasHeight = canvas.height;
    let oldCanvasWidth = canvas.width;

    initialWidth = newWidth;
    initialHeight = newHeight;

    canvas.width = newWidth;
    canvas.height = newHeight;

    // --- Update positions relative to new size ---
    // Keep paddles relative to center and edges
    leftPaddle.x = 5;
    leftPaddle.y = leftPaddle.y / (initialHeight / heightRatio); // Adjust y based on previous height ratio
    rightPaddle.x = canvas.width - paddleWidth - 5;
    rightPaddle.y = rightPaddle.y / (initialHeight / heightRatio); // Adjust y based on previous height ratio
    ball.x = ball.x / (initialWidth / widthRatio);
    ball.y = ball.y / (initialHeight / heightRatio);


    // --- Update sizes and speeds with limits ---
    const sizeRatio = Math.min(widthRatio, heightRatio); // Use minimum ratio for consistent scaling
    ball.radius = Math.min(Math.max(ballRadius * sizeRatio, 8), 25);
    // Reset ball speed based on base speed and size ratio, ensures speed resets correctly on resize
    ball.speed = Math.min(Math.max(ballSpeed * sizeRatio, 2), 6);
    // Recalculate dx/dy based on new speed, maintaining direction
    const currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    if (currentSpeed > 0) { // Avoid division by zero if ball is somehow static
        ball.dx = (ball.dx / currentSpeed) * ball.speed;
        ball.dy = (ball.dy / currentSpeed) * ball.speed;
    } else { // If static (e.g. start of game), set based on lastScoredSide
         resetBallDirection(); // Use helper for direction logic
    }


    // Update paddle size and speed with limits
    paddleWidth = Math.min(Math.max(initialPaddleWidth * widthRatio, 10), 30);
    paddleHeight = Math.min(Math.max(initialPaddleHeight * heightRatio, 80), 200);
    const paddleSpeedRatio = Math.sqrt(heightRatio);
    // Update base speeds based on resize, then difficulty multiplier applies on top
    leftPaddle.width = paddleWidth;
    leftPaddle.height = paddleHeight;
    leftPaddle.dy = Math.min(Math.max(leftPaddle.dy * paddleSpeedRatio, 2), 6); // Player speed scales
    rightPaddle.width = paddleWidth;
    rightPaddle.height = paddleHeight;
    rightPaddle.dy = Math.min(Math.max(rightPaddle.dy * paddleSpeedRatio, 2.5), 7); // AI base speed scales (max slightly higher)

    // Ensure paddles stay within bounds after resize
    leftPaddle.y = Math.max(0, Math.min(leftPaddle.y, canvas.height - leftPaddle.height));
    rightPaddle.y = Math.max(0, Math.min(rightPaddle.y, canvas.height - rightPaddle.height));

    // Update font sizes with limits
    scoreFontSize = Math.min(Math.max(60 * sizeRatio, 30), 80);
    infoFontSize = Math.min(Math.max(20 * sizeRatio, 15), 30);

    // Re-apply font settings (needed after resize clears context state potentially)
    context.font = `${scoreFontSize}px Arial`;
    // Need to reset textAlign if it was changed
    context.textAlign = 'start';
});

function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
    context.fillStyle = 'purple';
    context.fill();
    context.closePath();
}

function updateBall() {
    if (gameState !== 'playing') return; // Don't update if paused or game over

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top/Bottom collision
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1; // reverse the direction
        ball.y = (ball.y - ball.radius < 0) ? ball.radius : canvas.height - ball.radius; // Prevent sticking
    }

    // Paddle collision checks
    let paddleHit = null;
    if (ball.dx > 0 && collisionDetect(rightPaddle, ball)) { // Moving right, check right paddle
         paddleHit = rightPaddle;
    } else if (ball.dx < 0 && collisionDetect(leftPaddle, ball)) { // Moving left, check left paddle
         paddleHit = leftPaddle;
    }

    if (paddleHit) {
        ball.dx *= -1;
        let paddleMid = paddleHit.y + paddleHit.height / 2;
        let collidePoint = ball.y - paddleMid;
        let normalizedCollidePoint = collidePoint / (paddleHit.height / 2);
        let maxBounceAngle = (5 * Math.PI) / 12;
        let bounceAngle = normalizedCollidePoint * maxBounceAngle;
        let directionMultiplier = (paddleHit === leftPaddle) ? 1 : -1;
        // Adjust speed slightly on hit maybe?
        // ball.speed = Math.min(ball.speed * 1.01, ballSpeed * 1.5); // Gradual speed increase up to a max
        ball.dx = directionMultiplier * ball.speed * Math.cos(bounceAngle);
        ball.dy = ball.speed * Math.sin(bounceAngle);
        hitSound.play();
        ball.x += ball.dx > 0 ? 1 : -1; // Nudge ball out
    } else {
        // Score detection
        if (ball.x + ball.radius > canvas.width) { // Left scores
            leftScore++;
            scoreSound.play();
            addStars(ball.x - ball.radius, ball.y, 100);
            lastScoredSide = 'left';
            checkWinCondition();
            if (gameState === 'playing') resetBall();
        } else if (ball.x - ball.radius < 0) { // Right scores
            rightScore++;
            scoreSound.play();
            addStars(ball.x + ball.radius, ball.y, 100);
            lastScoredSide = 'right';
            checkWinCondition();
            if (gameState === 'playing') resetBall();
        }
    }
}

// --- Check Win Condition ---
function checkWinCondition() {
    if (leftScore >= winningScore) {
        gameState = 'gameOver';
        winner = 'Left Player'; // Left is always Player 1
    } else if (rightScore >= winningScore) {
        gameState = 'gameOver';
        // Right side is AI in vsAI mode, otherwise Right Player
        winner = (gameMode === 'vsAI') ? 'AI' : 'Right Player';
    }
     // Optional: Stop sounds immediately on game over?
     // hitSound.pause(); hitSound.currentTime = 0;
     // scoreSound.pause(); scoreSound.currentTime = 0;
}


// --- resetBall only positions and sets direction ---
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    resetBallDirection(); // Use helper for direction
}

// --- resetBallDirection helper ---
function resetBallDirection() {
     // Generate a random angle between -45 and 45 degrees (converted to radians)
    let angle = (Math.random() - 0.5) * (Math.PI / 2); // +/- 45 degrees
    // Set the ball's new direction based on the angle and the side that last scored
    let directionMultiplier = (lastScoredSide === 'right') ? 1 : -1; // Serve towards player who didn't score
    ball.dx = directionMultiplier * ball.speed * Math.cos(angle);
    ball.dy = ball.speed * Math.sin(angle);
}

function drawPaddle(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

// --- Control flags ---
let keyState = {}; // Use an object to track multiple key presses

// --- Event Listeners ---
window.addEventListener('keydown', function(event) {
    keyState[event.key.toLowerCase()] = true; // Store key state as lowercase

    // Prevent default scrolling for arrow keys only when game is active/paused
    if (gameState !== 'gameOver' && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
         event.preventDefault();
    }

    // Handle non-movement keys (Pause, Mode switch, Reset)
    switch(event.key.toLowerCase()) {
        case 'p': // Pause/Resume
            if (gameState === 'playing') {
                gameState = 'paused';
            } else if (gameState === 'paused') {
                gameState = 'playing';
            }
            break;
        case 'm': // Mode Switch
            // Allow mode switch anytime except during game over animation?
             if (gameState !== 'gameOver') {
                 gameMode = (gameMode === 'twoPlayer') ? 'vsAI' : 'twoPlayer';
                 resetGame(); // Reset the game when mode changes
             }
            break;
        case 'r': // Reset from Game Over
             if (gameState === 'gameOver') {
                 resetGame(); // Reset game only from game over screen
             }
             break;
        case 'd': // Difficulty Cycle
             if (gameMode === 'vsAI' && gameState !== 'gameOver') { // Only change difficulty in AI mode and when not game over
                 let currentIndex = difficultyLevels.indexOf(aiDifficulty);
                 currentIndex = (currentIndex + 1) % difficultyLevels.length; // Cycle through levels
                 aiDifficulty = difficultyLevels[currentIndex];
                 // Difficulty change takes effect immediately in updateAIPaddle
             }
             break;
    }
});

window.addEventListener('keyup', function(event) {
    keyState[event.key.toLowerCase()] = false; // Clear key state
});

// --- Collision Detection (more robust) ---
function collisionDetect(paddle, ball) {
    // Find closest point on paddle to ball center
    let closestX = Math.max(paddle.x, Math.min(ball.x, paddle.x + paddle.width));
    let closestY = Math.max(paddle.y, Math.min(ball.y, paddle.y + paddle.height));

    // Calculate distance between ball center and closest point
    let distX = ball.x - closestX;
    let distY = ball.y - closestY;
    let distanceSquared = (distX * distX) + (distY * distY);

    // Check if distance is less than ball radius squared
    return distanceSquared < (ball.radius * ball.radius);
}


let leftScore = 0;
let rightScore = 0;

function drawScore() {
    context.font = `bold ${scoreFontSize}px Arial`;
    context.fillStyle = 'white';
    context.textAlign = 'center'; // Center score text
    context.fillText(leftScore, canvas.width * 0.25, canvas.height * 0.15); // Adjusted position
    context.fillText(rightScore, canvas.width * 0.75, canvas.height * 0.15); // Adjusted position
    context.textAlign = 'start'; // Reset alignment
}

// --- Display Game State Info ---
function displayInfo() {
    context.font = `${infoFontSize}px Arial`;
    context.fillStyle = 'rgba(255, 255, 255, 0.7)';
    context.textAlign = 'center';

    let topTextY = infoFontSize * 1.5;
    let secondTextY = infoFontSize * 3.0;
    let thirdTextY = infoFontSize * 4.5;

    let modeText = `Mode: ${gameMode === 'vsAI' ? 'Player vs AI' : 'Player vs Player'} (Press 'M' to Switch)`;
    context.fillText(modeText, canvas.width / 2, topTextY);

    // Show AI Difficulty if applicable
    if (gameMode === 'vsAI') {
        let difficultyText = `Difficulty: ${aiDifficulty} (Press 'D' to Change)`;
        context.fillText(difficultyText, canvas.width / 2, secondTextY);
    }

    // Show Pause Text
    if (gameState === 'playing') {
         let pauseText = "Press 'P' to Pause";
         // Adjust Y position based on whether difficulty text is shown
         let pauseTextY = (gameMode === 'vsAI') ? thirdTextY : secondTextY;
         context.fillText(pauseText, canvas.width / 2, pauseTextY);
    }

    // Paused / Game Over messages
    if (gameState === 'paused') {
        context.font = `bold ${scoreFontSize * 0.8}px Arial`;
        context.fillStyle = 'yellow';
        context.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
        context.font = `${infoFontSize * 1.5}px Arial`;
        context.fillText("Press 'P' to Resume", canvas.width / 2, canvas.height / 2 + 50);
    } else if (gameState === 'gameOver') {
        context.fillStyle = 'rgba(0, 0, 0, 0.6)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = `bold ${scoreFontSize}px Arial`;
        context.fillStyle = 'lime';
        context.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 50);
        context.font = `bold ${scoreFontSize * 0.7}px Arial`;
        context.fillStyle = 'white';
        context.fillText(`${winner} Wins!`, canvas.width / 2, canvas.height / 2 + 20);
        context.font = `${infoFontSize * 1.5}px Arial`;
        context.fillText("Press 'R' to Restart", canvas.width / 2, canvas.height / 2 + 80);
    }
    context.textAlign = 'start';
}

let hitSound = new Audio('hit.wav');
let scoreSound = new Audio('score.wav');

// --- Star Animation Code (Unchanged) ---
class Star {
    // ... (Star constructor remains the same) ...
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 5;
        this.speedX = (Math.random() - 0.5) * 10; // random velocity in x direction
        this.speedY = (Math.random() - 0.5) * 10; // random velocity in y direction
        this.opacity = 1;
        this.opacitySpeed = 0.02; // Faster fade for visibility
    }

    draw() {
        context.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        context.beginPath();
        // Star drawing method (5 spikes)
        const spikes = 5;
        const outerRadius = this.size;
        const innerRadius = this.size / 2;
        let rotation = Math.PI / 2 * 3; // Start at top
        let x = this.x;
        let y = this.y;
        let step = Math.PI / spikes;

        context.moveTo(x, y - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = this.x + Math.cos(rotation) * outerRadius;
            y = this.y + Math.sin(rotation) * outerRadius;
            context.lineTo(x, y);
            rotation += step; // Use += consistently or ensure logic matches desired shape

            x = this.x + Math.cos(rotation) * innerRadius;
            y = this.y + Math.sin(rotation) * innerRadius;
            context.lineTo(x, y);
            rotation += step;
        }
        context.lineTo(this.x, this.y - outerRadius); // Close the path
        context.closePath();
        context.fill();
    }


    update() {
        this.x += this.speedX; // update x position
        this.y += this.speedY; // update y position
        if (this.size > 0.2) this.size -= 0.1; // Shrink
        if (this.opacity > 0) this.opacity -= this.opacitySpeed; // Fade
         // No need to filter here, handle removal in main loop
    }
}
let stars = [];
function addStars(x, y, count) {
    if (gameState !== 'playing') return; // Don't add stars if game isn't active
    for (let i = 0; i < count; i++) {
        stars.push(new Star(x, y));
    }
}
function updateStars() {
     if (gameState === 'gameOver') { // Clear stars instantly on game over
         stars = [];
         return;
     }
    for (let i = stars.length - 1; i >= 0; i--) { // Iterate backwards for safe removal
        stars[i].update();
        if (stars[i].size <= 0.2 || stars[i].opacity <= 0) {
            stars.splice(i, 1); // Remove star
        }
    }
}
function drawStars() {
    for (let i = 0; i < stars.length; i++) {
        stars[i].draw();
    }
}
// --- End Star Animation Code ---


function drawNet() {
    context.beginPath();
    context.setLineDash([5, 15]); // Adjusted dash pattern
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.strokeStyle = 'rgba(255, 255, 255, 0.5)'; // Make net semi-transparent
    context.lineWidth = 5; // Make net thicker
    context.stroke();
    context.setLineDash([]); // Reset line dash
    context.lineWidth = 1; // Reset line width
}

// --- AI Paddle Update Logic ---
function updateAIPaddle() {
    if (gameState !== 'playing' || gameMode !== 'vsAI') return;

    // Get settings for current difficulty
    const settings = difficultySettings[aiDifficulty];
    // Calculate AI speed based on base speed and difficulty multiplier
    const effectiveSpeed = rightPaddle.dy * settings.speedMultiplier;

    const paddleCenter = rightPaddle.y + rightPaddle.height / 2;

    // Calculate target Y with random error based on difficulty
    // Error is +/- half the margin, centered around 0
    const errorOffset = (Math.random() - 0.5) * 2 * settings.errorMargin;
    const targetY = ball.y + errorOffset;

    // Move paddle towards the target Y using the effective speed
    // Adding a small deadzone helps prevent jitter when ball is near center
    const deadZone = 10; // Small pixel deadzone

    if (paddleCenter < targetY - deadZone) { // Move down
        rightPaddle.y += effectiveSpeed;
    } else if (paddleCenter > targetY + deadZone) { // Move up
        rightPaddle.y -= effectiveSpeed;
    }
    // If within the deadzone, the AI paddle doesn't move vertically

    // Clamp paddle position to bounds
    rightPaddle.y = Math.max(0, Math.min(rightPaddle.y, canvas.height - rightPaddle.height));
}

// --- Reset Game Function ---
function resetGame() {
    leftScore = 0;
    rightScore = 0;
    winner = null;
    stars = []; // Clear existing stars

    // Reset paddle positions (consider potential resize)
    leftPaddle.y = canvas.height / 2 - leftPaddle.height / 2;
    rightPaddle.y = canvas.height / 2 - rightPaddle.height / 2;

    lastScoredSide = 'right'; // Reset serve direction preference
    resetBall(); // Position ball and set initial random direction

    gameState = 'playing'; // Set state to playing
    // Difficulty remains as selected by the user across resets
}

// --- Main Game Loop (animate) ---
function animate() {
    // Clear canvas
    context.fillStyle = '#000'; // Ensure background is black
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw fixed elements
    drawNet();
    drawScore();
    displayInfo(); // Show mode, pause text, or game over messages

    // Only update and draw moving elements if not game over
    if (gameState !== 'gameOver') {
        // Draw paddles and ball regardless of pause state (shows static scene when paused) 
        // --- Draw paddles: Left=Red, Right=Blue(P2)/Cyan(AI) ---
        drawPaddle(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, 'red');
        drawPaddle(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, gameMode === 'vsAI' ? 'cyan' : 'blue');
        drawBall();
        drawStars(); // Draw stars even when paused? Yes.

        // --- Update logic only if playing ---
        if (gameState === 'playing') {
            updateBall(); // Updates ball position and checks for score/win
            updateStars(); // Update star animations

            // --- Paddle Movement ---
            // Left Paddle (Player 1 - W/S)
            if (keyState['w'] && leftPaddle.y > 0) {
                leftPaddle.y -= leftPaddle.dy;
            } else if (keyState['s'] && (leftPaddle.y < canvas.height - leftPaddle.height)) {
                leftPaddle.y += leftPaddle.dy;
            }
            leftPaddle.y = Math.max(0, Math.min(leftPaddle.y, canvas.height - leftPaddle.height)); // Clamp

            // Right Paddle (Player 2 or AI)
            if (gameMode === 'twoPlayer') {
                // Player 2 - Arrow Keys
                if (keyState['arrowup'] && rightPaddle.y > 0) {
                    rightPaddle.y -= rightPaddle.dy;
                } else if (keyState['arrowdown'] && (rightPaddle.y < canvas.height - rightPaddle.height)) {
                    rightPaddle.y += rightPaddle.dy;
                }
                rightPaddle.y = Math.max(0, Math.min(rightPaddle.y, canvas.height - rightPaddle.height)); // Clamp
            } else { // vsAI mode
                updateAIPaddle(); // AI controls the right paddle
            }
        }
    } else {
         // Draw final static scene
         drawPaddle(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, 'red');
         drawPaddle(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, gameMode === 'vsAI' ? 'cyan' : 'blue');
         drawBall();
         // Stars are cleared in updateStars when gameState is 'gameOver' or handled in displayInfo overlay
         // displayInfo handles the overlay and text
    }
    requestAnimationFrame(animate); // Continue the loop
}


// --- Initial Game Setup ---
resetGame(); // Set up scores, paddles, ball, and start state
animate(); // Start the game loop