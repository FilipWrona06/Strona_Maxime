// app/(user)/page.tsx

import type { Metadata } from "next";

import Hero from "@/components/home/Hero";
import { site } from "@/data/site";

// import About from "@/components/home/About";
// import Testimonials from "@/components/home/Testimonials";
// import LatestUpdates from "@/components/home/LatestUpdates";
// import Values from "@/components/home/Values";
// import CallToAction from "@/components/home/CallToAction";

export const metadata: Metadata = {
  // Strona główna nie używa szablonu "%s | Orkiestra Maxime" —
  // tytuł ma być pełny i zawierać nazwę, usługę i miasto.
  title: { absolute: site.title },
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* <main> jest w (user)/layout.tsx — tutaj go NIE MA. */}
      <Hero />

      {/* <About /> */}
      {/* <Testimonials /> */}
      {/* <LatestUpdates /> */}
      {/* <Values /> */}
      {/* <CallToAction /> */}
    </>
  );
}
