export const SAVED_GAMES_EVENT = "f2p:saved-games-changed";
const STORAGE_KEY = "f2p-hub:saved-games";
const EMPTY_SNAPSHOT = { ids: [], error: "", loaded: false };

let snapshot = EMPTY_SNAPSHOT;
const subscribers = new Set();

export function readSavedGameIds() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];

  const ids = JSON.parse(saved);
  if (!Array.isArray(ids) || !ids.every((id) => typeof id === "number")) {
    throw new Error("Saved games data is invalid.");
  }

  return ids;
}

function notifySubscribers() {
  for (const subscriber of subscribers) {
    subscriber();
  }
}

function refreshSavedGames(event) {
  try {
    const ids =
      event.type === SAVED_GAMES_EVENT && Array.isArray(event.detail)
        ? event.detail
        : readSavedGameIds();
    snapshot = { ids, error: "", loaded: true };
  } catch {
    snapshot = {
      ids: [],
      error: "Saved games are unavailable. Check your browser storage settings.",
      loaded: true,
    };
  }
  notifySubscribers();
}

export function getSavedGamesSnapshot() {
  return snapshot;
}

export function getServerSavedGamesSnapshot() {
  return EMPTY_SNAPSHOT;
}

export function subscribeToSavedGames(subscriber) {
  subscribers.add(subscriber);

  if (subscribers.size === 1) {
    window.addEventListener(SAVED_GAMES_EVENT, refreshSavedGames);
    window.addEventListener("storage", refreshSavedGames);
    refreshSavedGames({ type: "initial" });
  }

  return () => {
    subscribers.delete(subscriber);
    if (subscribers.size === 0) {
      window.removeEventListener(SAVED_GAMES_EVENT, refreshSavedGames);
      window.removeEventListener("storage", refreshSavedGames);
    }
  };
}

export function toggleSavedGame(id) {
  const current = readSavedGameIds();
  const saved = current.includes(id)
    ? current.filter((savedId) => savedId !== id)
    : [...current, id];

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  window.dispatchEvent(new CustomEvent(SAVED_GAMES_EVENT, { detail: saved }));
  return saved;
}
