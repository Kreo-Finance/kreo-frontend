interface CreoScoreBadgeProps {
  tier: 0 | 1 | 2 | 3;
  size?: "sm" | "md";
}

// ── SVG icons ─────────────────────────────────────────────────────────────────

const StarIcon = ({ size }: { size: "sm" | "md" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 14 14"
    fill="currentColor"
    className={size === "md" ? "h-4 w-4 shrink-0" : "h-3.5 w-3.5 shrink-0"}
    aria-hidden="true"
  >
    <path d="M7 1.5l1.5 4H13l-3.5 2.5 1.3 4L7 9.8 3.2 12l1.3-4L1 5.5h4.5z" />
  </svg>
);

const CheckIcon = ({ size }: { size: "sm" | "md" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 14 14"
    fill="none"
    className={size === "md" ? "h-4 w-4 shrink-0" : "h-3.5 w-3.5 shrink-0"}
    aria-hidden="true"
  >
    <path
      d="M2.5 7l3 3 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MedalIcon = ({ size }: { size: "sm" | "md" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 14 14"
    fill="currentColor"
    className={size === "md" ? "h-4 w-4 shrink-0" : "h-3.5 w-3.5 shrink-0"}
    aria-hidden="true"
  >
    <circle cx="7" cy="8.5" r="4.5" fillOpacity="0.3" />
    <circle cx="7" cy="8.5" r="2.5" />
    <path d="M5 4.5L4 1.5h6l-1 3" fillOpacity="0.6" />
  </svg>
);

// ── Per-tier config ────────────────────────────────────────────────────────────

// All colours are expressed as inline styles so they look sharp in both
// dark and light modes without needing extra Tailwind config.

const TIER_CONFIG = {
  1: {
    label: "Established",
    ariaLabel: "CreoScore Tier: Established",
    // Bronze / warm copper
    style: {
      background:
        "linear-gradient(135deg, rgba(217,119,6,0.14) 0%, rgba(180,83,9,0.08) 100%)",
      border: "1px solid rgba(217,119,6,0.45)",
      color: "#D97706",
    } as React.CSSProperties,
    hoverStyle: {} as React.CSSProperties,
    icon: "medal" as const,
  },
  2: {
    label: "Trusted",
    ariaLabel: "CreoScore Tier: Trusted",
    // Silver / slate
    style: {
      background: "rgba(148,163,184,0.14)",
      border: "1px solid rgba(148,163,184,0.45)",
      color: "#94A3B8",
    } as React.CSSProperties,
    hoverStyle: {} as React.CSSProperties,
    icon: "check" as const,
  },
  3: {
    label: "Elite",
    ariaLabel: "CreoScore Tier: Elite",
    // Gold — with ambient glow
    style: {
      background:
        "linear-gradient(135deg, rgba(251,191,36,0.22) 0%, rgba(245,158,11,0.12) 100%)",
      border: "1px solid rgba(251,191,36,0.6)",
      color: "#F59E0B",
      boxShadow: "0 0 12px rgba(251,191,36,0.25)",
    } as React.CSSProperties,
    hoverStyle: {
      boxShadow: "0 0 22px rgba(251,191,36,0.45)",
    } as React.CSSProperties,
    icon: "star" as const,
  },
} as const;

// ── Component ─────────────────────────────────────────────────────────────────

import React, { useState } from "react";

const CreoScoreBadge = ({ tier, size = "sm" }: CreoScoreBadgeProps) => {
  const [hovered, setHovered] = useState(false);

  if (tier === 0) return null;

  const config = TIER_CONFIG[tier];

  const sizeClasses =
    size === "md"
      ? "px-3 py-1.5 text-sm gap-1.5 font-semibold"
      : "px-2.5 py-1 text-xs gap-1 font-semibold";

  const mergedStyle: React.CSSProperties =
    hovered && tier === 3
      ? { ...config.style, ...config.hoverStyle }
      : config.style;

  return (
    <span
      role="img"
      aria-label={config.ariaLabel}
      className={`inline-flex items-center rounded-full font-body tracking-wide transition-shadow cursor-default select-none ${sizeClasses}`}
      style={mergedStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {config.icon === "star"  && <StarIcon  size={size} />}
      {config.icon === "check" && <CheckIcon size={size} />}
      {config.icon === "medal" && <MedalIcon size={size} />}
      {config.label}
    </span>
  );
};

export default CreoScoreBadge;
