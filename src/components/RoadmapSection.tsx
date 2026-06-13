import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const phases = [
  {
    num: "01",
    phase: "Phase 1",
    period: "Q2 2026",
    title: "Mainnet Beta Launch",
    description:
      "Smart contracts live on Base testnet. Singapore entity incorporated. Creator and investor onboarding complete. First on-chain raise, capital release, and monthly settlement cycle executed in beta.",
    milestone: "Beta opens July 2026 — accredited investors across all three variance tiers.",
    accent: "creo-teal",
    glowPos: "20% 40%",
  },
  {
    num: "02",
    phase: "Phase 2",
    period: "Q3 2026",
    title: "Insurance Pool & Token Launch",
    description:
      "External audit complete. Base Mainnet deployed with 48-hour governance timelock. $KREO token launched via SAFT round. Staking drives real USDC yield from the insurance pool. RST secondary market on Uniswap V3.",
    milestone: "$KREO staking — insurance pool-backed yield paid in USDC, not promises.",
    accent: "creo-pink",
    glowPos: "80% 40%",
  },
  {
    num: "03",
    phase: "Phase 3",
    period: "Q4 2026",
    title: "Global Scale Through DAO Governance",
    description:
      "KREO DAO assumes full on-chain governance — no admin keys in production. Cross-chain to Ethereum and Solana. Institutional APIs and whitelabel settlement infrastructure. Full retail compliance across all target markets.",
    milestone: "KREO DAO governs the protocol — fee rates, oracle parameters, treasury.",
    accent: "creo-yellow",
    glowPos: "50% 80%",
  },
];

const colorMap: Record<
  string,
  { text: string; bg: string; border: string; glow: string; numOpacity: string }
> = {
  "creo-teal": {
    text: "text-creo-teal",
    bg: "bg-creo-teal/5",
    border: "border-creo-teal/20",
    glow: "hsl(var(--creo-teal))",
    numOpacity: "opacity-[0.05] dark:opacity-[0.13]",
  },
  "creo-pink": {
    text: "text-creo-pink",
    bg: "bg-creo-pink/5",
    border: "border-creo-pink/20",
    glow: "hsl(var(--creo-pink))",
    numOpacity: "opacity-[0.05] dark:opacity-[0.13]",
  },
  "creo-yellow": {
    text: "text-creo-yellow",
    bg: "bg-creo-yellow/5",
    border: "border-creo-yellow/20",
    glow: "hsl(var(--creo-yellow))",
    numOpacity: "opacity-[0.05] dark:opacity-[0.13]",
  },
};

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="border-t border-border">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <FadeIn className="container mx-auto px-4 pt-20 md:pt-28 pb-16 md:pb-20 max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[hsl(var(--creo-teal))/30] bg-[hsl(var(--creo-teal))/8] text-[hsl(var(--creo-teal))] text-xs font-semibold tracking-widest uppercase mb-6">
          Protocol Roadmap
        </div>
        <h2
          className="font-display font-bold leading-[0.95] tracking-tight"
          style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
        >
          From Launch{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "var(--gradient-teal-pink)" }}
          >
            to Scale.
          </span>
        </h2>
        <p className="font-body text-muted-foreground text-lg mt-6 max-w-xl mx-auto">
          Three phases. Every milestone public, every contract on-chain, every
          commitment verifiable.
        </p>
      </FadeIn>

      {/* ── Phase panels ───────────────────────────────────────────────────── */}
      <div className="border-t border-b border-border grid md:grid-cols-3">
        {phases.map((p, i) => {
          const c = colorMap[p.accent];
          return (
            <FadeIn
              key={p.phase}
              delay={i * 0.08}
              className={`relative overflow-hidden flex flex-col justify-between min-h-[500px]
                p-10 md:p-12 lg:p-14
                ${i < phases.length - 1 ? "border-b md:border-b-0 md:border-r border-border" : ""}
              `}
            >
              {/* Radial glow */}
              <div
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at ${p.glowPos}, ${c.glow}, transparent 65%)`,
                }}
              />

              {/* Phase number watermark */}
              <span
                className={`absolute right-6 bottom-6 font-display font-bold select-none pointer-events-none ${c.numOpacity} text-foreground`}
                style={{ fontSize: "clamp(7rem, 16vw, 11rem)", lineHeight: 1 }}
              >
                {p.num}
              </span>

              {/* Top content */}
              <div className="relative flex flex-col gap-6">
                {/* Phase label + period */}
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`font-body text-xs font-semibold tracking-widest uppercase ${c.text}`}
                  >
                    {p.phase}
                  </span>
                  <span className="font-body text-xs text-muted-foreground border border-border rounded-full px-3 py-0.5">
                    {p.period}
                  </span>
                </div>

                {/* Title */}
                <p
                  className="font-display font-bold leading-none text-foreground"
                  style={{ fontSize: "clamp(2.2rem, 6vw, 3.6rem)" }}
                >
                  {p.title}
                </p>

                {/* Accent rule */}
                <div
                  className={`h-px w-14 rounded-full`}
                  style={{ background: c.glow, opacity: 0.6 }}
                />

                {/* Description */}
                <p className="font-body text-base text-muted-foreground leading-relaxed max-w-sm">
                  {p.description}
                </p>
              </div>

              {/* Bottom milestone chip */}
              <div className="relative mt-10">
                <div
                  className={`inline-block rounded-xl border ${c.border} ${c.bg} px-5 py-4 max-w-sm`}
                >
                  <p className={`font-body text-xs font-semibold tracking-widest uppercase ${c.text} mb-1`}>
                    Key milestone
                  </p>
                  <p className="font-body text-sm text-muted-foreground leading-snug">
                    {p.milestone}
                  </p>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
