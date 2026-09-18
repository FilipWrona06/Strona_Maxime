// data/site.ts
//
// Jedno źródło prawdy: domena, organizacja, nawigacja, socjale, trasy.
// Celowo BEZ JSX — ten plik importują robots.ts, sitemap.ts i blok
// metadata w root layoucie, więc musi zostać czystym TypeScriptem.

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/** Czy ta instancja ma trafić do indeksu wyszukiwarek.
 *  Na Vercelu trzymamy false aż do przenosin. */
export const isIndexable = process.env.NEXT_PUBLIC_INDEXABLE === "true";

/* ───────────────────────────── Organizacja ───────────────────────────── */

export const site = {
  /** Nazwa publiczna. Świadomie "Orkiestra Maxime", nie samo "Maxime":
   *  w wynikach kolidujemy z Orkiestrą Maximus, Fundacją Maxima
   *  i Fundacją Maxima Dzieciom. */
  name: "Orkiestra Maxime",
  shortName: "Maxime",
  motto: "Z pasji do muzyki",

  /** DO DECYZJI U KLIENTA: fundacja czy stowarzyszenie?
   *  Ta nazwa idzie do metadanych, JSON-LD, copyrightu i klauzuli RODO. */
  legalName: "Fundacja Maxime",

  title: "Orkiestra Maxime — oprawa muzyczna wydarzeń | Dąbrowa Górnicza",
  titleTemplate: "%s | Orkiestra Maxime",

  description:
    "Orkiestra symfoniczna i kameralna z Dąbrowy Górniczej. Oprawa muzyczna gal, jubileuszy firmowych, ceremonii i koncertów plenerowych na Śląsku i w Zagłębiu. Skład od kwartetu po 40 muzyków.",

  tagline:
    "Odkryj z nami maksymalną jakość, maksymalne zaangażowanie oraz maksymalną radość z muzyki.",

  locale: "pl_PL",
  lang: "pl",

  /** Dopóki nie ma białego eksportu z brandbooka, invert nakłada filtr
   *  na czarne logo.svg. Po wrzuceniu /logo-white.svg: podmień src,
   *  ustaw invert na false. */
  logo: {
    src: "/logo.svg",
    invert: true,
    width: 160,
    height: 55,
  },

  contact: {
    email: "kontakt@maxime.com.pl",
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

  /** ZWERYFIKOWAĆ przed wdrożeniem. */
  geo: { lat: 50.3216, lng: 19.1874 },

  /** Dane rejestrowe: stopka, kontakt, JSON-LD, klauzula RODO.
   *  DO UZUPEŁNIENIA: KRS i NIP fundacji. */
  legal: {
    associationName: "Stowarzyszenie Maxime",
    associationKrs: "0000968685",
    associationNip: "6292503804",
    foundationName: "Fundacja Maxime",
    foundationKrs: "",
    foundationNip: "",
  },

  foundingDate: "2022",

  /** Podpis wykonawcy w stopce. Ustaw na null, żeby go nie renderować. */
  author: {
    name: "",
    url: "",
  },

  /** Cel przycisku "Wesprzyj nas". Dopóki nie ma Patronite
   *  ani podstrony zbiórki — kotwica na "O nas". */
  supportUrl: "/o-nas#wesprzyj",
} as const;

/** Rok liczony przy wywołaniu, nie przy imporcie modułu.
 *  Wersja ze stałą pokazywała rok z momentu builda. */
export const getCopyright = () =>
  `© ${new Date().getFullYear()} ${site.legalName}. Wszelkie prawa zastrzeżone.`;

/* ───────────────────────────── Nawigacja ───────────────────────────── */

export type NavLink = {
  name: string;
  path: string;
  /** Podświetlaj też na trasach zagnieżdżonych,
   *  np. /wydarzenia/nazwa-koncertu → aktywne "Wydarzenia". */
  matchNested?: boolean;
};

/** "Strona główna" wycięta z menu — logo po lewej robi to samo.
 *  Sześć pozycji zamiast siedmiu ratuje układ na laptopie 1280 px. */
export const mainLinks: NavLink[] = [
  { name: "O nas", path: "/o-nas" },
  { name: "Oferta", path: "/oferta" },
  { name: "Wydarzenia", path: "/wydarzenia", matchNested: true },
  { name: "Aktualności", path: "/aktualnosci", matchNested: true },
  { name: "Galeria", path: "/galeria", matchNested: true },
  { name: "Kontakt", path: "/kontakt" },
];

export const footerLinks: NavLink[] = [
  { name: "Strona główna", path: "/" },
  ...mainLinks,
];

export const legalLinks: NavLink[] = [
  { name: "Regulamin", path: "/regulamin" },
  { name: "Polityka prywatności", path: "/polityka-prywatnosci" },
];

/** Czy dany link odpowiada bieżącej trasie.
 *  Czysta funkcja — mogą jej używać komponenty klienckie i serwerowe. */
export function isActiveLink(pathname: string, link: NavLink): boolean {
  if (link.path === "/") return pathname === "/";
  if (link.matchNested) {
    return pathname === link.path || pathname.startsWith(`${link.path}/`);
  }
  return pathname === link.path;
}

/** JEDEN efekt linku nawigacyjnego dla całego serwisu: podkreślenie
 *  wyjeżdżające od środka plus zmiana koloru. Wcześniej nagłówek miał
 *  podkreślenie, a menu mobilne i stopka kropkę z przesunięciem —
 *  trzy różne zachowania dla tej samej czynności.
 *
 *  Rozmiar tekstu ustala miejsce użycia, zachowanie jest wspólne. */
export const navLink = {
  wrapper:
    "group font-montserrat relative inline-block transition-colors duration-300",

  color: (active: boolean) =>
    active ? "text-arylideYellow" : "text-white/70 hover:text-white",

  underline: (active: boolean) =>
    `bg-arylideYellow absolute -bottom-1 left-1/2 h-px -translate-x-1/2 transition-all duration-300 ${
      active ? "w-full" : "w-0 group-hover:w-full"
    }`,
};

/* ───────────────────────────── Socjale ───────────────────────────── */

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "youtube"
  | "linkedin"
  | "patronite"
  | "tiktok"
  | "x";

export type Social = {
  platform: SocialPlatform;
  url: string;
  /** Etykieta dla czytników ekranu. */
  label: string;
};

/** Tylko realnie istniejące profile. Sześć ikon prowadzących w jedno
 *  miejsce na Facebooku osłabia sygnał marki. */
export const socials: Social[] = [
  {
    platform: "facebook",
    url: "https://www.facebook.com/stowarzyszeniemaxime/",
    label: "Orkiestra Maxime na Facebooku",
  },
  // { platform: "instagram", url: "", label: "Orkiestra Maxime na Instagramie" },
  // { platform: "youtube",   url: "", label: "Orkiestra Maxime na YouTube" },
];

export const socialUrls = socials.map((s) => s.url);

/* ───────────────────────────── Trasy ───────────────────────────── */

export const staticRoutes = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/oferta", priority: 0.9, changeFrequency: "monthly" },
  { path: "/wydarzenia", priority: 0.9, changeFrequency: "weekly" },
  { path: "/o-nas", priority: 0.8, changeFrequency: "monthly" },
  { path: "/aktualnosci", priority: 0.7, changeFrequency: "weekly" },
  { path: "/galeria", priority: 0.5, changeFrequency: "monthly" },
  { path: "/kontakt", priority: 0.6, changeFrequency: "yearly" },
  { path: "/polityka-prywatnosci", priority: 0.2, changeFrequency: "yearly" },
  { path: "/regulamin", priority: 0.2, changeFrequency: "yearly" },
] as const;
