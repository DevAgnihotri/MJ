# Development Guide

This document provides guidance on the code structure and how to make changes to the Moonwalk game.

## Project Structure

- `public/` - Static assets like audio files
- `src/` - Source code for the game
  - `main.js` - Entry point for the game
  - `globals.js` - Global variables and settings
  - `audio.js` - Audio processing and playback
  - `drawing.js` - Drawing utilities
  - `wavesurfer.js` - Audio waveform generation
  - `ship.js` - Player character logic
  - `scenes/` - Game scenes (menu, game, etc.)
  - `translations/` - Language files

## Adding Features

### New Game Modes

To add a new game mode:

1. Create a new scene file in `src/scenes/`
2. Import it in `src/scenes/index.js`
3. Add UI elements in `src/ui.js`
4. Update the menu scene to include the new mode

### Custom Audio Visualization

To create a new visualization style:

1. Modify the `getPeaks` function in `wavesurfer.js`
2. Update the drawing logic in `src/scenes/game.js`

### Adding Translations

1. Create a new JSON file in `src/translations/`
2. Follow the structure of existing translations
3. Add the new language option in `src/ui.js`

## Build Process

The project uses Vite for building:

- Development builds include source maps for easier debugging
- Production builds are minified and optimized

## Testing

To test the game locally:

1. Run `npm run dev`
2. Open your browser to `http://localhost:3000`
