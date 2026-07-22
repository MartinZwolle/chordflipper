const FAVORITES_KEY = "chordflipper-favorites";

function loadFavorites() {
    const json = localStorage.getItem(FAVORITES_KEY);

    if (!json) {
        return [];
    }

    try {
        return JSON.parse(json);
    } catch {
        return [];
    }
}

function saveFavorites(favorites) {
    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
    );
}