"use client";

import CompanySection from "@/components/shared/CompanySection";
import FeatureCard from "@/components/shared/FeatureCard";
import SectionHeading from "@/components/shared/SectionHeading";

import { softwareCompany } from "@/data/companies";

export default function Products() {
  return (
    <CompanySection id="products">
      <SectionHeading
        badge="Products"
        title="Software That Creates Real Impact"
        description="Our engineering teams build intelligent platforms that transform industries, improve lives and power the Evantra ecosystem."
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
        {softwareCompany.products.map((product) => (
          <FeatureCard
            key={product.title}
            title={product.title}
            description={product.description}
            icon={product.icon!}
            tags={product.tags}
            featured={product.featured}
          />
        ))}
      </div>
    </CompanySection>
  );
}