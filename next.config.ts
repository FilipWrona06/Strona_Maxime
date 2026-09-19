import type { NextConfig } from "next";

const isIndexable = process.env.NEXT_PUBLIC_INDEXABLE === "true";

const nextConfig: NextConfig = {
  reactCompiler: true,

  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 70, 75],
  },

  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];

    // Nagłówek HTTP jest pewniejszy niż meta robots: działa też dla plików,
    // obrazów i odpowiedzi, które nie są dokumentem HTML. Dopóki siedzimy
    // na domenie vercelowej, nic stąd nie ma prawa trafić do indeksu.
    const noindex = isIndexable
      ? []
      : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];

    return [{ source: "/:path*", headers: [...security, ...noindex] }];
  },
};

export default nextConfig;
