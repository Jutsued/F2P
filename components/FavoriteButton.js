"use client";

import { useState, useSyncExternalStore } from "react";
import {
  getSavedGamesSnapshot,
  getServerSavedGamesSnapshot,
  subscribeToSavedGames,
  toggleSavedGame,
} from "@/lib/saved-games";

export default function FavoriteButton({ gameId, gameTitle }) {
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
        title={saved ? "Remove from saved games" : "Save for later"}
        className={`absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border backdrop-blur-md transition ${
          saved
            ? "border-lime-300/40 bg-lime-300 text-zinc-950"
            : "border-white/15 bg-black/55 text-white hover:border-lime-300/60 hover:text-lime-300"
        }`}
      >
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
        </svg>
      </button>
      <span className="sr-only" aria-live="polite">
          {savedGames.error || actionError}
      </span>
    </>
  );
}
