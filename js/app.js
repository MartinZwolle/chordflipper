// ===============================
// APP INITIALISATIE
// ===============================

const metronome = new Metronome(60);

function initApp() {
    updateTempoDisplay(metronome.tempo);

    startButton.addEventListener('click', toggleStartStop);
    pauseButton.addEventListener('click', togglePauseResume);

    intervalSelector.addEventListener('change', () => {
        state.beatCounter = 0;
    });

    chordsInput.addEventListener('change', () => {
        updateChordsFromInput();

        if (isRunning()) {
            showNextChord();
            state.beatCounter = 0;
        }
    });

    const tempoChangeButtons = document.getElementsByClassName('tempo-change');

    for (let i = 0; i < tempoChangeButtons.length; i++) {
        tempoChangeButtons[i].addEventListener('click', updateTempo);
    }

    metronome.onBeat = handleBeat;

    showChord(state.chords[0]);
}

function updateTempo(event) {
    metronome.tempo += parseInt(event.target.dataset.change, 10);

    if (metronome.tempo < 30) {
        metronome.tempo = 30;
    }

    if (metronome.tempo > 240) {
        metronome.tempo = 240;
    }

    updateTempoDisplay(metronome.tempo);
}

initApp();