const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

// Game State & Settings
let gameState = 'start'; // 'start', 'playing', 'paused', 'gameOver'
let gameMode = 'AIvsAI'; // 'vsAI', 'AIvsAI', 'twoPlayer'
let theme = 'modern'; // 'modern' or 'classic'
let isMuted = false;
let speedRamp = true;
let aiDifficulty = 'Medium';
const winningScore = 10;
let winner = null;

let leftScore = 0;
let rightScore = 0;
let lastScoredSide = 'right';

// Entities
let ball = { x: 0, y: 0, radius: 15, speed: 5, dx: 5, dy: 5 };
let leftPaddle = { x: 10, y: 0, width: 20, height: 130, dy: 6 };
let rightPaddle = { x: 0, y: 0, width: 20, height: 130, dy: 6 };

// UI Elements
const uiLayer = document.getElementById('ui-layer');
const btnPlay = document.getElementById('btn-play');
const btnMute = document.getElementById('btn-mute');
const btnTheme = document.getElementById('btn-theme');
const btnMode = document.getElementById('btn-mode');
const btnSpeed = document.getElementById('btn-speed');
const btnDiff = document.getElementById('btn-diff');
const gameOverOverlay = document.getElementById('game-over-overlay');
const winnerDisplay = document.getElementById('winner-display');
const btnRestart = document.getElementById('btn-restart');
const scoreLeftEl = document.getElementById('score-left');
const scoreRightEl = document.getElementById('score-right');

// Audio
let hitSound = new Audio('hit.wav');
let scoreSound = new Audio('score.wav');

// Keyboard State
let keyState = {};

// Themes
const themes = {
    modern: {
        bgAlpha: 0.25, // For motion blur trail
        bgColor: '#01012b',
        paddleLeft: '#ff2a6d',
        paddleRight: '#05d9e8',
        ball: '#e2ff00',
        net: 'rgba(5, 217, 232, 0.3)',
        glow: true
    },
    classic: {
        bgAlpha: 1.0, // Solid background
        bgColor: '#000000',
        paddleLeft: '#ffffff',
        paddleRight: '#ffffff',
        ball: '#ffffff',
        net: '#ffffff',
        glow: false
    }
};

const difficultySettings = {
    'Easy':   { speedMultiplier: 0.4, errorMargin: 40 },
    'Medium': { speedMultiplier: 0.6, errorMargin: 20 },
    'Hard':   { speedMultiplier: 0.85, errorMargin: 5 },
    'Impossible': { speedMultiplier: 1.0, errorMargin: 0 }
};

// Resizing logic
function initSizes() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Scale sizes based on screen height
    const scale = Math.max(0.5, canvas.height / 1080);
    
    leftPaddle.height = 150 * scale;
    leftPaddle.width = 20 * scale;
    rightPaddle.height = 150 * scale;
    rightPaddle.width = 20 * scale;
    
    leftPaddle.x = 20 * scale;
    rightPaddle.x = canvas.width - rightPaddle.width - (20 * scale);
    
    ball.radius = Math.max(8, 15 * scale);
    
    // Base speed
    ball.speed = 5 * scale;
    leftPaddle.dy = 9 * scale;
    rightPaddle.dy = 9 * scale;

    // Reposition paddles to stay in bounds
    leftPaddle.y = Math.min(leftPaddle.y, canvas.height - leftPaddle.height);
    rightPaddle.y = Math.min(rightPaddle.y, canvas.height - rightPaddle.height);
}
window.pongResizeCallback = initSizes;
window.addEventListener('resize', initSizes);
initSizes(); // Initial setup

// Audio Handler
function playSound(audio) {
    if (!isMuted && gameState === 'playing') {
        audio.currentTime = 0;
        audio.play().catch(e => { /* Ignore autoplay blocks */ });
    }
}

