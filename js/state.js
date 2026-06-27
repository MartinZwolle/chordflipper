const AppState = {
    IDLE: 'idle',
    COUNTDOWN: 'countdown',
    RUNNING: 'running',
    PAUSED: 'paused'
};

const state = {
    mode: AppState.IDLE,
    chords: ['C', 'G', 'Am', 'F'],
    currentChordIndex: -1,
    beatCounter: 0
};

function setMode(mode) {
    state.mode = mode;
}

function isIdle() {
    return state.mode === AppState.IDLE;
}

function isCountingDown() {
    return state.mode === AppState.COUNTDOWN;
}

function isRunning() {
    return state.mode === AppState.RUNNING;
}

function isPaused() {
    return state.mode === AppState.PAUSED;
}