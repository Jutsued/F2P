"use client";

import { useState, useSyncExternalStore } from "react";
import {
  getSavedGamesSnapshot,
  getServerSavedGamesSnapshot,
  subscribeToSavedGames,
  toggleSavedGame,
} from "@/lib/saved-games";

// `large` is the bordered button on the game page; the default is the small
// text toggle at the bottom of each card.
export default function FavoriteButton({ gameId, gameTitle, large = false }) {
  const savedGames = useSyncExternalStore(
    subscribeToSavedGames,
    getSavedGamesSnapshot,
    getServerSavedGamesSnapshot,
  );
  const [actionError, setActionError] = useState("");
  const saved = savedGames.ids.includes(gameId);

  function handleClick() {
    try {
      toggleSavedGame(gameId);
      setActionError("");
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Could not save this game. Check your browser storage settings.",
      );
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={`${saved ? "Remove" : "Save"} ${gameTitle} ${saved ? "from" : "to"} saved games`}
        aria-pressed={saved}
        className={
          large
            ? `btn ${saved ? "border-stamp bg-stamp text-paper hover:bg-stamp-dark" : "btn-outline"}`
            : `inline-flex shrink-0 items-center gap-1 font-semibold ${
                saved ? "text-stamp" : "text-ink hover:text-stamp"
              }`
        }
      >
        <svg
          aria-hidden="true"
          className={large ? "h-4 w-4" : "h-3.5 w-3.5"}
          viewBox="0 0 24 24"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 3h12v18l-6-4.5L6 21Z" />
        </svg>
        {saved ? "Saved" : "Save"}
      </button>
      <span className="sr-only" aria-live="polite">
        {savedGames.error || actionError}
      </span>
    </>
  );
}
