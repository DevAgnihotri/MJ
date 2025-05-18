/*--------------------------------*/
/* PMD - Perpetual MJ Dance Clock */
/*--------------------------------*/

// Background music functionality
const bgMusic = document.getElementById("bgMusic");
let isMusicPlaying = false;

function toggleBackgroundMusic() {
  const musicButton = document.getElementById("toggleMusic");
  
  if (isMusicPlaying) {
    bgMusic.pause();
    musicButton.textContent = "🎵 Play MJ Music";
    isMusicPlaying = false;
  } else {
    bgMusic.play();
    musicButton.textContent = "🔇 Pause Music";
    isMusicPlaying = true;
  }
}

// Main clock functionality
var display = document.getElementById("display");
var displayTime = document.getElementById("time-left");
var timerLabel = document.getElementById("timer-label");
var displaySession = document.getElementById("session-length");
var displayBreak = document.getElementById("break-length");
var startStopButton = document.getElementById("start_stop");
var resetButton = document.getElementById("reset");
var buttons = document.getElementsByClassName("button");
var alarm = document.getElementById("beep");
var heeHeeSound = new Audio("../audio/Beat_It.mp3"); // We'll play specific portions of these songs
var whooshSound = new Audio("../audio/Smooth_Criminal.mp3");

// Configure sounds to play short segments
heeHeeSound.currentTime = 30; // Jump to a section with "hee-hee" sound
whooshSound.currentTime = 15; // Jump to a good part of Smooth Criminal

var mode = "session";
var sessionLength = 25;
var breakLength = 5;
var time = 0;
var status = 0;
var minutes = sessionLength;
var seconds = 0;
var display = updateDisplay();
var countdown = null;

// Initialize the timer
init();

function init() {  // Add initial animation class
  display.classList.add('session-mode');
  
  // Show welcome message after a short delay
  setTimeout(() => {
    showMJMessage("Welcome to the PMD Clock! Dance with the King of Pop!");
    createMJEmojis(["🕺", "👑", "🎵", "🎩", "🌙", "⚡"]);
  }, 1000);
  // Set up button event listeners
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    button.addEventListener("click", function() {
      getInput(this);
    });
  }
  
  // Set up keyboard controls
  keyboard();
  
  console.log("Pomodoro Clock initialized");
}

function inputType(button) {
  var id = button.id;
  var buttonType = id;
  return buttonType;
}

function getInput(button) {
  switch (inputType(button)) {
    case "start_stop":
      startStop();
      break;
    case "reset":
      reset();
      break;
    case "session-increment":
      changeSession(1);
      break;
    case "session-decrement":
      changeSession(-1);
      break;
    case "break-increment":
      changeBreak(1);
      break;
    case "break-decrement":
      changeBreak(-1);
  }
}

function keyboard() {
  keyboardEvents("keydown");
  keyboardEvents("keyup");
}

function keyboardEvents(keyEvent) {
  document.addEventListener(keyEvent, function (event) {
    if (event.defaultPrevented) {
      return;
    }
    var key = event.key || event.keyCode;

    for (var i = 0; i < buttons.length; i++) {
      var button = buttons[i];
      if (button.dataset.key == key) {
        handleKeyboardEvent(button, keyEvent);
      }
    }
  });
}

function handleKeyboardEvent(button, keyEvent) {
  if (keyEvent == "keydown") {
    button.classList.add("select");
    getInput(button);
  }
  if (keyEvent == "keyup") {
    button.classList.remove("select");
  }
}

function startStop() {
  if (status == 1) {
    timerSwitch(0);
  } else {
    timerSwitch(1);
  }
}

function timerSwitch(on) {
  if (minutes == 0 && seconds == 0) {
    return;
  }
  if (on == 1) {
    countdown = setInterval(timer, 1000);
    status = 1;    startStopButton.innerText = "Pause MJ";
    startStopButton.classList.remove('start');
    startStopButton.classList.add('stop');
    console.log("Timer started");
    
    // Play short MJ sound when starting
    heeHeeSound.currentTime = 10;
    heeHeeSound.play();
    setTimeout(() => heeHeeSound.pause(), 1500);
    
    // Show MJ message when starting
    showMJMessage("Dancing with MJ! Hee-hee!");
  } else {
    clearInterval(countdown);
    status = 0;
    
    // Play short MJ sound when stopping
    whooshSound.currentTime = 5;
    whooshSound.play();
    setTimeout(() => whooshSound.pause(), 1500);
      // Show MJ message when pausing
    showMJMessage("Taking a break! Shamone!");
    startStopButton.innerText = "Beat It!";
    startStopButton.classList.remove('stop');
    startStopButton.classList.add('start');
    console.log("Timer stopped");
  }
}

function timer() {
  if (minutes == 0 && seconds == 0) {
    updateDisplay();
    return zero();
  }
  if (minutes >= 0) {
    if (seconds > 0) {
      seconds -= 1;
      updateDisplay()
    } else {
      minutes -= 1;
      seconds = 59;
      updateDisplay()
    }
  }
}

function zero() {
  // Play alarm sound
  alarm.play();
  modeSwitch();
}

