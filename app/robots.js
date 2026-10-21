// app/robots.js
// Next.js turns this into /robots.txt and points crawlers at the sitemap.
import { SITE_URL } from "@/lib/site";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
