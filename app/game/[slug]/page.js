import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FavoriteButton from "@/components/FavoriteButton";
import GameGrid from "@/components/GameGrid";
import SectionHeading from "@/components/SectionHeading";
import {
  getAllGames,
  getCategory,
  getGameBySlug,
  getRelatedGames,
  slugify,
} from "@/lib/freetogame";

export async function generateStaticParams() {
  const games = await getAllGames();
  return games.slice(0, 50).map((game) => ({ slug: slugify(game.title) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    return { title: "Game not found" };
  }

  return {
    title: `${game.title}: Free ${game.genre} Game, Specs & Screenshots`,
    description: game.short_description,
    alternates: { canonical: `/game/${slug}` },
    openGraph: {
      title: `${game.title} — Free ${game.genre} Game`,
      description: game.short_description,
      images: [{ url: game.thumbnail, alt: `${game.title} cover art` }],
      type: "website",
    },
  };
}

export default async function GamePage({ params }) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const related = await getRelatedGames(game, 4);
  const reqs = game.minimum_system_requirements;
  const category = getCategory(slugify(game.genre || ""));
  const details = [
    ["Genre", game.genre],
    ["Platform", game.platform],
    ["Developer", game.developer],
    ["Publisher", game.publisher],
    ["Released", game.release_date],
  ];

  return (
    <article className="space-y-16">
      <div className="space-y-6">
        <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          {category && (
            <>
              {" / "}
              <Link href={`/category/${category.slug}`} className="hover:text-ink">
                {category.label}
              </Link>
            </>
          )}
          {" / "}
          <span aria-current="page">{game.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
          <Image
            src={game.thumbnail}
            alt={`${game.title} cover art`}
            width={365}
            height={206}
            priority
            className="thumb aspect-[365/206] h-auto w-full border-2 border-ink object-cover"
          />

          <div className="flex flex-col gap-5">
            <h1 className="display text-5xl sm:text-6xl">{game.title}</h1>
            <p className="text-lg leading-8 text-ink-2">{game.short_description}</p>

            <div className="flex flex-wrap gap-3">
              <a
                href={game.game_url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="btn btn-solid"
              >
                Play {game.title} <span aria-hidden="true">↗</span>
              </a>
              <FavoriteButton gameId={game.id} gameTitle={game.title} large />
            </div>

            <dl className="mt-auto border-t-2 border-ink text-sm">
              {details.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[7rem_1fr] gap-3 border-b border-rule py-2"
                >
                  <dt className="font-mono text-xs uppercase leading-5 text-muted">{label}</dt>
                  <dd className="font-semibold">{value || "Not listed"}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <section aria-labelledby="about" className="space-y-5">
        <SectionHeading id="about" title={`About ${game.title}`} />
        <p className="max-w-3xl whitespace-pre-line leading-8 text-ink-2">
          {game.description || game.short_description}
        </p>
      </section>

      {reqs && (
        <section aria-labelledby="specs" className="space-y-5">
          <SectionHeading id="specs" title="Minimum system requirements" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem] max-w-3xl text-left text-sm">
              <tbody>
                {[
                  ["Operating system", reqs.os],
                  ["Processor", reqs.processor],
                  ["Memory", reqs.memory],
                  ["Graphics", reqs.graphics],
                  ["Storage", reqs.storage],
                ].map(([label, value]) => (
                  <tr key={label} className="border-b border-rule">
                    <th
                      scope="row"
                      className="w-44 py-2.5 pr-4 align-top font-mono text-xs font-normal uppercase leading-5 text-muted"
                    >
                      {label}
                    </th>
                    <td className="py-2.5">{value || "Not listed"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {game.screenshots?.length > 0 && (
        <section aria-labelledby="screenshots" className="space-y-5">
          <SectionHeading id="screenshots" title="Screenshots" />
          <div className="screenshot-strip">
            {game.screenshots.map((shot, index) => (
              <Image
                key={shot.id}
                src={shot.image}
                alt={`${game.title} gameplay screenshot ${index + 1}`}
                width={1280}
                height={720}
                className="thumb w-full border border-ink"
              />
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related" className="space-y-5">
          <SectionHeading
            id="related"
            title={`More ${game.genre} games`}
            link={category ? { href: `/category/${category.slug}`, label: `All ${category.label} games` } : null}
          />
          <GameGrid games={related} />
        </section>
      )}
    </article>
  );
}
