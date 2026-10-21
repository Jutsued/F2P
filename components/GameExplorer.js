"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import GameGrid from "@/components/GameGrid";
import { CATEGORIES, PLATFORMS, slugify } from "@/lib/freetogame";
import {
  getSavedGamesSnapshot,
  getServerSavedGamesSnapshot,
  subscribeToSavedGames,
} from "@/lib/saved-games";

const PAGE_SIZE = 24;

export default function GameExplorer({
  games,
  initialSearch = "",
  initialSavedOnly = false,
  initialSort = "popular",
}) {
  const [search, setSearch] = useState(initialSearch);
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");
  const [sort, setSort] = useState(initialSort);
  const [savedOnly, setSavedOnly] = useState(initialSavedOnly);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const savedGames = useSyncExternalStore(
    subscribeToSavedGames,
    getSavedGamesSnapshot,
    getServerSavedGamesSnapshot,
  );
  const { ids: savedIds, error: storageError, loaded: savedLoaded } = savedGames;

  const filteredGames = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    const selectedPlatform = PLATFORMS.find((item) => item.slug === platform);
    const results = games.filter((game) => {
      const matchesSearch =
        !query ||
        [
          game.title,
          game.short_description,
          game.genre,
          game.platform,
          game.developer,
          game.publisher,
        ]
          .filter(Boolean)
          .some((value) => value.toLocaleLowerCase().includes(query));
      const matchesGenre = !genre || slugify(game.genre || "") === genre;
      const matchesPlatform =
        !selectedPlatform || game.platform?.includes(selectedPlatform.match);
      const matchesSaved = !savedOnly || savedIds.includes(game.id);

      return matchesSearch && matchesGenre && matchesPlatform && matchesSaved;
    });

    if (sort === "title") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "newest") {
      results.sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""));
    }

    return results;
  }, [games, genre, platform, savedIds, savedOnly, search, sort]);

  function resetFilters() {
    setSearch("");
    setGenre("");
    setPlatform("");
    setSort("popular");
    setSavedOnly(false);
    setVisibleCount(PAGE_SIZE);
  }

  function updateFilter(setter, value) {
    setter(value);
    setVisibleCount(PAGE_SIZE);
  }

  const hasFilters = search || genre || platform || savedOnly;

  return (
    <div className="space-y-7">
      <section
        aria-label="Filter games"
        className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(12rem,1.5fr)_1fr_1fr_1fr_auto]">
          <label className="sr-only" htmlFor="catalog-search">
            Search by title, genre, or studio
          </label>
          <input
            id="catalog-search"
            type="search"
            value={search}
            onChange={(event) => updateFilter(setSearch, event.target.value)}
            placeholder="Search titles, genres, studios..."
            className="filter-control w-full px-4 text-sm sm:col-span-2 lg:col-span-1"
          />

          <label className="sr-only" htmlFor="genre-filter">
            Filter by genre
          </label>
          <select
            id="genre-filter"
            value={genre}
            onChange={(event) => updateFilter(setGenre, event.target.value)}
            className="filter-control w-full px-3 text-sm"
          >
            <option value="">All genres</option>
            {CATEGORIES.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.label}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="platform-filter">
            Filter by platform
          </label>
          <select
            id="platform-filter"
            value={platform}
            onChange={(event) => updateFilter(setPlatform, event.target.value)}
            className="filter-control w-full px-3 text-sm"
          >
            <option value="">All platforms</option>
            {PLATFORMS.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.label}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="sort-games">
            Sort games
          </label>
          <select
            id="sort-games"
            value={sort}
            onChange={(event) => updateFilter(setSort, event.target.value)}
            className="filter-control w-full px-3 text-sm"
          >
            <option value="popular">Most popular</option>
            <option value="newest">Recently released</option>
            <option value="title">Title A–Z</option>
          </select>

          <button
            type="button"
            onClick={() => {
              updateFilter(setSavedOnly, !savedOnly);
            }}
            aria-pressed={savedOnly}
            className={`min-h-12 rounded-xl border px-4 text-sm font-semibold transition ${
              savedOnly
                ? "border-lime-300 bg-lime-300 text-zinc-950"
                : "border-white/10 bg-white/[0.04] text-zinc-200 hover:border-lime-300/50"
            }`}
          >
            Saved
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
          <p className="text-sm text-zinc-400" aria-live="polite" aria-atomic="true">
            <span className="font-semibold text-white">{filteredGames.length}</span>{" "}
            {filteredGames.length === 1 ? "game" : "games"}
            {savedOnly ? " saved in this browser" : " in the catalog"}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-semibold text-lime-300 underline decoration-lime-300/40 underline-offset-4 hover:text-lime-200"
            >
              Clear filters
            </button>
          )}
        </div>
        {storageError && (
          <p role="status" className="mt-3 text-sm text-amber-300">
            {storageError}
          </p>
        )}
      </section>

      {savedOnly && !savedLoaded ? (
        <p className="py-10 text-center text-sm text-zinc-400">Loading your saved games…</p>
      ) : savedOnly && filteredGames.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center">
          <p className="font-semibold text-white">
            {savedIds.length === 0 ? "Your shortlist is empty." : "No saved games match these filters."}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Save games with the heart button and they&apos;ll be waiting here in this browser.
          </p>
          <Link
            href="/games"
            className="mt-5 inline-flex rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-lime-300 hover:border-lime-300/50"
          >
            Browse all games
          </Link>
        </div>
      ) : (
        <>
          <GameGrid games={filteredGames.slice(0, visibleCount)} />
          {filteredGames.length > visibleCount && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-lime-300/60 hover:text-lime-300"
              >
                Show more games
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
