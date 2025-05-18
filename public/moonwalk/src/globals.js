// globals.js - Global variables for Moonwalk game
import './kontra.js';

//------------------------------------------------------------
// Global variables
//------------------------------------------------------------
export const ctx = window.kontra.context;
export const mid = window.kontra.canvas.height / 2;  // midpoint of the canvas
export const waveWidth = 2;
export const waveHeight = 215;
export const maxLength = Math.floor(window.kontra.canvas.width / waveWidth) + 2; // maximum number of peaks to show on screen
export const defaultOptions = {
  volume: 1,
  uiScale: 1,
  gameSpeed: 1,
  language: 'en',
  peaks: 1,
  casual: 0,
};

// Variables that will be modified throughout the game
export let audio;  // audio file for playing/pausing
export let peaks;  // peak data of the audio file
export let buffer;  // audio buffer for processing
export let context; // audio context for processing
export let songName = 'MoonwalkDefault.mp3';
export let showTutorialBars = true;
export let tutorialMoveInc = 0.15;
export let startCombo;
export let numUpdates = 0;
export let ampBarHeight = 0;
export let options = { ...defaultOptions };
export let touchPressed = false;
export let gamepad;
export let startCollide = false;
export let bestTime = 0;
export let isTutorial = true;
