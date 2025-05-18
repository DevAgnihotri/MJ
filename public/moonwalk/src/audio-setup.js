// Audio configuration for moonwalk application
let audioContext;
try {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  window.audioContext = audioContext;
} catch (e) {
  console.error('Web Audio API not supported:', e);
  audioContext = null;
}

let buffer = null;

// Create a global function to set up audio
window.setupAudio = function(audioElement, audioCtx) {
  window.audio = audioElement;
  
  if (audioCtx) {
    window.audioContext = audioCtx;
  }
  
  // Set default values
  if (window.audio) {
    window.audio.volume = window.options && window.options.volume ? window.options.volume : 0.7;
    window.audio.loop = false;
  }
  
  console.log('Audio setup complete');
  return window.audio;
};

// Function to load audio with fallbacks
window.loadGameAudio = function(primarySrc, fallbackSrc) {
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
      
      if (window.audioContext) {
        try {
          const source = window.audioContext.createMediaElementSource(audioElement);
          source.connect(window.audioContext.destination);
        } catch (e) {
          console.warn('Error connecting audio to context:', e);
          // Continue anyway since we can still play the audio
        }
      }
      
      window.setupAudio(audioElement, window.audioContext);
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

// Default to use the included audio file
window.addEventListener('load', function() {
  window.loadGameAudio('AudioDashDefault.mp3', 'MoonwalkDefault.mp3')
    .then(audio => {
      window.defaultAudio = audio;
      console.log('Default audio loaded successfully');
    })
    .catch(err => {
      console.error('Could not load any audio:', err);
      // Create dummy audio element as fallback
      window.defaultAudio = new Audio();
      window.audio = window.defaultAudio;
    });
});
