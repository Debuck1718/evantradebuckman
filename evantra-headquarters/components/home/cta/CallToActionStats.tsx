"use client";

const stats = [
  {
    value: "6+",
    label: "Technology Divisions",
  },
  {
    value: "AI",
    label: "Innovation Driven",
  },
  {
    value: "Global",
    label: "Strategic Vision",
  },
];

export default function CallToActionStats() {
  return (
    <div
      className="
        mt-20

        grid
        gap-10

        border-t
        border-white/10

        pt-10

        md:grid-cols-3
      "
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="text-center"
        >
          <p
            className="
              text-5xl
              font-bold

              text-ev-gold-gradient
            "
          >
            {stat.value}
          </p>

          <p
            className="
              mt-3

              text-white/70
            "
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}