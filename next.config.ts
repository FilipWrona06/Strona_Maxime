import type { NextConfig } from "next";

const isIndexable = process.env.NEXT_PUBLIC_INDEXABLE === "true";
const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy.
 *
 * Pisana teraz, bo strona nie ładuje jeszcze niczego z zewnątrz — każdy
 * błąd widać od razu. Po dołożeniu analityki i osadzonych filmów trzeba
 * będzie rozszerzyć script-src, frame-src i connect-src.
 *
 * OGRANICZENIE: script-src ma 'unsafe-inline', bo Next wstrzykuje
 * skrypty inline do hydracji. Szczelna wersja wymaga generowania nonce
 * w middleware (komponent JsonLd ma już przygotowany prop nonce).
 * Mimo to frame-ancestors, base-uri, form-action i object-src
 * blokują realne klasy ataków.
 *
 * 'unsafe-eval' tylko w trybie deweloperskim — wymaga go Turbopack.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // Tailwind kompiluje się do arkusza, ale w komponentach są atrybuty
  // style (cienie tekstu w hero, opóźnienia animacji) — stąd inline.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self'",
  // vitals.vercel-insights.com potrzebne po włączeniu Speed Insights.
  "connect-src 'self' https://vitals.vercel-insights.com",
  // Po dodaniu filmów z YouTube dopisać:
  //   "frame-src 'self' https://www.youtube-nocookie.com",
  "frame-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  reactCompiler: true,

  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 70, 75],
    // Grafiki są statyczne i nie zmieniają się między wdrożeniami,
    // więc nie ma powodu odpytywać o nie co minutę. 30 dni.
    minimumCacheTTL: 2_592_000,
    // Po podpięciu CMS dojdzie tu remotePatterns z hostem obrazów.
  },

  async headers() {
    const security = [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      // Musi zgadzać się z frame-ancestors w CSP — rozbieżność bywa
      // interpretowana niespójnie przez różne przeglądarki.
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      {
        key: "Permissions-Policy",
        value: [
          "camera=()",
          "microphone=()",
          "geolocation=()",
          "payment=()",
          "usb=()",
          "magnetometer=()",
          "gyroscope=()",
          "interest-cohort=()",
        ].join(", "),
      },
    ];

    // Nagłówek HTTP jest pewniejszy niż meta robots: działa też dla plików,
    // obrazów i odpowiedzi, które nie są dokumentem HTML. Dopóki siedzimy
    // na domenie vercelowej, nic stąd nie ma prawa trafić do indeksu.
    //
    // Strict-Transport-Security celowo pominięty — Vercel dodaje go sam
    // dla domen z certyfikatem.
    const noindex = isIndexable
      ? []
      : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];

    return [{ source: "/:path*", headers: [...security, ...noindex] }];
  },

  /**
   * MIGRACJA: tutaj trafią przekierowania 301 ze starych adresów
   * maxime.com.pl na nową strukturę. Bez nich zaindeksowane URL-e
   * zaczną zwracać 404 w chwili przełączenia domeny.
   *
   * Listę adresów wyciągnij z Search Console STAREJ wersji, zanim
   * cokolwiek przełączysz — po podmianie nie będzie skąd jej odczytać.
   */
  // async redirects() {
  //   return [
  //     { source: "/stary-adres", destination: "/nowy-adres", permanent: true },
  //   ];
  // },
};

export default nextConfig;
