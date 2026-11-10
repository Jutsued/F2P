// app/not-found.js
// Shown whenever a page calls notFound() or the URL matches nothing.
import Link from "next/link";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl space-y-4 border-y-2 border-ink py-16 text-center">
      <h1 className="display text-4xl sm:text-5xl">Page not found</h1>
      <p className="leading-7 text-ink-2">
        That game or category doesn&apos;t exist, or it was removed from the catalog.
      </p>
      <Link
        href="/"
        className="btn btn-solid"
      >
        Back to the home page
      </Link>
    </div>
  );
}
