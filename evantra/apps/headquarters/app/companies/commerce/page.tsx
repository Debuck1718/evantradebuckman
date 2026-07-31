import type { Metadata } from "next";

import {
  Hero,
  FeaturedPlatform,
  Mission,
  Capabilities,
  Solutions,
  Technology,
  Products,
  Research,
  Culture,
  Careers,
} from "@/components/commerce";

import {
  GlobalHeader,
  GlobalFooter,
} from "@/components/layout";

export const metadata: Metadata = {
  title: "Commerce Center | Evantra",

  description:
    "The Evantra Commerce Center engineers enterprise commerce platforms, payment infrastructure, marketplace ecosystems and digital business technologies that help organizations grow in the modern economy.",
};

export default function CommercePage() {
  return (
    <>
      <GlobalHeader />

      <main>
        <Hero />

        <FeaturedPlatform />

        <Mission />

        <Capabilities />

        <Solutions />

        <Technology />

        <Products />

        <Research />

        <Culture />

        <Careers />
      </main>

      <GlobalFooter />
    </>
  );
}