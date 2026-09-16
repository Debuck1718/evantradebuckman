"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";

import { searchSite } from "@/lib/searchIndex";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchDialog({ open, onClose }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchSite(query), [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);

      const timer = setTimeout(() => inputRef.current?.focus(), 50);

      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (index) => (index - 1 + results.length) % results.length,
      );
      return;
    }

    if (event.key === "Enter" && results[activeIndex]) {
      go(results[activeIndex].href);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-[#050d16]/70 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a1a28]/95 shadow-[0_30px_80px_rgba(0,0,0,.55)] backdrop-blur-2xl"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-label="Search Evantra"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <Search size={18} className="shrink-0 text-[#e6b24a]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Evantra — products, research, resources…"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                aria-label="Search query"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={onClose}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-white/45">
                  No results for “{query}”. Try “identity”, “cybersecurity”
                  or “contact”.
                </p>
              ) : (
                <ul role="listbox" aria-label="Search results">
                  {results.map((result, index) => (
                    <li key={result.href}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={index === activeIndex}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => go(result.href)}
                        className={`flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3 text-left transition-colors ${
                          index === activeIndex
                            ? "bg-white/10"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium text-white">
                              {result.title}
                            </span>
                            <span className="shrink-0 rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/50">
                              {result.group}
                            </span>
                          </span>
                          <span className="mt-1 block truncate text-xs text-white/50">
                            {result.description}
                          </span>
                        </span>
                        <ArrowRight
                          size={16}
                          className="shrink-0 text-white/35"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-[11px] text-white/40">
              <span>
                <kbd className="rounded border border-white/15 px-1.5 py-0.5 font-semibold">
                  ↑
                </kbd>{" "}
                <kbd className="rounded border border-white/15 px-1.5 py-0.5 font-semibold">
                  ↓
                </kbd>{" "}
                to navigate
              </span>
              <span>
                <kbd className="rounded border border-white/15 px-1.5 py-0.5 font-semibold">
                  Enter
                </kbd>{" "}
                to open ·{" "}
                <kbd className="rounded border border-white/15 px-1.5 py-0.5 font-semibold">
                  Esc
                </kbd>{" "}
                to close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
