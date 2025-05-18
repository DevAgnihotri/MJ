// generateCards(): Creates card elements with MJ song titles for the game.
// shuffle(array): Randomizes the order of elements in an array.
// handleCardClick(event): Manages card clicks and checks for matches.
// startGame(): Resets the game, shuffles cards, and starts a timer.

// Replace colors with MJ song titles
const mjSongs = [
    'Billie Jean',
    'Thriller',
    'Beat It',
    'Bad',
    'Smooth Criminal',
    'Black or White',
    'Man in the Mirror',
    'Rock With You'
];
 
let cards = shuffle(mjSongs.concat(mjSongs)); // Concatenate the array with itself to create pairs
let selectedCards = [];
let score = 0;
let timeLeft = 30;
let gameInterval;
let gameStarted = false; // Flag to track if game has started

const startbtn = document.getElementById('startbtn');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');

// This function is responsible for generating the cards dynamically and adding them to the game container.
function generateCards() {
    // Loop through each song in the shuffled cards array.
    for (const song of cards) {
        // Create a new div element for each card.
        const card = document.createElement('div');
        
        // Add the 'card' class to the div for styling purposes.
        card.classList.add('card');
        
        // Store the song as a data attribute on the card for later reference.
        card.dataset.song = song;
        
        // Set the initial text content of the card to '?' to hide the song.
        card.textContent = '?';

        // Add disabled class until game starts
        if (!gameStarted) {
            card.classList.add('disabled');
        }
        
        // Append the card to the game container in the DOM.
        gameContainer.appendChild(card);
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i (inclusive).
        const j = Math.floor(Math.random() * (i + 1));
        // Swap the elements at indices i and j in the array.
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Add MJ-themed card flipping and matching logic
function flipCard(card) {
    // Only flip cards if the game has started
    if (!gameStarted || card.classList.contains('disabled')) return;
    
    card.classList.add('flipped');
    card.textContent = card.dataset.song;
}

function unflipCard(card) {
    card.classList.remove('flipped');
    card.textContent = '?';
}

function markMatched(card1, card2) {
    card1.classList.add('matched');
    card2.classList.add('matched');
}

function resetBoard() {
    gameStarted = false; // Reset game started flag
    while (gameContainer.firstChild) {
        gameContainer.removeChild(gameContainer.firstChild);
    }
    selectedCards = [];
    score = 0;
    timeLeft = 30;
    scoreElement.textContent = 'Score: 0';
    timerElement.textContent = 'Time Left: 30';
}

function handleCardClick(event) {
    // Only handle clicks if the game has started
    if (!gameStarted) return;
    
    const card = event.target;
    if (card.classList.contains('flipped') || card.classList.contains('matched') || selectedCards.length === 2) return;
    flipCard(card);
    selectedCards.push(card);
    if (selectedCards.length === 2) {
        if (selectedCards[0].dataset.song === selectedCards[1].dataset.song) {
            markMatched(selectedCards[0], selectedCards[1]);
            score += 10;
            scoreElement.textContent = 'Score: ' + score;
            selectedCards = [];
        } else {
            setTimeout(() => {
                unflipCard(selectedCards[0]);
                unflipCard(selectedCards[1]);
                selectedCards = [];
            }, 800);
        }
    }
}

function startGame() {
    resetBoard();
    cards = shuffle(mjSongs.concat(mjSongs));
    generateCards();
    
    // Set game started flag to true
    gameStarted = true;
    
    // Enable all cards by removing disabled class
    Array.from(document.getElementsByClassName('card')).forEach(card => {
        card.classList.remove('disabled');
        card.addEventListener('click', handleCardClick);
    });
    
    clearInterval(gameInterval);
    timeLeft = 30;
    timerElement.textContent = 'Time Left: ' + timeLeft;
    gameInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = 'Time Left: ' + timeLeft;
        if (timeLeft === 0) {
            clearInterval(gameInterval);
            setTimeout(() => {
                alert('Time up! Your score: ' + score);
                gameStarted = false; // Disable cards when time is up
                
                // Disable all cards when game ends
                Array.from(document.getElementsByClassName('card')).forEach(card => {
                    card.classList.add('disabled');
                });
            }, 100);
        }
    }, 1000);
    
    // Play background music - YDRCAU.mp4
    const audio = document.getElementById('bg-music');
    if (audio) {
        audio.currentTime = 0;
        
        try {
            audio.play().catch(error => {
                console.log("Background music couldn't play automatically:", error);
                const message = document.getElementById('message');
                if (message) {
                    message.innerHTML += "<br><small>Click anywhere to enable music</small>";
                }
                
                // Allow user to enable music with a click
                document.body.addEventListener('click', function() {
                    audio.play().catch(e => console.log("Still unable to play audio:", e));
                }, { once: true });
            });
        } catch (error) {
            console.log("Error with background music:", error);
        }
    }
}

startbtn.addEventListener('click', startGame);

// Initial setup
resetBoard();
generateCards();

// Add click handler to cards, but they won't respond until game starts
Array.from(document.getElementsByClassName('card')).forEach(card => {
    card.addEventListener('click', handleCardClick);
});