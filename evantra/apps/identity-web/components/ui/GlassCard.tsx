import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gold" | "dark" | "elevated";
  hover?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

export function GlassCard({
  variant = "default",
  hover = true,
  glow = true,
  children,
  className = "",
  ...props
}: GlassCardProps) {
  const variantStyles = {
    default: "border-white/10 bg-white/[0.035] shadow-[0_8px_32px_rgba(0,0,0,0.37)]",
    gold: "border-[#e6b24a]/30 bg-[#e6b24a]/[0.04] shadow-[0_8px_32px_rgba(230,178,74,0.12)]",
    dark: "border-white/10 bg-black/40 shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
    elevated: "border-white/15 bg-gradient-to-br from-white/[0.07] to-white/[0.02] shadow-[0_12px_48px_rgba(0,0,0,0.45)]",
  };

  const hoverStyles = hover
    ? "transition-all duration-300 hover:-translate-y-1 hover:border-[#e6b24a]/40 hover:shadow-[0_12px_40px_rgba(230,178,74,0.18)]"
    : "transition-colors duration-200";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border backdrop-blur-2xl ${variantStyles[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {/* Ambient glass reflection */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60" />

      {/* Radial Gold Glow Spotlight */}
      {glow && (
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#e6b24a]/10 blur-3xl" />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
