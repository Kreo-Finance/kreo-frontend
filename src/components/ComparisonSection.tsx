import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, TrendingUp, ScanFace, Clock, BarChart3, Layers } from "lucide-react";

// ─── Variance Model Data ───────────────────────────────────────────────────
const creators = [
  {
    name: "Creator A",
    label: "Consistent",
    tag: "LOW VARIANCE",
    tagColor: "text-creo-teal",
    tagBg: "bg-creo-teal/10 border-creo-teal/20",
    barColor: "bg-creo-teal",
    avg: "$6,000",
    cv: "4.7%",
    tier: "Low  (CV < 15%)",
    discount: "85% of average",
    floor: "$5,100 / mo",
    maxRaise: "$13,795",
    worstYield: "+29.6%",
    ringData: [5900, 6100, 6400, 5800, 6200, 5600],
    ringMax: 8500,
    description: "Rock-steady income. Rewarded with the largest raise ceiling.",
    highlightRaise: true,
  },
  {
    name: "Creator B",
    label: "Volatile",
    tag: "HIGH VARIANCE",
    tagColor: "text-creo-yellow",
    tagBg: "bg-creo-yellow/10 border-creo-yellow/20",
    barColor: "bg-creo-yellow",
    avg: "$6,000",
    cv: "36%",
    tier: "High  (CV > 30%)",
    discount: "60% of average",
    floor: "$3,600 / mo",
    maxRaise: "$7,049",
    worstYield: "+22.4%",
    ringData: [8500, 3200, 7800, 4100, 9000, 5400],
    ringMax: 8500,
    description: "Spiky income — correctly priced, never rejected.",
    highlightRaise: false,
  },
];

// ─── Fraud Prevention Layers ──────────────────────────────────────────────
const layers = [
  {
    icon: BarChart3,
    color: "text-creo-pink",
    bg: "bg-creo-pink/10",
    border: "border-creo-pink/20",
    glow: "hsl(var(--creo-pink))",
    glowPos: "20% 20%",
    title: "Graduated Trust Caps",
    sub: "Offering #1: 50%  ·  #2: 80%  ·  #3+: 100% of model max",
    detail:
      "First-time raise is capped at 50% of their variance model maximum. The fraud prize is limited before a single check runs.",
  },
  {
    icon: TrendingUp,
    color: "text-creo-teal",
    bg: "bg-creo-teal/10",
    border: "border-creo-teal/20",
    glow: "hsl(var(--creo-teal))",
    glowPos: "80% 20%",
    title: "Payout Verification",
    sub: "Bank payouts verified — not just gross earnings",
    detail:
      "We verify actual Stripe bank transfers, not just revenue records. Circular fake invoices generate earnings on paper but cannot move real money to a verified bank account.",
  },
  {
    icon: Layers,
    color: "text-creo-yellow",
    bg: "bg-creo-yellow/10",
    border: "border-creo-yellow/20",
    glow: "hsl(var(--creo-yellow))",
    glowPos: "50% 20%",
    title: "Social Proof Score ≥ 40",
    sub: "YouTube · Twitter · GitHub · Stripe consistency",
    detail:
      "Source-flexible: any combination of channels reaching 40/100. A fraudster must fabricate two strong identity signals simultaneously — costly, time-consuming, and not worth the capped prize.",
  },
  {
    icon: ScanFace,
    color: "text-creo-pink",
    bg: "bg-creo-pink/10",
    border: "border-creo-pink/20",
    glow: "hsl(var(--creo-pink))",
    glowPos: "20% 80%",
    title: "KYC + Video Verification",
    sub: "Sumsub — live video for raises above $5,000",
    detail:
      "Document check for all raises. Live video verification for raises above $5k. Leaves a complete identity trail — making fraud legally consequential, not just technically difficult.",
  },
  {
    icon: Clock,
    color: "text-creo-teal",
    bg: "bg-creo-teal/10",
    border: "border-creo-teal/20",
    glow: "hsl(var(--creo-teal))",
    glowPos: "80% 80%",
    title: "3-Day Capital Release Window",
    sub: "Automated re-checks · Admin freeze gate",
    detail:
      "After every fundraise close, automated checks re-verify all identity signals for 72 hours. Fraudster behavior changes immediately after a raise closes — this window is precisely when that signal is most visible.",
  },
  {
    icon: ShieldCheck,
    color: "text-creo-yellow",
    bg: "bg-creo-yellow/10",
    border: "border-creo-yellow/20",
    glow: "hsl(var(--creo-yellow))",
    glowPos: "50% 80%",
    title: "Bond + Protocol Default Lock",
    sub: "Abandonment = permanent block until investors recovered",
    detail:
      "A creator who abandons loses their bond AND loses all future protocol access until investor shortfall is fully recovered. The cost of abandonment is not just the bond — it is every future raise they will ever want to do.",
  },
];

