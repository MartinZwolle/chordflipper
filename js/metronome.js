class Metronome {
    constructor(tempo = 60) {
        this.audioContext = null;
        this.currentBeatInBar = 0;
        this.beatsPerBar = 4;
        this.tempo = tempo;

        this.lookahead = 25;
        this.scheduleAheadTime = 0.1;
        this.nextNoteTime = 0.0;

        this.isRunning = false;
        this.intervalID = null;

        this.onBeat = null;
    }

    nextNote() {
        const secondsPerBeat = 60.0 / this.tempo;

        this.nextNoteTime += secondsPerBeat;

        this.currentBeatInBar++;

        if (this.currentBeatInBar === this.beatsPerBar) {
            this.currentBeatInBar = 0;
        }
    }

    scheduleNote(beatNumber, time) {
        if (this.onBeat) {
            const delay = Math.max(0, (time - this.audioContext.currentTime) * 1000);
            setTimeout(() => this.onBeat(beatNumber), delay);
        }

        const oscillator = this.audioContext.createOscillator();
        const envelope = this.audioContext.createGain();

        oscillator.frequency.value = beatNumber % this.beatsPerBar === 0 ? 1000 : 800;

        envelope.gain.setValueAtTime(1, time);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

        oscillator.connect(envelope);
        envelope.connect(this.audioContext.destination);

        oscillator.start(time);
        oscillator.stop(time + 0.03);
    }

    scheduler() {
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
            this.scheduleNote(this.currentBeatInBar, this.nextNoteTime);
            this.nextNote();
        }
    }

    start() {
        if (this.isRunning) {
            return;
        }

        if (this.audioContext === null) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        this.isRunning = true;
        this.currentBeatInBar = 0;
        this.nextNoteTime = this.audioContext.currentTime + 0.05;

        this.intervalID = setInterval(() => this.scheduler(), this.lookahead);
    }

    stop() {
        this.isRunning = false;

        if (this.intervalID) {
            clearInterval(this.intervalID);
            this.intervalID = null;
        }
    }
}