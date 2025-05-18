// ui-controls.js - Simple UI controls for the Moonwalk game
// This provides basic UI interaction handlers

// Initialize game namespace
window.moonwalkGame = window.moonwalkGame || {};
const game = window.moonwalkGame;

// Set up keyboard controls
function setupKeyboardControls() {
  // Space bar to jump/switch sides
  document.addEventListener('keydown', function(event) {
    if (event.keyCode === 32) { // Space bar
      handleJump();
      event.preventDefault();
    }
    
    if (event.keyCode === 13) { // Enter key
      handlePause();
      event.preventDefault();
    }
    
    if (event.keyCode === 27) { // Escape key
      handleEscape();
      event.preventDefault();
    }
  });
}

// Set up touch/click controls
function setupTouchControls() {
  // Canvas click/touch for jumping
  const canvas = document.querySelector('canvas');
  if (canvas) {
    canvas.addEventListener('click', function(event) {
      handleJump();
    });
    
    canvas.addEventListener('touchstart', function(event) {
      handleJump();
      event.preventDefault();
    }, { passive: false });
  }
}

// Jump/switch sides handler
function handleJump() {
  console.log("Jump/switch sides triggered");
  if (game.ship && typeof game.ship.toggle === 'function') {
    game.ship.toggle();
  }
}

// Pause handler
function handlePause() {
  console.log("Pause/resume triggered");
  if (game.audio) {
    if (game.audio.paused) {
      game.audio.play();
    } else {
      game.audio.pause();
    }
  }
}

// Escape handler
function handleEscape() {
  console.log("Escape triggered");
  // Show menu if in game
  if (window.gameScene && window.gameScene.active && window.menuScene) {
    if (game.audio) {
      game.audio.pause();
    }
    window.gameScene.hide(function() {
      window.menuScene.show();
    });
  }
}

// Set up all controls
function setupControls() {
  setupKeyboardControls();
  setupTouchControls();
  console.log("UI controls initialized");
}

// Run setup when document is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(setupControls, 1000);
} else {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(setupControls, 1000);
  });
}

// Make functions available globally
game.setupControls = setupControls;
game.handleJump = handleJump;
game.handlePause = handlePause;
