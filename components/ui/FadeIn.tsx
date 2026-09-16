// src/components/ui/FadeIn.tsx
//
// Poprawki względem wersji wyjściowej:
//  - przy prefers-reduced-motion treść jest widoczna od razu,
//    zamiast czekać na obserwator,
//  - data-fade-in pozwala globals.css odsłonić treść, gdy JS nie działa
//    (bez tego cała strona poza hero byłaby dla takiego użytkownika pusta),
//  - duration-1200 działa dzięki tokenowi --transition-duration-1200
//    zadeklarowanemu w @theme,
//  - obserwator odłącza się po pierwszym wejściu w kadr.

"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

export default function FadeIn({
  children,
  delay = "0ms",
  className = "",
}: {
  children: ReactNode;
  delay?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-fade-in
      className={`${className} duration-1200 transition-all ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible
          ? "translate-y-0 scale-100 opacity-100"
          : "translate-y-12 scale-[0.98] opacity-0"
      }`}
      style={{ transitionDelay: delay }}
    >
      {children}
    </div>
  );
}
