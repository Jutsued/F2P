// app/error.js
// Safety net for unexpected errors while a page renders on request. Note: if
// FreeToGame is down, pages that were already cached keep showing their last
// good version, and a page being built for the very first time returns a 500
// instead (that's Next.js's behavior for static pages, and it's fine for SEO).
"use client"; // error boundaries must be client components (they use onClick)

export default function Error({ reset }) {
  return (
    <div className="space-y-4 py-16 text-center">
      <h1 className="text-3xl font-bold">Game data is temporarily unavailable</h1>
      <p className="text-zinc-400">
        Our data source isn&apos;t responding right now. Please try again in a minute.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded bg-emerald-700 px-4 py-2 font-semibold hover:bg-emerald-600"
      >
        Try again
      </button>
    </div>
  );
}
