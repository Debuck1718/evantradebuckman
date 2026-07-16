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
} from "@/components/engineering";

import {
  GlobalHeader,
  GlobalFooter,
} from "@/components/layout";

export const metadata: Metadata = {
  title: "Engineering Center | Evantra",

  description:
    "The Evantra Engineering Center develops autonomous systems, robotics, industrial IoT, smart infrastructure and intelligent engineering technologies that connect software with the physical world.",
};

export default function EngineeringPage() {
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