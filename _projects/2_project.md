---
layout: page
title: Pong AI Test
description: An exploration of game development using JavaScript and Canvas, featuring the classic Pong game with both two-player and variable-difficulty AI modes.
img: assets/img/pongbasic.png # Make sure this path is correct
importance: 2
category: fun
giscus_comments: true
---

## Project Overview

This project began in June 2024 as an exploration into implementing Artificial Intelligence within the simple yet engaging framework of the classic game, Pong. It has evolved into a fully playable game featuring both **two-player** and **single-player vs. AI** modes, complete with adjustable AI difficulty. Built entirely with vanilla JavaScript and the HTML5 Canvas API, it demonstrates core game development concepts like rendering, physics, input handling, state management, and basic AI implementation.

The development process involved setting up the core mechanics, handling user input, implementing collision detection, adding audio-visual feedback, and finally, layering on the AI logic with different challenge levels.

## Play the Game!

Experience the classic Pong gameplay right here!

**Controls:**
* `W` / `S`: Move Left Paddle (Player 1)
* `ArrowUp` / `ArrowDown`: Move Right Paddle (Player 2, *only in Two-Player mode*)
* `M`: Switch between **Two-Player** and **Player vs AI** modes (resets game)
* `P`: Pause / Resume game
* `D`: Cycle AI Difficulty (Easy, Medium, Hard, Impossible - *only in AI mode*)
* `R`: Restart game (when "Game Over" is shown)

<div style="text-align: center; margin: 20px 0;">
  <iframe src="../pong_game/index.html" width="80%" height="500px" style="border:1px solid #ccc;">
    Your browser does not support iframes. Please access the game directly.
  </iframe>
</div>

## Core Game Development and Functionality

The foundation of this project is a faithful recreation of Pong, enhanced with modern features.

* **Technology:** Built using vanilla JavaScript and HTML5 Canvas.
* **Dynamic Resizing:** Adapts fluidly to browser window changes.
* **Game Elements:** Ball, two paddles (player-controlled or AI), center net.
* **Game Logic:**
    * **Movement:** Smooth `requestAnimationFrame` loop.
    * **Collision:** Ball bounces realistically off walls and paddles, with bounce angle affected by paddle impact location.
    * **Scoring:** First to 10 points wins. Score displayed on screen.
    * **State Management:** Handles 'playing', 'paused', and 'gameOver' states.
    * **Controls:** Keyboard inputs for paddles and game options (Mode, Pause, Difficulty, Reset). Includes prevention of default browser scrolling for arrow keys during gameplay.
* **Audio-Visual Feedback:** Hit and score sounds (`.wav`), star explosion effect on score.

<img src="/assets/img/pongbasic.png" alt="Pong Gameplay Screenshot" width="400" style="display: block; margin: 20px auto;"> ## AI Implementation and Difficulty

Fulfilling the project's original goal, a computer-controlled opponent has been implemented for the **right paddle** when playing in "Player vs AI" mode.

### AI Strategy

The AI employs a simple yet effective reactive strategy:
1.  It determines the ball's current vertical position (`ball.y`).
2.  It tries to move its paddle vertically to align its center with the ball's position.

### Difficulty Levels

To provide a balanced challenge, the AI's effectiveness can be adjusted using the `D` key, cycling through:
* **Easy:** AI is significantly slower and has a large random error margin in its targeting, making it prone to mistakes.
* **Medium:** AI is moderately fast with a noticeable error margin. Beatable with good shots.
* **Hard:** AI is quite fast with minimal error. Requires precise play to beat.
* **Impossible:** AI moves at maximum speed with perfect accuracy (no error margin), providing an extreme challenge.

Difficulty is adjusted by modifying two parameters:
1.  **Speed Multiplier:** A factor applied to the AI paddle's base speed (`dy`). Lower multipliers make the AI slower.
2.  **Error Margin:** A random vertical offset added to the AI's target position. Larger margins make the AI less accurate.

## Results (Current State)

The project successfully implements the classic Pong gameplay with significant enhancements:
* Functional two-player and single-player (vs. AI) modes.
* Adjustable AI difficulty providing scalable challenge.
* Responsive controls and smooth animations.
* Robust core mechanics (collision, scoring, state management).
* Adaptive display for various screen sizes.
* Clear on-screen information and audio-visual feedback.

## Future Work

Potential areas for future development include:
* Implementing a visual start menu or title screen.
* Adding a dedicated "Start" button control.
* Exploring more advanced AI, such as predicting the ball's trajectory.
* Enhancing visual effects or adding more sound variety.
* Introducing optional gameplay modifiers (e.g., ball speed increases during long rallies).

## Conclusion

The Pong AI Test project successfully evolved from an initial AI exploration concept into a complete and playable game. It demonstrates fundamental game development techniques using JavaScript and HTML5 Canvas, including rendering, physics simulation, input handling, state control, and the implementation of a basic, adjustable AI opponent. This project serves as a practical example of building an interactive application from the ground up and provides a fun, retro-inspired gaming experience.

Feel free to leave a comment below if you have any questions or feedback on the project!