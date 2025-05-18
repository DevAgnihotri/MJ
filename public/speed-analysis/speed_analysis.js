// Michael Jackson lyrics for typing tests
const mjLyrics = {
    thriller: "It's close to midnight and something evil's lurking in the dark. Under the moonlight you see a sight that almost stops your heart. You try to scream but terror takes the sound before you make it.",
    billie_jean: "She was more like a beauty queen from a movie scene. I said don't mind, but what do you mean, I am the one. Who will dance on the floor in the round?",
    beat_it: "They told him don't you ever come around here. Don't wanna see your face, you better disappear. The fire's in their eyes and their words are really clear. So beat it, just beat it.",
    smooth_criminal: "As he came into the window, it was the sound of a crescendo. He came into her apartment, he left the bloodstains on the carpet. She ran underneath the table, he could see she was unable.",
    bad: "Your butt is mine, gonna tell you right. Just show your face in broad daylight. I'm telling you on how I feel. Gonna hurt your mind, don't shoot to kill. Come on, come on, lay it on me all right."
};

let testText = mjLyrics.beat_it;
let startTime, endTime;
let isTestRunning = false;
let accuracyScore = 0;
let correctChars = 0;
let totalChars = 0;
let testDuration = 0;

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Setup quote selection dropdown
    const quoteSelect = document.getElementById('quoteSelect');
    quoteSelect.addEventListener('change', function() {
        testText = mjLyrics[this.value];
        // If test isn't running, update the input text
        if (!isTestRunning) {
            document.getElementById("inputText").value = testText;
        }
    });
    
    // Initialize audio controls
    const musicBtn = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const songTitle = document.querySelector('.song-title');
    
    // Set initial song to match default selection (Beat It)    // Map of lyrics to song files
    const songMap = {
        thriller: 'TDRCAU', // Using available tracks for songs we don't have 
        billie_jean: 'Bad',
        beat_it: 'Beat_It',
        smooth_criminal: 'Smooth_Criminal',
        bad: 'Bad'
    };
    
    // Always skip to 80 seconds when a song loads
    bgMusic.addEventListener('loadedmetadata', function() {
        bgMusic.currentTime = 80; // Skip to 80 seconds in for immediate intro
    });
    
    // Play/pause button functionality
    musicBtn.addEventListener('click', function() {
        if (bgMusic.paused) {
            bgMusic.play();
            musicBtn.textContent = '❚❚';
        } else {
            bgMusic.pause();
            musicBtn.textContent = '▶';
        }
    });
    
    // Switch song based on selected lyrics
    quoteSelect.addEventListener('change', function() {
        const selectedSong = songMap[this.value];
        bgMusic.src = `../audio/${selectedSong}.mp3`;
        songTitle.textContent = this.options[this.selectedIndex].text; // Use the text from dropdown
        
        // If music was playing, continue playing the new song from the 80-second mark
        if (musicBtn.textContent === '❚❚') {
            bgMusic.addEventListener('canplaythrough', function onCanPlay() {
                bgMusic.currentTime = 80; // Skip to 80 seconds into the song
                bgMusic.play();
                bgMusic.removeEventListener('canplaythrough', onCanPlay);
            });
        }
    });
    
    // Set initial text
    document.getElementById("inputText").value = testText;
    
    // Enable real-time feedback
    const userInput = document.getElementById('userInput');
    userInput.addEventListener('input', function() {
        if (isTestRunning) {
            updateRealTimeFeedback();
        }
    });
});

function startTest() {
    // Reset and prepare the test
    const userInput = document.getElementById("userInput");
    userInput.value = "";
    userInput.readOnly = false;
    userInput.focus();
    
    // Hide previous results
    const output = document.getElementById("output");
    output.innerHTML = "";
    output.classList.remove('active');
    
    // Get test text based on selected quote
    const quoteSelect = document.getElementById('quoteSelect');
    testText = mjLyrics[quoteSelect.value];
    
    document.getElementById("inputText").value = testText;
    
    // Reset stats
    accuracyScore = 0;
    correctChars = 0;
    totalChars = 0;
    
    // Start the timer
    startTime = new Date().getTime();
    isTestRunning = true;
    
    // Change button
    const button = document.getElementById("btn");
    button.innerHTML = "End Test";
    button.onclick = endTest;
}

