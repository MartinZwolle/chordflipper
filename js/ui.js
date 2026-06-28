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
const beatIndicator = document.getElementById("beatIndicator");


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
// ===============================
// BEAT INDICATOR
// ===============================

function createBeatIndicator(totalBeats) {

    beatIndicator.innerHTML = "";

    for (let i = 1; i <= totalBeats; i++) {

        if (i > 1 && (i - 1) % 4 === 0) {
            const gap = document.createElement("div");
            gap.className = "beat-gap";
            beatIndicator.appendChild(gap);
        }

        const dot = document.createElement("div");
        dot.className = "beat-dot";
        beatIndicator.appendChild(dot);
    }
}

function updateBeatIndicator(currentBeat) {

    const dots = beatIndicator.querySelectorAll(".beat-dot");

    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentBeat - 1);
    });

}

function showBeatIndicator() {
    beatIndicator.classList.remove("hidden");
}

function hideBeatIndicator() {
    beatIndicator.classList.add("hidden");
}