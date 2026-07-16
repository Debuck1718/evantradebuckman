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
} from "@/components/software";

import {
  GlobalHeader,
  GlobalFooter,
} from "@/components/layout";

export default function SoftwarePage() {
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