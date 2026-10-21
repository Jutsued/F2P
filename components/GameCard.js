import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import { slugify } from "@/lib/freetogame";

export default function GameCard({ game }) {
  return (
    <article className="game-card group relative h-full overflow-hidden rounded-2xl">
      <div className="relative overflow-hidden bg-zinc-900">
        <Link
          href={`/game/${slugify(game.title)}`}
          className="block overflow-hidden"
          aria-label={`View ${game.title}`}
        >
          <Image
            src={game.thumbnail}
            alt={`${game.title} cover art`}
            width={365}
            height={206}
            className="game-card-image aspect-[365/206] h-auto w-full object-cover"
          />
        </Link>
        <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/65 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white backdrop-blur-md">
          Free to play
        </span>
        <FavoriteButton gameId={game.id} gameTitle={game.title} />
      </div>

      <div className="flex min-h-44 flex-col p-4">
        <h3 className="text-base font-bold leading-snug text-white">
          <Link
            href={`/game/${slugify(game.title)}`}
            className="rounded-sm transition-colors hover:text-lime-300"
          >
            {game.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">
          {game.short_description}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[0.68rem] text-zinc-300">
            {game.genre || "Free game"}
          </span>
          <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[0.68rem] text-zinc-400">
            {game.platform?.includes("Browser") ? "Browser" : "PC"}
          </span>
        </div>
      </div>
    </article>
  );
}
