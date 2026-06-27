// ===============================
// UI ELEMENTEN
// ===============================

const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');

const chordDisplay = document.getElementById('chordDisplay');
const countdownDisplay = document.getElementById('countdownDisplay');

const settingsPanel = document.getElementById('settingsPanel');

const chordsInput = document.getElementById('chordsInput');
const intervalSelector = document.getElementById('intervalSelector');

const tempoDisplay = document.getElementById('tempo');


// ===============================
// KNOPPEN
// ===============================

function showPauseButton() {
    pauseButton.classList.remove('hidden');
}

function hidePauseButton() {
    pauseButton.classList.add('hidden');
}

function setStartButtonRunning() {
    startButton.textContent = "Stop";
}

function setStartButtonIdle() {
    startButton.textContent = "Start";
}

function setPauseButtonPaused() {
    pauseButton.textContent = "Pauze";
}

function setPauseButtonResume() {
    pauseButton.textContent = "Hervat";
}


// ===============================
// OEFENSCHERM
// ===============================

function showChord(chord) {
    chordDisplay.textContent = chord;
}

function showCountdown(value) {

    countdownDisplay.textContent = value;
    countdownDisplay.classList.remove("hidden");

}

function hideCountdown() {

    countdownDisplay.classList.add("hidden");

}


// ===============================
// SETTINGS
// ===============================

function showSettings() {

    settingsPanel.classList.remove("hidden");

}

function hideSettings() {

    settingsPanel.classList.add("hidden");

}


// ===============================
// TEMPO
// ===============================

function updateTempoDisplay(tempo) {

    tempoDisplay.textContent = tempo;

}