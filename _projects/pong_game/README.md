# 🏓 pong-ai-test 🤖

Welcome to pong-ai-test, a modern twist on the classic Pong game featuring dynamic resizing, sound effects, multiple game modes, and an AI opponent with adjustable difficulty. Initially developed with assistance from GitHub Copilot, this project now showcases a complete gameplay experience.

## 🎮 How to Play

1.  **Open the Game:** Download the project and open the `index.html` file in your web browser.
2.  **Game Modes:**
    * Press `M` to switch between **Two-Player** and **Player vs AI** modes. The game will reset when you switch.
3.  **Controls:**
    * **Left Paddle (Player 1):** Use `W` (up) and `S` (down) keys. (Always player-controlled).
    * **Right Paddle (Player 2 / AI):**
        * In **Two-Player** mode: Use `ArrowUp` (up) and `ArrowDown` (down) keys.
        * In **Player vs AI** mode: The AI controls this paddle.
4.  **Gameplay:**
    * Hit the ball with your paddle to send it to the opponent's side.
    * Score a point if the ball goes past your opponent's paddle.
    * The first player to reach **10 points** wins!
5.  **In-Game Options:**
    * **Pause/Resume:** Press `P` to pause or resume the game.
    * **Change AI Difficulty:** In **Player vs AI** mode, press `D` to cycle through difficulty levels: Easy, Medium, Hard, Impossible.
    * **Restart:** After the game ends ("Game Over"), press `R` to restart in the current mode.

## 🕹️ Game Mechanics

* **Two Modes:** Play against another human or challenge the AI.
* **AI Difficulty:** Four levels (Easy, Medium, Hard, Impossible) affect the AI's speed and accuracy.
* **Scoring:** First to 10 points wins.
* **Dynamic Resizing:** Game elements adapt fluidly to the browser window size.
* **Physics:** Ball bounce angle depends on where it hits the paddle.
* **Visuals & Sound:** Includes a center net, scoring sound effects, paddle hit sounds, and a star animation on score.
* **Pause/Reset:** Control the game flow with pause and post-game reset options.

## 💻 Development

This game was developed using JavaScript and the HTML5 Canvas API for rendering. Initial scaffolding and some features were guided by GitHub Copilot suggestions.

Key development aspects include:
* **Game Loop:** Managed using `requestAnimationFrame`.
* **State Management:** Tracking game state (`playing`, `paused`, `gameOver`), game mode, scores, and difficulty.
* **Input Handling:** Detecting key presses for paddle movement and game controls.
* **Collision Detection:** Calculating ball collisions with paddles and walls.
* **AI Logic:** The AI uses a reactive strategy (tracking the ball's Y position) modified by the selected difficulty level through speed scaling and random error margins.
* **Dynamic Scaling:** Adjusting element sizes, positions, and speeds on window resize.

## 🚀 Future Plans

While the core game is complete, potential future enhancements include:
* Adding a visual start/menu screen.
* Implementing a Start button instead of auto-start.
* Exploring more advanced AI techniques (e.g., prediction).
* Adding more sound effects or visual polish.
* Optional gameplay variations (e.g., ball speed increasing over time).

## 🎉 Acknowledgements

A big thank you to GitHub Copilot for assisting in the initial development stages of this game!

Enjoy playing pong-ai-test! 🎉