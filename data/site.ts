// data/site.ts
//
// Jedno źródło prawdy: domena, organizacja, nawigacja, socjale, trasy.
// Celowo BEZ JSX — ten plik importują robots.ts, sitemap.ts i blok
// metadata w root layoucie, więc musi zostać czystym TypeScriptem.
//
// Podmiot prowadzący serwis: Fundacja Maxime. Nazwa stowarzyszenia
// nie występuje w projekcie.

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/** Czy ta instancja ma trafić do indeksu wyszukiwarek.
 *  Na Vercelu trzymamy false aż do przenosin. */
export const isIndexable = process.env.NEXT_PUBLIC_INDEXABLE === "true";

/* ───────────────────────────── Socjale ───────────────────────────── */

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
 *  sygnał tożsamości — przydatny przy kolizji nazwy z Orkiestrą Maximus
 *  i dwiema Fundacjami Maxima. */
export const socialUrls = socials.map((s) => s.url);

const patronite = socials.find((s) => s.platform === "patronite");

/* ───────────────────────────── Organizacja ───────────────────────────── */

export const site = {
  /** Nazwa publiczna — używana w nagłówkach, tytułach i treści. */
  name: "Orkiestra Maxime",
  shortName: "Maxime",
  motto: "Z pasji do muzyki",

  /** Podmiot prawny — stopka, regulamin, polityka prywatności,
   *  klauzule RODO, JSON-LD. */
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

  /** Dane rejestrowe fundacji.
   *  BLOKADA: bez KRS i NIP nie da się domknąć stopki, regulaminu,
   *  polityki prywatności ani klauzuli przy formularzu. */
  legal: {
    name: "Fundacja Maxime",
    krs: "",
    nip: "",
    regon: "",
  },

  /** Rok powstania orkiestry, nie data rejestracji podmiotu.
   *  Schema opisuje zespół, a ten gra od 2022. */
  foundingDate: "2022",

  /** Podpis wykonawcy w stopce. Pusta nazwa = nie renderuje się. */
  author: {
    name: "",
    url: "",
  },

  /** Cel przycisku "Wesprzyj nas" — Patronite.
   *  Navbar sam wykryje adres zewnętrzny i doda target="_blank". */
  supportUrl: patronite?.url ?? "/kontakt",
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
 *  wyjeżdżające od środka plus zmiana koloru. Rozmiar tekstu ustala
 *  miejsce użycia, zachowanie jest wspólne. */
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
