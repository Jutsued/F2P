# F2P Hub

A fast, searchable discovery platform for free-to-play PC and browser games, built with Next.js (App Router) and Tailwind CSS. Game data comes from the [FreeToGame API](https://www.freetogame.com/api-doc) (free for commercial use, attribution required, max 10 requests/sec).

## What players can do

- Search the full catalog by game title, genre, platform, or studio.
- Filter by genre and platform, then sort by popularity, release date, or title.
- Save games to a browser-based shortlist without creating an account. Saved games stay in that browser and are not synced across devices.
- Browse dedicated game, genre, platform, and genre/platform pages.
- Open game details for descriptions, screenshots, publisher information, and listed PC system requirements.

## Run it locally

```bash
npm install
Copy-Item .env.example .env.local   # skip if .env.local already exists
npm run dev
```

Open http://localhost:3000.

## Before deploying

```bash
npm run build
```

This is the same build Vercel runs. If it passes here, it'll pass there.

## Deploy to Vercel (free)

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project**, import the repo, keep the defaults.
3. Add the environment variable `NEXT_PUBLIC_SITE_URL` set to your live URL (e.g. `https://f2p-hub.vercel.app`).
4. Deploy. Then submit `https://your-url/sitemap.xml` in Google Search Console.

## Where things live

| Path | What it is |
|------|------------|
| `lib/freetogame.js` | Every API call, category list, and caching rule |
| `lib/site.js` | Site name and URL |
| `lib/saved-games.js` | Browser-only saved game storage |
| `components/` | Shared game cards, interactive filters, and saved-game controls |
| `app/page.js` | Home page |
| `app/games/page.js` | Searchable, filterable game catalog |
| `app/game/[slug]/page.js` | Game detail pages (~400) |
| `app/category/[name]/page.js` | Category pages (~45) |
| `app/category/[name]/[platform]/page.js` | Category + platform pages |
| `app/platform/[name]/page.js` | PC and Browser pages |
| `app/sitemap.js`, `app/robots.js` | SEO files |
| `app/not-found.js`, `app/error.js` | 404 page and a safety-net error page |

## How caching works

Every API response is cached for 24 hours. The top 50 games, 8 big categories, and both platform pages are built at deploy time; everything else is built on its first visit and then cached. If FreeToGame goes down, visitors keep seeing the last good version of each page.

## Search visibility and future ads

Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin before deploying so metadata and `sitemap.xml` use the live domain. Submit `/sitemap.xml` to Google Search Console and verify the domain there.

There are no ad tags or tracking scripts in the app. Before monetizing, publish an accurate privacy policy, add consent controls where required, clearly label sponsored placements, and test that any ad slots preserve page speed, accessibility, and the game content's visibility. Keep the FreeToGame attribution link in place.
