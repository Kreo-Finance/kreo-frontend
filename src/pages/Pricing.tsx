import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Coins,
  Zap,
  Lock,
  Star,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";

// ─── Bond tier table ──────────────────────────────────────────────────────────
const bondTiers = [
  {
    tier: "First Offering",
    score: "No KreoScore yet",
    bond: "10%",
    color: "text-muted-foreground",
    bg: "bg-muted/40",
    border: "border-border",
  },
  {
    tier: "Returning — Bronze",
    score: "KreoScore 1–2",
    bond: "8%",
    color: "text-creo-yellow",
    bg: "bg-creo-yellow/5",
    border: "border-creo-yellow/20",
  },
  {
    tier: "Returning — Silver",
    score: "KreoScore 3–5",
    bond: "6%",
    color: "text-creo-teal",
    bg: "bg-creo-teal/5",
    border: "border-creo-teal/20",
  },
  {
    tier: "Returning — Gold",
    score: "KreoScore 6+",
    bond: "4%",
    color: "text-creo-pink",
    bg: "bg-creo-pink/5",
    border: "border-creo-pink/20",
  },
];

// ─── Creator benefits ─────────────────────────────────────────────────────────
const creatorBenefits = [
  {
    icon: Coins,
    text: "3% is deducted from each monthly settlement — the only recurring cost. No subscription, no hidden charges.",
  },
  {
    icon: Zap,
    text: "Capital in 72 hours after your offering closes. No milestones, no drip release.",
  },
  {
    icon: ShieldCheck,
    text: "Bond is fully returned + a 2% bonus when you complete your offering successfully.",
  },
  {
    icon: Star,
    text: "Higher KreoScore = lower bond, higher raise ceiling, better terms — every time.",
  },
];

// ─── Investor benefits ────────────────────────────────────────────────────────
const investorBenefits = [
  {
    icon: TrendingUp,
    text: "The 3% protocol fee is deducted from each settlement before distribution — priced into the 122%+ minimum return model so your yield is never a surprise.",
  },
  {
    icon: Coins,
    text: "Monthly USDC distributions paid automatically — no claiming, no gas, no extra platform cut beyond the 3%.",
  },
  {
    icon: Lock,
    text: "If a creator defaults, their Commitment Bond is distributed to you first — not to the platform.",
  },
  {
    icon: Star,
    text: "No additional investor fees. The 3% settlement fee is the only deduction, shared transparently across both sides.",
  },
];

