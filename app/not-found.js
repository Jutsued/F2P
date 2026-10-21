// app/not-found.js
// Shown whenever a page calls notFound() or the URL matches nothing.
import Link from "next/link";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="space-y-4 py-16 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-zinc-400">
        That game or category doesn&apos;t exist, or it was removed from the catalog.
      </p>
      <Link
        href="/"
        className="inline-block rounded bg-emerald-700 px-4 py-2 font-semibold hover:bg-emerald-600"
      >
        Back to all games
      </Link>
    </div>
  );
}
