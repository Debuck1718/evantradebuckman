"use client";

import clsx from "clsx";

import Reveal from "./Reveal";
import SectionBadge from "./SectionBadge";
import { EvantraButton } from "./EvantraButton";
import { useSectionTheme } from "./SectionThemeContext";

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
  const theme = useSectionTheme();

  const isDark = theme === "dark";

  const highlightedTitle =
    highlight && title.includes(highlight)
      ? title.split(highlight)
      : null;

  return (
    <div
      className={clsx(
        "flex flex-col gap-6",
        centered && "items-center text-center"
      )}
      style={{
        maxWidth,
      }}
    >
      {badge && (
        <Reveal>
          <SectionBadge>{badge}</SectionBadge>
        </Reveal>
      )}

      <Reveal delay={0.1}>
        <h2
          className={clsx(
            `
              text-4xl
              font-extrabold
              leading-[1.05]
              tracking-tight

              md:text-5xl
              xl:text-6xl

              transition-colors
              duration-300
            `,
            isDark
              ? `
                  text-white
                  drop-shadow-[0_2px_10px_rgba(255,255,255,0.08)]
                `
              : `
                  text-slate-900
                `
          )}
        >
          {highlightedTitle ? (
            <>
              {highlightedTitle[0]}

              <span
                className="
                  text-[hsl(var(--accent))]
                "
              >
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
            className={clsx(
              `
                text-lg
                leading-8

                transition-colors
                duration-300
              `,
              isDark
                ? "text-slate-200"
                : "text-slate-600"
            )}
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