"use client";

import Link from "next/link";

const groups = [
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Company", "/company"],
      ["Careers", "/resources#careers"],
      ["News", "/resources#news"],
    ],
  },
  {
    title: "Ecosystem",
    links: [
      ["Software", "/companies/software"],
      ["Artificial Intelligence", "/companies/artificial-intelligence"],
      ["Cybersecurity", "/companies/cybersecurity"],
      ["Engineering", "/companies/engineering"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Research", "/research"],
      ["Innovation", "/companies/innovation"],
      ["Identity", "/identity"],
      ["Contact", "/contact"],
      ["Media", "/resources#media"],
    ],
  },
];

export default function FooterNavigation() {
  return (
    <div
      className="
        grid

        gap-12

        sm:grid-cols-2

        lg:grid-cols-3
      "
    >
      {groups.map((group) => (
        <div key={group.title}>
          <h4
            className="
              mb-6

              text-sm

              font-semibold

              uppercase

              tracking-[0.25em]

              text-ev-gold
            "
          >
            {group.title}
          </h4>

          <div className="space-y-4">
            {group.links.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="
                  block

                  text-white/70

                  transition-colors

                  hover:text-ev-gold
                "
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}