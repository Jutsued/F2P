import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import { platformLabel, releaseYear, slugify } from "@/lib/freetogame";

export default function GameCard({ game }) {
  const href = `/game/${slugify(game.title)}`;

  return (
    <article className="flex h-full flex-col border border-ink bg-card">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block border-b border-ink">
        <Image
          src={game.thumbnail}
          alt=""
          width={365}
          height={206}
          className="thumb aspect-[365/206] h-auto w-full object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-lg font-bold leading-tight">
          <Link href={href} className="hover:text-stamp hover:underline">
            {game.title}
          </Link>
        </h3>
        <p className="mt-1 font-mono text-xs text-muted">
          {game.genre || "Game"} · {platformLabel(game)} · {releaseYear(game)}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-2">{game.short_description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-rule pt-2.5 text-xs">
          <span className="truncate text-muted">{game.developer}</span>
          <FavoriteButton gameId={game.id} gameTitle={game.title} />
        </div>
      </div>
    </article>
  );
}
