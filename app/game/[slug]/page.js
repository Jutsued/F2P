import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FavoriteButton from "@/components/FavoriteButton";
import GameGrid from "@/components/GameGrid";
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

  const related = await getRelatedGames(game);
  const reqs = game.minimum_system_requirements;
  const category = getCategory(slugify(game.genre || ""));
  const details = [
    ["Genre", game.genre],
    ["Platform", game.platform],
    ["Publisher", game.publisher],
    ["Developer", game.developer],
    ["Released", game.release_date],
  ];

  return (
    <article className="space-y-14">
      <div className="space-y-6">
        <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          {category && (
            <>
              {" "}
              /{" "}
              <Link href={`/category/${category.slug}`} className="hover:text-white">
                {category.label}
              </Link>
            </>
          )}{" "}
          / {game.title}
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-center">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
            <Image
              src={game.thumbnail}
              alt={`${game.title} cover art`}
              width={365}
              height={206}
              priority
              className="aspect-[365/206] h-auto w-full object-cover"
            />
            <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/65 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-lime-300 backdrop-blur">
              Free to play
            </span>
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <p className="eyebrow">{game.genre} · {game.platform}</p>
              <h1 className="text-4xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl">
                {game.title}
              </h1>
              <p className="leading-7 text-zinc-400">{game.short_description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={game.game_url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-lime-300 px-5 text-sm font-extrabold text-zinc-950 transition hover:bg-lime-200"
              >
                Play {game.title} <span aria-hidden="true" className="ml-2">↗</span>
              </a>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10">
                <FavoriteButton gameId={game.id} gameTitle={game.title} />
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-3 pt-2">
              {details.map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3">
                  <dt className="text-xs text-zinc-500">{label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-zinc-200">{value || "Not listed"}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="eyebrow">The rundown</p>
            <h2 className="text-2xl font-black tracking-tight text-white">About {game.title}</h2>
          </div>
          <p className="whitespace-pre-line leading-8 text-zinc-300">
            {game.description || game.short_description}
          </p>
        </div>
        <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <p className="eyebrow">Quick facts</p>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-xs text-zinc-500">Play style</dt>
              <dd className="mt-1 font-semibold text-white">{game.genre || "Not listed"}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Available on</dt>
              <dd className="mt-1 font-semibold text-white">{game.platform || "Not listed"}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Developer</dt>
              <dd className="mt-1 font-semibold text-white">{game.developer || "Not listed"}</dd>
            </div>
          </dl>
        </aside>
      </section>

      {reqs && (
        <section className="space-y-5">
          <div className="space-y-2">
            <p className="eyebrow">Before you download</p>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Minimum system requirements
            </h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <tbody className="divide-y divide-white/[0.07]">
                {[
                  ["Operating system", reqs.os],
                  ["Processor", reqs.processor],
                  ["Memory", reqs.memory],
                  ["Graphics", reqs.graphics],
                  ["Storage", reqs.storage],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <th scope="row" className="w-44 bg-white/[0.025] px-4 py-3 font-medium text-zinc-400">
                      {label}
                    </th>
                    <td className="px-4 py-3 text-zinc-200">{value || "Not listed"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {game.screenshots?.length > 0 && (
        <section className="space-y-5">
          <div className="space-y-2">
            <p className="eyebrow">A peek at the action</p>
            <h2 className="text-2xl font-black tracking-tight text-white">Screenshots</h2>
          </div>
          <div className="screenshot-strip">
            {game.screenshots.map((shot, index) => (
              <Image
                key={shot.id}
                src={shot.image}
                alt={`${game.title} gameplay screenshot ${index + 1}`}
                width={1280}
                height={720}
                className="w-full rounded-xl border border-white/10 bg-zinc-900"
              />
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="space-y-6">
          <div className="space-y-2">
            <p className="eyebrow">Keep the streak going</p>
            <h2 className="text-2xl font-black tracking-tight text-white">
              More free {game.genre} games
            </h2>
          </div>
          <GameGrid games={related} />
        </section>
      )}
    </article>
  );
}
