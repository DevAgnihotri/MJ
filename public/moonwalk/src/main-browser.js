// main-browser.js - Non-module version for browser compatibility
// This replaces the ES module imports with direct usage of globals

// Initialize game namespace
window.moonwalkGame = window.moonwalkGame || {};
const game = window.moonwalkGame;

// Main setup function for the game
function setupMoonwalkGame() {
  console.log("Setting up Moonwalk Game...");
  
  // Initialize the canvas and context if needed
  if (window.kontra && !kontra.context) {
    window.kontra.init();
    console.log("Kontra initialized");
  }
  
  // Set up font measurement if function exists
  if (typeof setFontMeasurement === 'function') {
    try {
      setFontMeasurement();
      console.log("Font measurement set");
    } catch (e) {
      console.error("Error setting font measurement:", e);
    }
  }
  
  // Get best time if function exists
  if (typeof getBestTime === 'function') {
    try {
      getBestTime();
      console.log("Best time retrieved");
    } catch (e) {
      console.error("Error getting best time:", e);
    }
  }
  
  // Set up UI components if they exist
  setupUIComponents();
  
  // Load audio for the game
  loadGameAudio();
}

// Set up UI components
function setupUIComponents() {
  // Get references to scene objects from either global or game namespace
  const loadingScene = window.loadingScene || game.loadingScene;
  const menuScene = window.menuScene || game.menuScene;
  const startBtn = window.startBtn || game.startBtn;
  
  if (loadingScene && typeof loadingScene.show === 'function') {
    console.log("UI components initialized");
  } else {
    console.warn("Some UI components are missing");
  }
}

// Load audio for the game
function loadGameAudio() {
  // Check if audio is already loading or loaded
  if (game.audio && game.audio.readyState > 0) {
    console.log("Audio already loading/loaded");
    return;
  }
  
  // Use the loadGameAudio function if available
  if (typeof game.loadGameAudio === 'function') {
    console.log("Loading audio using loadGameAudio function");
    game.loadGameAudio('AudioDashDefault.mp3', 'MoonwalkDefault.mp3')
      .then(function(audio) {
        console.log("Audio loaded successfully");
      })
      .catch(function(error) {
        console.error("Failed to load audio:", error);
      });
  } else {
    console.log("Loading audio directly");
    // Direct audio loading
    const audioElement = new Audio('AudioDashDefault.mp3');
    
    audioElement.addEventListener('canplaythrough', function onCanPlay() {
      console.log("Audio loaded successfully");
      
      if (game.audioContext) {
        try {
          const source = game.audioContext.createMediaElementSource(audioElement);
          source.connect(game.audioContext.destination);
        } catch (e) {
          console.error("Error connecting audio to context:", e);
        }
      }
      
      game.audio = audioElement;
      window.audio = audioElement; // For backward compatibility
      
      audioElement.removeEventListener('canplaythrough', onCanPlay);
    });
    
    audioElement.addEventListener('error', function(e) {
      console.error("Audio error:", e);
      // Try fallback audio
      audioElement.src = 'MoonwalkDefault.mp3';
      audioElement.load();
    });
    
    audioElement.load();
  }
}

// Make function available globally
window.setupMoonwalkGame = setupMoonwalkGame;

// Run setup when document is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(setupMoonwalkGame, 500);
} else {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(setupMoonwalkGame, 500);
  });
}
