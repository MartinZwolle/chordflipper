// Haal de benodigde elementen op
const startButton = document.getElementById('startButton');
const chordDisplay = document.getElementById('chordDisplay');
const chordsInput = document.getElementById('chordsInput');
const intervalSelector = document.getElementById('intervalSelector');
const tempoDisplay = document.getElementById('tempo');
const countdownOverlay = document.getElementById('countdownOverlay');
const countdownText = document.getElementById('countdownText');

// Lijst met standaard akkoorden
let chords = ['C', 'G', 'Am', 'F'];
let currentChordIndex = -1;
let beatCounter = 0;
let isCountingDown = false;

// Instantie van de metronoom
const metronome = new Metronome(60);

// Update het tempo display
tempoDisplay.textContent = metronome.tempo;

// Functie om een nieuw akkoord weer te geven
function displayNextChord() {
    if (chords.length === 0) {
        chordDisplay.textContent = '-';
        return;
    }

    const randomIndex = getRandomChordIndex();
    chordDisplay.textContent = chords[randomIndex];
}

// Genereer een willekeurige index zonder direct herhaling
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

// Countdown tonen
function startCountdown(callback) {
    isCountingDown = true;
    startButton.disabled = true;

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
            isCountingDown = false;
            callback();
        }
    }, 1000);
}

// Start de oefening
function startPractice() {
    startButton.textContent = 'Stop';

    beatCounter = 0;
    displayNextChord();

    metronome.start();

    // Vraag schermvergrendeling aan
    if ('wakeLock' in navigator) {
        navigator.wakeLock.request('screen').then(lock => {
            console.log('Screen Wake Lock is active');
            window.wakeLock = lock;
        }).catch(err => {
            console.error(`${err.name}, ${err.message}`);
        });
    }
}

// Stop de oefening
function stopPractice() {
    startButton.textContent = 'Start';

    metronome.stop();

    if (window.wakeLock) {
        window.wakeLock.release().then(() => {
            console.log('Screen Wake Lock was released');
            window.wakeLock = null;
        }).catch(err => {
            console.error(`${err.name}, ${err.message}`);
        });
    }
}

// Start of stop de akkoordenwisselaar en metronoom
function toggleStartStop() {
    if (isCountingDown) {
        return;
    }

    if (!metronome.isRunning) {
        startCountdown(startPractice);
    } else {
        stopPractice();
    }
}

// Update het wisselinterval van de akkoorden
function updateInterval() {
    beatCounter = 0;
}

// Update het tempo van de metronoom
function updateTempo(event) {
    metronome.tempo += parseInt(event.target.dataset.change);
    tempoDisplay.textContent = metronome.tempo;
}

// Event listeners
startButton.addEventListener('click', toggleStartStop);
intervalSelector.addEventListener('change', updateInterval);

const tempoChangeButtons = document.getElementsByClassName('tempo-change');
for (let i = 0; i < tempoChangeButtons.length; i++) {
    tempoChangeButtons[i].addEventListener('click', updateTempo);
}

// Laad de akkoordenlijst bij pagina-laden
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

// Wordt aangeroepen op iedere metronoomtik
metronome.onBeat = function () {
    beatCounter++;

    const beatsUntilChange = parseInt(intervalSelector.value);

    if (beatCounter >= beatsUntilChange) {
        displayNextChord();
        beatCounter = 0;
    }
};