// Non-module version of scenes index for browser compatibility
// This makes the scene functionality available globally

//------------------------------------------------------------
// Scene Management
//------------------------------------------------------------

// Initialize global arrays to track scenes
window.scenes = window.scenes || [];
window.activeScenes = window.activeScenes || [];
window.fadeTime = 300;
window.focusedBtn = null;

// Global scene creator function
window.Scene = function(name) {
  // Create DOM element to hold scene DOM elements for screen readers
  // This lets us hide the parent element and not each child, which caused lag
  const sceneEl = document.createElement('div');
  sceneEl.hidden = true;
  
  // Find the UI scenes container
  const uiScenes = document.getElementById('uiScenes');
  if (uiScenes) {
    uiScenes.appendChild(sceneEl);
  } else {
    console.warn('UI scenes container not found');
    document.body.appendChild(sceneEl);
  }

  let scene = {
    name: name,
    alpha: 0,
    active: false,
    children: [],
    inc: 0.05,
    isHidding: false,
    domElement: sceneEl,

    // Create fade in/out transitions when hiding and showing scenes
    hide: function(cb) {
      if (window.focusedBtn) window.focusedBtn.blur();

      this.isHidding = true;
      sceneEl.hidden = true;
      this.alpha = 1;
      this.inc = -0.05;
      setTimeout(() => {
        this.isHidding = false;
        this.active = false;
        if (window.activeScenes) {
          const index = window.activeScenes.indexOf(this);
          if (index !== -1) {
            window.activeScenes.splice(index, 1);
          }
        }
        if (cb && typeof cb === 'function') cb();
      }, window.fadeTime || 300);
    },
    
    show: function(cb) {
      this.active = true;
      sceneEl.hidden = false;
      if (window.activeScenes) {
        window.activeScenes.push(this);
      }
      this.alpha = 0;
      this.inc = 0.05;
      setTimeout(() => {
        if (this.onShow && typeof this.onShow === 'function') this.onShow();
        if (cb && typeof cb === 'function') cb();
      }, window.fadeTime || 300);
    },
    
    add: function() {
      for (let i = 0; i < arguments.length; i++) {
        let child = arguments[i];
        this.children.push(child);
        
        // Add DOM element if available
        if (child.domEl) {
          sceneEl.appendChild(child.domEl);
        }
      }
      return this;
    },
    
    update: function() {
      if (!this.active) return;
      
      this.alpha += this.inc;
      if (this.alpha > 1) this.alpha = 1;
      if (this.alpha < 0) this.alpha = 0;
      
      // Update children
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i];
        if (child.update) {
          child.update();
        }
      }
    },
    
    render: function() {
      if (!this.active) return;
      
      // Render children
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i];
        if (child.render) {
          child.render(this.alpha);
        }
      }
    }
  };

  // Register scene globally
  if (window.scenes) {
    window.scenes.push(scene);
  }
  
  return scene;
};

// Create basic scenes that most games will need
window.loadingScene = window.Scene('loading');
window.menuScene = window.Scene('menu');
window.gameScene = window.Scene('game');
window.gameOverScene = window.Scene('gameOver');
window.winScene = window.Scene('win');
window.tutorialScene = window.Scene('tutorial');
window.optionsScene = window.Scene('options');
