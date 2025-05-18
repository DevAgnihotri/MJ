// globals.js - Global variables for Moonwalk game
// Browser-compatible version (no modules)

//------------------------------------------------------------
// Global variables
//------------------------------------------------------------

// Initialize global variables
window.moonwalkGame = window.moonwalkGame || {};
const game = window.moonwalkGame;

// Set up constants and global variables after kontra is initialized
function initGlobals() {
  if (!window.kontra || !window.kontra.context) {
    console.error('Kontra not initialized. Call initGlobals() after kontra initialization.');
    return;
  }
  
  // Constants
  game.ctx = window.kontra.context;
  game.mid = window.kontra.canvas.height / 2;  // midpoint of the canvas
  game.waveWidth = 2;
  game.waveHeight = 215;
  game.maxLength = Math.floor(window.kontra.canvas.width / game.waveWidth) + 2; // maximum peaks on screen
  
  // Default options
  game.defaultOptions = {
    volume: 0.7,
    uiScale: 1,
    gameSpeed: 1,
    language: 'en',
    peaks: 1,
    casual: 0,
  };
  
  // Initialize options from stored user preferences if available
  game.options = game.options || Object.assign({}, game.defaultOptions);
  
  // Game state variables
  game.audio = game.audio || null;   // audio file for playing/pausing
  game.peaks = game.peaks || null;   // peak data of the audio file
  game.buffer = game.buffer || null; // audio buffer for processing
  game.context = game.context || null; // audio context for processing
  game.songName = game.songName || 'MoonwalkDefault.mp3';
  game.showTutorialBars = true;
  game.tutorialMoveInc = 0.15;
  game.startCombo = null;
  game.numUpdates = 0;
  game.ampBarHeight = 0;
}

// Call to initialize globals after DOM is loaded and kontra is ready
window.addEventListener('load', function() {
  // Wait a small amount of time to ensure kontra is loaded
  setTimeout(initGlobals, 100);
});
export let options = { ...defaultOptions };
export let touchPressed = false;
export let gamepad;
export let startCollide = false;
export let bestTime = 0;
export let isTutorial = true;
