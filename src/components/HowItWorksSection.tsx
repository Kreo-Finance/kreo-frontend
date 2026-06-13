import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Wallet, ShieldCheck, Coins, TrendingUp } from "lucide-react";

const creatorSteps = [
  {
    icon: Wallet,
    number: "01",
    title: "Connect & Verify",
    description:
      "Link your wallet and Stripe account. Complete KYC in minutes. We verify 6 months of consistent earnings automatically.",
    accent: "creo-pink",
  },
  {
    icon: ShieldCheck,
    number: "02",
    title: "Deposit Bond",
    description:
      "Deposit 5% commitment bond to show investors you're serious. Earn it back with a bonus when your offering completes.",
    accent: "creo-teal",
  },
  {
    icon: TrendingUp,
    number: "03",
    title: "Get Funded",
    description:
      "Set your revenue share %, duration, and fundraise target. Investors fund your offering with USDC. You receive capital instantly (minus 3% fee).",
    accent: "creo-pink",
  },
];

const investorSteps = [
  {
    icon: Wallet,
    number: "01",
    title: "Browse Marketplace",
    description:
      "Explore creator offerings filtered by yield, risk score, earnings history, and KreoScore reputation tier.",
    accent: "creo-teal",
  },
  {
    icon: Coins,
    number: "02",
    title: "Invest USDC",
    description:
      "Purchase Revenue Share Tokens. Creator Tokens auto-mint to your wallet in the same transaction — zero extra cost.",
    accent: "creo-pink",
  },
  {
    icon: TrendingUp,
    number: "03",
    title: "Earn Real Yield",
    description:
      "Monthly oracle-verified settlements update your claimable balance. Claim USDC anytime or enable auto-claim.",
    accent: "creo-yellow",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  "creo-pink": { bg: "bg-creo-pink/10", text: "text-creo-pink", border: "border-creo-pink/20" },
  "creo-teal": { bg: "bg-creo-teal/10", text: "text-creo-teal", border: "border-creo-teal/20" },
  "creo-yellow": { bg: "bg-creo-yellow/10", text: "text-creo-yellow", border: "border-creo-yellow/20" },
};

// Delays (seconds) — creators and investors animate in parallel
const CREATOR_BADGE_DELAY = 0.2;
const CREATOR_STEP_BASE = 0.55;
const INVESTOR_BADGE_DELAY = 0.2;
const INVESTOR_STEP_BASE = 0.55;
const STEP_STAGGER = 0.4;

interface StepCardProps {
  step: (typeof creatorSteps)[0];
  index: number;
  baseDelay: number;
  inView: boolean;
}

const StepCard = ({ step, index, baseDelay, inView }: StepCardProps) => {
  const colors = colorMap[step.accent];
  const delay = baseDelay + index * STEP_STAGGER;

  return (
    <motion.div
      initial={{ opacity: 0, y: -28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -28 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="relative flex gap-5"
    >
      {/* Vertical connector line — runs from below the number to the next step */}
      {index < 2 && (
        <motion.div
          className="absolute left-5 top-9 bottom-0 w-px bg-border"
          initial={{ scaleY: 0, originY: 0 }}
          animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ delay: delay + 0.3, duration: 0.4, ease: "easeOut" }}
        />
      )}

      {/* Large inline step number */}
      <div className="w-10 flex-shrink-0 flex justify-center">
        <motion.span
          className={`font-display text-2xl font-bold ${colors.text} leading-none tabular-nums`}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
          transition={{ delay, duration: 0.35, ease: "backOut" }}
        >
          {step.number}
        </motion.span>
      </div>

      {/* Content */}
      <div className="pb-12 flex-1">
        {/* Icon chip + title */}
        <motion.div
          className="flex items-center gap-3 mb-2.5"
          initial={{ opacity: 0, x: -12 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
          transition={{ delay: delay + 0.1, duration: 0.4, ease: "easeOut" }}
        >
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${colors.bg} ${colors.border}`}
          >
            <step.icon className={`h-4 w-4 ${colors.text}`} />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground leading-tight">
            {step.title}
          </h3>
        </motion.div>

        <motion.p
          className="font-body text-sm text-muted-foreground leading-relaxed"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: delay + 0.25, duration: 0.4 }}
        >
          {step.description}
        </motion.p>
      </div>
    </motion.div>
  );
};

const HowItWorksSection = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="border-t border-border">

      {/* ── Section header ── */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="container mx-auto px-4 pt-20 md:pt-28 pb-16 md:pb-20 max-w-4xl text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-creo-teal/30 bg-creo-teal/[0.08] text-creo-teal text-xs font-semibold tracking-widest uppercase mb-6">
          Protocol Flow
        </div>
        <h2
          className="font-display font-bold leading-[0.95] tracking-tight"
          style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
        >
          How it{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "var(--gradient-teal-pink)" }}
          >
            works.
          </span>
        </h2>
        <p className="font-body text-muted-foreground text-lg mt-6 max-w-xl mx-auto">
          Whether you're a creator seeking capital or an investor chasing real
          yield — getting started takes minutes.
        </p>
      </motion.div>

      {/* ── Two-panel grid ── */}
      <div ref={gridRef} className="border-t border-b border-border grid md:grid-cols-2">

        {/* Creator panel */}
        <div className="relative overflow-hidden p-10 md:p-14 border-b md:border-b-0 md:border-r border-border">
          {/* Subtle radial glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              background:
                "radial-gradient(ellipse at 20% 20%, hsl(var(--creo-pink)), transparent 65%)",
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
            transition={{ delay: CREATOR_BADGE_DELAY, duration: 0.45 }}
            className="mb-10 inline-flex items-center gap-2 rounded-full border border-creo-pink/30 bg-creo-pink/[0.08] px-4 py-2"
          >
            <span className="h-2 w-2 rounded-full bg-creo-pink" />
            <span className="font-display text-sm font-semibold text-creo-pink">
              For Creators
            </span>
          </motion.div>
          <div className="space-y-0">
            {creatorSteps.map((step, i) => (
              <StepCard
                key={step.number}
                step={step}
                index={i}
                baseDelay={CREATOR_STEP_BASE}
                inView={inView}
              />
            ))}
          </div>
        </div>

        {/* Investor panel */}
        <div className="relative overflow-hidden p-10 md:p-14">
          {/* Subtle radial glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              background:
                "radial-gradient(ellipse at 80% 20%, hsl(var(--creo-teal)), transparent 65%)",
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
            transition={{ delay: INVESTOR_BADGE_DELAY, duration: 0.45 }}
            className="mb-10 inline-flex items-center gap-2 rounded-full border border-creo-teal/30 bg-creo-teal/[0.08] px-4 py-2"
          >
            <span className="h-2 w-2 rounded-full bg-creo-teal" />
            <span className="font-display text-sm font-semibold text-creo-teal">
              For Investors
            </span>
          </motion.div>
          <div className="space-y-0">
            {investorSteps.map((step, i) => (
              <StepCard
                key={step.number}
                step={step}
                index={i}
                baseDelay={INVESTOR_STEP_BASE}
                inView={inView}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
