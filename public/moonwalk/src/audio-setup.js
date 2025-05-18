// Audio configuration for moonwalk application
// Initialize game namespace if not already done
window.moonwalkGame = window.moonwalkGame || {};
const game = window.moonwalkGame;

// Initialize audio context
try {
  game.audioContext = new (window.AudioContext || window.webkitAudioContext)();
} catch (e) {
  console.error('Web Audio API not supported:', e);
  game.audioContext = null;
}

game.buffer = null;

// Create a global function to set up audio
game.setupAudio = function(audioElement, audioCtx) {
  game.audio = audioElement;
  
  if (audioCtx) {
    game.audioContext = audioCtx;
  }
  
  // Set default values
  if (game.audio) {
    game.audio.volume = game.options && game.options.volume ? game.options.volume : 0.7;
    game.audio.loop = false;
  }
  
  console.log('Audio setup complete');
  return game.audio;
};

// Function to load audio with fallbacks
game.loadGameAudio = function(primarySrc, fallbackSrc) {
  return new Promise((resolve, reject) => {
    const audioElement = new Audio();
    let loadAttempts = 0;
    const maxAttempts = 3;
    
    function attemptLoad(src) {
      loadAttempts++;
      console.log(`Attempt ${loadAttempts} to load audio: ${src}`);
      audioElement.src = src;
      audioElement.load();
    }
    
    audioElement.addEventListener('canplaythrough', function onCanPlay() {
      console.log('Audio loaded successfully');
      
      if (game.audioContext) {
        try {
          const source = game.audioContext.createMediaElementSource(audioElement);
          source.connect(game.audioContext.destination);
        } catch (e) {
          console.warn('Error connecting audio to context:', e);
          // Continue anyway since we can still play the audio
        }
      }
      
      game.setupAudio(audioElement, game.audioContext);
      audioElement.removeEventListener('canplaythrough', onCanPlay);
      resolve(audioElement);
    });
    
    audioElement.addEventListener('error', function(e) {
      console.error('Audio error:', e);
      
      if (loadAttempts === 1 && fallbackSrc) {
        // Try fallback source
        attemptLoad(fallbackSrc);
      } else if (loadAttempts < maxAttempts) {
        // Try again with same source
        setTimeout(() => attemptLoad(audioElement.src), 1000);
      } else {
        // Give up after max attempts
        console.error('Failed to load audio after multiple attempts');
        reject(e);
      }
    });
    
    // Start loading primary source
    attemptLoad(primarySrc);
  });
};

// Make these functions available globally for backward compatibility
window.setupAudio = game.setupAudio;
window.loadGameAudio = game.loadGameAudio;

// Default to use the included audio file
window.addEventListener('load', function() {
  game.loadGameAudio('AudioDashDefault.mp3', 'MoonwalkDefault.mp3')
    .then(audio => {
      game.defaultAudio = audio;
      console.log('Default audio loaded successfully');
      
      // Also set window.audio for backward compatibility
      window.audio = audio;
      window.defaultAudio = audio;
    })
    .catch(err => {
      console.error('Could not load any audio:', err);
      // Create dummy audio element as fallback
      game.defaultAudio = new Audio();
      game.audio = game.defaultAudio;
      
      // Also set window.audio for backward compatibility
      window.audio = game.defaultAudio;
      window.defaultAudio = game.defaultAudio;
    });
});
