"use client";

import { motion } from "framer-motion";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import Reveal from "@/components/shared/Reveal";
import TechChip from "@/components/shared/TechChip";

import { softwareCompany } from "@/data/companies";
import { fadeUp, showcaseContainer } from "@/lib/animations/featuredShowcase";

export default function Technology() {
  return (
    <CompanySection
      id="technology"
      background="gradient"
    >
      <SectionHeading
        badge="Technology Stack"
        title="Engineering With Modern Technologies"
        description="Our engineering teams leverage proven technologies, cloud-native infrastructure and artificial intelligence to build secure, scalable and future-ready digital platforms."
        centered
      />

      <motion.div
        variants={showcaseContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-20 space-y-14"
      >
        {softwareCompany.technologies.map((category) => (
          <motion.div
            key={category.title}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="
              group
              rounded-3xl
              border
              border-white/10
              bg-white/5
              p-8
              backdrop-blur-xl
              transition-colors
              duration-500
              hover:border-[hsl(var(--accent))]/40
              hover:bg-white/[0.07]
            "
          >
            <h3
              className="
                text-2xl
                font-semibold
                text-white
                transition-colors
                duration-300
                group-hover:text-[hsl(var(--accent))]
              "
            >
              {category.title}
            </h3>

            {category.description && (
              <p
                className="
                  mt-3
                  max-w-3xl
                  text-white/70
                "
              >
                {category.description}
              </p>
            )}

            <div
              className="
                mt-8
                flex
                flex-wrap
                gap-3
              "
            >
              {category.technologies.map((technology, index) => (
                <Reveal
                  key={technology.name ?? technology.title}
                  delay={index * 0.05}
                  distance={16}
                  amount={0.1}
                >
                  <TechChip
                    label={technology.name ?? technology.title}
                  />
                </Reveal>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </CompanySection>
  );
}