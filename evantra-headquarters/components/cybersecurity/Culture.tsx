"use client";

import CompanySection from "@/components/shared/CompanySection";
import FeatureCard from "@/components/shared/FeatureCard";
import SectionHeading from "@/components/shared/SectionHeading";

import { cybersecurityCompany } from "@/data/companies/cybersecurity";

export default function Culture() {
  return (
    <CompanySection
      id="culture"
      background="light"
    >
      <SectionHeading
        badge="Our Culture"
        title="A Culture of Trust, Discipline and Innovation"
        description="Our teams combine engineering excellence with continuous learning, ethical responsibility and collaborative security practices."
        centered
      />

      <div
        className="
          mt-20
          grid
          gap-8
          lg:grid-cols-2
        "
      >
        {cybersecurityCompany.culture.map((item, index) => (
          <FeatureCard
            key={item.title}
            title={item.title}
            description={item.description}
            icon={item.icon}
            tags={item.tags}
            featured={index === 0}
          />
        ))}
      </div>
    </CompanySection>
  );
}