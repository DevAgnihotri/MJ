/*--------------------------------*/
/* Pomodoro Clock                 */
/*--------------------------------*/

var display = document.getElementById("display");
var displayTime = document.getElementById("time-left");
var timerLabel = document.getElementById("timer-label");
var displaySession = document.getElementById("session-length");
var displayBreak = document.getElementById("break-length");
var startStopButton = document.getElementById("start_stop");
var resetButton = document.getElementById("reset");
var buttons = document.getElementsByClassName("button");
var alarm = document.getElementById("beep");

var mode = "session";
var sessionLength = 25;
var breakLength = 5;
var time = 0;
var status = 0;
var minutes = sessionLength;
var seconds = 0;
var display = updateDisplay();
var countdown = null;

// Initialize the timer and MJ theme
init();

function init() {
  // Set up button event listeners
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    button.addEventListener("click", function() {
      getInput(this);
    });
  }
  
  // Set up keyboard controls
  keyboard();
  
  // Initialize MJ theme
  document.body.style.backgroundImage = `url(${mjBackgrounds[0]})`;
  console.log("MJ Pomodoro Clock initialized with background: " + mjBackgrounds[0]);
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
    status = 1;
    startStopButton.innerText = "Stop";
    startStopButton.classList.remove('start');
    startStopButton.classList.add('stop');
    console.log("Timer started");
  } else {
    clearInterval(countdown);
    status = 0;
    startStopButton.innerText = "Start";
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
    timerLabel.innerText = "Break";
    minutes = breakLength;
    updateDisplay();
    mode = "break";
    
    // Play random MJ song during break
    playRandomMJSong();
    
    // Change background image for break
    changeBackground();
    return;
  } else {
    console.log("Break finished");
    timerLabel.innerText = "Session";
    minutes = sessionLength;
    updateDisplay();
    mode = "session";
    
    // Stop any playing MJ song when session starts
    stopMJSongs();
    
    // Reset background to first image for session
    document.body.style.backgroundImage = `url(${mjBackgrounds[0]})`;
    return;
  }
}

// Play a random MJ song
function playRandomMJSong() {
  // Stop any currently playing songs
  stopMJSongs();
  
  // Choose a random song
  var randomIndex = Math.floor(Math.random() * mjSongs.length);
  currentSong = mjSongs[randomIndex];
  
  // Play the selected song
  currentSong.volume = 0.5; // Set volume to 50%
  currentSong.play();
  console.log("Playing MJ song: " + randomIndex);
}

// Stop all MJ songs
function stopMJSongs() {
  mjSongs.forEach(song => {
    song.pause();
    song.currentTime = 0;
  });
  currentSong = null;
}

// Change background image
function changeBackground() {
  currentBackground = (currentBackground + 1) % mjBackgrounds.length;
  document.body.style.backgroundImage = `url(${mjBackgrounds[currentBackground]})`;
  console.log("Changed background to: " + mjBackgrounds[currentBackground]);
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
  mode = "session";
  timerLabel.innerText = "Session";
  minutes = sessionLength;
  seconds = 0;
  updateDisplay();
  
  // Reset MJ theme elements
  stopMJSongs();
  currentBackground = 0;
  document.body.style.backgroundImage = `url(${mjBackgrounds[0]})`;
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