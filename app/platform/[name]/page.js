// app/platform/[name]/page.js
import { notFound } from "next/navigation";
import GameGrid from "@/components/GameGrid";
import PageHeader from "@/components/PageHeader";
import { PLATFORMS, getGamesByPlatform, getPlatform } from "@/lib/freetogame";

// Only 2 platforms, so pre-build both
export function generateStaticParams() {
  return PLATFORMS.map((platform) => ({ name: platform.slug }));
}

export async function generateMetadata({ params }) {
  const { name } = await params;
  const platform = getPlatform(name);

  if (!platform) {
    return { title: "Platform not found" };
  }

  return {
    title: `Best Free Games ${platform.phrase}`,
    description: `Every free-to-play game you can play ${platform.phrase.toLowerCase()}, sorted by popularity.`,
    alternates: { canonical: `/platform/${platform.slug}` },
  };
}

export default async function PlatformPage({ params }) {
  const { name } = await params;
  const platform = getPlatform(name);

  if (!platform) {
    notFound();
  }

  const games = await getGamesByPlatform(platform.slug);

  return (
    <div className="space-y-8">
      <PageHeader crumbs={[{ label: platform.label }]} title={`Free games ${platform.phrase}`}>
        <p className="max-w-2xl leading-7 text-ink-2">
          {games.length} free-to-play games, most played first.
        </p>
      </PageHeader>

      <GameGrid games={games} />
    </div>
  );
}
