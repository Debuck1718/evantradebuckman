"use client";

import CompanySection from "@/components/shared/CompanySection";
import FeatureCard from "@/components/shared/FeatureCard";
import SectionHeading from "@/components/shared/SectionHeading";

import { softwareCompany } from "@/data/companies";

export default function Solutions() {
  return (
    <CompanySection id="solutions">
      <SectionHeading
        badge="Solutions"
        title="Transforming Industries Through Software"
        description="We develop secure, intelligent and scalable digital solutions that enable organizations to modernize operations, improve efficiency and accelerate innovation."
        centered
      />

      <div
        className="
          mt-20

          grid

          gap-8

          md:grid-cols-2

          xl:grid-cols-3
        "
      >
        {softwareCompany.solutions.map((solution) => (
          <FeatureCard
            key={solution.title}
            title={solution.title}
            description={solution.description}
            icon={solution.icon!}
            tags={solution.tags}
            featured={solution.featured}
          />
        ))}
      </div>
    </CompanySection>
  );
}