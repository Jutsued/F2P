import Image from "next/image";
import Link from "next/link";
import { platformLabel, releaseYear, slugify } from "@/lib/freetogame";

// Numbered catalog rows: rank, thumbnail, title, then genre/platform/year/studio
// columns on wide screens (folded into one line on phones).
export default function RankedList({ games, start = 1 }) {
  return (
    <div className="border-b border-ink">
      <div
        aria-hidden="true"
        className="hidden grid-cols-[3rem_6rem_minmax(0,1fr)_8rem_7rem_4rem_10rem] gap-4 border-b border-ink py-2 font-mono text-xs uppercase text-muted md:grid"
      >
        <span>No.</span>
        <span />
        <span>Game</span>
        <span>Genre</span>
        <span>Platform</span>
        <span>Year</span>
        <span>Studio</span>
      </div>
      <ol>
        {games.map((game, index) => {
          const href = `/game/${slugify(game.title)}`;
          return (
            <li
              key={game.id}
              className="grid grid-cols-[2.25rem_5rem_minmax(0,1fr)] items-center gap-3 border-b border-rule py-3 last:border-b-0 md:grid-cols-[3rem_6rem_minmax(0,1fr)_8rem_7rem_4rem_10rem] md:gap-4"
            >
              <span className="font-mono text-sm text-muted">
                {String(start + index).padStart(2, "0")}
              </span>
              <Link href={href} tabIndex={-1} aria-hidden="true" className="block border border-ink">
                <Image
                  src={game.thumbnail}
                  alt=""
                  width={365}
                  height={206}
                  className="thumb aspect-[365/206] h-auto w-full object-cover"
                />
              </Link>
              <div className="min-w-0">
                <Link href={href} className="font-bold leading-tight hover:text-stamp hover:underline">
                  {game.title}
                </Link>
                <p className="mt-0.5 hidden truncate text-sm text-ink-2 md:block">
                  {game.short_description}
                </p>
                <p className="mt-0.5 font-mono text-xs text-muted md:hidden">
                  {game.genre} · {platformLabel(game)} · {releaseYear(game)}
                </p>
              </div>
              <span className="hidden text-sm md:block">{game.genre}</span>
              <span className="hidden text-sm md:block">{platformLabel(game)}</span>
              <span className="hidden font-mono text-sm md:block">{releaseYear(game)}</span>
              <span className="hidden truncate text-sm text-ink-2 md:block">{game.developer}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
