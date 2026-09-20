// data/site.ts
//
// ŹRÓDŁO PRAWDY: dane i konfiguracja. Nazwa, podmiot prawny, adres,
// kontakt, profile, trasy, metadane SEO.
//
// NIE MA tu treści wyświetlanej na stronie — nagłówki, akapity, motto
// i hasła żyją w komponentach, które je renderują. Wyjątkiem są tytuł
// i opis meta, bo to nie copy strony, tylko wpisy dla wyszukiwarki.
//
// Celowo BEZ JSX — plik importują robots.ts, sitemap.ts i blok metadata
// w root layoucie, więc musi zostać czystym TypeScriptem.

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/** Czy ta instancja ma trafić do indeksu wyszukiwarek.
 *  Na Vercelu trzymamy false aż do przenosin.
 *  UWAGA: odczytywane przy BUILDZIE — zmiana wymaga redeployu. */
export const isIndexable = process.env.NEXT_PUBLIC_INDEXABLE === "true";

/* ═══════════════════════════ SOCJALE ═══════════════════════════ */

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "youtube"
  | "linkedin"
  | "patronite"
  | "tiktok";

export type Social = {
  platform: SocialPlatform;
  url: string;
  /** Etykieta dla czytników ekranu — sam kształt ikony nic im nie mówi. */
  label: string;
};

/** Adresy profili zawierają stare handle (@stowarzyszeniemaxime).
 *  Nie ruszamy ich — zmiana zrywa istniejące linki, a rozpoznanie marki
 *  załatwia sameAs w danych strukturalnych. Do zmiany są natomiast
 *  NAZWY WYŚWIETLANE na tych profilach, po stronie klienta. */
export const socials: Social[] = [
  {
    platform: "facebook",
    url: "https://www.facebook.com/stowarzyszeniemaxime/",
    label: "Maxime na Facebooku",
  },
  {
    platform: "instagram",
    url: "https://www.instagram.com/maxime.orchestra/",
    label: "Maxime na Instagramie",
  },
  {
    platform: "youtube",
    url: "https://www.youtube.com/@stowarzyszeniemaxime",
    label: "Maxime na YouTube",
  },
  {
    platform: "tiktok",
    url: "https://www.tiktok.com/@maxime.orchestra",
    label: "Maxime na TikToku",
  },
  {
    platform: "linkedin",
    url: "https://www.linkedin.com/company/stowarzyszenie-maxime/",
    label: "Maxime na LinkedIn",
  },
  {
    platform: "patronite",
    url: "https://patronite.pl/stowarzyszeniemaxime",
    label: "Wesprzyj Maxime na Patronite",
  },
];

/** Idzie do sameAs w JSON-LD. Sześć potwierdzonych profili to mocny
 *  sygnał tożsamości przy kolizji nazwy z Orkiestrą Maximus
 *  i dwiema Fundacjami Maxima. */
export const socialUrls = socials.map((s) => s.url);

const patronite = socials.find((s) => s.platform === "patronite");

/* ═══════════════════════════ TRASY ═══════════════════════════
   JEDNO źródło dla nawigacji, stopki i sitemapy. Wcześniej te same
   ścieżki były wypisane w trzech listach, co gwarantuje rozjazd:
   wystarczy dodać podstronę do menu i zapomnieć o sitemapie.
   ═══════════════════════════════════════════════════════════════ */

type Route = {
  path: string;
  label: string;
  /** Pokazuj w menu głównym. */
  nav?: boolean;
  /** Pokazuj w kolumnie "Eksploruj" w stopce. */
  footer?: boolean;
  /** Pokazuj w pasku prawnym na dole stopki. */
  legal?: boolean;
  /** Podświetlaj też na trasach zagnieżdżonych,
   *  np. /wydarzenia/nazwa-koncertu → aktywne "Wydarzenia". */
  matchNested?: boolean;
  /** Dane do sitemapy. Pominięcie = trasa nie trafia do mapy. */
  sitemap?: {
    priority: number;
    changeFrequency:
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never";
  };
};

