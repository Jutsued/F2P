import GameCard from "@/components/GameCard";

export default function GameGrid({ games }) {
  if (games.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center">
        <p className="font-semibold text-white">No games found just yet.</p>
        <p className="mt-2 text-sm text-zinc-500">Try a different search or explore another category.</p>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-5">
      {games.map((game) => (
        <li key={game.id} className="h-full">
          <GameCard game={game} />
        </li>
      ))}
    </ul>
  );
}
