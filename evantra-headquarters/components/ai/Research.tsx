"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import InnovationCard from "@/components/shared/InnovationCard";
import VisionBanner from "@/components/shared/VisionBanner";

import { aiCompany } from "@/data/companies/ai";

export default function Research() {
    return (
        <CompanySection
            id="research"
            background="gradient"
        >
            <SectionHeading
                badge="Research & Innovation"
                title="Advancing Artificial Intelligence Through Responsible Research"
                description="The Evantra AI Center transforms research into practical innovation by developing trustworthy AI technologies that address healthcare, education, enterprise and societal challenges."
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
                {aiCompany.research.map((item) => (
                    <InnovationCard
                        key={item.title}
                        title={item.title}
                        description={item.description}
                        icon={item.icon}
                        tags={Array.isArray(item.tags) ? item.tags : []}
                    />
                ))}
            </div>

            <div className="mt-24">
                <VisionBanner
                    title="Research That Creates Lasting Impact"
                    description="Every research initiative at the Evantra AI Center is driven by a commitment to building secure, explainable and human-centered artificial intelligence that solves meaningful real-world problems."
                />
            </div>

        </CompanySection>
    );
}