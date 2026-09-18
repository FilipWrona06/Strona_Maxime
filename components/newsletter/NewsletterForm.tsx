// components/newsletter/NewsletterForm.tsx
//
// WERSJA WYGLĄDOWA — brak podpięcia do mailera.
// Wysyłka jest symulowana, żeby dało się obejrzeć wszystkie stany
// (ładowanie, sukces, błąd) bez backendu.
//
// Gdy dojdzie integracja, podmieniamy TYLKO wnętrze handleSubmit
// na wywołanie akcji serwerowej. Reszta zostaje.
//
// Zmiany względem wersji wyjściowej:
//  - <title> w ikonach zamienione na aria-hidden. Tytuł w SVG wewnątrz
//    przycisku z aria-label powodował podwójny odczyt przez czytnik.
//  - komunikat sukcesu i błędu w aria-live, żeby był ogłaszany.
//  - błąd nie znika sam po 3 sekundach; użytkownik czytający wolniej
//    tracił informację, zanim zdążył ją przeczytać.

"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { site } from "@/data/site";

type Status = "idle" | "loading" | "success" | "error";

interface NewsletterFormProps {
  variant?: "dark" | "light";
  className?: string;
}

export default function NewsletterForm({
  variant = "dark",
  className = "",
}: NewsletterFormProps) {
  const isDark = variant === "dark";
  const checkboxId = useId();

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);

    // ─── ATRAPA ───────────────────────────────────────────────
    // Docelowo:
    //   const response = await subscribeToNewsletter(new FormData(e.currentTarget));
    //   if (response.error) { setStatus("error"); setMessage(response.error); return; }
    await new Promise((resolve) => setTimeout(resolve, 900));
    // ──────────────────────────────────────────────────────────

    setStatus("success");
    setMessage(
      "Prawie gotowe. Sprawdź skrzynkę e-mail i kliknij link, aby potwierdzić zapis.",
    );
  };

  if (status === "success") {
    return (
      <div className={`w-full ${className}`}>
        <div
          aria-live="polite"
          className={`animate-fade-in-up flex flex-col items-center justify-center p-4 text-center ${
            isDark ? "text-white" : "text-raisinBlack"
          }`}
        >
          <div className="bg-arylideYellow text-raisinBlack mb-3 flex h-12 w-12 items-center justify-center rounded-full">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
              focusable="false"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </div>
          <p className="font-montserrat max-w-70 text-sm leading-relaxed font-bold">
            {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="group relative flex w-full flex-col"
      >
        <div className="relative flex w-full items-end">
          <div
            className={`relative w-full transition-colors duration-500 ${
              isDark
                ? "focus-within:border-arylideYellow border-b border-white/20 pb-3 hover:border-white/50"
                : "border-raisinBlack/20 hover:border-raisinBlack/50 focus-within:border-raisinBlack border-b-2 pb-4"
            } ${status === "error" ? "border-red-400!" : ""}`}
          >
            <input
              type="email"
              name="email"
              placeholder="Twój adres e-mail"
              autoComplete="email"
              required
              disabled={status === "loading"}
              aria-label="Adres e-mail"
              aria-invalid={status === "error"}
              className={`font-montserrat w-full bg-transparent outline-none placeholder:font-light disabled:opacity-50 ${
                isDark
                  ? "text-sm font-medium text-white placeholder:text-white/30"
                  : "text-raisinBlack placeholder:text-raisinBlack/40 text-xl font-bold lg:text-2xl"
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            aria-label="Zapisz się do newslettera"
            className={`absolute right-0 flex items-center justify-center transition-all duration-500 disabled:opacity-50 disabled:hover:scale-100 ${
              isDark
                ? "hover:text-arylideYellow bottom-2 text-white/50"
                : "bg-raisinBlack text-arylideYellow hover:bg-oxfordBlue bottom-3 h-12 w-12 rounded-full shadow-xl hover:scale-110 hover:text-white"
            }`}
          >
            {status === "loading" ? (
              <svg
                className="h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                focusable="false"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 transition-transform duration-300 group-focus-within:translate-x-1 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={isDark ? 2 : 2.5}
                aria-hidden="true"
                focusable="false"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    isDark
                      ? "M14 5l7 7m0 0l-4 4m4-4H3"
                      : "M14 5l7 7m0 0l-7 7m7-7H3"
                  }
                />
              </svg>
            )}
          </button>
        </div>

        {status === "error" && message && (
          <span
            aria-live="assertive"
            className="font-montserrat mt-3 text-[0.65rem] font-bold text-red-400"
          >
            {message}
          </span>
        )}

        {/* Zgoda marketingowa. Checkbox to dopiero pierwszy krok —
            zapis potwierdza się linkiem z maila (double opt-in),
            bo samo zaznaczenie pola nie dowodzi zgody. */}
        <div className="mt-6 flex items-start gap-3">
          <label
            htmlFor={checkboxId}
            className="relative mt-[0.15rem] flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center"
          >
            <input
              type="checkbox"
              required
              name="rodo_consent"
              id={checkboxId}
              disabled={status === "loading"}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={`h-4 w-4 rounded-sm border transition-all duration-300 ${
                isDark
                  ? "peer-checked:border-arylideYellow peer-checked:bg-arylideYellow peer-focus-visible:ring-arylideYellow/50 border-white/30 peer-focus-visible:ring-2"
                  : "border-raisinBlack/30 peer-checked:border-raisinBlack peer-checked:bg-raisinBlack peer-focus-visible:ring-raisinBlack/50 peer-focus-visible:ring-2"
              }`}
            />
            <svg
              className={`pointer-events-none absolute h-3 w-3 opacity-0 transition-opacity duration-300 peer-checked:opacity-100 ${
                isDark ? "text-oxfordBlue" : "text-arylideYellow"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
              aria-hidden="true"
              focusable="false"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </label>

          <div
            className={`font-montserrat text-left text-[0.55rem] leading-[1.6] tracking-widest uppercase sm:text-[0.6rem] ${
              isDark ? "text-white/40" : "text-raisinBlack/50"
            }`}
          >
            <label
              htmlFor={checkboxId}
              className={`cursor-pointer transition-colors ${
                isDark ? "hover:text-white/60" : "hover:text-raisinBlack/70"
              }`}
            >
              Wyrażam zgodę na otrzymywanie informacji o wydarzeniach drogą
              elektroniczną od {site.legalName}. Zapoznałem się z{" "}
            </label>
            <Link
              href="/polityka-prywatnosci"
              className={`font-bold transition-colors ${
                isDark
                  ? "hover:text-arylideYellow text-white/70"
                  : "text-raisinBlack hover:text-oxfordBlue"
              }`}
            >
              Polityką Prywatności
            </Link>
            .
          </div>
        </div>
      </form>
    </div>
  );
}
