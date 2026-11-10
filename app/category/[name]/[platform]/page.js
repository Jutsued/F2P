// app/category/[name]/[platform]/page.js
// Targets searches like "free browser mmorpg" or "free pc shooter".
// Reuses the cached category list and filters locally: zero extra API calls.
import { notFound } from "next/navigation";
import GameGrid from "@/components/GameGrid";
import PageHeader from "@/components/PageHeader";
import {
  filterByPlatform,
  getCategory,
  getGamesByCategory,
  getPlatform,
} from "@/lib/freetogame";

export async function generateMetadata({ params }) {
  const { name, platform: platformSlug } = await params;
  const category = getCategory(name);
  const platform = getPlatform(platformSlug);

  if (!category || !platform) {
    return { title: "Page not found" };
  }

  return {
    title: `Free ${category.label} Games ${platform.phrase}`,
    description: `Every free-to-play ${category.label} game you can play ${platform.phrase.toLowerCase()}, sorted by popularity.`,
    alternates: { canonical: `/category/${category.slug}/${platform.slug}` },
  };
}

export default async function CategoryPlatformPage({ params }) {
  // Renaming on destructure: "platform" from the URL becomes platformSlug so it
  // doesn't clash with the platform object below
  const { name, platform: platformSlug } = await params;
  const category = getCategory(name);
  const platform = getPlatform(platformSlug);

  if (!category || !platform) {
    notFound();
  }

  const games = filterByPlatform(await getGamesByCategory(category.slug), platform.slug);

  if (games.length === 0) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        crumbs={[
          { href: `/category/${category.slug}`, label: category.label },
          { label: platform.label },
        ]}
        title={`Free ${category.label} games ${platform.phrase}`}
      >
        <p className="max-w-2xl leading-7 text-ink-2">
          {games.length} free-to-play {category.label} games, most played first.
        </p>
      </PageHeader>

      <GameGrid games={games} />
    </div>
  );
}
