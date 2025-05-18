// fallback.js - Fallback implementation for the moonwalk game
// This provides a simplified version if the main game fails to load

document.addEventListener('DOMContentLoaded', function() {
  // Only run this code if the game hasn't initialized properly
  setTimeout(function() {
    // Check if the game seems to be running already
    if (window.moonwalkGame && window.moonwalkGame.initialized) {
      console.log('Main game is running, fallback not needed');
      return;
    }
    
    if (window.gameRunning) {
      console.log('Game appears to be running, fallback not needed');
      return;
    }
    
    console.log('Game not detected, initializing fallback...');
    
    // Find the canvas
    const canvas = document.querySelector('canvas');
    const ctx = canvas && canvas.getContext('2d');
    
    if (!canvas || !ctx) {
      console.error('Could not find canvas element');
      return;
    }
    
    // Simple ship implementation
    const ship = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      direction: 1,
      speed: 2,
      color: '#1eff14',
      
      update: function() {
        // Move in current direction
        this.y += this.direction * this.speed;
        
        // Bounce at edges
        if (this.y < 50 || this.y > canvas.height - 50) {
          this.direction *= -1;
        }
      },
      
      render: function() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    
    // Simple audio waveform visualization
    const waveform = {
      bars: [],
      generateBars: function() {
        this.bars = [];
        const numBars = 50;
        const spacing = canvas.width / numBars;
        
        for (let i = 0; i < numBars; i++) {
          this.bars.push({
            x: i * spacing,
            height: Math.random() * canvas.height * 0.3 + 10,
            color: `rgb(${Math.random() * 100 + 100}, ${Math.random() * 150 + 100}, 255)`
          });
        }
      },
      
      update: function() {
        // Update bars occasionally
        if (Math.random() < 0.05) {
          this.generateBars();
        }
      },
      
      render: function() {
        for (let bar of this.bars) {
          ctx.fillStyle = bar.color;
          ctx.fillRect(bar.x, canvas.height / 2 - bar.height / 2, 5, bar.height);
        }
      }
    };
    
    // Generate initial bars
    waveform.generateBars();
    
    // Game loop
    function gameLoop() {
      // Clear canvas
      ctx.fillStyle = '#222';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and render waveform
      waveform.update();
      waveform.render();
      
      // Update and render ship
      ship.update();
      ship.render();
      
      // Show instructions
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('MOONWALK - Press SPACE to jump', canvas.width / 2, 50);
      
      // Continue loop
      requestAnimationFrame(gameLoop);
    }
    
    // Start game loop
    gameLoop();
    
    // Handle space bar
    document.addEventListener('keydown', function(e) {
      if (e.keyCode === 32) { // Space
        ship.direction *= -1;
        e.preventDefault();
      }
    });
    
    // Handle touch/click
    canvas.addEventListener('click', function() {
      ship.direction *= -1;
    });
    
    console.log('Fallback game initialized');
  }, 3000); // Give the main game some time to initialize first
});
