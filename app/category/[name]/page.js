// app/category/[name]/page.js
import Link from "next/link";
import { notFound } from "next/navigation";
import GameGrid from "@/components/GameGrid";
import PageHeader from "@/components/PageHeader";
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
    <div className="space-y-8">
      <PageHeader crumbs={[{ label: category.label }]} title={`Best free ${category.label} games`}>
        <p className="max-w-2xl leading-7 text-ink-2">
          {games.length} free-to-play {category.label} games, most played first.
        </p>
        {platformLinks.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {platformLinks.map((platform) => (
              <li key={platform.slug}>
                <Link
                  href={`/category/${category.slug}/${platform.slug}`}
                  className="btn btn-outline min-h-9 px-3 text-sm"
                >
                  {platform.label} only
                  <span className="font-mono font-normal">{platform.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PageHeader>

      <GameGrid games={games} />
    </div>
  );
}
