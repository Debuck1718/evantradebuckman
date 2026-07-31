"use client";

import CompanySection from "@/components/shared/CompanySection";
import VisionBanner from "@/components/shared/VisionBanner";

import { cybersecurityCompany } from "@/data/companies/cybersecurity";

export default function Careers() {
  return (
    <CompanySection
      id="careers"
      background="gradient"
    >
      <VisionBanner
        title={cybersecurityCompany.careers.title}
        description={cybersecurityCompany.careers.description}
      />
    </CompanySection>
  );
}