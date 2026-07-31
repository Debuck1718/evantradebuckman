"use client";

import { Search } from "lucide-react";

interface SearchButtonProps {
  onClick?: () => void;
  dark?: boolean;
}

export default function SearchButton({
  onClick,
  dark = false,
}: SearchButtonProps) {
  return (
    <button
      type="button"
      aria-label="Search Evantra"
      onClick={onClick}
      className={`
        group
        relative
        hidden
        lg:flex
        h-11
        items-center
        gap-3
        rounded-full
        border
        px-4
        transition-all
        duration-300
        backdrop-blur-xl
        ${
          dark
            ? "border-slate-200/15 bg-white/10 text-white hover:bg-white/15"
            : "border-slate-300 bg-white text-slate-700 hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--primary))]"
        }
      `}
    >
      <Search
        size={18}
        className="transition-transform duration-300 group-hover:scale-110"
      />

      <span className="text-sm font-medium">
        Search
      </span>

      <div
        className={`
          ml-1
          rounded-md
          border
          px-2
          py-0.5
          text-[11px]
          font-semibold
          tracking-wide
          ${
            dark
              ? "border-white/15 text-white/70"
              : "border-slate-300 text-slate-500"
          }
        `}
      >
        ⌘ K
      </div>
    </button>
  );
}