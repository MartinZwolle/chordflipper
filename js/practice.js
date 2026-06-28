// ===============================
// AKKOORDLOGICA
// ===============================

function updateChordsFromInput() {
    const inputChords = chordsInput.value
        .split(',')
        .map(chord => chord.trim())
        .filter(chord => chord.length > 0);

    state.chords = inputChords.length > 0 ? inputChords : ['C'];
    state.currentChordIndex = -1;
}

function getRandomChordIndex() {
    if (state.chords.length === 1) {
        state.currentChordIndex = 0;
        return 0;
    }

    let randomIndex;

    do {
        randomIndex = Math.floor(Math.random() * state.chords.length);
    } while (randomIndex === state.currentChordIndex);

    state.currentChordIndex = randomIndex;
    return randomIndex;
}

function showNextChord() {
    const randomIndex = getRandomChordIndex();
    const chord = state.chords[randomIndex];

    showChord(chord);
}


// ===============================
// COUNTDOWN
// ===============================

function startCountdown(callback) {
    setMode(AppState.COUNTDOWN);

    const steps = ['3', '2', '1', 'GO'];
    let stepIndex = 0;

    showCountdown(steps[stepIndex]);

    const countdownTimer = setInterval(() => {
        stepIndex++;

        if (stepIndex < steps.length) {
            showCountdown(steps[stepIndex]);
            return;
        }

        clearInterval(countdownTimer);
        hideCountdown();
        callback();

    }, 1000);
}


// ===============================
// WAKE LOCK
// ===============================

function requestWakeLock() {
    if (!('wakeLock' in navigator)) {
        return;
    }

    navigator.wakeLock.request('screen')
        .then(lock => {
            window.wakeLock = lock;
        })
        .catch(error => {
            console.error(`${error.name}, ${error.message}`);
        });
}

function releaseWakeLock() {
    if (!window.wakeLock) {
        return;
    }

    window.wakeLock.release()
        .then(() => {
            window.wakeLock = null;
        })
        .catch(error => {
            console.error(`${error.name}, ${error.message}`);
        });
}


// ===============================
// PRACTICE FLOW
// ===============================

function preparePractice() {
    updateChordsFromInput();

    hideSettings();
    showPauseButton();

    setStartButtonRunning();
    setPauseButtonPaused();

    state.beatCounter = 0;
}

function startPractice() {
    preparePractice();

    startCountdown(() => {
    setMode(AppState.RUNNING);

    const totalBeats = parseInt(intervalSelector.value, 10);

    createBeatIndicator(totalBeats);
    showBeatIndicator();
    updateBeatIndicator(1);

    metronome.start(true);
    requestWakeLock();
    });
}

function stopPractice() {
    setMode(AppState.IDLE);

    metronome.stop();
    releaseWakeLock();

    showSettings();
    hidePauseButton();
    hideBeatIndicator();

    setStartButtonIdle();
    setPauseButtonPaused();

    state.beatCounter = 0;
}

function pausePractice() {
    if (!isRunning()) {
        return;
    }

    setMode(AppState.PAUSED);

    metronome.stop();
    releaseWakeLock();

    setPauseButtonResume();
}

function resumePractice() {
    if (!isPaused()) {
        return;
    }

    setMode(AppState.RUNNING);

    metronome.start(false);
    requestWakeLock();

    setPauseButtonPaused();
}

function toggleStartStop() {
    if (isCountingDown()) {
        return;
    }

    if (isIdle()) {
        startPractice();
        return;
    }

    stopPractice();
}

function togglePauseResume() {
    if (isCountingDown()) {
        return;
    }

    if (isPaused()) {
        resumePractice();
        return;
    }

    pausePractice();
}


// ===============================
// METRONOOM CALLBACK
// ===============================

function handleBeat() {
    if (!isRunning()) {
        return;
    }

    state.beatCounter++;

    const beatsUntilChange = parseInt(intervalSelector.value, 10);

    // Nieuw akkoord op de eerste tel
    if (state.beatCounter === 1) {
        showNextChord();
    }

    // Beat-indicator bijwerken
    updateBeatIndicator(state.beatCounter);

    // Nieuwe cyclus starten
    if (state.beatCounter >= beatsUntilChange) {
        state.beatCounter = 0;
    }
}