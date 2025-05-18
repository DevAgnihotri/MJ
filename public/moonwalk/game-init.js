document.addEventListener('DOMContentLoaded', function() {
  console.log('Moonwalk game initializing...');
  
  // Wait a short time for all scripts to load and process
  setTimeout(function() {
    // Try different initialization methods in order of preference
    
    // Method 1: Use the setupMoonwalkGame function from main-browser.js
    if (window.setupMoonwalkGame && typeof window.setupMoonwalkGame === 'function') {
      console.log('Starting moonwalk game using setupMoonwalkGame function');
      try {
        window.setupMoonwalkGame();
        return;
      } catch (e) {
        console.error('Error in setupMoonwalkGame:', e);
      }
    }
    
    // Method 2: Use the global initGame function
    if (window.initGame && typeof window.initGame === 'function') {
      console.log('Starting moonwalk game using global initGame function');
      try {
        window.initGame();
        return;
      } catch (e) {
        console.error('Error in initGame:', e);
      }
    }
    
    // Method 3: Use the gameInit function from init.js
    if (window.gameInit && typeof window.gameInit === 'function') {
      console.log('Starting moonwalk game using gameInit function');
      try {
        window.gameInit();
        return;
      } catch (e) {
        console.error('Error in gameInit:', e);
      }
    }
    
    // Fallback initialization
    console.log('Using fallback game initialization');
    
    // Initialize Kontra framework with the canvas if it exists
    if (typeof kontra !== 'undefined' && kontra.init) {
      kontra.init();
      
      // Define global variables if not already defined
      if (!window.audio) {
        if (window.loadGameAudio && typeof window.loadGameAudio === 'function') {
          window.loadGameAudio('AudioDashDefault.mp3', 'MoonwalkDefault.mp3');
        } else {
          window.audio = new Audio('AudioDashDefault.mp3');
        }
      }
      
      // Start the game loop if exists
      if (typeof kontra.gameLoop === 'function') {
        const loop = kontra.gameLoop({
          update: function() {
            // Update all active scenes
            if (window.scenes) {
              window.scenes.forEach(scene => {
                if (scene.active && typeof scene.update === 'function') scene.update();
              });
            }
          },
          render: function() {
            // Render all active scenes
            if (window.scenes) {
              window.scenes.forEach(scene => {
                if (scene.active && typeof scene.render === 'function') scene.render();
              });
            }
          }
        });
        
        // Start the game loop
        if (!loop.isStopped) {
          loop.stop();
        }
        loop.start();
      }
      
      // Initialize any menus if they exist
      if (window.menuScene && typeof window.menuScene.show === 'function') {
        console.log('Showing menu scene');
        setTimeout(() => window.menuScene.show(), 500);
      } else if (window.loadingScene && typeof window.loadingScene.show === 'function') {
        console.log('Showing loading scene');
        window.loadingScene.show();
      }
    } else {
      // If kontra framework isn't available, direct to simple version
      console.error('Game framework not found, redirecting to simple version');
      window.location.href = 'simple.html';
    }
  }, 500);
});
