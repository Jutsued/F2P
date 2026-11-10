import Image from "next/image";
import Link from "next/link";
import GameGrid from "@/components/GameGrid";
import RankedList from "@/components/RankedList";
import SectionHeading from "@/components/SectionHeading";
import {
  PLATFORMS,
  filterByPlatform,
  getAllGames,
  getCategory,
  getLatestGames,
  platformLabel,
  releaseYear,
  slugify,
} from "@/lib/freetogame";

// Counts each game's main genre, most common first. FreeToGame's genre labels
// are inconsistent (" MMORPG", "Card Game" vs "Card"), so labels are trimmed
// and one-off genres are left out. Genres with their own category page link
// there; the rest fall back to a catalog search.
function countGenres(games) {
  const counts = new Map();
  for (const game of games) {
    const genre = game.genre?.trim();
    if (genre) counts.set(genre, (counts.get(genre) ?? 0) + 1);
  }
  return [...counts]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([genre, count]) => {
      const category = getCategory(slugify(genre));
      return {
        genre,
        count,
        href: category ? `/category/${category.slug}` : `/games?q=${encodeURIComponent(genre)}`,
      };
    });
}

export default async function HomePage() {
  const [games, latest] = await Promise.all([getAllGames(), getLatestGames(4)]);
  const [top, ...rest] = games;
  const genres = countGenres(games);
  const platforms = PLATFORMS.map((platform) => ({
    ...platform,
    count: filterByPlatform(games, platform.slug).length,
  }));

  return (
    <div className="space-y-16 sm:space-y-20">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="space-y-6">
          <h1 className="display max-w-2xl text-5xl sm:text-7xl">
            Find a free game worth installing.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-ink-2">
            {games.length} free-to-play games for PC and browser, ranked by how many people play
            them. Every listing has screenshots, the studio behind it, and minimum specs.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/games" className="btn btn-solid">
              Browse all {games.length}
            </Link>
            <Link href="/games?pick=1" className="btn btn-outline">
              Pick one for me
            </Link>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-sm text-ink-2">
            {platforms.map((platform) => (
              <li key={platform.slug}>
                <Link href={`/platform/${platform.slug}`} className="text-link">
                  {platform.label}: {platform.count}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {top && (
          <Link
            href={`/game/${slugify(top.title)}`}
            className="group relative block border-2 border-ink bg-card"
          >
            <span className="stamp absolute -top-3 left-4 z-10 -rotate-2 bg-card px-2 py-0.5 text-xs">
              No. 1 most played
            </span>
            <Image
              src={top.thumbnail}
              alt=""
              width={365}
              height={206}
              priority
              className="thumb aspect-[365/206] h-auto w-full border-b-2 border-ink object-cover"
            />
            <div className="p-4">
              <p className="display text-3xl group-hover:text-stamp">{top.title}</p>
              <p className="mt-1 font-mono text-xs text-muted">
                {top.genre} · {platformLabel(top)} · {releaseYear(top)} · {top.developer}
              </p>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-2">
                {top.short_description}
              </p>
            </div>
          </Link>
        )}
      </section>

      <section aria-labelledby="most-played" className="space-y-4">
        <SectionHeading
          id="most-played"
          title="Most played"
          link={{ href: "/games", label: "Full ranking" }}
        />
        <RankedList games={rest.slice(0, 10)} start={2} />
      </section>

      <section aria-labelledby="new-releases" className="space-y-5">
        <SectionHeading
          id="new-releases"
          title="New releases"
          link={{ href: "/games?sort=newest", label: "All by release date" }}
        />
        <GameGrid games={latest} />
      </section>

      <section aria-labelledby="genres" className="space-y-5">
        <SectionHeading id="genres" title="By genre" />
        <ul className="grid gap-x-10 gap-y-1 sm:grid-cols-2 lg:grid-cols-4">
          {genres.map(({ genre, count, href }) => (
            <li key={genre}>
              <Link href={href} className="group flex items-baseline gap-2 py-1.5">
                <span className="font-semibold group-hover:text-stamp group-hover:underline">
                  {genre}
                </span>
                <span aria-hidden="true" className="leader" />
                <span className="font-mono text-sm text-muted">
                  {count}
                  <span className="sr-only"> games</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
