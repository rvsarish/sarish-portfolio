# Sarish R V — Portfolio

A frontend-only personal portfolio built from the content in Sarish's GitHub profile README.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```sh
npm run build
npm run preview
```

Deploy the generated `dist/` directory to any static hosting provider.

## Stack

- React + Vite
- React Three Fiber + Three.js
- Plain CSS with responsive layouts and reduced-motion support

## Graphics and resilience

- Two interactive 3D experiences: the hero payment network and a four-stage transaction system map
- A five-step precedence mental map explaining the path from impact and context through evidence, validation, and learning
- Pointer, touch, and keyboard controls with reduced-motion alternatives
- Responsive cameras and layouts from 320px mobile screens through large desktops
- Scene rendering pauses offscreen and while the page is hidden
- Lazy-loaded 3D modules keep the main application bundle lightweight
- Designed loading and fallback states for failed downloads, unavailable WebGL, and lost graphics contexts
- Keyboard-safe mobile navigation with Escape handling and short-screen scrolling

No backend, API keys, or environment variables are required.