// Particle System
class Spark {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 2;
        this.speedX = (Math.random() - 0.5) * 15;
        this.speedY = (Math.random() - 0.5) * 15;
        this.color = color;
        this.life = 1.0;
        this.decay = Math.random() * 0.04 + 0.02;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size *= 0.95;
    }
    draw(ctx) {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        if (themes[theme].glow) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
let sparks = [];
function spawnSparks(x, y, count, color) {
    for(let i=0; i<count; i++) sparks.push(new Spark(x, y, color));
}

// UI Updates
function updateUI() {
    btnMute.textContent = isMuted ? 'Mute: On' : 'Mute: Off';
    btnTheme.textContent = `Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`;
    let modeText = gameMode === 'vsAI' ? 'Player vs AI' : (gameMode === 'AIvsAI' ? 'AI vs AI' : 'Player vs Player');
    btnMode.textContent = `Mode: ${modeText}`;
    
    btnSpeed.textContent = speedRamp ? 'Ramp Speed: On' : 'Ramp Speed: Off';
    
    btnDiff.textContent = `Difficulty: ${aiDifficulty}`;
    if (gameMode === 'twoPlayer') {
        btnDiff.style.display = 'none';
    } else {
        btnDiff.style.display = 'inline-block';
    }
    
    scoreLeftEl.textContent = leftScore;
    scoreRightEl.textContent = rightScore;

    if (theme === 'classic') {
        document.body.classList.add('classic-theme');
    } else {
        document.body.classList.remove('classic-theme');
    }
}

// UI Event Listeners
btnPlay.addEventListener('click', () => {
    uiLayer.classList.add('hidden');
    gameState = 'playing';
    resetGame();
});

btnRestart.addEventListener('click', () => {
    gameOverOverlay.style.display = 'none';
    resetGame();
});

btnMute.addEventListener('click', () => {
    isMuted = !isMuted;
    updateUI();
});

btnTheme.addEventListener('click', () => {
    theme = theme === 'modern' ? 'classic' : 'modern';
    updateUI();
});

btnMode.addEventListener('click', () => {
    if (gameMode === 'vsAI') gameMode = 'AIvsAI';
    else if (gameMode === 'AIvsAI') gameMode = 'twoPlayer';
    else gameMode = 'vsAI';
    updateUI();
});

btnSpeed.addEventListener('click', () => {
    speedRamp = !speedRamp;
    updateUI();
});

document.getElementById('controls-toggle').addEventListener('click', () => {
    document.getElementById('controls-menu').classList.toggle('expanded');
});

const difficultyLevels = ['Easy', 'Medium', 'Hard', 'Impossible'];
btnDiff.addEventListener('click', () => {
    let currentIndex = difficultyLevels.indexOf(aiDifficulty);
    aiDifficulty = difficultyLevels[(currentIndex + 1) % difficultyLevels.length];
    updateUI();
});

// Keyboard Listeners
window.addEventListener('keydown', function(e) {
    const key = e.key.toLowerCase();
    keyState[key] = true;

    if (gameState !== 'gameOver' && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
    }

    // Auto-switch to vsAI if user interacts during AIvsAI
    if (gameMode === 'AIvsAI' && (key === 'w' || key === 's' || key === 'arrowup' || key === 'arrowdown')) {
        gameMode = 'vsAI';
        updateUI();
    }

    if (key === 'p' && gameState !== 'start' && gameState !== 'gameOver') {
        gameState = gameState === 'paused' ? 'playing' : 'paused';
    }
    
    if (key === 'm') {
        isMuted = !isMuted;
        updateUI();
    }

    if (key === 'd' && gameMode !== 'twoPlayer') {
        let currentIndex = difficultyLevels.indexOf(aiDifficulty);
        aiDifficulty = difficultyLevels[(currentIndex + 1) % difficultyLevels.length];
        updateUI();
    }
    
    if (key === ' ') {
        if (gameState === 'playing') resetBall();
    }
});

window.addEventListener('keyup', function(e) {
    keyState[e.key.toLowerCase()] = false;
});

// Game Logic
function resetBall() {
    const scale = Math.max(0.5, canvas.height / 1080);
    ball.speed = 5 * scale;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    let angle = (Math.random() - 0.5) * (Math.PI / 2); // +/- 45 degrees
    let directionMultiplier = (lastScoredSide === 'right') ? 1 : -1;
    ball.dx = directionMultiplier * ball.speed * Math.cos(angle);
    ball.dy = ball.speed * Math.sin(angle);
}

function resetGame() {
    leftScore = 0;
    rightScore = 0;
    winner = null;
    sparks = [];
    updateUI();
    leftPaddle.y = canvas.height / 2 - leftPaddle.height / 2;
    rightPaddle.y = canvas.height / 2 - rightPaddle.height / 2;
    lastScoredSide = 'right';
    resetBall();
    gameState = 'playing';
}

function checkWinCondition() {
    if (leftScore >= winningScore) {
        let name = gameMode === 'AIvsAI' ? 'Left AI' : 'Player 1';
        endGame(name, 'left');
    } else if (rightScore >= winningScore) {
        let name = gameMode === 'twoPlayer' ? 'Player 2' : (gameMode === 'AIvsAI' ? 'Right AI' : 'AI');
        endGame(name, 'right');
    }
}

function endGame(winnerName, side) {
    gameState = 'gameOver';
    winnerDisplay.textContent = `${winnerName} Wins!`;
    
    if (theme === 'modern') {
        if (side === 'left') {
            winnerDisplay.style.color = themes.modern.paddleLeft;
            winnerDisplay.style.textShadow = `0 0 15px ${themes.modern.paddleLeft}`;
        } else {
            winnerDisplay.style.color = themes.modern.paddleRight;
            winnerDisplay.style.textShadow = `0 0 15px ${themes.modern.paddleRight}`;
        }
    } else {
        winnerDisplay.style.color = 'white';
        winnerDisplay.style.textShadow = 'none';
    }
    
    if (gameMode === 'AIvsAI') {
        // Auto restart for background AI mode
        gameOverOverlay.style.display = 'flex';
        btnRestart.style.display = 'none';
        setTimeout(() => {
            if (gameState === 'gameOver' && gameMode === 'AIvsAI') {
                gameOverOverlay.style.display = 'none';
                resetGame();
            }
        }, 3000);
    } else {
        gameOverOverlay.style.display = 'flex';
        btnRestart.style.display = 'inline-block';
    }
}

function updateAIPaddle(paddle, isLeftAI) {
    const settings = difficultySettings[aiDifficulty];
    const effectiveSpeed = paddle.dy * settings.speedMultiplier;
    const paddleCenter = paddle.y + paddle.height / 2;
    
    // Simple prediction/tracking
    let targetY = canvas.height / 2;
    // Only track if ball is moving towards the AI
    if ((isLeftAI && ball.dx < 0) || (!isLeftAI && ball.dx > 0)) {
        const errorOffset = (Math.random() - 0.5) * 2 * settings.errorMargin;
        targetY = ball.y + errorOffset;
    }
    
    const deadZone = 15;
    if (paddleCenter < targetY - deadZone) paddle.y += effectiveSpeed;
    else if (paddleCenter > targetY + deadZone) paddle.y -= effectiveSpeed;
    
    paddle.y = Math.max(0, Math.min(paddle.y, canvas.height - paddle.height));
}

function collisionDetect(paddle, ball) {
    let closestX = Math.max(paddle.x, Math.min(ball.x, paddle.x + paddle.width));
    let closestY = Math.max(paddle.y, Math.min(ball.y, paddle.y + paddle.height));
    let distX = ball.x - closestX;
    let distY = ball.y - closestY;
    return (distX * distX) + (distY * distY) < (ball.radius * ball.radius);
}

function updateBall() {
    if (gameState !== 'playing') return;

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall bounce
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
        ball.y = (ball.y - ball.radius < 0) ? ball.radius : canvas.height - ball.radius;
    }

    // Anti-vertical stuck
    const minDx = (canvas.width / 1920) * 2.5;
    if (Math.abs(ball.dx) < minDx) {
        ball.dx = ball.dx >= 0 ? minDx : -minDx;
    }

    // Paddle hit
    let paddleHit = null;
    if (ball.dx > 0 && collisionDetect(rightPaddle, ball)) paddleHit = rightPaddle;
    else if (ball.dx < 0 && collisionDetect(leftPaddle, ball)) paddleHit = leftPaddle;

    if (paddleHit) {
        ball.dx *= -1;
        let paddleMid = paddleHit.y + paddleHit.height / 2;
        let collidePoint = ball.y - paddleMid;
        let normalizedCollidePoint = collidePoint / (paddleHit.height / 2);
        let bounceAngle = normalizedCollidePoint * ((5 * Math.PI) / 12); // Max bounce angle
        
        // Speed up slightly on hit up to a max
        if (speedRamp) {
            ball.speed = Math.min(ball.speed * 1.05, (canvas.height/1080) * 18);
        }
        
        let directionMultiplier = (paddleHit === leftPaddle) ? 1 : -1;
        ball.dx = directionMultiplier * ball.speed * Math.cos(bounceAngle);
        ball.dy = ball.speed * Math.sin(bounceAngle);
        
        playSound(hitSound);
        
        // Visual effects
        let sparkColor = paddleHit === leftPaddle ? themes[theme].paddleLeft : themes[theme].paddleRight;
        spawnSparks(ball.x, ball.y, 15, sparkColor);
        
        // Nudge ball out
        ball.x += ball.dx > 0 ? 2 : -2; 
    } else {
        // Score
        if (ball.x + ball.radius > canvas.width) {
            leftScore++;
            lastScoredSide = 'left';
            playSound(scoreSound);
            spawnSparks(ball.x, ball.y, 50, themes[theme].paddleLeft);
            updateUI();
            checkWinCondition();
            if (gameState === 'playing') resetBall();
        } else if (ball.x - ball.radius < 0) {
            rightScore++;
            lastScoredSide = 'right';
            playSound(scoreSound);
            spawnSparks(ball.x, ball.y, 50, themes[theme].paddleRight);
            updateUI();
            checkWinCondition();
            if (gameState === 'playing') resetBall();
        }
    }
}

