import GameExplorer from "@/components/GameExplorer";
import PageHeader from "@/components/PageHeader";
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
      <PageHeader crumbs={[{ label: "All games" }]} title="All free games">
        <p className="max-w-2xl leading-7 text-ink-2">
          The full catalog, {games.length} games. Filter by genre or platform, or let the site
          pick one for you. Saved games stay in this browser, no account needed.
        </p>
      </PageHeader>

      <GameExplorer
        games={games}
        initialSearch={initialSearch}
        initialSavedOnly={query.saved === "1"}
        initialSort={initialSort}
        initialPick={query.pick === "1"}
      />
    </div>
  );
}
