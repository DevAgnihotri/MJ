// MoonColor - MJ Themed Color Palette Generator
// Created for the award-winning-website

document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const generateBtn = document.getElementById('generate-palette');
  const colorBoxes = document.querySelectorAll('.color-box');
  const copyBtns = document.querySelectorAll('.copy-btn');
  const notification = document.getElementById('notification');
  const modeButtons = document.querySelectorAll('.mode-btn');
  const paletteTheme = document.getElementById('palette-theme');
  const savedPalettesContainer = document.getElementById('saved-palettes');
  const musicToggle = document.getElementById('music-toggle');
  const bgMusic = document.getElementById('bg-music');
  const visualizerContainer = document.querySelector('.visualizer-container');
  
  // Globals
  let currentMode = 'random';
  let savedPalettes = JSON.parse(localStorage.getItem('mjPalettes')) || [];
  
  // MJ Icon Colors
  const mjIconicColors = {
    thriller: ['#ff0000', '#000000', '#ff7700', '#4d0000', '#ffcc00'],
    billie_jean: ['#01049e', '#d4af37', '#000000', '#ffffff', '#220054'],
    bad: ['#000000', '#ffffff', '#222222', '#dddddd', '#888888'],
    dangerous: ['#d4af37', '#000000', '#e3000b', '#ffffff', '#4d0000'],
    smooth_criminal: ['#ffffff', '#000080', '#c0c0c0', '#000000', '#0000ff'],
    beat_it: ['#ff0000', '#000000', '#ff3030', '#333333', '#a30000'],
    this_is_it: ['#d4af37', '#000000', '#ffffff', '#c0c0c0', '#4a3c0f']
  };
  
  // MJ Album Inspired Colors
  const mjAlbumColors = {
    off_the_wall: ['#7e3f98', '#f8c55d', '#ec008c', '#000000', '#ffffff'],
    thriller: ['#e3000b', '#000000', '#ffcc00', '#4d0000', '#ffffff'],
    bad: ['#000000', '#ffffff', '#373737', '#d9d9d9', '#888888'],
    dangerous: ['#d4af37', '#000000', '#ffffff', '#a52a2a', '#e3000b'],
    history: ['#c0c0c0', '#000000', '#ffffff', '#808080', '#404040'],
    invincible: ['#0000ff', '#f5f5f5', '#000080', '#000000', '#c0c0c0']
  };
  
  // Color Name Mapping (for better theme descriptions)
  const colorNames = {
    '#ff0000': 'Red',
    '#e3000b': 'MJ Red',
    '#000000': 'Black',
    '#ffffff': 'White',
    '#d4af37': 'Gold',
    '#c0c0c0': 'Silver',
    '#ff7700': 'Orange',
    '#ffcc00': 'Yellow',
    '#01049e': 'Blue',
    '#0000ff': 'Bright Blue',
    '#000080': 'Navy Blue',
    '#7e3f98': 'Purple',
    '#ec008c': 'Pink',
    '#a52a2a': 'Brown',
    '#808080': 'Gray',
    '#4d0000': 'Dark Red',
    '#220054': 'Deep Purple'
  };
  
  // Initialize
  renderSavedPalettes();
  setDefaultPalette();
  
  // Event Listeners
  generateBtn.addEventListener('click', generatePalette);
  
  copyBtns.forEach(btn => {
    btn.addEventListener('click', copyColorToClipboard);
  });
  
  modeButtons.forEach(btn => {
    btn.addEventListener('click', changeMode);
  });
  
  musicToggle.addEventListener('click', toggleMusic);
  
  // Functions
  function generatePalette() {
    let palette = [];
    
    if (currentMode === 'random') {
      palette = generateRandomColors(5);
      paletteTheme.textContent = 'Random colors inspired by the King of Pop!';
    } 
    else if (currentMode === 'iconic') {
      const iconicOptions = Object.keys(mjIconicColors);
      const selectedTheme = iconicOptions[Math.floor(Math.random() * iconicOptions.length)];
      palette = mjIconicColors[selectedTheme];
      paletteTheme.textContent = `Inspired by MJ's iconic "${selectedTheme.replace('_', ' ').toUpperCase()}" look.`;
    } 
    else if (currentMode === 'album') {
      const albumOptions = Object.keys(mjAlbumColors);
      const selectedAlbum = albumOptions[Math.floor(Math.random() * albumOptions.length)];
      palette = mjAlbumColors[selectedAlbum];
      paletteTheme.textContent = `Colors inspired by the "${selectedAlbum.replace('_', ' ').toUpperCase()}" album.`;
    }
    
    // Apply colors to boxes
    colorBoxes.forEach((box, index) => {
      const colorPreview = box.querySelector('.color-preview');
      const colorHex = box.querySelector('.color-hex');
      
      colorPreview.style.backgroundColor = palette[index];
      colorHex.textContent = palette[index].toUpperCase();
      
      // Add fancy entrance animation
      box.classList.add('animate__animated', 'animate__fadeIn');
      setTimeout(() => {
        box.classList.remove('animate__animated', 'animate__fadeIn');
      }, 1000);
    });
    
    // Save palette
    savePalette(palette);
    
    // Add sparkle animation
    addSparkleEffect();
  }
  
  function generateRandomColors(count) {
    const mjTones = [
      // Red tones (MJ's iconic color)
      '#ff0000', '#e3000b', '#cc0000', '#990000', '#800000', '#4d0000',
      // Golds and whites (stage outfit colors)
      '#d4af37', '#ffd700', '#ffffff', '#f5f5f5', '#e0e0e0',
      // Blues (important in MJ visuals)
      '#00bfff', '#0000ff', '#000080', '#4169e1',
      // Blacks (essential MJ)
      '#000000', '#222222', '#333333',
      // Other accent colors from MJ's visuals
      '#800080', '#7e3f98', '#ec008c', '#ff69b4'
    ];
    
    let palette = [];
    
    for (let i = 0; i < count; i++) {
      if (Math.random() > 0.7) {
        // Sometimes use an MJ-associated color
        palette.push(mjTones[Math.floor(Math.random() * mjTones.length)]);
      } else {
        // Otherwise generate a completely random color
        const color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        palette.push(color);
      }
    }
    
    return palette;
  }
  
  function copyColorToClipboard(event) {
    const colorBox = event.target.closest('.color-box');
    const colorHex = colorBox.querySelector('.color-hex').textContent;
    
    navigator.clipboard.writeText(colorHex).then(() => {
      showNotification(`Copied ${colorHex} to clipboard!`);
      
      // Add sparkle effect to the specific box
      const sparkleContainer = colorBox.querySelector('.sparkle-container');
      createSparklesInContainer(sparkleContainer);
    });
  }
  
  function showNotification(message) {
    const notificationMessage = document.querySelector('.notification-message');
    notificationMessage.textContent = message;
    
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 2000);
  }
  
  function changeMode(event) {
    modeButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    currentMode = event.target.dataset.mode;
    
    // Update music based on mode
    updateMusicForMode();
  }
  
  function updateMusicForMode() {
    let songTitle = 'Beat It';
    
    if (currentMode === 'iconic') {
      bgMusic.src = '../audio/Beat_It.mp3';
      songTitle = 'Beat It';
    } 
    else if (currentMode === 'album') {
      bgMusic.src = '../audio/Dangerous.mp3';
      songTitle = 'Dangerous';
    }
    else {
      bgMusic.src = '../audio/Smooth_Criminal.mp3';
      songTitle = 'Smooth Criminal';
    }
    
    musicToggle.textContent = `🎵 Play ${songTitle}`;
    
    if (!bgMusic.paused) {
      bgMusic.play();
    }
  }
  
  function toggleMusic() {
    if (bgMusic.paused) {
      bgMusic.currentTime = 80; // Skip intros
      bgMusic.play();
      musicToggle.textContent = `❚❚ ${musicToggle.textContent.split(' ')[1]} ${musicToggle.textContent.split(' ')[2]}`;
      visualizerContainer.classList.add('visualizer-active');
    } else {
      bgMusic.pause();
      musicToggle.textContent = `🎵 Play ${musicToggle.textContent.split(' ')[2]}`;
      visualizerContainer.classList.remove('visualizer-active');
    }
  }
  
  function savePalette(palette) {
    // Only store the last 10 palettes
    if (savedPalettes.length >= 10) {
      savedPalettes.shift();
    }
    
    savedPalettes.push(palette);
    localStorage.setItem('mjPalettes', JSON.stringify(savedPalettes));
    
    renderSavedPalettes();
  }
  
  function renderSavedPalettes() {
    savedPalettesContainer.innerHTML = '';
    
    savedPalettes.forEach((palette, paletteIndex) => {
      const paletteElement = document.createElement('div');
      paletteElement.classList.add('saved-palette');
      paletteElement.dataset.index = paletteIndex;
      
      palette.forEach(color => {
        const colorElement = document.createElement('div');
        colorElement.classList.add('saved-color');
        colorElement.style.backgroundColor = color;
        paletteElement.appendChild(colorElement);
      });
      
      paletteElement.addEventListener('click', () => {
        applySavedPalette(palette);
      });
      
      savedPalettesContainer.appendChild(paletteElement);
    });
  }
  
  function applySavedPalette(palette) {
    colorBoxes.forEach((box, index) => {
      const colorPreview = box.querySelector('.color-preview');
      const colorHex = box.querySelector('.color-hex');
      
      colorPreview.style.backgroundColor = palette[index];
      colorHex.textContent = palette[index].toUpperCase();
    });
    
    // Try to generate a description based on colors
    const description = generatePaletteDescription(palette);
    paletteTheme.textContent = description;
    
    addSparkleEffect();
  }
  
  function generatePaletteDescription(palette) {
    // Check if it matches any iconic or album palette
    for (const [theme, colors] of Object.entries(mjIconicColors)) {
      if (arraysMatch(colors, palette)) {
        return `Inspired by MJ's iconic "${theme.replace('_', ' ').toUpperCase()}" look.`;
      }
    }
    
    for (const [album, colors] of Object.entries(mjAlbumColors)) {
      if (arraysMatch(colors, palette)) {
        return `Colors inspired by the "${album.replace('_', ' ').toUpperCase()}" album.`;
      }
    }
    
    // Generate a generic description based on dominant colors
    const namedColors = palette.map(color => {
      // Find exact match or closest named color
      return colorNames[color] || 'Custom';
    });
    
    const uniqueColors = [...new Set(namedColors.filter(name => name !== 'Custom'))];
    
    if (uniqueColors.length > 0) {
      return `A palette featuring ${uniqueColors.slice(0, 3).join(', ')} tones inspired by MJ's style.`;
    }
    
    return 'A custom Michael Jackson inspired color palette.';
  }
  
  function arraysMatch(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].toLowerCase() !== arr2[i].toLowerCase()) {
        return false;
      }
    }
    
    return true;
  }
  
  function setDefaultPalette() {
    // Start with Thriller palette
    const defaultPalette = mjIconicColors.thriller;
    
    colorBoxes.forEach((box, index) => {
      const colorPreview = box.querySelector('.color-preview');
      const colorHex = box.querySelector('.color-hex');
      
      colorPreview.style.backgroundColor = defaultPalette[index];
      colorHex.textContent = defaultPalette[index].toUpperCase();
    });
    
    paletteTheme.textContent = 'Inspired by MJ\'s iconic "THRILLER" look.';
  }
  
  function addSparkleEffect() {
    colorBoxes.forEach(box => {
      const sparkleContainer = box.querySelector('.sparkle-container');
      createSparklesInContainer(sparkleContainer);
    });
  }
  
  function createSparklesInContainer(container) {
    // Clear existing sparkles
    container.innerHTML = '';
    
    // Set to visible
    container.style.opacity = 1;
    
    // Create multiple sparkles
    for (let i = 0; i < 15; i++) {
      createSparkle(container);
    }
    
    // Hide container after animation
    setTimeout(() => {
      container.style.opacity = 0;
    }, 1500);
  }
  
  function createSparkle(container) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    
    // Random position
    const xPos = Math.random() * 100;
    const yPos = Math.random() * 100;
    
    sparkle.style.left = `${xPos}%`;
    sparkle.style.top = `${yPos}%`;
    
    // Random size
    const size = 3 + Math.random() * 8;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    
    // Random delay
    sparkle.style.animationDelay = `${Math.random() * 0.5}s`;
    
    container.appendChild(sparkle);
    
    // Remove after animation
    setTimeout(() => {
      sparkle.remove();
    }, 1500);
  }
});
