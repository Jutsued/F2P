// app/sitemap.js
// Next.js turns this into /sitemap.xml. Submit that URL in Google Search Console.
import { CATEGORIES, PLATFORMS, getAllGames, slugify } from "@/lib/freetogame";
import { SITE_URL } from "@/lib/site";

export default async function sitemap() {
  const games = await getAllGames();
  const now = new Date();

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    ...PLATFORMS.map((platform) => ({
      url: `${SITE_URL}/platform/${platform.slug}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    })),
    ...CATEGORIES.map((category) => ({
      url: `${SITE_URL}/category/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
    ...games.map((game) => ({
      url: `${SITE_URL}/game/${slugify(game.title)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    })),
  ];
}
