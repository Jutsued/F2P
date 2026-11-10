import GameCard from "@/components/GameCard";

export default function GameGrid({ games }) {
  if (games.length === 0) {
    return (
      <div className="border border-dashed border-ink px-6 py-12 text-center">
        <p className="font-bold">No games match that.</p>
        <p className="mt-2 text-sm text-ink-2">Try a different search or another genre.</p>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {games.map((game) => (
        <li key={game.id} className="h-full">
          <GameCard game={game} />
        </li>
      ))}
    </ul>
  );
}
