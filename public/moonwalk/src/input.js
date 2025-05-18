// input.js - Basic input handling for Moonwalk game

// Initialize keyboard input
const initializeInput = () => {
  // Use kontra's key bindings
  kontra.keys.bind('space', () => {
    // Jump action
  });
  
  kontra.keys.bind('left', () => {
    // Move left
  });
  
  kontra.keys.bind('right', () => {
    // Move right
  });
};

// Export functions
export { initializeInput };
