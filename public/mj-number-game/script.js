// THRILLGUESSER - MJ NUMBER GAME JS

document.addEventListener('DOMContentLoaded', function() {
    // Game Elements
    const startBtn = document.getElementById('start-btn');
    const instructionsDiv = document.querySelector('.game-instructions');
    const gamePlayDiv = document.querySelector('.game-play');
    const levelOptions = document.querySelectorAll('.level-option');
    const guessInput = document.getElementById('guess-input');
    const guessBtn = document.getElementById('guess-btn');
    const attemptsDisplay = document.querySelector('.status-value.attempts');
    const rangeDisplay = document.querySelector('.status-value.range');
    const hintText = document.querySelector('.hint-text');
    const guessHistory = document.querySelector('.guess-history');
    const resultModal = document.getElementById('result-modal');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const playAgainBtn = document.getElementById('play-again-btn');
    const soundToggle = document.getElementById('sound-toggle');
    const songTitle = document.querySelector('.song-title');
      // Audio Element
    const bgMusic = document.getElementById('bg-music');
    
    // Game Variables
    let secretNumber;
    let attemptsLeft;
    let minRange;
    let maxRange;
    let gameLevel = 'medium'; // Default level
    let soundEnabled = false;
    let guesses = [];
      // Level configurations
    const levels = {
        'easy': { range: [1, 25], attempts: 15, song: 'Beat It', bgMusic: '../audio/Beat_It.mp3' },
        'medium': { range: [1, 50], attempts: 10, song: 'Thriller', bgMusic: '../audio/TDRCAU.mp3' },
        'hard': { range: [1, 100], attempts: 7, song: 'Bad', bgMusic: '../audio/Bad.mp3' }
    };
      // Initialize the game
    function initGame() {
        const currentLevel = levels[gameLevel];
        minRange = currentLevel.range[0];
        maxRange = currentLevel.range[1];
        attemptsLeft = currentLevel.attempts;
        secretNumber = generateRandomNumber(minRange, maxRange);
        guesses = [];
        
        // Update UI
        attemptsDisplay.textContent = attemptsLeft;
        rangeDisplay.textContent = `${minRange}-${maxRange}`;
        hintText.textContent = 'Make your first guess to start the thriller...';
        guessHistory.innerHTML = '';
        guessInput.value = '';
        guessInput.min = minRange;
        guessInput.max = maxRange;
        guessInput.placeholder = '?';
        
        // Show/hide game sections
        instructionsDiv.classList.add('hidden');
        gamePlayDiv.classList.remove('hidden');
        resultModal.classList.add('hidden');
        
        console.log(`Secret number: ${secretNumber} (for debugging)`); // For debugging
        
        // Set focus on input
        guessInput.focus();
        
        // Update song title and music file
        songTitle.textContent = currentLevel.song.toUpperCase();
        
        // Update background music if enabled
        if (soundEnabled) {
            bgMusic.src = currentLevel.bgMusic;
            bgMusic.play();
        }
    }
    
    // Generate a random number within a range
    function generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Process player's guess
    function processGuess() {
        // Parse input
        const playerGuess = parseInt(guessInput.value);
        
        // Validate input
        if (isNaN(playerGuess) || playerGuess < minRange || playerGuess > maxRange) {
            hintText.textContent = `Please enter a number between ${minRange} and ${maxRange}.`;
            hintText.style.color = 'var(--mj-silver)';
            guessInput.value = '';
            return;
        }
        
        // Check if guess was already made
        if (guesses.includes(playerGuess)) {
            hintText.textContent = "You already tried that number. Try another one!";
            hintText.style.color = 'var(--mj-silver)';
            guessInput.value = '';
            return;
        }
        
        // Play sound effect
        if (soundEnabled) {
            guessSound.currentTime = 0;
            guessSound.play();
        }
        
        // Add to guesses array
        guesses.push(playerGuess);
        
        // Decrease attempts
        attemptsLeft--;
        attemptsDisplay.textContent = attemptsLeft;
        
        // Create guess history item
        const guessItem = document.createElement('div');
        guessItem.classList.add('guess-item');
        guessItem.textContent = playerGuess;
        
        // Check guess against secret number
        if (playerGuess === secretNumber) {
            // Win condition
            gameWon();
        } else if (attemptsLeft === 0) {
            // Lose condition
            gameLost();
        } else {
            // Continue game
            if (playerGuess < secretNumber) {
                hintText.textContent = generateLowHint(playerGuess);
                hintText.style.color = 'var(--mj-blue)';
                guessItem.classList.add('too-low');
            } else {
                hintText.textContent = generateHighHint(playerGuess);
                hintText.style.color = 'var(--mj-red)';
                guessItem.classList.add('too-high');
            }
            
            // Add guess to history and play hint sound
            guessHistory.appendChild(guessItem);
            guessInput.value = '';
            guessInput.focus();
            
            if (soundEnabled) {
                hintSound.currentTime = 0;
                hintSound.play();
            }
        }
    }
    
    // Generate varied low hint messages
    function generateLowHint(guess) {
        const gap = secretNumber - guess;
        const hints = [
            "Too low! You need to BEAT IT higher!",
            "Higher! Don't stop 'til you get enough!",
            "Need to go higher! It's a THRILLER!",
            "That's too low - are you BAD enough to go higher?",
            "Way too low! SHAMONE, go higher!"
        ];
        
        if (gap > Math.floor((maxRange - minRange) / 2)) {
            return "WAY too low! You're not even close!";
        } else if (gap > Math.floor((maxRange - minRange) / 4)) {
            return hints[Math.floor(Math.random() * 3)];
        } else {
            return "Getting closer, but still too low!";
        }
    }
    
    // Generate varied high hint messages
    function generateHighHint(guess) {
        const gap = guess - secretNumber;
        const hints = [
            "Too high! Bring it down, DANGEROUS!",
            "Lower! That's not it! HEE-HEE!",
            "Too high! You wanna be startin' somethin' lower?",
            "Lower! This is not a SMOOTH CRIMINAL guess!",
            "That's the wrong way! Go lower!"
        ];
        
        if (gap > Math.floor((maxRange - minRange) / 2)) {
            return "WAY too high! Not even close!";
        } else if (gap > Math.floor((maxRange - minRange) / 4)) {
            return hints[Math.floor(Math.random() * 3)];
        } else {
            return "Getting warmer, but still too high!";
        }
    }
      // Win condition
    function gameWon() {
        if (soundEnabled) {
            bgMusic.pause();
            winSound.play();
        }
        
        const attemptsUsed = levels[gameLevel].attempts - attemptsLeft;
        let winMessage = '';
        
        // Different messages based on attempts used
        if (attemptsUsed === 1) {
            winMessage = "INCREDIBLE! First try! You're the KING OF POP guessing!";
        } else if (attemptsUsed <= 3) {
            winMessage = "AMAZING! That was DANGEROUS good!";
        } else if (attemptsUsed <= levels[gameLevel].attempts / 2) {
            winMessage = "SMOOTH CRIMINAL work! You got it with plenty of attempts left!";
        } else {
            winMessage = "You got it! Not bad, but I bet you can BEAT IT next time!";
        }
        
        // Show result modal
        resultTitle.textContent = "YOU WON!";
        resultTitle.style.color = 'var(--mj-gold)';
        resultMessage.textContent = `${winMessage} The number was ${secretNumber}.`;
        resultModal.classList.remove('hidden');
        resultModal.classList.remove('fade-out');
        
        // Add victory animation to body
        document.body.classList.add('victory-glow');
        setTimeout(() => {
            document.body.classList.remove('victory-glow');
        }, 3000);
    }
      // Lose condition
    function gameLost() {
        if (soundEnabled) {
            bgMusic.pause();
            loseSound.play();
        }
        
        // Show result modal
        resultTitle.textContent = "GAME OVER";
        resultTitle.style.color = 'var(--mj-red)';
        resultMessage.textContent = `The number was ${secretNumber}. Don't stop 'til you get enough - try again!`;
        resultModal.classList.remove('hidden');
        resultModal.classList.remove('fade-out');
    }
      // Reset game to initial state
    function resetGame() {
        // Add fade-out class to the modal
        resultModal.classList.add('fade-out');
        
        // Wait for animation to complete before hiding
        setTimeout(() => {
            resultModal.classList.add('hidden');
            resultModal.classList.remove('fade-out');
            
            // Show instructions and hide gameplay
            instructionsDiv.classList.remove('hidden');
            gamePlayDiv.classList.add('hidden');
        }, 300);
        
        // Play background music if enabled
        if (soundEnabled) {
            bgMusic.currentTime = 0;
            bgMusic.play();
        }
    }
    
    // Level selection
    levelOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Update active class
            levelOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Update game level
            gameLevel = this.getAttribute('data-level');
            
            // Update instructions text
            const levelInfo = levels[gameLevel];
            document.querySelector('.instructions-text').innerHTML = `
                <span class="highlight">I'm thinking of a number...</span><br>
                ${capitalizeFirst(gameLevel)} level: ${levelInfo.range[0]}-${levelInfo.range[1]} with ${levelInfo.attempts} attempts<br>
                <span class="shine-text">Are you BAD enough to guess it?</span>
            `;
        });
    });
    
    // Helper to capitalize first letter
    function capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Toggle sound
    soundToggle.addEventListener('click', function() {
        soundEnabled = !soundEnabled;
        
        if (soundEnabled) {
            this.innerHTML = '<div class="sound-icon">🔊</div>';
            bgMusic.play();
        } else {
            this.innerHTML = '<div class="sound-icon">🔇</div>';
            bgMusic.pause();
        }
    });
    
    // Event Listeners
    startBtn.addEventListener('click', initGame);
    
    guessBtn.addEventListener('click', processGuess);
    
    guessInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            processGuess();
        }
    });
    
    playAgainBtn.addEventListener('click', resetGame);
    
    // Handle enter key for starting game
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !instructionsDiv.classList.contains('hidden')) {
            initGame();
        }
    });      // Check if sound file exists
    function checkSoundExists(filename) {
        const audioElement = document.createElement('audio');
        audioElement.src = `./sounds/${filename}`;
        
        audioElement.addEventListener('error', () => {
            console.log(`Sound file may not exist or has issues: ${filename}`);
            alert(`Sound file ${filename} may be missing. Please use the sound extractor tool in the sounds folder to create it from MJ songs.`);
        });
        
        // Try to load but don't play
        audioElement.load();
    }
    
    // Check if sound files exist (for development)
    checkSoundExists('guess.mp3');
    checkSoundExists('win.mp3');
    checkSoundExists('lose.mp3');
    checkSoundExists('hint.mp3');
    
    // Tell user about the sound extractor if needed
    console.log("Need sound effects? Visit /mj-number-game/sounds/ to create them from MJ songs!");
});
