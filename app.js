// Haal de benodigde elementen op
const startButton = document.getElementById('startButton');
const chordDisplay = document.getElementById('chordDisplay');
const chordsInput = document.getElementById('chordsInput');
const intervalSelector = document.getElementById('intervalSelector');
const tempoDisplay = document.getElementById('tempo');

// Lijst met standaard akkoorden
let chords = ['C', 'G', 'Am', 'F'];
let currentChordIndex = -1;
let beatCounter = 0;

// Instantie van de metronoom
const metronome = new Metronome(60); // Starttempo ingesteld op 60 bpm

// Update het tempo display
tempoDisplay.textContent = metronome.tempo;

// Functie om een nieuw akkoord weer te geven
function displayNextChord() {
    const randomIndex = getRandomChordIndex();
    chordDisplay.textContent = chords[randomIndex];
}

// Genereer een willekeurige index zonder direct herhaling
function getRandomChordIndex() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * chords.length);
    } while (randomIndex === currentChordIndex);
    currentChordIndex = randomIndex;
    return randomIndex;
}

// Wordt aangeroepen op iedere metronoomtik
metronome.onBeat = function () {
    beatCounter++;

    const beatsUntilChange = parseInt(intervalSelector.value);

    if (beatCounter >= beatsUntilChange) {
        displayNextChord();
        beatCounter = 0;
    }
};

// Start of stop de akkoordenwisselaar en metronoom
function toggleStartStop() {
    if (!metronome.isRunning) {
        startButton.textContent = 'Stop';

        beatCounter = 0;
        displayNextChord();

        // Start de metronoom
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
    } else {
        startButton.textContent = 'Start';

        // Stop de metronoom
        metronome.stop();

        // Vrijgeven van de wake lock
        if (window.wakeLock) {
            window.wakeLock.release().then(() => {
                console.log('Screen Wake Lock was released');
                window.wakeLock = null;
            }).catch(err => {
                console.error(`${err.name}, ${err.message}`);
            });
        }
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
        chords = chordsInput.value.split(',').map(chord => chord.trim());

        if (metronome.isRunning) {
            displayNextChord();
            beatCounter = 0;
        }
    });
});