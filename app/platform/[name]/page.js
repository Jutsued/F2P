// app/platform/[name]/page.js
import Link from "next/link";
import { notFound } from "next/navigation";
import GameGrid from "@/components/GameGrid";
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
    <div className="space-y-10">
      <header className="space-y-4 border-b border-white/10 pb-8">
        <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
          <Link href="/" className="hover:text-white">
            Home
          </Link>{" "}
          / {platform.label}
        </nav>
        <p className="eyebrow">Play how you want</p>
        <h1 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
          Best free games {platform.phrase}
        </h1>
        <p className="max-w-2xl leading-7 text-zinc-400">
          {games.length} free-to-play games, sorted by popularity.
        </p>
      </header>

      <GameGrid games={games} />
    </div>
  );
}
