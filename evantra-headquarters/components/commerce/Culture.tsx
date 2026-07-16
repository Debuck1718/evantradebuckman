"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureCard from "@/components/shared/FeatureCard";

import { commerceCompany } from "@/data/companies/commerce";

export default function Culture() {
  return (
    <CompanySection
      id="culture"
      background="light"
    >
      <SectionHeading
        badge="Our Culture"
        title="Where Engineering Meets Commerce Innovation"
        description="Our culture is built around customer success, engineering excellence and continuous innovation. We believe digital commerce should empower businesses through secure platforms, intelligent technology and exceptional user experiences."
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
        {commerceCompany.culture.map((item, index) => (
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