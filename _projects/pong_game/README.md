# 🏓 pong-ai-test - Neon Edition 🤖

Welcome to **pong-ai-test**, a modern 2026 twist on the classic Pong game. Initially developed as a basic AI exploration project in June 2024, it has been completely overhauled into a visually stunning "Neon Edition" featuring dynamic resizing, a robust particle engine, multiple game modes (including autoplaying AI vs AI), and an immersive Cyberpunk/Synthwave aesthetic.

## 🎮 How to Play

1. **Open the Game:** Download the project and open the `index.html` file in your web browser, or navigate to [my portfolio page](https://mastersj5.github.io/projects/2_project/) to play it directly in-browser.
2. **Game Modes:**
   Use the top-right UI buttons to cycle through the modes:
   * **Player vs AI:** You against the computer.
   * **Two-Player:** Grab a friend and share the keyboard.
   * **AI vs AI:** Watch two computer players battle it out (perfect for background ambiance).
3. **Controls:**
   * **Left Paddle (Player 1):** Use `W` (up) and `S` (down) keys.
   * **Right Paddle (Player 2):** Use `ArrowUp` (up) and `ArrowDown` (down) keys.
   * **Force Re-serve:** Press `Space` if the ball gets stuck or you want to restart the volley.
   * **Pause/Resume:** Press `P` to pause or resume the game.
   * **Mute Audio:** Press `M` to toggle sound effects.
   * **Cycle Difficulty:** Press `D` to change the AI's skill level (Easy, Medium, Hard, Impossible).
4. **Expandable Menu:**
   * Click the "Controls & Hotkeys" menu in the bottom-left corner to review the inputs at any time.

## 🕹️ Modern Mechanics & Visuals

* **Three Modes:** Play against a human, challenge the AI, or let the AI play itself.
* **Cyberpunk Aesthetic:** Toggle between the classic black-and-white look and the modern "Neon" theme featuring glowing paddles, motion blur trails, and a dynamic spark particle system.
* **AI Difficulty:** Four levels (Easy, Medium, Hard, Impossible) scale the AI's speed and target accuracy.
* **Speed Ramping:** Enable the "Ramp Speed" toggle to have the ball gradually accelerate during long volleys.
* **Anti-Stuck Physics:** Custom collision logic prevents the ball from getting trapped in infinite vertical loops by enforcing a minimum horizontal velocity.
* **Dynamic Resizing:** Game elements scale fluidly to any browser window size or iframe.

## 💻 Development

This game is built entirely with vanilla **JavaScript**, **HTML**, and **CSS** using the **HTML5 Canvas API** for high-performance rendering.

Key development aspects include:
* **Game Loop:** Managed using `requestAnimationFrame` for smooth rendering.
* **State Management:** Tracking game states (`start`, `playing`, `paused`, `gameOver`), UI themes, and difficulty settings dynamically.
* **Particle Engine:** A custom, physics-based spark system for visual feedback on paddle hits and scores.
* **AI Logic:** The AI uses a reactive tracking strategy modified by difficulty parameters (Speed Multiplier and Error Margin).
* **Modern UI:** CSS-driven overlays and interactive menus that sit cleanly above the canvas without interfering with gameplay.

## 🎉 Acknowledgements

A big thank you to GitHub Copilot for assisting in the initial 2024 development stages, and to the continuous iterative process that brought this game into its modern 2026 form! Enjoy playing!
