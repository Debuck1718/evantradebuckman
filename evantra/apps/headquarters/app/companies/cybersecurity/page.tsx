import type { Metadata } from "next";

import {
  Hero,
  Mission,
  Capabilities,
  Solutions,
  Technology,
  Products,
  Research,
  Culture,
  Careers,
  FeaturedPlatform,
} from "@/components/cybersecurity";

import GlobalHeader from "@/components/layout/GlobalHeader";
import Footer from "@/components/layout/GlobalFooter";

export const metadata: Metadata = {
  title: "Cybersecurity Center | Evantra",
  description:
    "The Evantra Cybersecurity Center engineers secure software, AI, cloud infrastructure and digital ecosystems through Zero Trust architecture, intelligent threat protection and proactive security engineering.",
};

export default function CybersecurityPage() {
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

      <Footer />
    </>
  );
}