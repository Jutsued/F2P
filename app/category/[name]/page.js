// app/category/[name]/page.js
import Link from "next/link";
import { notFound } from "next/navigation";
import GameGrid from "@/components/GameGrid";
import {
  PLATFORMS,
  filterByPlatform,
  getCategory,
  getGamesByCategory,
} from "@/lib/freetogame";

// Pre-build the biggest categories; the rest build on first visit.
const PREBUILT_CATEGORIES = [
  "mmorpg",
  "shooter",
  "moba",
  "battle-royale",
  "strategy",
  "card",
  "fantasy",
  "low-spec",
];

export function generateStaticParams() {
  return PREBUILT_CATEGORIES.map((name) => ({ name }));
}

export async function generateMetadata({ params }) {
  const { name } = await params;
  const category = getCategory(name);

  if (!category) {
    return { title: "Category not found" };
  }

  return {
    title: `Best Free ${category.label} Games`,
    description: `Browse free-to-play ${category.label} games for PC and browser, ranked by popularity, with system requirements and screenshots.`,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params }) {
  const { name } = await params;
  const category = getCategory(name);

  if (!category) {
    notFound();
  }

  const games = await getGamesByCategory(category.slug);

  // An empty list page is "thin content" that hurts SEO, so 404 it instead
  if (games.length === 0) {
    notFound();
  }

  // Only link to platform sub-pages that actually have games
  const platformLinks = PLATFORMS.map((platform) => ({
    ...platform,
    count: filterByPlatform(games, platform.slug).length,
  })).filter((platform) => platform.count > 0);

  return (
    <div className="space-y-10">
      <header className="space-y-4 border-b border-white/10 pb-8">
        <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
          <Link href="/" className="hover:text-white">
            Home
          </Link>{" "}
          / {category.label}
        </nav>
        <p className="eyebrow">Find your next obsession</p>
        <h1 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
          Best free {category.label} games
        </h1>
        <p className="max-w-2xl leading-7 text-zinc-400">
          {games.length} free-to-play {category.label} games, sorted by popularity.
        </p>
        {platformLinks.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {platformLinks.map((platform) => (
              <Link
                key={platform.slug}
                href={`/category/${category.slug}/${platform.slug}`}
                className="category-link rounded-full px-4 py-2 text-sm text-zinc-300"
              >
                {platform.label} games <span className="text-zinc-500">· {platform.count}</span>
              </Link>
            ))}
          </div>
        )}
      </header>

      <GameGrid games={games} />
    </div>
  );
}
