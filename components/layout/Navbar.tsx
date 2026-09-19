// components/layout/Navbar.tsx
//
// Logika podświetlania wbudowana, bez komponentu ActiveLinks.
// Warunek aktywności i klasy efektu siedzą w data/site.ts, żeby
// Navbar i Footer nie rozjechały się przy kolejnej zmianie.
//
// JEDEN efekt w całym serwisie: podkreślenie wyjeżdżające od środka
// plus zmiana koloru. Rozmiar tekstu ustala miejsce użycia.

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { isActiveLink, mainLinks, navLink, site } from "@/data/site";

const isExternal = (url: string) => /^https?:\/\//.test(url);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => setIsMenuOpen(false);

  // Stan scrolla: passive + rAF, żeby nie blokować wątku głównego.
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);
        ticking = false;
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Escape zamyka i oddaje fokus przyciskowi otwierającemu.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setIsMenuOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  // Blokada przewijania tła pod otwartym menu.
  useEffect(() => {
    if (!isMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMenuOpen]);

  // Zmiana trasy zamyka menu.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reagujemy na pathname
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const logoClass = site.logo.invert ? "brightness-0 invert" : "";

  const supportLinkProps = isExternal(site.supportUrl)
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <>
      <header className="animate-slide-down fixed top-0 right-0 left-0 z-100 flex justify-center px-4 pt-4 lg:px-6 lg:pt-6">
        <nav
          aria-label="Menu główne"
          className={`flex w-full max-w-7xl items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled
              ? "bg-raisinBlack/85 rounded-full border border-white/10 px-8 py-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl"
              : "rounded-none border-transparent bg-transparent px-0 py-2"
          }`}
        >
          <Link
            href="/"
            aria-label={`${site.name} — strona główna`}
            className="flex shrink-0 items-center lg:mr-4 xl:mr-8"
          >
            <Image
              src={site.logo.src}
              alt={site.name}
              width={site.logo.width}
              height={site.logo.height}
              priority
              className={`h-10 w-auto lg:h-10 xl:h-14 ${logoClass}`}
            />
          </Link>

          {/* Menu desktopowe — od lg, czyli 1024 px.
              Wszystko poniżej (w tym tablety) dostaje wersję mobilną. */}
          <ul className="hidden grow justify-center lg:flex lg:gap-2.5 xl:gap-6 2xl:gap-8">
            {mainLinks.map((link) => {
              const active = isActiveLink(pathname, link);
              return (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    aria-current={active ? "page" : undefined}
                    className={`${navLink.wrapper} ${navLink.color(active)} py-2 text-[0.75rem] font-medium whitespace-nowrap uppercase lg:text-[0.65rem] lg:tracking-widest xl:text-[0.8rem] xl:tracking-[0.15em]`}
                  >
                    {link.name}
                    <span
                      aria-hidden="true"
                      className={navLink.underline(active)}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden shrink-0 lg:ml-4 lg:block xl:ml-8">
            <Link
              href={site.supportUrl}
              {...supportLinkProps}
              className="border-arylideYellow font-montserrat text-arylideYellow hover:bg-arylideYellow hover:text-raisinBlack flex items-center justify-center rounded-full border bg-transparent px-8 py-3 text-[0.7rem] font-bold uppercase transition-colors duration-500 lg:px-5 lg:py-2 lg:text-[0.65rem] lg:tracking-[0.15em] xl:px-8 xl:py-3 xl:text-[0.7rem] xl:tracking-[0.2em]"
            >
              Wesprzyj nas
            </Link>
          </div>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Otwórz menu"
            aria-expanded={isMenuOpen}
            aria-controls="menu-mobilne"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 lg:hidden"
          >
            <span aria-hidden="true" className="h-0.5 w-6 bg-white" />
            <span aria-hidden="true" className="h-0.5 w-4 bg-white" />
          </button>
        </nav>
      </header>

      {/* Menu mobilne i tabletowe */}
      <div
        id="menu-mobilne"
        inert={!isMenuOpen}
        className={`fixed inset-0 z-110 flex justify-end transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          isMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={closeMenu}
          aria-label="Zamknij menu"
          tabIndex={-1}
          className="bg-raisinBlack/60 absolute inset-0 backdrop-blur-sm"
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={`bg-raisinBlack relative flex h-full w-full max-w-sm flex-col justify-between border-l border-white/10 p-8 shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[80%] ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <Image
              src={site.logo.src}
              alt=""
              aria-hidden="true"
              width={180}
              height={60}
              className={`h-12 w-auto ${logoClass}`}
            />
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Zamknij menu"
              className="flex h-10 w-10 items-center justify-center text-3xl text-white"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <ul className="flex flex-col items-start gap-6 pt-12">
            {mainLinks.map((link, i) => {
              const active = isActiveLink(pathname, link);
              return (
                <li
                  key={link.path}
                  className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isMenuOpen
                      ? "translate-x-0 opacity-100"
                      : "translate-x-12 opacity-0"
                  }`}
                  style={{ transitionDelay: `${150 + i * 75}ms` }}
                >
                  {/* Ten sam efekt co w nagłówku i stopce —
                      wcześniej była tu kropka z przesunięciem. */}
                  <Link
                    href={link.path}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={`${navLink.wrapper} ${navLink.color(active)} pb-1 text-3xl leading-tight font-light tracking-wide`}
                  >
                    {link.name}
                    <span
                      aria-hidden="true"
                      className={navLink.underline(active)}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto pb-8">
            <Link
              href={site.supportUrl}
              {...supportLinkProps}
              onClick={closeMenu}
              className="bg-arylideYellow font-montserrat text-raisinBlack flex w-full items-center justify-center rounded-full py-5 text-xs font-bold tracking-[0.2em] uppercase"
            >
              Wesprzyj nas
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
