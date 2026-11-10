"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import GameGrid from "@/components/GameGrid";
import {
  CATEGORIES,
  PLATFORMS,
  platformLabel,
  releaseYear,
  slugify,
} from "@/lib/freetogame";
import {
  getSavedGamesSnapshot,
  getServerSavedGamesSnapshot,
  subscribeToSavedGames,
} from "@/lib/saved-games";

const PAGE_SIZE = 24;

// Random game from the list, avoiding the current pick when there's a choice.
function pickRandom(list, current) {
  const pool = list.length > 1 && current ? list.filter((game) => game.id !== current.id) : list;
  return pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : null;
}

export default function GameExplorer({
  games,
  initialSearch = "",
  initialSavedOnly = false,
  initialSort = "popular",
  initialPick = false,
}) {
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState("");
  const [categoryResults, setCategoryResults] = useState({ slug: "", games: [] });
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [platform, setPlatform] = useState("");
  const [sort, setSort] = useState(initialSort);
  const [savedOnly, setSavedOnly] = useState(initialSavedOnly);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [pick, setPick] = useState(null);
  useEffect(() => {
    setSavedOnly(initialSavedOnly);
    setVisibleCount(PAGE_SIZE);
  }, [initialSavedOnly]);

  // Picking happens after hydration so server and client render the same HTML.
  useEffect(() => {
    if (initialPick) {
      setPick(pickRandom(games, null));
    }
  }, [initialPick, games]);

  useEffect(() => {
    if (!category) {
      setCategoryResults({ slug: "", games: [] });
      setCategoryError("");
      setCategoryLoading(false);
      return;
    }

    const controller = new AbortController();
    setCategoryLoading(true);
    setCategoryError("");

    fetch(`/api/games/category/${category}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("The selected category could not be loaded.");
        }
        return response.json();
      })
      .then((games) => {
        if (!Array.isArray(games)) {
          throw new Error("The selected category returned invalid game data.");
        }
        setCategoryResults({ slug: category, games });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setCategoryResults({ slug: category, games: [] });
          setCategoryError(error.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setCategoryLoading(false);
        }
      });

    return () => controller.abort();
  }, [category]);

  const savedGames = useSyncExternalStore(
    subscribeToSavedGames,
    getSavedGamesSnapshot,
    getServerSavedGamesSnapshot,
  );
  const { ids: savedIds, error: storageError, loaded: savedLoaded } = savedGames;

  const filteredGames = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    const selectedPlatform = PLATFORMS.find((item) => item.slug === platform);
    const categoryGames =
      category && categoryResults.slug === category ? categoryResults.games : games;
    const results = categoryGames.filter((game) => {
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
      const matchesPlatform =
        !selectedPlatform || game.platform?.includes(selectedPlatform.match);
      const matchesSaved = !savedOnly || savedIds.includes(game.id);

      return matchesSearch && matchesPlatform && matchesSaved;
    });

    if (sort === "title") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "newest") {
      results.sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""));
    }

    return results;
  }, [games, category, categoryResults, platform, savedIds, savedOnly, search, sort]);

  function resetFilters() {
    setSearch("");
    setCategory("");
    setPlatform("");
    setSort("popular");
    setSavedOnly(false);
    setVisibleCount(PAGE_SIZE);
  }

  function updateFilter(setter, value) {
    setter(value);
    setVisibleCount(PAGE_SIZE);
  }

  const hasFilters = search || category || platform || savedOnly;
  const listReady = !categoryLoading && !categoryError && !(savedOnly && !savedLoaded);
  const labelClass = "mb-1 block font-mono text-xs uppercase text-muted";

  return (
    <div className="space-y-8">
      <section aria-label="Filter games" className="border-b-2 border-ink pb-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(12rem,1.6fr)_1fr_1fr_1fr_auto] lg:items-end">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className={labelClass} htmlFor="catalog-search">
              Search
            </label>
            <input
              id="catalog-search"
              type="search"
              value={search}
              onChange={(event) => updateFilter(setSearch, event.target.value)}
              placeholder="Title, genre or studio"
              className="field w-full px-3 text-sm"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="genre-filter">
              Genre
            </label>
            <select
              id="genre-filter"
              value={category}
              onChange={(event) => updateFilter(setCategory, event.target.value)}
              className="field w-full px-2 text-sm"
            >
              <option value="">Any genre</option>
              {CATEGORIES.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="platform-filter">
              Platform
            </label>
            <select
              id="platform-filter"
              value={platform}
              onChange={(event) => updateFilter(setPlatform, event.target.value)}
              className="field w-full px-2 text-sm"
            >
              <option value="">PC and browser</option>
              {PLATFORMS.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.label} only
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="sort-games">
              Sort
            </label>
            <select
              id="sort-games"
              value={sort}
              onChange={(event) => updateFilter(setSort, event.target.value)}
              className="field w-full px-2 text-sm"
            >
              <option value="popular">Most played</option>
              <option value="newest">Newest first</option>
              <option value="title">Title A–Z</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              updateFilter(setSavedOnly, !savedOnly);
            }}
            aria-pressed={savedOnly}
            className={`btn ${savedOnly ? "border-stamp bg-stamp text-paper" : "btn-outline"}`}
          >
            Saved only
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-sm" aria-live="polite" aria-atomic="true">
            <span className="font-semibold">{filteredGames.length}</span>{" "}
            {filteredGames.length === 1 ? "game" : "games"}
            {savedOnly ? " saved in this browser" : ""}
            {hasFilters && (
              <>
                {" · "}
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-link font-sans font-semibold"
                >
                  Clear filters
                </button>
              </>
            )}
          </p>
          <button
            type="button"
            onClick={() => setPick(pickRandom(filteredGames, pick))}
            disabled={!listReady || filteredGames.length === 0}
            className="btn btn-solid"
          >
            {pick ? "Pick another" : "Pick one for me"}
          </button>
        </div>
        {storageError && (
          <p role="status" className="mt-3 text-sm text-stamp">
            {storageError}
          </p>
        )}
      </section>

      {pick && <PickedGame game={pick} onClose={() => setPick(null)} />}

      {categoryLoading ? (
        <p className="py-10 text-center font-mono text-sm text-muted">Loading genre…</p>
      ) : categoryError ? (
        <p role="alert" className="py-10 text-center text-sm text-stamp">
          {categoryError}
        </p>
      ) : savedOnly && !savedLoaded ? (
        <p className="py-10 text-center font-mono text-sm text-muted">Loading saved games…</p>
      ) : savedOnly && filteredGames.length === 0 ? (
        <div className="border border-dashed border-ink px-6 py-12 text-center">
          <p className="font-bold">
            {savedIds.length === 0 ? "Nothing saved yet." : "No saved games match these filters."}
          </p>
          <p className="mt-2 text-sm text-ink-2">
            Use the Save button on any game and it will be listed here. Saves stay in this
            browser.
          </p>
          <Link href="/games" className="btn btn-outline mt-5">
            Browse all games
          </Link>
        </div>
      ) : (
        <>
          <GameGrid games={filteredGames.slice(0, visibleCount)} />
          {filteredGames.length > visibleCount && (
            <div className="flex flex-col items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="btn btn-outline"
              >
                Show {Math.min(PAGE_SIZE, filteredGames.length - visibleCount)} more
              </button>
              <p className="font-mono text-xs text-muted">
                Showing {visibleCount} of {filteredGames.length}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PickedGame({ game, onClose }) {
  const href = `/game/${slugify(game.title)}`;

  return (
    <section
      aria-label="Random pick"
      aria-live="polite"
      className="relative grid gap-5 border-2 border-ink bg-card p-4 sm:grid-cols-[minmax(0,20rem)_1fr] sm:p-5"
    >
      <span className="stamp absolute -top-3 left-4 -rotate-2 bg-card px-2 py-0.5 text-xs">
        Picked at random
      </span>
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block border border-ink">
        <Image
          src={game.thumbnail}
          alt=""
          width={365}
          height={206}
          className="thumb aspect-[365/206] h-auto w-full object-cover"
        />
      </Link>
      <div className="flex flex-col gap-2">
        <h2 className="display text-3xl sm:text-4xl">{game.title}</h2>
        <p className="font-mono text-xs text-muted">
          {game.genre} · {platformLabel(game)} · {releaseYear(game)} · {game.developer}
        </p>
        <p className="leading-7 text-ink-2">{game.short_description}</p>
        <div className="mt-auto flex flex-wrap gap-3 pt-2">
          <Link href={href} className="btn btn-solid">
            See details
          </Link>
          {game.game_url && (
            <a
              href={game.game_url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="btn btn-outline"
            >
              Play now <span aria-hidden="true">↗</span>
            </a>
          )}
          <button type="button" onClick={onClose} className="text-link px-2 text-sm font-semibold">
            Dismiss
          </button>
        </div>
      </div>
    </section>
  );
}
