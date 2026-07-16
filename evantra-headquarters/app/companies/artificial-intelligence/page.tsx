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
} from "@/components/ai";

import type { Metadata } from "next";
import {
  GlobalHeader,
  GlobalFooter,
} from "@/components/layout";

export const metadata: Metadata = {
  title: "Artificial Intelligence Center | Evantra",
  description:
    "The Evantra AI Center researches, engineers and deploys responsible artificial intelligence solutions across healthcare, enterprise, education and public services.",
};

export default function AIPage() {
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