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

const colorMap: Record<string, { bg: string; text: string }> = {
  "creo-pink": { bg: "bg-creo-pink/10", text: "text-creo-pink" },
  "creo-teal": { bg: "bg-creo-teal/10", text: "text-creo-teal" },
  "creo-yellow": { bg: "bg-creo-yellow/10", text: "text-creo-yellow" },
};

// Delays (seconds) — creators first, then investors
const CREATOR_BADGE_DELAY = 0.2;
const CREATOR_STEP_BASE = 0.55; // step i = base + i * 0.4
const INVESTOR_BADGE_DELAY = 2.0;
const INVESTOR_STEP_BASE = 2.35; // step i = base + i * 0.4
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
      className="relative flex gap-4"
    >
      {/* Vertical connector */}
      {index < 2 && (
        <motion.div
          className="absolute left-6 top-14 bottom-0 w-px bg-border"
          initial={{ scaleY: 0, originY: 0 }}
          animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ delay: delay + 0.3, duration: 0.4, ease: "easeOut" }}
        />
      )}

      {/* Icon circle */}
      <motion.div
        className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${colors.bg}`}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
        transition={{ delay, duration: 0.35, ease: "backOut" }}
      >
        <step.icon className={`h-5 w-5 ${colors.text}`} />
      </motion.div>

      {/* Content */}
      <div className="pb-10">
        <motion.div
          className="flex items-center gap-2 mb-1"
          initial={{ opacity: 0, x: -12 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
          transition={{ delay: delay + 0.1, duration: 0.4, ease: "easeOut" }}
        >
          <span className={`font-display text-xs font-bold ${colors.text}`}>
            {step.number}
          </span>
          <h3 className="font-display text-lg font-semibold text-foreground">
            {step.title}
          </h3>
        </motion.div>
        <motion.p
          className="font-body text-sm text-muted-foreground leading-relaxed max-w-sm"
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
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="font-display text-4xl font-bold md:text-5xl">
            How it <span className="text-gradient-hero">works</span>
          </h2>
          <p className="mt-4 font-body text-lg text-muted-foreground max-w-xl mx-auto">
            Whether you're a creator seeking capital or an investor chasing real
            yield — getting started takes minutes.
          </p>
        </motion.div>

        {/* Animated content — triggers when section scrolls into view */}
        <div ref={gridRef} className="grid gap-16 lg:gap-12 lg:grid-cols-2 max-w-4xl mx-auto">
          {/* Creator Flow */}
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
              transition={{ delay: CREATOR_BADGE_DELAY, duration: 0.45 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-creo-pink/30 bg-creo-pink/5 px-4 py-2"
            >
              <span className="h-2 w-2 rounded-full bg-creo-pink" />
              <span className="font-display text-sm font-semibold text-creo-pink">
                For Creators
              </span>
            </motion.div>
            <div className="space-y-0 w-full max-w-sm">
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

          {/* Investor Flow */}
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
              transition={{ delay: INVESTOR_BADGE_DELAY, duration: 0.45 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-creo-teal/30 bg-creo-teal/5 px-4 py-2"
            >
              <span className="h-2 w-2 rounded-full bg-creo-teal" />
              <span className="font-display text-sm font-semibold text-creo-teal">
                For Investors
              </span>
            </motion.div>
            <div className="space-y-0 w-full max-w-sm">
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
      </div>
    </section>
  );
};

export default HowItWorksSection;
