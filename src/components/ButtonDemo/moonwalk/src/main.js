// main.js - Entry point for Moonwalk game
import './kontra.js';
import './globals.js';
import './audio.js';
import './drawing.js';
import './input.js';
import './random.js';
import './ship.js';
import './time.js';
import './ui.js';
import './wavesurfer.js';
import './loop.js';
import './scenes/index.js';
import { setFontMeasurement } from './font.js';
import { getBestTime } from './time.js';
import { fetchAudio } from './audio.js';

async function main() {
  // Initialize the canvas and context
  window.kontra.init();
  
  setFontMeasurement();
  getBestTime();
  
  // Import scene references
  const { loadingScene, menuScene } = await import('./scenes/index.js');
  const { startBtn } = await import('./ui.js');
  
  loadingScene.show();
  // music from https://opengameart.org/content/adventure-theme
  await fetchAudio('MoonwalkDefault.mp3');
  loadingScene.hide(() => {
    menuScene.show(() => startBtn.focus());
  });
}

// Start the game
main();
