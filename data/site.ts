// data/site.ts
//
// Jedno źródło prawdy dla całego serwisu: domena, organizacja, nawigacja,
// socjale, trasy. Celowo BEZ JSX — ten plik importują robots.ts, sitemap.ts
// i blok metadata w root layoucie, więc musi zostać czystymi danymi.
// Ikony socjali są osobno, w components/ui/SocialIcon.tsx.

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/** Czy ta instancja ma trafić do indeksu wyszukiwarek.
 *  Na Vercelu trzymamy false aż do przenosin — inaczej Google
 *  zaindeksuje wersję roboczą i zostaniemy z duplikatami. */
export const isIndexable = process.env.NEXT_PUBLIC_INDEXABLE === "true";

/* ───────────────────────────── Organizacja ───────────────────────────── */

export const site = {
  /** Nazwa publiczna. Świadomie "Orkiestra Maxime", nie samo "Maxime":
   *  w wynikach kolidujemy z Orkiestrą Maximus, Fundacją Maxima
   *  i Fundacją Maxima Dzieciom. */
  name: "Orkiestra Maxime",
  shortName: "Maxime",
  motto: "Z pasji do muzyki",

  /** DO DECYZJI: kto jest podmiotem prowadzącym stronę — fundacja
   *  powołana w grudniu 2025 czy stowarzyszenie z 2022?
   *  Ta nazwa idzie do metadanych, JSON-LD, stopki i klauzuli RODO,
   *  więc musi być jedna w całym serwisie. */
  legalName: "Fundacja Maxime",

  title: "Orkiestra Maxime — oprawa muzyczna wydarzeń | Dąbrowa Górnicza",
  titleTemplate: "%s | Orkiestra Maxime",

  description:
    "Orkiestra symfoniczna i kameralna z Dąbrowy Górniczej. Oprawa muzyczna gal, jubileuszy firmowych, ceremonii i koncertów plenerowych na Śląsku i w Zagłębiu. Skład od kwartetu po 40 muzyków.",

  locale: "pl_PL",
  lang: "pl",

  /** Logo. Dopóki nie ma eksportu białej wersji z brandbooka,
   *  invert=true nakłada filtr na czarne logo.svg.
   *  Po wrzuceniu /logo-white.svg: zmień src i ustaw invert na false. */
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

  /** Współrzędne siedziby — do JSON-LD i mapy na kontakcie. ZWERYFIKOWAĆ. */
  geo: { lat: 50.3216, lng: 19.1874 },

  /** Dane rejestrowe: stopka, strona kontaktu, JSON-LD, klauzula RODO.
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

  /** Cel przycisku "Wesprzyj nas".
   *  Dopóki nie ma Patronite ani podstrony zbiórki — kotwica na "O nas". */
  supportUrl: "/o-nas#wesprzyj",
} as const;

/** Rok liczony przy wywołaniu, nie przy imporcie modułu.
 *  Wersja ze stałą pokazywała rok z momentu builda — strona zbudowana
 *  w grudniu wyświetlałaby stary rok przez cały styczeń. */
export const getCopyright = () =>
  `© ${new Date().getFullYear()} ${site.legalName}. Wszelkie prawa zastrzeżone.`;

/* ───────────────────────────── Nawigacja ───────────────────────────── */

export type NavLink = {
  name: string;
  path: string;
  /** Podświetlaj też na trasach zagnieżdżonych,
   *  np. /wydarzenia/fabryka-klasyki-2026 → aktywne "Wydarzenia". */
  matchNested?: boolean;
};

/** "Strona główna" wycięta z menu — logo po lewej pełni tę samą funkcję
 *  i jest rozpoznawalnym wzorcem. Zwalnia to miejsce na sześć pozycji
 *  zamiast siedmiu, co na laptopie 1280px realnie ratuje układ. */
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
  /** Etykieta dla czytników ekranu i atrybutu title. */
  label: string;
};

/** Tylko realnie istniejące profile. Sześć ikon prowadzących w jedno
 *  miejsce na Facebooku osłabia sygnał marki i wygląda na niedokończoną
 *  stronę. Odkomentuj wpis, gdy konto faktycznie powstanie. */
export const socials: Social[] = [
  {
    platform: "facebook",
    url: "https://www.facebook.com/stowarzyszeniemaxime/",
    label: "Orkiestra Maxime na Facebooku",
  },
  // { platform: "instagram", url: "", label: "Orkiestra Maxime na Instagramie" },
  // { platform: "youtube",   url: "", label: "Orkiestra Maxime na YouTube" },
  // { platform: "patronite", url: "", label: "Wesprzyj nas na Patronite" },
];

export const socialUrls = socials.map((s) => s.url);

/* ───────────────────────────── Trasy ───────────────────────────── */

/** Trasy statyczne do sitemapy. Wpisy dynamiczne (wydarzenia, aktualności,
 *  galerie) dokleja sitemap.ts po podpięciu Sanity. */
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
