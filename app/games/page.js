import Link from "next/link";
import GameExplorer from "@/components/GameExplorer";
import { getAllGames } from "@/lib/freetogame";

export const metadata = {
  title: "Explore free-to-play games",
  description:
    "Search and filter free-to-play games by title, genre, platform, and release date. Save your favorites to your own browser-based shortlist.",
  alternates: { canonical: "/games" },
};

export default async function GamesPage({ searchParams }) {
  const [games, query] = await Promise.all([getAllGames(), searchParams]);
  const initialSearch = typeof query.q === "string" ? query.q : "";
  const initialSort = ["popular", "newest", "title"].includes(query.sort)
    ? query.sort
    : "popular";

  return (
    <div className="space-y-8">
      <header className="max-w-3xl space-y-4">
        <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
          <Link href="/" className="hover:text-white">
            Home
          </Link>{" "}
          / Discover
        </nav>
        <p className="eyebrow">The whole free-to-play universe</p>
        <h1 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
          Find your next game.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-400">
          Search hundreds of free-to-play games. Narrow it down by genre or platform, sort
          the way you like, and keep a shortlist right in your browser.
        </p>
      </header>

      <GameExplorer
        games={games}
        initialSearch={initialSearch}
        initialSavedOnly={query.saved === "1"}
        initialSort={initialSort}
      />
    </div>
  );
}