function modeSwitch() {
  if (mode == "session") {
    console.log("Session finished");
    timerLabel.innerText = "Moonwalk Break";
    minutes = breakLength;
    updateDisplay();
    mode = "break";
      // Play MJ sound effect
    whooshSound.currentTime = 15;
    whooshSound.play();
    setTimeout(() => whooshSound.pause(), 2000); // Play only a short clip
    
    // Apply break animation class
    display.classList.remove('session-mode');
    display.classList.add('break-mode');
    
    // Show MJ message
    showMJMessage("Time for a moonwalk break! Shamone!");
    
    // Create random MJ emojis
    createMJEmojis(["🕺", "👑", "🎵", "🎩", "🌙", "👞"]);
    
    return;
  } else {
    console.log("Break finished");
    timerLabel.innerText = "MJ Dance Session";
    minutes = sessionLength;
    updateDisplay();
    mode = "session";
      // Play MJ sound effect
    heeHeeSound.currentTime = 30;
    heeHeeSound.play();
    setTimeout(() => heeHeeSound.pause(), 2000); // Play only a short clip
    
    // Apply session animation class
    display.classList.remove('break-mode');
    display.classList.add('session-mode');
    
    // Show MJ message
    showMJMessage("Back to dancing! Beat It!");
    
    // Create random MJ emojis
    createMJEmojis(["🎸", "🎤", "🎶", "💃", "⚡", "🌟"]);
    
    return;
  }
}

// Function to create floating MJ emojis
function createMJEmojis(emojis) {
  // Reduce number of emojis from 6 to 3 to prevent overloading animations
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const emojiElement = document.createElement('div');
      emojiElement.className = 'mj-emoji';
      emojiElement.textContent = emoji;      // Position in the center area to avoid edge issues
      const leftPos = Math.floor(Math.random() * 40) + 30; // 30-70% (central area only)
      emojiElement.style.left = `${leftPos}%`;
      emojiElement.style.bottom = '20px';
      // Fix position calculation to avoid layout shifts
      emojiElement.style.position = 'fixed';
      
      document.body.appendChild(emojiElement);
        // Remove after animation completes - safely handle removal
      setTimeout(() => {
        if (emojiElement && emojiElement.parentNode) {
          document.body.removeChild(emojiElement);
        }
      }, 3000);
    }, i * 800); // Increased delay between emojis to reduce animation load
  }
}

// Function to show MJ themed messages
function showMJMessage(message) {
  // Create message element if it doesn't exist
  let mjMessage = document.getElementById('mj-message');
  if (!mjMessage) {
    mjMessage = document.createElement('div');
    mjMessage.id = 'mj-message';
    mjMessage.style.position = 'fixed';
    mjMessage.style.top = '50%';
    mjMessage.style.left = '50%';
    mjMessage.style.transform = 'translate(-50%, -50%)';
    mjMessage.style.background = 'rgba(0, 0, 0, 0.8)';
    mjMessage.style.color = 'white';
    mjMessage.style.padding = '20px';
    mjMessage.style.borderRadius = '10px';
    mjMessage.style.fontSize = '24px';
    mjMessage.style.fontWeight = 'bold';    mjMessage.style.textAlign = 'center';
    mjMessage.style.zIndex = '1000';
    mjMessage.style.boxShadow = '0 0 8px rgba(255, 0, 0, 0.5)';
    document.body.appendChild(mjMessage);
  }
  
  // Set message and show
  mjMessage.innerText = message;
  mjMessage.style.display = 'block';
  
  // Hide after 3 seconds
  setTimeout(() => {
    mjMessage.style.display = 'none';
  }, 3000);
}

function updateDisplay() {
  display = minutes + ":" + formatSeconds(seconds);
  displayTime.innerText = display;
  console.log(display);
  return display;
}

function formatSeconds(num) {
  var str = num.toString();
  if (str.length == 1) {
    str = "0" + str;
  }
  return str;
}

function reset() {
  if (status == 1) {
    timerSwitch(0);
  }
  
  // Add spin animation
  display.classList.add('reset-spin');
  
  // Remove animation class after it completes
  setTimeout(() => {
    display.classList.remove('reset-spin');
  }, 500);
  
  // Reset to session mode
  mode = "session";
  timerLabel.innerText = "MJ Dance Session";
  minutes = sessionLength;
  seconds = 0;
  updateDisplay();
  
  // Reset animation classes
  display.classList.remove('break-mode');
  display.classList.remove('session-mode');
  setTimeout(() => {
    display.classList.add('session-mode');
  }, 600);
    // Show message
  showMJMessage("Ready to dance? Hee-hee!");
  
  // Create MJ emojis for reset
  createMJEmojis(["🕺", "🎩", "👑", "🎵", "⚡", "🌟"]);
}

function changeSession(value) {
  if (sessionLength + value > 0 && sessionLength + value <= 60) {
    sessionLength += value;
    if (mode == "session") {
      minutes = sessionLength;
      updateDisplay();
    }
    displaySession.innerText = sessionLength;
  }
  return sessionLength;
}

function changeBreak(value) {
  if (breakLength + value > 0 && breakLength + value <= 60) {
    breakLength += value;
    if (mode == "break") {
      minutes = breakLength;
      updateDisplay();
    }
    displayBreak.innerText = breakLength;
  }
  return breakLength;
}

function debugClock() {
  console.log("mode: " + mode);
  console.log("time: " + time);
  console.log("display: " + display);
  console.log("status: " + status);
}