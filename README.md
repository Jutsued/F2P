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
3. Set `NEXT_PUBLIC_SITE_URL` to the canonical live URL (for example, `https://www.f2pgameshub.com`).
4. To enable Google Analytics 4, set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to the Measurement ID from your GA4 web data stream (it starts with `G-`). This ID is public, not a secret.
5. Deploy. Verify the domain in Google Search Console and submit `https://www.f2pgameshub.com/sitemap.xml`.

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

Google Analytics loads only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set. Publish an accurate privacy notice describing analytics and provide consent controls where required. Before monetizing, clearly label sponsored placements and test that any ad slots preserve page speed, accessibility, and the game content's visibility. Keep the FreeToGame attribution link in place.
