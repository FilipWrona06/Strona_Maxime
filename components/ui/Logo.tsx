// components/ui/Logo.tsx
//
// Logo jako inline SVG odwołujące się do symbolu z <LogoSprite />,
// który musi być wstawiony raz w (user)/layout.tsx.
//
// Dlaczego nie <Image>:
//  - zero żądań sieciowych, logo jest na ekranie w tej samej klatce
//    co reszta HTML-u
//  - znika ostrzeżenie o obrazie LCP, bo inline SVG nie jest
//    kandydatem na ten wskaźnik
//  - kolor przez currentColor zamiast filtra brightness-0 invert:
//    czystsze krawędzie i brak przeliczania filtra przy przewijaniu
//
// Kolor ustawia klasa tekstu:
//   <Logo className="h-10 w-auto text-white" />
//   <Logo className="h-10 w-auto text-raisinBlack" />
//
// Dwa jawne warianty zamiast rozwinięcia obiektu z atrybutami:
// analiza statyczna nie zagląda do {...(warunek ? a : b)}, więc linter
// zgłaszał brak opisu alternatywnego mimo że aria-label tam był.

type LogoProps = {
  className?: string;
  /** Tekst dla czytników ekranu. Pusty string = logo dekoracyjne,
   *  np. drugi egzemplarz w panelu menu mobilnego, gdzie nazwa
   *  jest już odczytywana z innego elementu. */
  title?: string;
};

export default function Logo({
  className = "h-10 w-auto",
  title = "Orkiestra Maxime",
}: LogoProps) {
  // Wariant dekoracyjny — całkowicie poza drzewem dostępności.
  if (title.length === 0) {
    return (
      <svg
        viewBox="0 0 3300 1134"
        className={className}
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <use href="#logo-maxime" />
      </svg>
    );
  }

  // Wariant opisany — nazwa idzie z elementu <title>, nie z aria-label:
  // bywa czytana przez więcej narzędzi i przeżywa automatyczne
  // tłumaczenie strony.
  return (
    <svg
      viewBox="0 0 3300 1134"
      className={className}
      fill="currentColor"
      role="img"
      focusable="false"
    >
      <title>{title}</title>
      <use href="#logo-maxime" />
    </svg>
  );
}
