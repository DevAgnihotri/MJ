// Game initialization script
// This handles the main setup for the Moonwalk game

// Global initialization function
window.gameInit = function() {
  console.log('Initializing Moonwalk game...');
  
  // Set up canvas and kontra
  if (typeof kontra === 'undefined') {
    console.error('Kontra framework is not loaded');
    return false;
  }
  
  // Initialize Kontra with canvas
  kontra.init();
  
  // Set up global variables
  window.options = window.options || {
    volume: 0.7,
    uiScale: 1,
    gameSpeed: 1,
    peaks: 12,
    casual: false,
    language: 'en'
  };
  
  // Start the game loop
  const gameLoop = kontra.gameLoop({
    update: function(dt) {
      // Update all scenes
      if (window.scenes && Array.isArray(window.scenes)) {
        window.scenes.forEach(scene => {
          if (scene.active && typeof scene.update === 'function') {
            scene.update(dt);
          }
        });
      }
    },
    
    render: function() {
      // Clear screen
      if (kontra.context) {
        kontra.context.clearRect(0, 0, kontra.canvas.width, kontra.canvas.height);
      }
      
      // Render all scenes
      if (window.scenes && Array.isArray(window.scenes)) {
        window.scenes.forEach(scene => {
          if (scene.active && typeof scene.render === 'function') {
            scene.render();
          }
        });
      }
    }
  });
  
  // Start the game loop
  if (gameLoop) {
    gameLoop.start();
    console.log('Game loop started');
  }
  
  return true;
};

// Auto-initialize if DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(window.gameInit, 100);
} else {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(window.gameInit, 100);
  });
}
