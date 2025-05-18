// ship.js - Player ship logic for Moonwalk game

// Ship class extending kontra.sprite
const createShip = (x, y) => {
  return kontra.sprite({
    x: x || kontra.canvas.width / 2,
    y: y || kontra.canvas.height - 50,
    width: 20,
    height: 20,
    color: 'white',
    dx: 0,
    speed: 3,
    
    // Update the ship position
    update() {
      // Handle input
      if (kontra.keys.pressed('left')) {
        this.dx = -this.speed;
      } 
      else if (kontra.keys.pressed('right')) {
        this.dx = this.speed;
      } 
      else {
        this.dx = 0;
      }
      
      // Update position
      this.x += this.dx;
      
      // Keep ship within bounds
      if (this.x < 0) {
        this.x = 0;
      } 
      else if (this.x + this.width > kontra.canvas.width) {
        this.x = kontra.canvas.width - this.width;
      }
    },
    
    // Draw the ship
    render() {
      this.context.fillStyle = this.color;
      this.context.fillRect(this.x, this.y, this.width, this.height);
      
      // Draw ship details
      this.context.fillRect(this.x + this.width / 2 - 5, this.y - 5, 10, 5);
    }
  });
};

// Export functions
export { createShip };
