import { Archivo, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

if (GA_MEASUREMENT_ID && !/^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID)) {
  throw new Error(
    "NEXT_PUBLIC_GA_MEASUREMENT_ID must be a valid Google Analytics 4 measurement ID.",
  );
}

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Find your next free game`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "An index of free-to-play games for PC and browser. Browse by genre and platform, check system requirements, and save games for later.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Find your next free game`,
    description: "An index of free-to-play games for PC and browser, ranked by popularity.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Find your next free game`,
    description: "An index of free-to-play games for PC and browser.",
  },
};

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-plex-mono",
});

const NAV_LINKS = [
  { href: "/games", label: "All games" },
  { href: "/platform/pc", label: "PC" },
  { href: "/platform/browser", label: "Browser" },
  { href: "/games?saved=1", label: "Saved" },
];

const FOOTER_LINKS = [
  { href: "/games", label: "All games" },
  { href: "/category/shooter", label: "Shooters" },
  { href: "/category/mmorpg", label: "MMORPGs" },
  { href: "/category/strategy", label: "Strategy" },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <head>
        {/* Every thumbnail comes from FreeToGame. Opening the connection up
            front saves ~0.5–1s on the first image, which otherwise pays for
            DNS + TLS. */}
        <link rel="preconnect" href="https://www.freetogame.com" />
      </head>
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-3 focus:font-bold focus:text-paper"
        >
          Skip to content
        </a>

        <header className="sticky top-0 z-20 border-b-2 border-ink bg-paper">
          <nav
            aria-label="Main navigation"
            className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-3 sm:px-6 lg:px-8"
          >
            <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="F2P Hub home">
              <span aria-hidden="true" className="stamp -rotate-3 px-1.5 py-0.5 text-sm">
                F2P
              </span>
              <span aria-hidden="true" className="display text-2xl">
                Hub
              </span>
            </Link>

            <ul className="order-3 flex w-full items-center gap-6 overflow-x-auto whitespace-nowrap text-sm font-semibold sm:order-none sm:w-auto">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-stamp">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <form action="/games" role="search" className="ml-auto w-full sm:w-auto">
              <label className="sr-only" htmlFor="site-search">
                Search free games
              </label>
              <div className="flex">
                <input
                  id="site-search"
                  name="q"
                  type="search"
                  placeholder="Title, genre or studio"
                  className="field min-h-10 w-full px-3 text-sm sm:w-56"
                />
                <button type="submit" className="btn btn-solid -ml-px min-h-10 px-3 text-sm">
                  Search
                </button>
              </div>
            </form>
          </nav>
        </header>

        <main id="main" className="mx-auto min-h-[65vh] max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          {children}
        </main>

        <footer className="mt-20 border-t-2 border-ink">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm sm:grid-cols-[1fr_auto] sm:px-6 lg:px-8">
            <div className="space-y-2">
              <p className="display text-xl">{SITE_NAME}</p>
              <p className="max-w-xl leading-6 text-ink-2">
                An index of free-to-play games for PC and browser. Game details and artwork
                belong to their publishers.
              </p>
              <p className="text-ink-2">
                Game data from{" "}
                <a
                  href="https://www.freetogame.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link font-semibold text-ink"
                >
                  FreeToGame
                </a>
                , refreshed daily.
              </p>
            </div>
            <ul className="flex flex-wrap content-start gap-x-6 gap-y-2 font-semibold">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-stamp">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </footer>

        {GA_MEASUREMENT_ID ? (
          <>
            <Script id="google-analytics-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
            <Script
              id="google-analytics"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
          </>
        ) : null}
      </body>
    </html>
  );
}