function endTest() {
    if (!isTestRunning) return;
    
    endTime = new Date().getTime();
    isTestRunning = false;
    
    // Calculate results
    const userTypedText = document.getElementById("userInput").value;
    testDuration = (endTime - startTime) / 1000; // in seconds
    
    // Calculate words per minute
    const typedWords = userTypedText.split(/\s+/).filter(word => word !== "").length;
    const wpm = Math.round((typedWords / testDuration) * 60);
    
    // Calculate accuracy
    calculateAccuracy(testText, userTypedText);
    
    // Disable user input
    document.getElementById("userInput").readOnly = true;
    
    // Show the results
    displayResults(typedWords, testDuration, wpm, accuracyScore);
    
    // Reset button
    const button = document.getElementById("btn");
    button.innerHTML = "Try Again";
    button.onclick = startTest;
    // Play a different MJ song as reward
    const bgMusic = document.getElementById('bgMusic');
    bgMusic.src = '../audio/Dangerous.mp3';
    document.querySelector('.song-title').textContent = 'Dangerous';
    
    if (!bgMusic.paused) {
        bgMusic.addEventListener('canplaythrough', function onCanPlay() {
            bgMusic.currentTime = 80; // Skip to 80 seconds into the song
            bgMusic.play();
            bgMusic.removeEventListener('canplaythrough', onCanPlay);
        });
    }
}

function calculateAccuracy(original, typed) {
    totalChars = original.length;
    correctChars = 0;
    
    // Compare each character
    const minLength = Math.min(original.length, typed.length);
    for (let i = 0; i < minLength; i++) {
        if (original[i] === typed[i]) {
            correctChars++;
        }
    }
    
    // Calculate percentage
    accuracyScore = Math.round((correctChars / totalChars) * 100);
}

function updateRealTimeFeedback() {
    // This could be enhanced to provide real-time visual feedback
    // For example, highlighting correct/incorrect characters as the user types
    
    // We could implement real-time feedback in the future
    // Example: compare current input against test text and highlight differences
    // const userInput = document.getElementById('userInput').value;
    // const originalText = document.getElementById('inputText').value;
}

function displayResults(words, time, wpm, accuracy) {
    const output = document.getElementById("output");
    
    // Determine performance level
    let performanceMessage = '';
    let messageClass = '';
    
    if (wpm > 60 && accuracy > 95) {
        performanceMessage = "Incredible! You're as smooth as Michael's moonwalk!";
        messageClass = 'success-message';
    } else if (wpm > 40 && accuracy > 85) {
        performanceMessage = "Great job! You've got the MJ rhythm!";
        messageClass = 'success-message';
    } else {
        performanceMessage = "Keep practicing! Even Michael had to rehearse!";
        messageClass = 'error-message';
    }
    
    // Build output HTML
    let resultHTML = `
        <h2 class="result-title">Typing Test Results</h2>
        
        <div class="stats-container">
            <div class="stat-card">
                <div class="stat-value">${wpm}</div>
                <div class="stat-label">Words Per Minute</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-value">${time.toFixed(1)}<span style="font-size:1.5rem">s</span></div>
                <div class="stat-label">Time Elapsed</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-value">${accuracy}%</div>
                <div class="stat-label">Accuracy</div>
            </div>
        </div>
        
        <div class="message ${messageClass}">
            ${performanceMessage}
        </div>
    `;
      // Display results
    output.innerHTML = resultHTML;
    output.classList.add('active');
    
    // Scroll to results
    output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}