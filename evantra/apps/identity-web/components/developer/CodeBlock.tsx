import type { ReactNode } from "react";

/**
 * Renders a labelled code sample.
 *
 * Pages under /developers and /docs share
 * this component so samples stay visually
 * consistent and scroll horizontally rather
 * than breaking the layout on narrow
 * screens.
 */
export function CodeBlock({
  label,
  language,
  code,
  children,
}: {
  label?: string;
  language?: string;
  code?: string;
  children?: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
      {(label || language) && (
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
            {label}
          </span>

          {language && (
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#e6b24a]/70">
              {language}
            </span>
          )}
        </div>
      )}

      <pre className="overflow-x-auto p-4 text-xs leading-6 text-white/80">
        <code>{children ?? code}</code>
      </pre>
    </div>
  );
}