"use client";

import Reveal from "./Reveal";
import SectionBadge from "./SectionBadge";
import { EvantraButton } from "./EvantraButton";

interface SectionHeadingProps {
  badge?: string;

  title: string;

  highlight?: string;

  description?: string;

  centered?: boolean;

  maxWidth?: string;

  buttonText?: string;

  buttonHref?: string;
}

export default function SectionHeading({
  badge,
  title,
  highlight,
  description,
  centered = false,
  maxWidth = "700px",
  buttonText,
}: SectionHeadingProps) {
  const highlightedTitle =
    highlight && title.includes(highlight)
      ? title.split(highlight)
      : null;

  return (
    <div
      className={`
        flex
        flex-col
        gap-6

        ${centered ? "items-center text-center" : ""}
      `}
      style={{
        maxWidth,
      }}
    >
      {badge && (
        <Reveal>
          <SectionBadge>
            {badge}
          </SectionBadge>
        </Reveal>
      )}

      <Reveal delay={0.1}>
        <h2
          className="
            text-4xl
            font-bold
            leading-tight
            tracking-tight

            text-slate-900

            md:text-5xl

            xl:text-6xl
          "
        >
          {highlightedTitle ? (
            <>
              {highlightedTitle[0]}

              <span className="text-[hsl(var(--accent))]">
                {highlight}
              </span>

              {highlightedTitle[1]}
            </>
          ) : (
            title
          )}
        </h2>
      </Reveal>

      {description && (
        <Reveal delay={0.2}>
          <p
            className="
              text-lg
              leading-8

              text-slate-600
            "
          >
            {description}
          </p>
        </Reveal>
      )}

      {buttonText && (
        <Reveal delay={0.3}>
          <div>
            <EvantraButton>
              {buttonText}
            </EvantraButton>
          </div>
        </Reveal>
      )}
    </div>
  );
}