"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import InnovationCard from "@/components/shared/InnovationCard";
import VisionBanner from "@/components/shared/VisionBanner";

import { engineeringCompany } from "@/data/companies/engineering";

export default function Research() {
  return (
    <CompanySection
      id="research"
      background="gradient"
    >
      <SectionHeading
        badge="Research & Innovation"
        title="Advancing Engineering Through Intelligent Research"
        description="The Evantra Engineering Center transforms engineering research into practical technologies by developing autonomous systems, robotics, industrial IoT and intelligent infrastructure for the industries of tomorrow."
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
        {engineeringCompany.research.map((item) => (
          <InnovationCard
            key={item.title}
            title={item.title}
            description={item.description}
            icon={item.icon}
            tags={(Array.isArray(item.tags) ? item.tags : []) as string[]}
          />
        ))}
      </div>

      <div className="mt-24">
        <VisionBanner
          title="Engineering Research That Shapes Tomorrow"
          description="Every research initiative at the Evantra Engineering Center is dedicated to creating intelligent engineering technologies that improve industries, strengthen infrastructure and enable a safer, smarter and more sustainable future."
        />
      </div>
    </CompanySection>
  );
}