// ─── Section fade-in wrapper ──────────────────────────────────────────────────
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
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── 1. HERO ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* grid mesh */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--creo-teal)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--creo-teal)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* glow orbs */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-gradient-to-r from-[hsl(var(--creo-teal))] to-[hsl(var(--creo-pink))] opacity-[0.12] blur-[100px] pointer-events-none" />

        <div className="relative container mx-auto px-4 pt-24 pb-20 md:pt-36 md:pb-28 text-center max-w-4xl">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[hsl(var(--creo-teal))/30] bg-[hsl(var(--creo-teal))/8] text-[hsl(var(--creo-teal))] text-xs font-semibold tracking-widest uppercase mb-6">
              Pricing
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>
            <h1
              className="font-display font-bold leading-[0.95] tracking-tight mb-6"
              style={{ fontSize: "clamp(3.5rem, 11vw, 8rem)" }}
            >
              Simple,{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "var(--gradient-teal-pink)" }}
              >
                honest
              </span>{" "}
              fees.
            </h1>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              One fee — 3% on every settlement — shared transparently across
              creators and investors. No hidden charges, no surprise deductions,
              no performance cuts. Both sides always know exactly what to
              expect.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── 2. MAIN FEE SPLIT PANELS ──────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="grid md:grid-cols-2">
          {/* Creator panel */}
          <FadeIn className="border-b md:border-b-0 md:border-r border-border p-10 md:p-16 lg:p-20 flex flex-col justify-between min-h-[400px] relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                background:
                  "radial-gradient(ellipse at 20% 50%, hsl(var(--creo-pink)), transparent 70%)",
              }}
            />
            <div className="relative">
              <p className="font-body text-xs font-semibold tracking-widest uppercase text-creo-pink mb-6">
                For Creators
              </p>
              <p
                className="font-display font-bold leading-none text-foreground mb-4"
                style={{ fontSize: "clamp(4rem, 12vw, 7rem)" }}
              >
                3%
              </p>
              <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-sm">
                Deducted from each monthly settlement — the revenue you
                contribute to the pool. No subscription. No upfront charge. No
                cut on the capital you raise. Only on what you earn and pay back
                each month.
              </p>
            </div>
            <div className="relative mt-10">
              <div className="inline-block rounded-xl border border-creo-pink/20 bg-creo-pink/5 px-5 py-4">
                <p className="font-body text-sm text-muted-foreground">
                  Monthly settlement{" "}
                  <span className="font-semibold text-foreground">$1,000</span>
                  {" → "}Protocol fee{" "}
                  <span className="font-semibold text-creo-pink">$30</span>
                  {" → "}Distributed{" "}
                  <span className="font-semibold text-creo-teal">$970</span>
                </p>
                <p className="font-body text-xs text-muted-foreground mt-1">
                  Every month, same formula. No surprises.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Investor panel */}
          <FadeIn
            delay={0.08}
            className="p-10 md:p-16 lg:p-20 flex flex-col justify-between min-h-[400px] relative overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                background:
                  "radial-gradient(ellipse at 80% 50%, hsl(var(--creo-teal)), transparent 70%)",
              }}
            />
            <div className="relative">
              <p className="font-body text-xs font-semibold tracking-widest uppercase text-creo-teal mb-6">
                For Investors
              </p>
              <p
                className="font-display font-bold leading-none text-foreground mb-4"
                style={{ fontSize: "clamp(3rem, 9vw, 5.5rem)" }}
              >
                Net of 3%
              </p>
              <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-sm">
                The same 3% settlement fee is deducted before your USDC
                distribution arrives. No separate investor charge on top — the
                fee is shared, and the minimum return model is built around it.
                What you see is exactly what you get.
              </p>
            </div>
            <div className="relative mt-10">
              <div className="inline-block rounded-xl border border-creo-teal/20 bg-creo-teal/5 px-5 py-4">
                <p className="font-body text-sm text-muted-foreground">
                  Minimum modelled return (post-fee){" → "}
                  <span className="font-semibold text-creo-teal">122%+</span>
                </p>
                <p className="font-body text-xs text-muted-foreground mt-1">
                  Guaranteed at the creator's floor, already accounting for the
                  3% fee.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 3. COMMITMENT BOND ────────────────────────────────────────────── */}
      <section className="border-t border-border bg-card/30">
        <div className="container mx-auto px-4 py-20 md:py-28 max-w-5xl">
          <FadeIn className="text-center mb-14">
            <p className="font-body text-xs font-semibold tracking-widest uppercase text-creo-yellow mb-3">
              Skin in the game
            </p>
            <h2
              className="font-display font-bold leading-tight"
              style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
            >
              The Commitment Bond
            </h2>
            <p className="font-body text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              Creators deposit a refundable bond before launching an offering.
              It signals intent, protects investors, and rewards creators who
              follow through.
            </p>
          </FadeIn>

          {/* Bond tier table */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {bondTiers.map((tier, i) => (
              <FadeIn key={tier.tier} delay={i * 0.07}>
                <div
                  className={`rounded-2xl border ${tier.border} ${tier.bg} p-6 flex flex-col gap-3 h-full`}
                >
                  <p
                    className={`font-display font-bold text-4xl ${tier.color}`}
                  >
                    {tier.bond}
                  </p>
                  <div>
                    <p className="font-body font-semibold text-sm text-foreground">
                      {tier.tier}
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-1">
                      {tier.score}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Bond rules */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                label: "On success",
                value: "100% back + 2% bonus",
                color: "text-creo-teal",
                bg: "bg-creo-teal/5 border-creo-teal/20",
                desc: "Complete your offering and your bond is returned in full, plus a 2% bonus as a reward for keeping your word.",
              },
              {
                label: "On default",
                value: "Distributed to investors",
                color: "text-creo-pink",
                bg: "bg-creo-pink/5 border-creo-pink/20",
                desc: "If a creator abandons an active offering, the bond is split among investors — not taken by the platform.",
              },
              {
                label: "On oracle failure",
                value: "Zero penalty — excluded",
                color: "text-creo-yellow",
                bg: "bg-creo-yellow/5 border-creo-yellow/20",
                desc: "API or oracle errors are never counted against you. Technical failures outside your control never trigger the bond.",
              },
            ].map((item, i) => (
              <FadeIn key={item.label} delay={i * 0.07}>
                <div className={`rounded-2xl border ${item.bg} p-6 h-full`}>
                  <p className="font-body text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
                    {item.label}
                  </p>
                  <p
                    className={`font-display font-bold text-xl mb-3 ${item.color}`}
                  >
                    {item.value}
                  </p>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. WHAT THIS MEANS FOR YOU ────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="grid md:grid-cols-2">
          {/* Creator side */}
          <div className="border-b md:border-b-0 md:border-r border-border p-10 md:p-16 lg:p-20">
            <FadeIn>
              <p className="font-body text-xs font-semibold tracking-widest uppercase text-creo-pink mb-3">
                For Creators
              </p>
              <h3
                className="font-display font-bold leading-tight mb-8"
                style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)" }}
              >
                What this means for you
              </h3>
            </FadeIn>
            <ul className="space-y-6">
              {creatorBenefits.map((item, i) => (
                <FadeIn key={i} delay={i * 0.07}>
                  <li className="flex gap-4">
                    <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-lg bg-creo-pink/10 border border-creo-pink/20 flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-creo-pink" />
                    </div>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed pt-1.5">
                      {item.text}
                    </p>
                  </li>
                </FadeIn>
              ))}
            </ul>
          </div>

          {/* Investor side */}
          <div className="p-10 md:p-16 lg:p-20">
            <FadeIn>
              <p className="font-body text-xs font-semibold tracking-widest uppercase text-creo-teal mb-3">
                For Investors
              </p>
              <h3
                className="font-display font-bold leading-tight mb-8"
                style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)" }}
              >
                What this means for you
              </h3>
            </FadeIn>
            <ul className="space-y-6">
              {investorBenefits.map((item, i) => (
                <FadeIn key={i} delay={i * 0.07}>
                  <li className="flex gap-4">
                    <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-lg bg-creo-teal/10 border border-creo-teal/20 flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-creo-teal" />
                    </div>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed pt-1.5">
                      {item.text}
                    </p>
                  </li>
                </FadeIn>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 5. ON-CHAIN TRANSPARENCY NOTE ────────────────────────────────── */}
      <section className="border-t border-border bg-card/30">
        <div className="container mx-auto px-4 py-20 md:py-28 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <p className="font-body text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                Fully on-chain
              </p>
              <h2
                className="font-display font-bold leading-tight mb-5"
                style={{ fontSize: "clamp(1.8rem, 5vw, 3.2rem)" }}
              >
                We can't hide fees even if we wanted to.
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                Every fee, every distribution, every bond deposit is a
                transparent on-chain transaction. There is no back-office where
                numbers get adjusted. No reconciliation delay. No fine print.
                The smart contract is the terms of service — and anyone can read
                it.
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="rounded-2xl border border-border bg-muted/30 p-8 font-mono text-sm space-y-4">
                <p className="text-xs text-muted-foreground uppercase tracking-widest pb-1 border-b border-border">
                  Per monthly settlement — example $1,000
                </p>
                {[
                  {
                    label: "Creator settlement contribution",
                    value: "$1,000.00",
                    color: "text-foreground",
                  },
                  {
                    label: "Protocol fee (3%)",
                    value: "−$30.00",
                    color: "text-creo-pink",
                  },
                  {
                    label: "Net distributed to investors",
                    value: "$970.00",
                    color: "text-creo-teal",
                    bold: true,
                  },
                  {
                    label: "─────────────────────",
                    value: "",
                    color: "text-border",
                  },
                  {
                    label: "Additional investor charge",
                    value: "none",
                    color: "text-creo-teal",
                  },
                  {
                    label: "─────────────────────",
                    value: "",
                    color: "text-border",
                  },
                  {
                    label: "Bond — first offering (10%)",
                    value: "−$1,000.00*",
                    color: "text-creo-yellow",
                  },
                  {
                    label: "Bond returned on completion",
                    value: "+$1,020.00",
                    color: "text-creo-teal",
                  },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between gap-4">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span
                      className={`${row.color} ${row.bold ? "font-bold" : ""}`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                  * Bond is locked, not lost — returned + 2% bonus on success.
                  Based on a $10,000 raise.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── 6. CTA ────────────────────────────────────────────────────────── */}
      <section className="border-t border-border relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--creo-teal)/0.08) 0%, hsl(var(--creo-pink)/0.08) 100%)",
          }}
        />
        {/* top gradient bar */}
        <div className="h-1 bg-gradient-teal-pink" />
        <div className="relative container mx-auto px-4 py-24 md:py-32 text-center max-w-3xl">
          <FadeIn>
            <h2
              className="font-display font-bold leading-tight mb-4"
              style={{ fontSize: "clamp(2.5rem, 8vw, 5.5rem)" }}
            >
              Your Earnings.
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "var(--gradient-teal-pink)" }}
              >
                Your Capital
              </span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.08}>
            <p className="font-body text-muted-foreground text-lg mb-10">
              One fee — 3% per settlement — shared transparently between
              creators and investors. No subscriptions, no lock-ins, no
              surprises on either side.
            </p>
          </FadeIn>
          <FadeIn delay={0.14}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-creo-pink text-primary-foreground hover:opacity-90 font-semibold px-8 h-12"
              >
                <Link to="/onboarding/creator">
                  Start as a Creator <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-creo-teal/40 text-creo-teal hover:bg-creo-teal/10 font-semibold px-8 h-12"
              >
                <Link to="/marketplace">Browse Offerings</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default Pricing;
