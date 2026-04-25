---
layout: page
title: Pong AI Test - Neon Edition
description: A 2026 modernization of the classic Pong game built with JavaScript and Canvas, featuring a new Synthwave aesthetic, an AI vs AI autoplay mode, and dynamic particle effects.
img: assets/img/pongmodern.png
importance: 2
category: fun
giscus_comments: true
---

## Project Overview

This project began in June 2024 as an exploration into implementing Artificial Intelligence within the simple yet engaging framework of the classic game, Pong. In **April 2026**, the project received a massive visual and mechanical overhaul, transforming it into a "Modern Neon Edition." 

What started as a basic two-player game has evolved into a fully featured web experience featuring **three modes** (Two-Player, Player vs AI, and an autoplaying AI vs AI mode), a toggleable Cyberpunk/Synthwave aesthetic, an advanced particle engine, and polished game mechanics. Built entirely with vanilla JavaScript and the HTML5 Canvas API, it demonstrates core game development concepts like rendering, physics, state management, and AI implementation without relying on external game engines.

## Play the Game!

Experience the modernized Pong gameplay right here!

<div style="text-align: center; margin: 20px 0; position: relative;">
  <iframe src="../pong_game/index.html" width="100%" height="600px" style="border: 2px solid #05d9e8; border-radius: 8px; box-shadow: 0 0 15px rgba(5, 217, 232, 0.5);">
    Your browser does not support iframes. Please access the game directly.
  </iframe>
</div>

**Controls & Features:**
* `W` / `S`: Move Left Paddle
* `↑` / `↓`: Move Right Paddle
* `Space`: Force Re-serve (if the ball gets stuck)
* **Expandable Menu:** A sleek UI overlay in the bottom-left corner lets you view all hotkeys.
* **Toggles:** Use the top-right overlay to switch modes, cycle AI difficulty (`D`), toggle the modern/classic theme, mute audio (`M`), or enable speed ramping!

## Core Game Mechanics & Modern Polish

The foundation of this project remains a faithful recreation of Pong, but the April 2026 update added a layer of modern "game juice":

Old:
{% include figure.liquid loading="eager" path="assets/img/pongbasic.png" title="Pong Gameplay Screenshot" class="img-fluid rounded z-depth-1" width="400px" %}

New:
{% include figure.liquid loading="eager" path="assets/img/pongmodern.png" title="Pong Gameplay Screenshot" class="img-fluid rounded z-depth-1" width="400px" %}

* **Technology:** Vanilla HTML, CSS, and JavaScript using the HTML5 Canvas API.
* **Visual Upgrades:**
    * **Neon Glow & Motion Blur:** The paddles and ball emit a neon glow using canvas `shadowBlur`, and a motion trail follows the ball by blending the background each frame.
    * **Particle Engine:** A physics-based spark system erupts when the ball strikes a paddle or scores a point, dynamically matching the color of the winning paddle.
    * **Classic Mode:** Purists can instantly switch back to the original black-and-white aesthetic using the Theme toggle.
* **Game Logic & Physics:**
    * **Speed Ramping:** An optional toggle allows the ball to gradually accelerate during long volleys, increasing tension.
    * **Anti-Stuck Physics:** New collision logic ensures the ball maintains a minimum horizontal velocity, preventing it from getting trapped in an infinite vertical bounce loop.
    * **Dynamic Resizing:** The game and all UI elements scale fluidly to any browser window or iframe size.


## AI Implementation and Difficulty

A core feature is the computer-controlled opponent, which can be played against or set to play against itself (perfect for a background portfolio showcase).

### AI Strategy

The AI employs a reactive tracking strategy:
1. It determines the ball's current vertical position.
2. It moves its paddle to align its center with the ball.
3. *Prediction:* It optimizes movement by only actively tracking the ball when it is moving towards the AI's side of the court.

### Scalable Difficulty

The AI's effectiveness can be adjusted using the `D` key or the top UI overlay, cycling through:
* **Easy:** AI is significantly slower with a large random error margin in its targeting.
* **Medium:** Moderately fast with a noticeable error margin. Beatable with good shots.
* **Hard:** Quite fast with minimal error. Requires precise play to beat.
* **Impossible:** Moves at maximum speed with perfect accuracy.

Difficulty is controlled mathematically by modifying a **Speed Multiplier** (altering the paddle's base speed) and an **Error Margin** (a random vertical offset added to the AI's target destination).

## Results (Current State)

The project successfully implements a highly polished, interactive experience with significant enhancements over its 2024 version:
* A stunning Cyberpunk/Synthwave visual mode.
* Functional Two-Player, Player vs. AI, and AI vs. AI modes.
* Interactive UI overlays for settings and controls without pausing the action.
* Adaptive display for various screen sizes, making it perfect for embedding.
* Robust mechanics with automated fixes for edge cases (like getting stuck).

## Conclusion

The Pong AI Test project successfully evolved from an initial exploration into a complete, modernized game. It demonstrates fundamental game development techniques using vanilla JavaScript—including advanced canvas rendering, physics simulation, state control, and the implementation of an adjustable AI opponent. This project serves as a fun, retro-inspired experience that proves you don't need a heavy game engine to create something visually engaging and highly playable on the web.

Feel free to leave a comment below if you have any questions or feedback on the project!