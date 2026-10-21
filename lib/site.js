// lib/site.js
// One place for site-wide constants so the layout, sitemap, and robots.txt
// never disagree about the site's name or URL.

export const SITE_NAME = "F2P Hub";

// NEXT_PUBLIC_ is fine here because the site URL isn't a secret.
// The trailing-slash strip avoids URLs like https://site.com//game/x
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");
