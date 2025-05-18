/**
 * Sound Effect Extractor for MJ Number Game
 * 
 * This script creates sound effects by extracting clips from MJ songs.
 * - Guess sound: A short "HEE-HEE" or drum hit
 * - Win sound: An exciting clip with "WOO!" or celebration
 * - Lose sound: A dramatic sound
 * - Hint sound: A short accent sound
 */

// Configure the AudioContext
let audioContext;
let songBuffers = {};
const songSources = [
  { name: 'Beat_It', path: '../audio/Beat_It.mp3' },
  { name: 'Bad', path: '../audio/Bad.mp3' },
  { name: 'Billie_Jean', path: '../audio/Billie_Jean.mp3' },
  { name: 'TDRCAU', path: '../audio/TDRCAU.mp3' }, // Thriller
  { name: 'Smooth_Criminal', path: '../audio/Smooth_Criminal.mp3' }
];

// Sound effect configurations
const soundConfigs = {
  guess: { songName: 'Beat_It', startTime: 12, duration: 0.5 },
  win: { songName: 'Bad', startTime: 30, duration: 2 },
  lose: { songName: 'TDRCAU', startTime: 220, duration: 2 },
  hint: { songName: 'Billie_Jean', startTime: 8, duration: 0.3 }
};

// Initialize audio context when page loads
document.addEventListener('DOMContentLoaded', async function() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    await loadAllSongs();
    document.getElementById('status').textContent = 'All songs loaded! Ready to extract sound effects.';
    document.getElementById('extract-btn').disabled = false;
  } catch (error) {
    document.getElementById('status').textContent = 'Error: ' + error.message;
    console.error('Error initializing audio:', error);
  }
});

// Load all the MJ songs
async function loadAllSongs() {
  document.getElementById('status').textContent = 'Loading songs...';
  
  const loadPromises = songSources.map(async (song) => {
    try {
      const response = await fetch(song.path);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      songBuffers[song.name] = audioBuffer;
      document.getElementById('log').innerHTML += `<div>✅ Loaded ${song.name}</div>`;
      return true;
    } catch (error) {
      document.getElementById('log').innerHTML += `<div>❌ Failed to load ${song.name}: ${error.message}</div>`;
      return false;
    }
  });
  
  await Promise.all(loadPromises);
}

// Extract a clip from a song buffer
function extractClip(songName, startTime, duration) {
  const sourceBuffer = songBuffers[songName];
  if (!sourceBuffer) {
    throw new Error(`Song ${songName} not loaded`);
  }
  
  // Calculate buffer size
  const sampleRate = sourceBuffer.sampleRate;
  const startSample = Math.floor(startTime * sampleRate);
  const durationSamples = Math.floor(duration * sampleRate);
  
  // Create a new buffer for the clip
  const clipBuffer = audioContext.createBuffer(
    sourceBuffer.numberOfChannels,
    durationSamples,
    sampleRate
  );
  
  // Copy data from source to clip
  for (let channel = 0; channel < sourceBuffer.numberOfChannels; channel++) {
    const sourceData = sourceBuffer.getChannelData(channel);
    const clipData = clipBuffer.getChannelData(channel);
    
    for (let i = 0; i < durationSamples; i++) {
      if (startSample + i < sourceData.length) {
        clipData[i] = sourceData[startSample + i];
      }
    }
  }
  
  return clipBuffer;
}

// Function to play an extracted clip
function playClip(buffer) {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
}

// Function to download an audio buffer as WAV
function downloadClip(buffer, filename) {
  // Create WAV file
  const wav = audioBufferToWav(buffer);
  const blob = new Blob([new Uint8Array(wav)], { type: 'audio/wav' });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

// Convert AudioBuffer to WAV format
function audioBufferToWav(buffer) {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2;
  const sampleRate = buffer.sampleRate;
  const data = new ArrayBuffer(44 + length);
  const view = new DataView(data);
  
  // Write WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numOfChan, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numOfChan * 2, true);
  view.setUint16(32, numOfChan * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, length, true);
  
  // Write PCM audio data
  const channelData = [];
  let offset = 44;
  
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channelData.push(buffer.getChannelData(i));
  }
  
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channelData[channel][i]));
      const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset, int16, true);
      offset += 2;
    }
  }
  
  return data;
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Extract and download all sound effects
async function extractAllSounds() {
  document.getElementById('status').textContent = 'Extracting sounds...';
  
  try {
    // Extract each sound effect and add to the page
    for (const [soundName, config] of Object.entries(soundConfigs)) {
      const clipBuffer = extractClip(config.songName, config.startTime, config.duration);
      
      // Create controls for this sound
      const soundDiv = document.createElement('div');
      soundDiv.className = 'sound-item';
      soundDiv.innerHTML = `
        <h3>${soundName}.mp3</h3>
        <p>From ${config.songName} (${config.startTime}s - ${config.startTime + config.duration}s)</p>
        <button class="play-btn" id="play-${soundName}">Play</button>
        <button class="download-btn" id="download-${soundName}">Download</button>
        <div class="adjust">
          <label>Start: <input type="range" min="0" max="300" value="${config.startTime}" id="start-${soundName}"> <span id="start-val-${soundName}">${config.startTime}</span>s</label>
          <label>Duration: <input type="range" min="0.1" max="5" step="0.1" value="${config.duration}" id="duration-${soundName}"> <span id="duration-val-${soundName}">${config.duration}</span>s</label>
        </div>
      `;
      document.getElementById('sounds-container').appendChild(soundDiv);
      
      // Add event listeners for this sound
      document.getElementById(`play-${soundName}`).addEventListener('click', () => {
        const startTime = parseFloat(document.getElementById(`start-${soundName}`).value);
        const duration = parseFloat(document.getElementById(`duration-${soundName}`).value);
        const newClip = extractClip(config.songName, startTime, duration);
        playClip(newClip);
      });
      
      document.getElementById(`download-${soundName}`).addEventListener('click', () => {
        const startTime = parseFloat(document.getElementById(`start-${soundName}`).value);
        const duration = parseFloat(document.getElementById(`duration-${soundName}`).value);
        const newClip = extractClip(config.songName, startTime, duration);
        downloadClip(newClip, `${soundName}.mp3`);
      });
      
      document.getElementById(`start-${soundName}`).addEventListener('input', (e) => {
        document.getElementById(`start-val-${soundName}`).textContent = e.target.value;
      });
      
      document.getElementById(`duration-${soundName}`).addEventListener('input', (e) => {
        document.getElementById(`duration-val-${soundName}`).textContent = e.target.value;
      });
    }
    
    document.getElementById('status').textContent = 'Ready! Play or download sound effects.';
  } catch (error) {
    document.getElementById('status').textContent = 'Error extracting sounds: ' + error.message;
    console.error('Error extracting sounds:', error);
  }
}
