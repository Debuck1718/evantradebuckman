"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureCard from "@/components/shared/FeatureCard";

import { innovationCompany } from "@/data/companies/innovation";

export default function Culture() {
  return (
    <CompanySection
      id="culture"
      background="light"
    >
      <SectionHeading
        badge="Our Culture"
        title="Where Curiosity Becomes Innovation"
        description="Our culture encourages exploration, experimentation and collaboration. We believe transformative innovation happens when bold ideas meet rigorous research and purposeful execution."
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
        {innovationCompany.culture.map((item, index) => (
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