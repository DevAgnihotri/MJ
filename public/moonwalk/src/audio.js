// audio.js - Audio processing and playback for Moonwalk game

// Audio context for processing
let audioContext;
let audioBuffer;
let source;

// Initialize audio context
const initializeAudio = () => {
  // Create audio context with fallback
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioContext();
};

// Fetch audio file and decode it
const fetchAudio = async (url) => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  } catch (error) {
    console.error('Error loading audio:', error);
    return null;
  }
};

// Play the loaded audio
const playAudio = (loop = false) => {
  if (!audioBuffer) return;
  
  // Create source node
  source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = loop;
  
  // Connect to output
  source.connect(audioContext.destination);
  source.start(0);
};

// Stop playing audio
const stopAudio = () => {
  if (source) {
    source.stop();
  }
};

// Export functions
export { initializeAudio, fetchAudio, playAudio, stopAudio };
