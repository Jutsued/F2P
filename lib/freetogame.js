// lib/freetogame.js
// All FreeToGame API code lives here so pages stay about layout, not fetching.
// Terms: free for commercial use, attribution link required (it's in the
// layout footer), max 10 requests/second.

// Server-only override (no NEXT_PUBLIC_ prefix) so you can point at a mock API
// for testing. You normally never set this.
const BASE_URL = process.env.FREETOGAME_API_URL || "https://www.freetogame.com/api";
const ONE_DAY = 60 * 60 * 24;
const TIMEOUT_MS = 10_000;
const MAX_ATTEMPTS = 3;

export const CATEGORIES = [
  { slug: "mmorpg", label: "MMORPG" },
  { slug: "mmo", label: "MMO" },
  { slug: "shooter", label: "Shooter" },
  { slug: "moba", label: "MOBA" },
  { slug: "battle-royale", label: "Battle Royale" },
  { slug: "strategy", label: "Strategy" },
  { slug: "card", label: "Card" },
  { slug: "fantasy", label: "Fantasy" },
  { slug: "sci-fi", label: "Sci-Fi" },
  { slug: "anime", label: "Anime" },
  { slug: "fighting", label: "Fighting" },
  { slug: "racing", label: "Racing" },
  { slug: "sports", label: "Sports" },
  { slug: "social", label: "Social" },
  { slug: "sandbox", label: "Sandbox" },
  { slug: "open-world", label: "Open World" },
  { slug: "survival", label: "Survival" },
  { slug: "pvp", label: "PvP" },
  { slug: "pve", label: "PvE" },
  { slug: "pixel", label: "Pixel" },
  { slug: "voxel", label: "Voxel" },
  { slug: "zombie", label: "Zombie" },
  { slug: "turn-based", label: "Turn-Based" },
  { slug: "first-person", label: "First-Person" },
  { slug: "third-person", label: "Third-Person" },
  { slug: "top-down", label: "Top-Down" },
  { slug: "tank", label: "Tank" },
  { slug: "space", label: "Space" },
  { slug: "sailing", label: "Sailing" },
  { slug: "side-scroller", label: "Side-Scroller" },
  { slug: "superhero", label: "Superhero" },
  { slug: "permadeath", label: "Permadeath" },
  { slug: "mmofps", label: "MMOFPS" },
  { slug: "mmotps", label: "MMOTPS" },
  { slug: "mmorts", label: "MMORTS" },
  { slug: "3d", label: "3D" },
  { slug: "2d", label: "2D" },
  { slug: "action-rpg", label: "Action RPG" },
  { slug: "action", label: "Action" },
  { slug: "military", label: "Military" },
  { slug: "martial-arts", label: "Martial Arts" },
  { slug: "flight", label: "Flight" },
  { slug: "low-spec", label: "Low-Spec" },
  { slug: "tower-defense", label: "Tower Defense" },
  { slug: "horror", label: "Horror" },
];

// `match` is the text FreeToGame puts in each game's `platform` field.
// Filtering the cached full list locally saves API calls (and rate limit).
export const PLATFORMS = [
  { slug: "pc", label: "PC", phrase: "on PC", match: "Windows" },
  { slug: "browser", label: "Browser", phrase: "in Your Browser", match: "Web Browser" },
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Returns parsed JSON, or null for "not found".
// Throws on real failures (API down, timeout, bad status) ON PURPOSE:
// - During a background refresh, a thrown error makes Next.js keep serving the
//   last good cached page. Returning empty data would instead cache a broken page.
// - During `npm run build`, it fails the build, so Vercel keeps your previous
//   working deployment live instead of shipping empty pages.
// - For a page nobody has visited yet, the visitor gets a 500 error. That's the
//   honest answer: Google retries a 500 later instead of indexing a broken page.
async function fetchJson(path, attempt = 1) {
  let res;

  try {
    res = await fetch(`${BASE_URL}${path}`, {
      next: { revalidate: ONE_DAY },
      // Without a timeout, a hanging API would hang the page render too.
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    if (attempt < MAX_ATTEMPTS) {
      await wait(1000 * attempt);
      return fetchJson(path, attempt + 1);
    }
    throw new Error(`FreeToGame unreachable: ${path} (${error.message})`);
  }

  // 429 = "too many requests". Back off a little longer each try.
  if (res.status === 429 && attempt < MAX_ATTEMPTS) {
    await wait(1000 * attempt);
    return fetchJson(path, attempt + 1);
  }

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(`FreeToGame request failed: ${res.status} ${path}`);
  }

  return res.json();
}

export function slugify(title) {
  return title
    .toLowerCase()
    .normalize("NFKD") // splits "é" into "e" + accent mark...
    .replace(/[̀-ͯ]/g, "") // ...so we can drop the accent mark
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCategory(slug) {
  return CATEGORIES.find((category) => category.slug === slug) ?? null;
}

export function getPlatform(slug) {
  return PLATFORMS.find((platform) => platform.slug === slug) ?? null;
}

export function filterByPlatform(games, platformSlug) {
  const platform = getPlatform(platformSlug);
  if (!platform) return [];
  return games.filter((game) => game.platform?.includes(platform.match));
}

// Called by almost every page. That's fine: the response is cached for a day,
// so Next.js reuses it instead of hitting the API each time.
export async function getAllGames() {
  const games = await fetchJson("/games?sort-by=popularity");
  // The API sometimes answers with an object instead of an array when there
  // are no results, so only trust real arrays.
  return Array.isArray(games) ? games : [];
}

export async function getGameBySlug(slug) {
  const games = await getAllGames();
  const match = games.find((game) => slugify(game.title) === slug);
  if (!match) return null;
  return fetchJson(`/game?id=${match.id}`);
}

export async function getGamesByCategory(categorySlug) {
  // Only known categories reach the API, so /category/garbage costs nothing.
  if (!getCategory(categorySlug)) return [];
  const games = await fetchJson(`/games?category=${categorySlug}&sort-by=popularity`);
  return Array.isArray(games) ? games : [];
}

export async function getGamesByPlatform(platformSlug) {
  const games = await getAllGames();
  return filterByPlatform(games, platformSlug);
}

export async function getLatestGames(limit = 6) {
  const games = await getAllGames();
  // Copy before sorting: .sort() mutates, and we don't want to reorder the
  // shared popularity-sorted list other code relies on.
  return [...games]
    .sort((a, b) => (b.release_date ?? "").localeCompare(a.release_date ?? ""))
    .slice(0, limit);
}

export async function getRelatedGames(game, limit = 6) {
  const games = await getAllGames();
  return games
    .filter((other) => other.genre === game.genre && other.id !== game.id)
    .slice(0, limit);
}
