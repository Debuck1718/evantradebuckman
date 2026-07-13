"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";

import InnovationGrid from "./InnovationGrid";
import CurrentResearch from "./CurrentResearch";
import FutureVision from "./FutureVision";

export default function Research() {
  return (
    <CompanySection
      id="research"
      background="gradient"
    >
      <SectionHeading
        badge="Research & Innovation"
        title="Engineering Tomorrow's Digital Economy"
        description="We invest in practical research, emerging technologies and responsible engineering to solve meaningful challenges across healthcare, education, enterprise software and digital infrastructure."
        centered
      />

      <InnovationGrid />

      <CurrentResearch />

      <FutureVision />
    </CompanySection>
  );
}