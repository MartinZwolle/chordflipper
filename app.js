const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const chordDisplay = document.getElementById('chordDisplay');
const chordsInput = document.getElementById('chordsInput');
const intervalSelector = document.getElementById('intervalSelector');
const tempoDisplay = document.getElementById('tempo');
const countdownOverlay = document.getElementById('countdownOverlay');
const countdownText = document.getElementById('countdownText');

let chords = ['C', 'G', 'Am', 'F'];
let currentChordIndex = -1;
let beatCounter = 0;
let isCountingDown = false;
let isPaused = false;
let hasStarted = false;

const metronome = new Metronome(60);
tempoDisplay.textContent = metronome.tempo;

// Zorg dat pauzeknop bij laden verborgen is
pauseButton.style.display = 'none';

function showPauseButton() {
    pauseButton.style.display = 'inline-block';
}

function hidePauseButton() {
    pauseButton.style.display = 'none';
}

function displayNextChord() {
    if (chords.length === 0) {
        chordDisplay.textContent = '-';
        return;
    }

    const randomIndex = getRandomChordIndex();
    chordDisplay.textContent = chords[randomIndex];
}

function getRandomChordIndex() {
    if (chords.length === 1) {
        currentChordIndex = 0;
        return 0;
    }

    let randomIndex;

    do {
        randomIndex = Math.floor(Math.random() * chords.length);
    } while (randomIndex === currentChordIndex);

    currentChordIndex = randomIndex;
    return randomIndex;
}

function startCountdown(callback) {
    isCountingDown = true;
    startButton.disabled = true;
    pauseButton.disabled = true;

    const steps = ['3', '2', '1', 'Go'];
    let stepIndex = 0;

    countdownText.textContent = steps[stepIndex];
    countdownOverlay.classList.remove('hidden');

    const countdownTimer = setInterval(() => {
        stepIndex++;

        if (stepIndex < steps.length) {
            countdownText.textContent = steps[stepIndex];
        } else {
            clearInterval(countdownTimer);

            countdownOverlay.classList.add('hidden');
            startButton.disabled = false;
            pauseButton.disabled = false;
            isCountingDown = false;

            callback();
        }
    }, 1000);
}

function requestWakeLock() {
    if ('wakeLock' in navigator) {
        navigator.wakeLock.request('screen').then(lock => {
            window.wakeLock = lock;
        }).catch(err => {
            console.error(`${err.name}, ${err.message}`);
        });
    }
}

function releaseWakeLock() {
    if (window.wakeLock) {
        window.wakeLock.release().then(() => {
            window.wakeLock = null;
        }).catch(err => {
            console.error(`${err.name}, ${err.message}`);
        });
    }
}

function beginRunning() {
    isPaused = false;
    pauseButton.textContent = 'Pauze';

    beatCounter = 0;
    displayNextChord();

    metronome.start();
    requestWakeLock();
}

function startPractice() {
    hasStarted = true;
    startButton.textContent = 'Stop / Reset';
    pauseButton.textContent = 'Pauze';
    showPauseButton();

    startCountdown(beginRunning);
}

function pausePractice() {
    if (!metronome.isRunning) {
        return;
    }

    isPaused = true;
    pauseButton.textContent = 'Hervat';

    metronome.stop();
    releaseWakeLock();
}

function resumePractice() {
    if (!isPaused) {
        return;
    }

    startCountdown(() => {
        isPaused = false;
        pauseButton.textContent = 'Pauze';

        metronome.start();
        requestWakeLock();
    });
}

function stopPractice() {
    hasStarted = false;
    isPaused = false;
    beatCounter = 0;

    startButton.textContent = 'Start';
    pauseButton.textContent = 'Pauze';
    hidePauseButton();

    metronome.stop();
    releaseWakeLock();
}

function toggleStartStop() {
    if (isCountingDown) {
        return;
    }

    if (!hasStarted) {
        startPractice();
    } else {
        stopPractice();
    }
}

function togglePauseResume() {
    if (isCountingDown) {
        return;
    }

    if (isPaused) {
        resumePractice();
    } else {
        pausePractice();
    }
}

function updateInterval() {
    beatCounter = 0;
}

function updateTempo(event) {
    metronome.tempo += parseInt(event.target.dataset.change);
    tempoDisplay.textContent = metronome.tempo;
}

startButton.addEventListener('click', toggleStartStop);
pauseButton.addEventListener('click', togglePauseResume);
intervalSelector.addEventListener('change', updateInterval);

const tempoChangeButtons = document.getElementsByClassName('tempo-change');

for (let i = 0; i < tempoChangeButtons.length; i++) {
    tempoChangeButtons[i].addEventListener('click', updateTempo);
}

document.addEventListener('DOMContentLoaded', () => {
    chordsInput.addEventListener('change', () => {
        chords = chordsInput.value
            .split(',')
            .map(chord => chord.trim())
            .filter(chord => chord.length > 0);

        if (metronome.isRunning) {
            displayNextChord();
            beatCounter = 0;
        }
    });
});

metronome.onBeat = function () {
    beatCounter++;

    const beatsUntilChange = parseInt(intervalSelector.value);

    if (beatCounter >= beatsUntilChange) {
        displayNextChord();
        beatCounter = 0;
    }
};