export const routes: Route[] = [
  {
    path: "/",
    label: "Strona główna",
    footer: true,
    sitemap: { priority: 1.0, changeFrequency: "weekly" },
  },
  {
    path: "/o-nas",
    label: "O nas",
    nav: true,
    footer: true,
    sitemap: { priority: 0.8, changeFrequency: "monthly" },
  },
  {
    path: "/oferta",
    label: "Oferta",
    nav: true,
    footer: true,
    sitemap: { priority: 0.9, changeFrequency: "monthly" },
  },
  {
    path: "/wydarzenia",
    label: "Wydarzenia",
    nav: true,
    footer: true,
    matchNested: true,
    sitemap: { priority: 0.9, changeFrequency: "weekly" },
  },
  {
    path: "/aktualnosci",
    label: "Aktualności",
    nav: true,
    footer: true,
    matchNested: true,
    sitemap: { priority: 0.7, changeFrequency: "weekly" },
  },
  {
    path: "/galeria",
    label: "Galeria",
    nav: true,
    footer: true,
    matchNested: true,
    sitemap: { priority: 0.5, changeFrequency: "monthly" },
  },
  {
    path: "/kontakt",
    label: "Kontakt",
    nav: true,
    footer: true,
    sitemap: { priority: 0.6, changeFrequency: "yearly" },
  },
  {
    path: "/regulamin",
    label: "Regulamin",
    legal: true,
    sitemap: { priority: 0.2, changeFrequency: "yearly" },
  },
  {
    path: "/polityka-prywatnosci",
    label: "Polityka prywatności",
    legal: true,
    sitemap: { priority: 0.2, changeFrequency: "yearly" },
  },
];

export type NavLink = { name: string; path: string; matchNested?: boolean };

const toNavLink = (r: Route): NavLink => ({
  name: r.label,
  path: r.path,
  matchNested: r.matchNested,
});

/** "Strona główna" celowo poza menu — logo po lewej robi to samo,
 *  a sześć pozycji zamiast siedmiu ratuje układ na laptopie 1280 px. */
export const mainLinks = routes.filter((r) => r.nav).map(toNavLink);
export const footerLinks = routes.filter((r) => r.footer).map(toNavLink);
export const legalLinks = routes.filter((r) => r.legal).map(toNavLink);

/** Dla app/sitemap.ts. Wpisy dynamiczne (wydarzenia, aktualności)
 *  dokleja sitemap.ts po podpięciu CMS. */
export const staticRoutes = routes
  .filter((r) => r.sitemap)
  .map((r) => ({
    path: r.path,
    priority: r.sitemap?.priority ?? 0.5,
    changeFrequency: r.sitemap?.changeFrequency ?? "monthly",
  }));

/** Czy dany link odpowiada bieżącej trasie.
 *  Czysta funkcja — mogą jej używać komponenty klienckie i serwerowe. */
export function isActiveLink(pathname: string, link: NavLink): boolean {
  if (link.path === "/") return pathname === "/";
  if (link.matchNested) {
    return pathname === link.path || pathname.startsWith(`${link.path}/`);
  }
  return pathname === link.path;
}

/* ═══════════════════════════ ORGANIZACJA ═══════════════════════════ */

/** Dane rejestrowe. Typ jawny zamiast wnioskowania z `as const` —
 *  inaczej puste stringi dostają typ literalny "" i warunek
 *  `site.legal.krs && ...` staje się dla TypeScriptu zawsze fałszywy. */
type Legal = { name: string; krs: string; nip: string; regon: string };

const legal: Legal = {
  name: "Fundacja Maxime",
  // BLOKADA: bez KRS i NIP nie da się domknąć stopki, regulaminu,
  // polityki prywatności ani klauzuli przy formularzu.
  krs: "",
  nip: "",
  regon: "",
};

