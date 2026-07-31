"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureCard from "@/components/shared/FeatureCard";

import { aiCompany } from "@/data/companies/ai";

export default function Culture() {
  return (
    <CompanySection
      id="culture"
      background="light"
    >
      <SectionHeading
        badge="Our Culture"
        title="Where Research Meets Responsible Innovation"
        description="Our culture is built around curiosity, collaboration and ethical engineering. We believe artificial intelligence should empower humanity through responsible research, continuous learning and practical innovation."
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
        {aiCompany.culture.map((item, index) => (
          <FeatureCard
            key={item.title}
            title={item.title}
            description={item.description}
            icon={item.icon!}
            tags={item.tags}
            featured={index === 0}
          />
        ))}
      </div>
    </CompanySection>
  );
}