// Rendering
function drawRect(x, y, w, h, color, glowColor) {
    context.fillStyle = color;
    if (themes[theme].glow) {
        context.shadowBlur = 20;
        context.shadowColor = glowColor;
    } else {
        context.shadowBlur = 0;
    }
    context.fillRect(x, y, w, h);
    context.shadowBlur = 0; // reset
}

function drawBall(t) {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = t.ball;
    if (t.glow) {
        context.shadowBlur = 20;
        context.shadowColor = t.ball;
    }
    context.fill();
    context.closePath();
    context.shadowBlur = 0;
}

function drawNet(t) {
    context.beginPath();
    context.setLineDash([10, 20]);
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.strokeStyle = t.net;
    context.lineWidth = 4;
    context.stroke();
    context.setLineDash([]);
}

function animate() {
    requestAnimationFrame(animate);

    const t = themes[theme];

    // Background clearing with motion blur effect
    if (t.bgAlpha < 1.0) {
        context.fillStyle = `rgba(1, 1, 43, ${t.bgAlpha})`;
        context.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        context.fillStyle = t.bgColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    drawNet(t);

    if (gameState !== 'start') {
        drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, t.paddleLeft, t.paddleLeft);
        drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, t.paddleRight, t.paddleRight);
        drawBall(t);

        // Update & Draw Sparks
        for (let i = sparks.length - 1; i >= 0; i--) {
            sparks[i].update();
            sparks[i].draw(context);
            if (sparks[i].life <= 0) sparks.splice(i, 1);
        }

        if (gameState === 'playing') {
            updateBall();

            // Left Paddle movement
            if (gameMode === 'AIvsAI') {
                updateAIPaddle(leftPaddle, true);
            } else {
                if (keyState['w'] && leftPaddle.y > 0) leftPaddle.y -= leftPaddle.dy;
                if (keyState['s'] && leftPaddle.y < canvas.height - leftPaddle.height) leftPaddle.y += leftPaddle.dy;
            }

            // Right Paddle movement
            if (gameMode === 'vsAI' || gameMode === 'AIvsAI') {
                updateAIPaddle(rightPaddle, false);
            } else {
                if (keyState['arrowup'] && rightPaddle.y > 0) rightPaddle.y -= rightPaddle.dy;
                if (keyState['arrowdown'] && rightPaddle.y < canvas.height - rightPaddle.height) rightPaddle.y += rightPaddle.dy;
            }
        } else if (gameState === 'paused') {
            context.fillStyle = 'rgba(0, 0, 0, 0.5)';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.font = 'bold 60px Outfit, Arial';
            context.fillStyle = t.paddleRight;
            context.textAlign = 'center';
            context.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
            context.textAlign = 'start';
        }
    }
}

// Initialize
updateUI();
resetBall();
leftPaddle.y = canvas.height / 2 - leftPaddle.height / 2;
rightPaddle.y = canvas.height / 2 - rightPaddle.height / 2;
animate();