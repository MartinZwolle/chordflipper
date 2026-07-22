// ===============================
// APP INITIALISATIE
// ===============================

const metronome = new Metronome(60);
const favoriteSetSelect = document.getElementById('favoriteSetSelect');
const favoriteSetName = document.getElementById('favoriteSetName');
const saveFavoriteSetButton = document.getElementById('saveFavoriteSetButton');
const deleteFavoriteSetButton = document.getElementById('deleteFavoriteSetButton');

function initApp() {
    updateTempoDisplay(metronome.tempo);

    startButton.addEventListener('click', toggleStartStop);
    pauseButton.addEventListener('click', togglePauseResume);
    saveFavoriteSetButton.addEventListener('click', saveCurrentFavoriteSet);


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
    
    renderFavoriteSets();
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
}2
function renderFavoriteSets() {
    const favorites = loadFavorites();

    favoriteSetSelect.innerHTML = `
        <option value="">Kies een akkoordenset</option>
    `;

    favorites.forEach((favorite, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = favorite.name;

        favoriteSetSelect.appendChild(option);
    });
}

function saveCurrentFavoriteSet() {
    const name = favoriteSetName.value.trim();
    const chords = chordsInput.value.trim();

    if (!name || !chords) {
        return;
    }

    const favorites = loadFavorites();

    favorites.push({
        name,
        chords
    });

    saveFavorites(favorites);

    favoriteSetName.value = '';

    renderFavoriteSets();
}

initApp();