export const site = {
  /** Nazwa publiczna marki. */
  name: "Orkiestra Maxime",
  shortName: "Maxime",

  /** Podmiot prawny — stopka, regulamin, polityka prywatności,
   *  klauzule RODO, JSON-LD. */
  legalName: "Fundacja Maxime",

  /* ─── Metadane wyszukiwarkowe ───
     To nie jest copy strony, tylko wpisy dla Google. Copy żyje
     w komponentach. */

  /** 53 znaki. Google ucina tytuły po mniej więcej 60. */
  title: "Orkiestra Maxime — oprawa muzyczna | Dąbrowa Górnicza",
  titleTemplate: "%s | Orkiestra Maxime",

  /** 154 znaki, w granicy tego, co Google pokazuje w wynikach.
   *  Wszystko ważne na początku, bo koniec bywa ucinany. */
  description:
    "Orkiestra symfoniczna i kameralna z Dąbrowy Górniczej. Oprawa muzyczna gal, jubileuszy firmowych, ceremonii i koncertów plenerowych na Śląsku.",

  /** Pełna wersja do JSON-LD, gdzie nie ma limitu długości. */
  descriptionLong:
    "Orkiestra symfoniczna i kameralna z Dąbrowy Górniczej, działająca od 2022 roku. Oprawa muzyczna gal i jubileuszy firmowych, ceremonii ślubnych, koncertów plenerowych i widowisk patriotycznych na Śląsku i w Zagłębiu. Skład od kwartetu po czterdziestu muzyków.",

  locale: "pl_PL",
  lang: "pl",

  /* ─── Zasoby i kontakt ─── */

  /** UWAGA: to pole służy WYŁĄCZNIE danym strukturalnym i grafikom OG.
   *  Na stronie logo renderuje komponent <Logo />, który wstawia je
   *  jako inline SVG — nie pobiera tego pliku.
   *
   *  Wersja rastrowa, bo Google przy logo organizacji lepiej radzi
   *  sobie z PNG niż z SVG. Czarny wariant, bo wizytówka w wynikach
   *  ma jasne tło. */
  logo: {
    src: "/logo-black.png",
    width: 900,
    height: 309,
  },

  contact: {
    email: "kontakt@maxime.com.pl",
    /** E.164 — do href="tel:" i do JSON-LD. */
    phone: "+48784762553",
    phoneDisplay: "+48 784 762 553",
  },

  address: {
    street: "Mireckiego 70",
    postalCode: "41-310",
    city: "Dąbrowa Górnicza",
    region: "śląskie",
    country: "PL",
  },

  /** ZWERYFIKOWAĆ przed wdrożeniem — wpisane orientacyjnie. */
  geo: { lat: 50.3216, lng: 19.1874 },

  legal,

  /** Rok powstania orkiestry, nie data rejestracji podmiotu.
   *  Schema opisuje zespół, a ten gra od 2022. */
  foundingDate: "2022",

  /** Podpis wykonawcy w stopce. Pusta nazwa = nie renderuje się. */
  author: { name: "", url: "" },

  /** Cel przycisku "Wesprzyj nas" — Patronite.
   *  Navbar sam wykryje adres zewnętrzny i doda target="_blank".
   *  UWAGA: Patronite pojawia się przez to dwa razy — jako przycisk
   *  w nagłówku i jako ikona w stopce. Do decyzji, czy zostawiamy. */
  supportUrl: patronite?.url ?? "/kontakt",
};

/** Rok liczony przy wywołaniu, nie przy imporcie modułu.
 *  Wersja ze stałą pokazywała rok z momentu builda. */
export const getCopyright = () =>
  `© ${new Date().getFullYear()} ${site.legalName}. Wszelkie prawa zastrzeżone.`;

/* ═══════════════════════════ STYL LINKÓW ═══════════════════════════ */

/** Jedyny wyjątek od zasady "tylko dane" w tym pliku. To prezentacja,
 *  ale wspólna dla Navbara i Footera — przeniesienie jej do komponentów
 *  cofnęłoby ujednolicenie efektu, o które chodziło.
 *
 *  Podkreślenie wyjeżdżające od środka plus zmiana koloru.
 *  Rozmiar tekstu ustala miejsce użycia, zachowanie jest wspólne.
 *  Kolory zakładają ciemne tło. */
export const navLink = {
  wrapper: "group relative inline-block transition-colors duration-300",

  color: (active: boolean) =>
    active ? "text-arylideYellow" : "text-white/70 hover:text-white",

  /** h-px jest ledwie widoczne pod tekstem 3xl w menu mobilnym.
   *  Jeśli razi, zmień tutaj na h-0.5 — zadziała wszędzie naraz. */
  underline: (active: boolean) =>
    `bg-arylideYellow absolute -bottom-1 left-1/2 h-px -translate-x-1/2 transition-all duration-300 ${
      active ? "w-full" : "w-0 group-hover:w-full"
    }`,
};