// ─── Mini bar chart ────────────────────────────────────────────────────────
const MiniChart = ({
  data,
  max,
  color,
  inView,
  baseDelay,
}: {
  data: number[];
  max: number;
  color: string;
  inView: boolean;
  baseDelay: number;
}) => (
  <div className="flex items-end gap-1 h-10">
    {data.map((v, i) => (
      <motion.div
        key={i}
        className={`flex-1 rounded-sm ${color} opacity-80`}
        initial={{ height: 0 }}
        animate={inView ? { height: `${(v / max) * 100}%` } : { height: 0 }}
        transition={{
          delay: baseDelay + i * 0.18,
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
    ))}
  </div>
);

// ─── Creator Card with sequential left-to-right animation ─────────────────
const CreatorCard = ({
  c,
  cardDelay = 0,
}: {
  c: (typeof creators)[0];
  cardDelay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Each section slides in from left, staggered
  const slide = (step: number) => ({
    initial: { opacity: 0, x: -20 },
    animate: inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 },
    transition: {
      delay: cardDelay + step * 0.3,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  });

  // Stats start after chart label + bars finish
  const statsDelay = cardDelay + 1.0;

  return (
    <div
      ref={ref}
      className="rounded-xl border border-border bg-muted/40 p-5 flex flex-col gap-4"
    >
      {/* ── Header ── */}
      <motion.div {...slide(0)} className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-base font-bold text-foreground">{c.name}</p>
          <p className="font-body text-xs text-muted-foreground mt-0.5">{c.description}</p>
        </div>
        <span
          className={`flex-shrink-0 rounded-full border px-2.5 py-1 font-body text-xs font-semibold ${c.tagColor} ${c.tagBg}`}
        >
          {c.tag}
        </span>
      </motion.div>

      {/* ── Mini earnings chart ── */}
      <motion.div {...slide(1)}>
        <p className="font-body text-xs text-muted-foreground mb-1.5">6-month earnings</p>
        <MiniChart
          data={c.ringData}
          max={c.ringMax}
          color={c.barColor}
          inView={inView}
          baseDelay={cardDelay + 0.5}
        />
      </motion.div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        {[
          { label: "Monthly Avg", value: c.avg },
          { label: "CV (volatility)", value: c.cv },
          { label: "Variance Tier", value: c.tier },
          { label: "Floor Discount", value: c.discount },
        ].map((s, si) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
            transition={{
              delay: statsDelay + si * 0.2,
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="rounded-lg bg-background/60 border border-border px-3 py-2"
          >
            <p className="font-body text-xs text-muted-foreground">{s.label}</p>
            <p className="font-display text-xs font-bold text-foreground mt-0.5">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Divider ── */}
      <motion.div {...slide(5)} className="h-px bg-border" />

      {/* ── Outcomes row ── */}
      <motion.div {...slide(6)} className="flex items-center justify-between gap-3">
        <div className="text-center min-w-0">
          <p className="font-body text-xs text-muted-foreground">Floor</p>
          <p className={`font-display text-lg font-bold ${c.tagColor}`}>{c.floor}</p>
        </div>
        <div className="h-8 w-px bg-border flex-shrink-0" />
        <div className="text-center min-w-0">
          <p className="font-body text-xs text-muted-foreground">Max Raise</p>
          {c.highlightRaise ? (
            <div className="h-8 flex items-center justify-center overflow-visible">
              <motion.p
                className="font-display font-bold text-creo-teal"
                style={{ fontSize: "1.125rem", lineHeight: 1 }}
                animate={{
                  scale: [1, 1.45, 1.45, 1],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  repeatDelay: 2.2,
                  ease: "easeInOut",
                  times: [0, 0.25, 0.65, 1],
                }}
              >
                {c.maxRaise}
              </motion.p>
            </div>
          ) : (
            <p className="font-display text-lg font-bold text-foreground">{c.maxRaise}</p>
          )}
        </div>
        <div className="h-8 w-px bg-border flex-shrink-0" />
        <div className="text-center min-w-0">
          <p className="font-body text-xs text-muted-foreground">Floor Yield</p>
          <p className="font-display text-lg font-bold text-creo-teal">{c.worstYield}</p>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Main Section ──────────────────────────────────────────────────────────
const ComparisonSection = () => {
  return (
    <section id="moat" className="border-t border-border">

      {/* ── Section header ── */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="container mx-auto px-4 pt-20 md:pt-28 pb-16 md:pb-20 max-w-4xl text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-creo-pink/30 bg-creo-pink/[0.08] text-creo-pink text-xs font-semibold tracking-widest uppercase mb-6">
          Built Different
        </div>
        <h2
          className="font-display font-bold leading-[0.95] tracking-tight"
          style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
        >
          The intelligence layer{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "var(--gradient-teal-pink)" }}
          >
            baked in.
          </span>
        </h2>
        <p className="font-body text-muted-foreground text-lg mt-6 max-w-xl mx-auto">
          Every platform uses raw averages. Kreo uses a variance-discounted model
          that rewards consistency and correctly prices volatility — automatically, on-chain.
        </p>
      </motion.div>

      {/* ══════════════════════════════════════════
          PART 1 — VARIANCE MODEL
      ══════════════════════════════════════════ */}
      <div className="border-t border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="container mx-auto px-4 py-12 md:py-16"
        >
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
            <div>
              <span className="font-body text-xs font-semibold tracking-widest uppercase text-creo-teal">
                Variance Model
              </span>
              <h3
                className="font-display font-bold leading-none text-foreground mt-3"
                style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)" }}
              >
                Same average.<br className="hidden sm:block" /> Different risk. Different raise.
              </h3>
              <div
                className="h-px w-14 rounded-full mt-4"
                style={{ background: "hsl(var(--creo-teal))", opacity: 0.6 }}
              />
              <p className="font-body text-base text-muted-foreground mt-4 max-w-lg">
                Two creators. Both averaging{" "}
                <span className="text-foreground font-medium">$6,000/month</span>.
                Every other platform treats them identically. Kreo doesn't.
              </p>
            </div>
            <div className="flex-shrink-0 inline-flex items-center gap-2 rounded-full border border-creo-pink/20 bg-creo-pink/5 px-4 py-2 self-start">
              <span className="h-2 w-2 rounded-full bg-creo-pink animate-pulse" />
              <span className="font-body text-xs font-medium text-creo-pink">
                Variance Model Active
              </span>
            </div>
          </div>

          {/* Two creator cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {creators.map((c) => (
              <CreatorCard key={c.name} c={c} cardDelay={0} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════
          PART 2 — FRAUD PREVENTION HEADER
      ══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="container mx-auto px-4 pt-16 pb-10 md:pt-20 md:pb-12 max-w-4xl text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-creo-teal/30 bg-creo-teal/[0.08] text-creo-teal text-xs font-semibold tracking-widest uppercase mb-6">
          <ShieldCheck className="h-3 w-3" />
          Fraud Stack Active
        </div>
        <h3
          className="font-display font-bold leading-[0.95] tracking-tight"
          style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}
        >
          Six layers between your capital{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "var(--gradient-teal-pink)" }}
          >
            and a bad actor.
          </span>
        </h3>
        <p className="font-body text-muted-foreground text-base mt-5 max-w-xl mx-auto">
          Each layer raises the cost and lowers the expected payoff of fraud — until
          attempting it is no longer rationally attractive.
        </p>
      </motion.div>

      {/* ══════════════════════════════════════════
          PART 2 — FRAUD PREVENTION PANELS
      ══════════════════════════════════════════ */}
      <div className="border-t border-b border-border grid sm:grid-cols-2 lg:grid-cols-3">
        {layers.map((layer, i) => {
          const Icon = layer.icon;

          // Border logic: border-b for non-last rows, border-r for non-last cols
          const borderClasses = [
            // Bottom border: mobile (1-col) all except last, sm (2-col) except last 2, lg (3-col) except last 3
            i < 5 ? "border-b" : "",
            i >= 4 ? "sm:border-b-0" : "",
            i >= 3 ? "lg:border-b-0" : "",
            // Right border at sm (2-col): even-index items
            i % 2 === 0 ? "sm:border-r" : "sm:border-r-0",
            // Right border at lg (3-col): non-last-col items
            i % 3 < 2 ? "lg:border-r" : "lg:border-r-0",
            "border-border",
          ].filter(Boolean).join(" ");

          return (
            <motion.div
              key={layer.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden flex flex-col min-h-[300px] p-10 md:p-12 ${borderClasses}`}
            >
              {/* Radial glow */}
              <div
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at ${layer.glowPos}, ${layer.glow}, transparent 65%)`,
                }}
              />

              {/* Watermark number */}
              <span
                className="absolute right-5 bottom-4 font-display font-bold select-none pointer-events-none opacity-[0.05] dark:opacity-[0.13] text-foreground"
                style={{ fontSize: "clamp(5rem, 12vw, 8rem)", lineHeight: 1 }}
              >
                L{i + 1}
              </span>

              {/* Content */}
              <div className="relative flex flex-col gap-5 h-full">
                {/* Icon + layer label */}
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border ${layer.bg} ${layer.border}`}
                  >
                    <Icon className={`h-5 w-5 ${layer.color}`} />
                  </div>
                  <span className={`font-body text-xs font-semibold tracking-widest uppercase ${layer.color} opacity-60`}>
                    Layer {i + 1}
                  </span>
                </div>

                {/* Title + accent rule */}
                <div>
                  <p className="font-display text-xl font-bold text-foreground leading-tight">
                    {layer.title}
                  </p>
                  <div
                    className="h-px w-10 rounded-full mt-3"
                    style={{ background: layer.glow, opacity: 0.6 }}
                  />
                </div>

                {/* Subtitle */}
                <p className={`font-body text-sm font-medium ${layer.color}`}>
                  {layer.sub}
                </p>

                {/* Detail — visible on hover */}
                <p className="font-body text-sm text-muted-foreground leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-200 max-h-0 group-hover:max-h-24 overflow-hidden">
                  {layer.detail}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
};

export default ComparisonSection;
