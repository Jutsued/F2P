// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Vercel's free tier caps how many images it will optimize per month.
    // 400 games + screenshots would blow past that, and FreeToGame's images are
    // already small JPGs. next/image still lazy-loads and reserves space, so we
    // keep the good parts (no layout shift) without the cost.
    unoptimized: true,
  },
};

export default nextConfig;
