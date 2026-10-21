// app/category/[name]/[platform]/page.js
// Targets searches like "free browser mmorpg" or "free pc shooter".
// Reuses the cached category list and filters locally: zero extra API calls.
import Link from "next/link";
import { notFound } from "next/navigation";
import GameGrid from "@/components/GameGrid";
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
    <div className="space-y-10">
      <header className="space-y-4 border-b border-white/10 pb-8">
        <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
          <Link href="/" className="hover:text-white">
            Home
          </Link>{" "}
          /{" "}
          <Link href={`/category/${category.slug}`} className="hover:text-white">
            {category.label}
          </Link>{" "}
          / {platform.label}
        </nav>
        <p className="eyebrow">A better fit for your setup</p>
        <h1 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
          Free {category.label} Games {platform.phrase}
        </h1>
        <p className="max-w-2xl leading-7 text-zinc-400">
          {games.length} free-to-play {category.label} games, sorted by popularity.
        </p>
      </header>

      <GameGrid games={games} />
    </div>
  );
}
