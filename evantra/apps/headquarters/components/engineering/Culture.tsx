"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureCard from "@/components/shared/FeatureCard";

import { engineeringCompany } from "@/data/companies/engineering";

export default function Culture() {
  return (
    <CompanySection
      id="culture"
      background="light"
    >
      <SectionHeading
        badge="Our Culture"
        title="Where Engineering Excellence Meets Practical Innovation"
        description="Our culture is built around precision, collaboration and continuous innovation. We believe engineering should solve meaningful real-world challenges through intelligent systems, responsible design and multidisciplinary teamwork."
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
        {engineeringCompany.culture.map((item, index) => (
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