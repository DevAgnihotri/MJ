// ship.js - Ship object for Moonwalk game
// This handles the player's ship behavior

// Initialize game namespace
window.moonwalkGame = window.moonwalkGame || {};
const game = window.moonwalkGame;

// Ship constructor
function createShip() {
  // Make sure kontra is available
  if (!window.kontra) {
    console.error('Kontra not available for ship creation');
    return null;
  }
  
  // Get canvas height (for positioning)
  const canvas = window.kontra.canvas;
  const ctx = window.kontra.context;
  
  if (!canvas || !ctx) {
    console.error('Canvas or context not available');
    return null;
  }
  
  // Calculate midpoint for ship positioning
  const mid = canvas.height / 2;
  
  // Create the ship object
  const ship = {
    // Ship properties
    x: canvas.width / 2,
    y: mid,
    width: 20,
    height: 20,
    speed: 10,
    color: '#1eff14', // Neon green color
    direction: 1,  // 1 = down, -1 = up
    points: [],    // Trail points
    maxTrailLength: 10,
    
    // Toggle the ship's position (above/below the line)
    toggle: function() {
      this.direction *= -1;
      
      // Add current position to points trail
      this.addPoint();
    },
    
    // Add current position to points trail
    addPoint: function() {
      this.points.push({
        x: this.x,
        y: this.y
      });
      
      // Limit trail length
      if (this.points.length > this.maxTrailLength) {
        this.points.shift();
      }
    },
    
    // Update ship position
    update: function(dt) {
      // Move the ship based on direction and speed
      if (this.direction === 1 && this.y < mid + 100) {
        this.y += this.speed;
      } else if (this.direction === -1 && this.y > mid - 100) {
        this.y -= this.speed;
      }
      
      // Add points to trail occasionally
      if (Math.random() < 0.1) {
        this.addPoint();
      }
    },
    
    // Draw the ship
    render: function() {
      if (!ctx) return;
      
      // Draw trail
      if (this.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        
        for (let i = 1; i < this.points.length; i++) {
          ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = 'rgba(30, 255, 20, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Draw ship
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw direction indicator
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + 15, this.y + (this.direction * 10));
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 3;
      ctx.stroke();
    },
    
    // Check collision with wave bar
    checkCollision: function(barX, barY, barWidth, barHeight) {
      // Simple bounding box collision
      return (
        this.x < barX + barWidth &&
        this.x + this.width > barX &&
        this.y < barY + barHeight &&
        this.y + this.height > barY
      );
    }
  };
  
  return ship;
}

// Create ship and add to game namespace
game.createShip = createShip;

// Create ship instance when document is ready
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    game.ship = createShip();
    
    // Make ship available globally for backward compatibility
    window.ship = game.ship;
  }, 500);
});
