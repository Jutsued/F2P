import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Find your next free game`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "A better way to find your next free-to-play game. Explore hundreds of PC and browser games by genre, platform, and what you feel like playing.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Find your next free game`,
    description:
      "Explore free-to-play PC and browser games. Find your next favorite by genre, platform, and mood.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Find your next free game`,
    description: "Explore free-to-play PC and browser games.",
  },
};

const NAV_LINKS = [
  { href: "/games", label: "Discover" },
  { href: "/games?saved=1", label: "My saved games" },
  { href: "/platform/pc", label: "PC" },
  { href: "/platform/browser", label: "Browser" },
  { href: "/category/mmorpg", label: "MMORPG" },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-lime-300 focus:px-4 focus:py-3 focus:font-bold focus:text-black"
        >
          Skip to content
        </a>

        <header className="site-header">
          <nav
            aria-label="Main navigation"
            className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-7 gap-y-3 px-4 py-3 sm:px-6 lg:px-8"
          >
            <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="F2P Hub home">
              <span aria-hidden="true" className="brand-mark">
                F2P
              </span>
              <span className="text-sm font-black tracking-tight text-white sm:text-base">
                {SITE_NAME}
                <span className="ml-1 text-lime-300">.</span>
              </span>
            </Link>

            <ul className="order-3 flex w-full items-center gap-5 overflow-x-auto whitespace-nowrap text-sm text-zinc-400 sm:order-none sm:w-auto">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-lime-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <form action="/games" role="search" className="ml-auto w-full sm:w-auto">
              <label className="sr-only" htmlFor="site-search">
                Search free games
              </label>
              <div className="relative">
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
                <input
                  id="site-search"
                  name="q"
                  type="search"
                  placeholder="Find a game..."
                  className="filter-control w-full py-2 pl-9 pr-3 text-sm sm:w-48"
                />
              </div>
            </form>
          </nav>
        </header>

        <main id="main" className="mx-auto min-h-[65vh] max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          {children}
        </main>

        <footer className="mt-16 border-t border-white/10">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-9 text-sm sm:grid-cols-[1fr_auto] sm:px-6 lg:px-8">
            <div className="space-y-2">
              <Link href="/" className="font-bold text-white">
                {SITE_NAME}
                <span className="text-lime-300">.</span>
              </Link>
              <p className="max-w-xl leading-6 text-zinc-500">
                A community-minded starting point for finding your next free-to-play game.
                Game details and artwork belong to their respective publishers.
              </p>
              <p className="text-zinc-500">
                Game data provided by{" "}
                <a
                  href="https://www.freetogame.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-300 underline decoration-zinc-600 underline-offset-4 hover:text-lime-300"
                >
                  FreeToGame
                </a>
                .
              </p>
            </div>
            <div className="flex flex-wrap content-start gap-x-5 gap-y-2 text-zinc-400">
              <Link href="/games" className="hover:text-lime-300">
                Browse all games
              </Link>
              <Link href="/category/shooter" className="hover:text-lime-300">
                Shooters
              </Link>
              <Link href="/category/strategy" className="hover:text-lime-300">
                Strategy
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
