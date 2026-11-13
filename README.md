# 🍉 Kill the Fruit

A small fruit-slicing game built with Vanilla JavaScript and HTML Canvas.

The project started as an experiment with Canvas-based game development and gradually grew to include hand tracking using MediaPipe.

## Features

- **Fruit slicing:** Slice fruits by moving your mouse across the canvas.
- **Hand tracking:** Use your index finger to slice fruits through your camera.
- **Particle effects:** Fruits produce particles when sliced.
- **Score tracking:** Keep track of your score and best score.

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- HTML Canvas
- [MediaPipe Tasks Vision](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker)

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Myra-Qi/kill-the-fruit.git
cd kill-the-fruit
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

## Hand Tracking

The game uses MediaPipe Hand Landmarker to detect hand landmarks through the browser camera.

Currently, the index fingertip is used as the input point for slicing fruits.

Camera access requires browser permission and a secure context (HTTPS or localhost).

Hand tracking is still experimental and may not work perfectly in every environment.

## Development Status

**Work in Progress.**

This is a personal learning project. I'm still experimenting with game mechanics, hand tracking, performance, and mobile browser compatibility.

Features and implementation may change as development continues.

## License

No license has been specified yet.