import Image from "next/image";
import Link from "next/link";
import GameGrid from "@/components/GameGrid";
import { CATEGORIES, getAllGames, getLatestGames, slugify } from "@/lib/freetogame";

const FEATURED_CATEGORIES = [
  "mmorpg",
  "shooter",
  "battle-royale",
  "strategy",
  "moba",
  "racing",
  "survival",
  "low-spec",
];

export default async function HomePage() {
  const [games, latest] = await Promise.all([getAllGames(), getLatestGames(3)]);
  const featured = games[0];
  const popular = games.slice(0, 6);
  const categories = FEATURED_CATEGORIES.map((slug) =>
    CATEGORIES.find((category) => category.slug === slug),
  ).filter(Boolean);

  return (
    <div className="space-y-16 sm:space-y-20">
      <section className="hero-panel grid min-h-[26rem] items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:p-14">
        <div className="relative z-10 max-w-2xl space-y-6">
          <p className="eyebrow">Your next favorite costs $0</p>
          <h1 className="max-w-xl text-4xl font-black leading-[1.04] tracking-[-0.045em] text-white sm:text-6xl">
            Find your next <span className="text-lime-300">favorite</span> game.
          </h1>
          <p className="max-w-lg text-base leading-7 text-zinc-400 sm:text-lg">
            Big worlds. Ridiculous loadouts. One more match. Discover free-to-play games worth
            your time, all in one place.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/games"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-lime-300 px-5 text-sm font-extrabold text-zinc-950 transition hover:bg-lime-200"
            >
              Explore all {games.length} games
              <span aria-hidden="true">↗</span>
            </Link>
            <Link
              href="/category/mmorpg"
              className="inline-flex min-h-12 items-center rounded-xl border border-white/15 px-5 text-sm font-bold text-white transition hover:border-white/35"
            >
              Find your next MMO
            </Link>
          </div>
          <p className="text-xs text-zinc-500">
            Browse by genre, platform, or your own shortlist.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:ml-auto">
          {featured ? (
            <Link
              href={`/game/${slugify(featured.title)}`}
              className="group relative block aspect-[1.25/1] overflow-hidden rounded-2xl border border-white/15 bg-zinc-900"
            >
              <Image
                src={featured.thumbnail}
                alt={`${featured.title} cover art`}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="hero-art object-cover transition duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="eyebrow">A good place to start</p>
                <p className="mt-2 text-2xl font-black text-white sm:text-3xl">{featured.title}</p>
                <p className="mt-1 line-clamp-2 max-w-sm text-sm text-zinc-300">
                  {featured.short_description}
                </p>
              </div>
              <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-xs font-bold text-lime-300 backdrop-blur">
                {featured.genre}
              </span>
            </Link>
          ) : (
            <div className="aspect-[1.25/1] rounded-2xl border border-white/10 bg-white/[0.03]" />
          )}
          <span className="absolute -bottom-4 -left-4 -z-10 hidden h-24 w-24 rounded-full border border-lime-300/25 sm:block" />
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="eyebrow">The community is playing</p>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Popular right now
            </h2>
          </div>
          <Link
            href="/games"
            className="text-sm font-semibold text-lime-300 underline decoration-lime-300/40 underline-offset-4 hover:text-lime-200"
          >
            See the full lineup
          </Link>
        </div>
        <GameGrid games={popular} />
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="eyebrow">Fresh on the radar</p>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Recently released
            </h2>
          </div>
          <Link
            href="/games?sort=newest"
            className="text-sm font-semibold text-lime-300 underline decoration-lime-300/40 underline-offset-4 hover:text-lime-200"
          >
            Browse new releases
          </Link>
        </div>
        <GameGrid games={latest} />
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <p className="eyebrow">Pick your next rabbit hole</p>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            What are you in the mood for?
          </h2>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <li key={category.slug}>
              <Link
                href={`/category/${category.slug}`}
                className="category-link flex min-h-24 items-center justify-between rounded-xl p-4"
              >
                <span>
                  <span className="block text-lg font-extrabold text-white">{category.label}</span>
                  <span className="mt-1 block text-xs text-zinc-500">Free-to-play games</span>
                </span>
                <span aria-hidden="true" className="text-2xl font-light text-lime-300/70">
                  {["↗", "⌁", "◈", "⌘"][index % 4]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-lime-300/15 bg-lime-300/[0.04] p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="space-y-2">
          <p className="eyebrow">Your next session is waiting</p>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Not sure what to play?
          </h2>
          <p className="max-w-xl text-sm leading-6 text-zinc-400">
            Filter the catalog by genre and platform, sort by release date, and save games to
            come back to later.
          </p>
        </div>
        <Link
          href="/games"
          className="inline-flex min-h-12 shrink-0 items-center rounded-xl bg-lime-300 px-5 text-sm font-extrabold text-zinc-950 transition hover:bg-lime-200"
        >
          Build your shortlist <span aria-hidden="true" className="ml-2">↗</span>
        </Link>
      </section>
    </div>
  );
}
