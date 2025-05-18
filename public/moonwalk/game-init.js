/**
 * Moonwalk Game Initialization Script
 * Handles the initialization and bootstrapping of the moonwalk game
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Moonwalk game initializing...');
  
  // Initialize game namespace
  window.moonwalkGame = window.moonwalkGame || {};
  const game = window.moonwalkGame;
  game.initialized = false;
  
  // Track initialization attempts
  let initAttempts = 0;
  const maxAttempts = 3;
  
  // Main initialization function
  function initGame() {
    try {
      initAttempts++;
      console.log(`Initializing Moonwalk game (attempt ${initAttempts})...`);
      
      // Make sure Kontra exists
      if (typeof window.kontra === 'undefined') {
        throw new Error('Kontra framework not found');
      }
      
      // Initialize Kontra with the canvas
      try {
        window.kontra.init();
        console.log('Kontra initialized with canvas');
      } catch (e) {
        console.warn('Note: Kontra may already be initialized');
      }
      
      // Initialize global variables
      if (typeof game.ctx === 'undefined' && window.kontra.context) {
        game.ctx = window.kontra.context;
      }
      
      // Make sure we have a canvas and context
      if (!window.kontra.canvas || !window.kontra.context) {
        throw new Error('Canvas or context not available');
      }
      
      // Create game loop
      game.loop = window.kontra.gameLoop({
        update: function(dt) {
          // Update active scenes
          if (window.scenes && Array.isArray(window.scenes)) {
            window.scenes.forEach(scene => {
              if (scene && scene.active && typeof scene.update === 'function') {
                scene.update(dt);
              }
            });
          }
        },
        render: function() {
          // Clear canvas
          if (window.kontra.context) {
            window.kontra.context.clearRect(0, 0, window.kontra.canvas.width, window.kontra.canvas.height);
          }
          
          // Render active scenes
          if (window.scenes && Array.isArray(window.scenes)) {
            window.scenes.forEach(scene => {
              if (scene && scene.active && typeof scene.render === 'function') {
                scene.render();
              }
            });
          }
        }
      });
      
      // Start game loop
      if (game.loop && game.loop.isStopped) {
        console.log('Starting game loop');
        game.loop.start();
      }
      
      console.log('Initializing audio...');
      
      // Initialize audio with fallbacks
      if (!game.audio) {
        if (typeof game.loadGameAudio === 'function') {
          game.loadGameAudio('AudioDashDefault.mp3', 'MoonwalkDefault.mp3')
            .then(function(audio) {
              game.audio = audio;
              initializeScenes();
            })
            .catch(function(err) {
              console.error('Error loading audio:', err);
              initializeScenes();  // Continue without audio
            });
        } else {
          // Simple audio initialization
          game.audio = new Audio('AudioDashDefault.mp3');
          game.audio.addEventListener('error', function() {
            game.audio.src = 'MoonwalkDefault.mp3';
          });
          initializeScenes();
        }
      } else {
        initializeScenes();
      }
      
      // Mark as initialized
      game.initialized = true;
      return true;
      
    } catch (error) {
      console.error('Error during game initialization:', error);
      
      // Try again if we haven't reached max attempts
      if (initAttempts < maxAttempts) {
        console.log(`Retrying initialization in 500ms (attempt ${initAttempts + 1}/${maxAttempts})...`);
        setTimeout(initGame, 500);
        return false;
      } else {
        // Give up and redirect to simple version
        console.error('Failed to initialize game after multiple attempts');
        setTimeout(function() {
          window.location.href = 'simple.html';
        }, 1000);
        return false;
      }
    }
  }
  
  // Initialize game scenes
  function initializeScenes() {
    console.log('Initializing scenes...');
    
    // Show loading scene first
    if (window.loadingScene && typeof window.loadingScene.show === 'function') {
      window.loadingScene.show();
      
      // Give some time for assets to load, then show menu
      setTimeout(function() {
        window.loadingScene.hide();
        if (window.menuScene && typeof window.menuScene.show === 'function') {
          window.menuScene.show();
        }
      }, 2000);
    } 
    // Directly show menu if no loading scene
    else if (window.menuScene && typeof window.menuScene.show === 'function') {
      window.menuScene.show();
    }
    
    console.log('Moonwalk game initialization complete!');
    
    // Flag that game is running
    window.gameRunning = true;
  }
  
  // Start initialization after a short delay
  setTimeout(initGame, 500);
});
