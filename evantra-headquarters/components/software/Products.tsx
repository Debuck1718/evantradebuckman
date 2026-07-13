"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";

import { softwareCompany } from "@/data/companies";

export default function Products() {
  return (
    <CompanySection
      id="products"
      background="dark"
    >
      <SectionHeading
        badge="Product Portfolio"
        title="Engineering Platforms That Create Real Impact"
        description="Our software products solve real-world challenges across education, healthcare, commerce, artificial intelligence and enterprise technology."
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
        {softwareCompany.products.map((product) => (
          <article
            key={product.title}
            className="
              group

              relative

              overflow-hidden

              rounded-[32px]

              border

              border-white/10

              bg-white/[0.04]

              p-8

              backdrop-blur-xl

              transition-all

              duration-500

              hover:border-[hsl(var(--accent))]/40

              hover:bg-white/[0.07]

              hover:-translate-y-2
            "
          >
            {/* Status */}

            {product.status && (
              <span
                className="
                  inline-flex

                  rounded-full

                  bg-emerald-500/15

                  px-3

                  py-1

                  text-xs

                  font-semibold

                  uppercase

                  tracking-[0.15em]

                  text-emerald-400
                "
              >
                {product.status}
              </span>
            )}

            {/* Category */}

            <p
              className="
                mt-5

                text-sm

                uppercase

                tracking-[0.18em]

                text-[hsl(var(--accent))]
              "
            >
              {product.category}
            </p>

            {/* Title */}

            <h3
              className="
                mt-3

                text-3xl

                font-bold

                text-white
              "
            >
              {product.title}
            </h3>

            {/* Description */}

            <p
              className="
                mt-5

                leading-8

                text-white/70
              "
            >
              {product.description}
            </p>

            {/* Tags */}

            <div
              className="
                mt-8

                flex

                flex-wrap

                gap-3
              "
            >
              {product.tags?.map((tag) => (
                <span
                  key={tag}
                  className="
                    rounded-full

                    border

                    border-white/10

                    px-3

                    py-1.5

                    text-xs

                    font-medium

                    text-white/70
                  "
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Future CTA */}

            {product.href && (
              <div className="mt-10">
                <span
                  className="
                    inline-flex

                    items-center

                    gap-2

                    font-semibold

                    text-[hsl(var(--accent))]
                  "
                >
                  Learn More →
                </span>
              </div>
            )}
          </article>
        ))}
      </div>
    </CompanySection>
  );
}