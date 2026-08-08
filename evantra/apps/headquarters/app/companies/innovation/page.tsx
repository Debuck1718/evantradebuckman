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
} from "@/components/innovation";

import {
  GlobalHeader,
  GlobalFooter,
} from "@/components/layout";

export const metadata: Metadata = {
  title: "Innovation Center | Evantra",

  description:
    "The Evantra Innovation Center explores emerging technologies, develops new capabilities and transforms research into practical solutions for people, organizations and society.",
};

export default function InnovationPage() {
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