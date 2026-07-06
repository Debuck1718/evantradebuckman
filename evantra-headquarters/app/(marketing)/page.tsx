import GlobalHeader from "@/components/layout/GlobalHeader";
import HeroSection from "@/components/hero/HeroSection";

export default function HomePage() {
  return (
    <>
      <GlobalHeader />

      <main className="relative overflow-x-hidden bg-[#06131F]">
        <HeroSection />
      </main>
    </>
  );
}