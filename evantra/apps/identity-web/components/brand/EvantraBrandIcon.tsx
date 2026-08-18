import React from "react";

interface EvantraBrandIconProps {
  size?: number;
  className?: string;
  showGlow?: boolean;
}

export function EvantraBrandIcon({
  size = 40,
  className = "",
  showGlow = true,
}: EvantraBrandIconProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {showGlow && (
        <div
          className="absolute inset-0 rounded-2xl bg-[#e6b24a]/20 blur-md pointer-events-none"
          style={{ transform: "scale(1.15)" }}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/favicon.ico"
        alt="Evantra"
        width={size}
        height={size}
        className="relative z-10 object-contain drop-shadow-sm select-none"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
