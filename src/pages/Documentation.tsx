import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  ChevronDown,
  BookOpen,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Code2,
  Star,
  Coins,
  Lock,
  ArrowRight,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

// ─── Sidebar structure ────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  {
    id: "introduction",
    label: "Introduction",
    icon: BookOpen,
    color: "text-creo-teal",
    items: [
      { id: "what-is-kreo", label: "What is KREO?" },
      { id: "core-concepts", label: "Core Concepts" },
      { id: "glossary", label: "Glossary" },
    ],
  },
  {
    id: "protocol",
    label: "Protocol",
    icon: Zap,
    color: "text-creo-pink",
    items: [
      { id: "how-it-works", label: "How It Works" },
      { id: "revenue-offerings", label: "Revenue-Backed Offerings" },
      { id: "kreoscore", label: "KreoScore System" },
      { id: "commitment-bond", label: "Commitment Bond" },
      { id: "settlements", label: "Settlements" },
    ],
  },
  {
    id: "for-creators",
    label: "For Creators",
    icon: Users,
    color: "text-creo-yellow",
    items: [
      { id: "creator-overview", label: "Overview" },
      { id: "creator-kyc", label: "KYC & Onboarding" },
      { id: "creator-offering", label: "Creating an Offering" },
      { id: "creator-settlements", label: "Managing Settlements" },
    ],
  },
  {
    id: "for-investors",
    label: "For Investors",
    icon: TrendingUp,
    color: "text-creo-teal",
    items: [
      { id: "investor-overview", label: "Overview" },
      { id: "investor-marketplace", label: "Browsing the Marketplace" },
      { id: "investor-returns", label: "Returns & Distributions" },
      { id: "investor-protection", label: "Risk Protection" },
    ],
  },
  {
    id: "smart-contracts",
    label: "Smart Contracts",
    icon: Code2,
    color: "text-creo-pink",
    items: [
      { id: "architecture", label: "Architecture" },
      { id: "onchain-transparency", label: "On-Chain Transparency" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

// ─── Section components ───────────────────────────────────────────────────────

function SectionHeading({
  id,
  label,
  color = "text-creo-teal",
}: {
  id: string;
  label: string;
  color?: string;
}) {
  return (
    <p
      className={`font-body text-xs font-semibold tracking-widest uppercase ${color} mb-3`}
    >
      {label}
    </p>
  );
}

function DocH2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="font-display font-bold text-foreground scroll-mt-24"
      style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)" }}
    >
      {children}
    </h2>
  );
}

function DocH3({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h3
      id={id}
      className="font-display font-bold text-foreground text-xl mt-10 mb-3 scroll-mt-24"
    >
      {children}
    </h3>
  );
}

function DocP({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-muted-foreground leading-relaxed mb-4">
      {children}
    </p>
  );
}

function Callout({
  color = "teal",
  children,
}: {
  color?: "teal" | "pink" | "yellow";
  children: React.ReactNode;
}) {
  const map = {
    teal: "border-creo-teal/30 bg-creo-teal/5 text-creo-teal",
    pink: "border-creo-pink/30 bg-creo-pink/5 text-creo-pink",
    yellow: "border-creo-yellow/30 bg-creo-yellow/5 text-creo-yellow",
  };
  return (
    <div className={`rounded-xl border ${map[color]} p-5 my-6`}>
      <p className="font-body text-sm leading-relaxed">{children}</p>
    </div>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-xs bg-muted border border-border px-1.5 py-0.5 rounded text-creo-teal">
      {children}
    </code>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mb-4">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 font-body text-sm text-muted-foreground leading-relaxed">
          <ChevronRight className="h-4 w-4 text-creo-teal flex-shrink-0 mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Divider() {
  return <div className="border-t border-border my-16" />;
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(NAV_SECTIONS.map((s) => [s.id, true]))
  );

  return (
    <nav className="py-8 px-4">
      <div className="mb-6">
        <p className="font-display text-xs font-bold tracking-widest uppercase text-muted-foreground px-2">
          Documentation
        </p>
      </div>
      <div className="space-y-1">
        {NAV_SECTIONS.map((section) => {
          const Icon = section.icon;
          const isExpanded = expanded[section.id];

          return (
            <div key={section.id}>
              <button
                onClick={() =>
                  setExpanded((prev) => ({
                    ...prev,
                    [section.id]: !prev[section.id],
                  }))
                }
                className="w-full flex items-center justify-between gap-2 px-2 py-2 rounded-lg hover:bg-muted/60 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${section.color}`} />
                  <span className="font-display text-sm font-semibold text-foreground">
                    {section.label}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </button>

              {isExpanded && (
                <div className="ml-6 mt-0.5 space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-body transition-colors ${
                          isActive
                            ? "text-foreground bg-muted font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        }`}
                      >
                        {isActive && (
                          <span className="inline-block w-1 h-1 rounded-full bg-creo-teal mr-2 mb-0.5" />
                        )}
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Main doc content ─────────────────────────────────────────────────────────

function DocContent() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-12 space-y-0">

      {/* ── INTRODUCTION ─────────────────────────────────────────────────── */}
      <section id="introduction">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-creo-teal/30 bg-creo-teal/8 text-creo-teal text-xs font-semibold tracking-widest uppercase mb-5">
            Introduction
          </div>
          <h1
            className="font-display font-bold leading-tight text-foreground mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            KREO Protocol{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "var(--gradient-teal-pink)" }}
            >
              Documentation
            </span>
          </h1>
          <p className="font-body text-muted-foreground text-lg leading-relaxed max-w-2xl">
            Everything you need to understand, build with, and participate in the KREO
            revenue-backed offering protocol.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: Users, label: "Creators", desc: "Tokenize your revenue and raise capital", color: "text-creo-yellow", bg: "bg-creo-yellow/5 border-creo-yellow/20" },
            { icon: TrendingUp, label: "Investors", desc: "Earn USDC monthly from creator revenue", color: "text-creo-teal", bg: "bg-creo-teal/5 border-creo-teal/20" },
            { icon: Shield, label: "Protocol", desc: "On-chain, transparent, trust-minimized", color: "text-creo-pink", bg: "bg-creo-pink/5 border-creo-pink/20" },
          ].map(({ icon: Icon, label, desc, color, bg }) => (
            <div key={label} className={`rounded-xl border ${bg} p-5`}>
              <Icon className={`h-5 w-5 ${color} mb-3`} />
              <p className="font-display font-semibold text-foreground text-sm mb-1">{label}</p>
              <p className="font-body text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <DocH2 id="what-is-kreo">What is KREO?</DocH2>
        <div className="mt-4 mb-6" />
        <DocP>
          KREO is a decentralised protocol that lets content creators and digital entrepreneurs
          tokenize their future revenue streams. In exchange for a portion of their upcoming
          earnings, creators receive upfront USDC capital — without surrendering equity, taking on
          debt, or dealing with traditional financial gatekeepers.
        </DocP>
        <DocP>
          On the other side of each offering are investors who earn predictable, monthly USDC
          distributions backed by real creator revenue. Every offering, every settlement, and every
          fee is verifiable on-chain.
        </DocP>
        <Callout color="teal">
          KREO is not a lending platform. There are no interest rates, no loan agreements, and no
          collateral requirements. Creators share future revenue — investors receive a portion of
          that revenue until the agreed total is reached.
        </Callout>

        <DocH2 id="core-concepts">Core Concepts</DocH2>
        <div className="mt-4 mb-4" />
        <DocP>
          Before diving deeper, it helps to understand the four pillars that underpin the KREO
          protocol:
        </DocP>

        {[
          {
            term: "Revenue-Backed Offering (RBO)",
            color: "text-creo-teal",
            bg: "bg-creo-teal/5 border-creo-teal/20",
            desc:
              "A creator launches an RBO specifying the capital they want to raise and the total revenue they commit to distribute back (always ≥ 122% of the raise). Investors fund the offering in return for monthly USDC distributions.",
          },
          {
            term: "KreoScore",
            color: "text-creo-yellow",
            bg: "bg-creo-yellow/5 border-creo-yellow/20",
            desc:
              "An on-chain reputation score for creators, ranging from 0 to 6+. It is calculated from successful offering completions, settlement consistency, and community signals. A higher KreoScore unlocks lower bond requirements and larger raise ceilings.",
          },
          {
            term: "Commitment Bond",
            color: "text-creo-pink",
            bg: "bg-creo-pink/5 border-creo-pink/20",
            desc:
              "Before launching, creators deposit a refundable bond (4–10% of the raise) as a skin-in-the-game signal. It is returned with a 2% bonus on successful completion, or distributed to investors if the creator defaults.",
          },
          {
            term: "Monthly Settlement",
            color: "text-creo-teal",
            bg: "bg-creo-teal/5 border-creo-teal/20",
            desc:
              "Each month, creators contribute a share of their verified revenue to the offering pool. A 3% protocol fee is deducted, and the remainder is distributed automatically in USDC to all investors proportional to their stake.",
          },
        ].map(({ term, color, bg, desc }) => (
          <div key={term} className={`rounded-xl border ${bg} p-5 mb-4`}>
            <p className={`font-display font-semibold text-sm ${color} mb-2`}>{term}</p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}

        <DocH2 id="glossary">Glossary</DocH2>
        <div className="mt-4 mb-4" />
        <div className="rounded-xl border border-border overflow-hidden">
          {[
            ["Offering", "A fundraising event where a creator tokenizes future revenue."],
            ["RBO", "Revenue-Backed Offering — the core instrument on KREO."],
            ["Settlement", "The monthly revenue contribution from creator to the pool."],
            ["KreoScore", "Creator reputation score (0–6+) used to determine bond rates."],
            ["Commitment Bond", "A refundable deposit required before launching an offering."],
            ["USDC", "USD Coin — the stablecoin used for all capital and distributions on KREO."],
            ["Oracle", "A service that verifies creator revenue data on-chain."],
            ["Raise Ceiling", "The maximum amount a creator can raise, scaled by KreoScore."],
            ["Default", "When a creator stops making settlements on an active offering."],
          ].map(([term, def], i) => (
            <div
              key={term}
              className={`flex gap-4 px-5 py-4 ${i % 2 === 0 ? "bg-muted/20" : ""} border-b border-border last:border-0`}
            >
              <span className="font-display font-semibold text-sm text-foreground w-36 flex-shrink-0">
                {term}
              </span>
              <span className="font-body text-sm text-muted-foreground">{def}</span>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── PROTOCOL ─────────────────────────────────────────────────────── */}
      <section id="protocol">
        <div className="mb-8 pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-creo-pink/30 bg-creo-pink/8 text-creo-pink text-xs font-semibold tracking-widest uppercase mb-5">
            Protocol
          </div>
          <DocH2 id="how-it-works">How It Works</DocH2>
        </div>
        <div className="mt-4" />
        <DocP>
          The KREO protocol operates on a simple premise: creators have predictable future
          revenue, and investors want stable yield. KREO connects them with an on-chain
          trust layer that makes the relationship transparent, automated, and fair.
        </DocP>

        <div className="my-8 rounded-2xl border border-border bg-muted/20 overflow-hidden">
          {[
            { step: "01", title: "Creator launches an offering", desc: "After passing KYC, a creator deposits their Commitment Bond and publishes an offering with a target raise amount and a minimum return commitment (≥ 122%)." },
            { step: "02", title: "Investors fund the offering", desc: "The offering is listed on the marketplace. Investors can browse creator analytics, review the offering terms, and commit USDC before the closing date." },
            { step: "03", title: "Capital is delivered in 72 hours", desc: "Once the offering closes successfully, the raised USDC is sent to the creator's wallet within 72 hours — no milestones, no drip release." },
            { step: "04", title: "Monthly settlements begin", desc: "Each month, the creator contributes their agreed revenue share. The protocol verifies it via oracle, deducts the 3% fee, and distributes the remainder to investors." },
            { step: "05", title: "Offering completes", desc: "When cumulative distributions reach 100% of the committed return, the offering is closed on-chain, the creator's bond is returned with a 2% bonus, and KreoScore increases." },
          ].map(({ step, title, desc }, i) => (
            <div
              key={step}
              className={`flex gap-5 p-6 ${i < 4 ? "border-b border-border" : ""}`}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                <span className="font-display font-bold text-xs text-primary-foreground">{step}</span>
              </div>
              <div>
                <p className="font-display font-semibold text-foreground text-sm mb-1">{title}</p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <DocH2 id="revenue-offerings">Revenue-Backed Offerings</DocH2>
        <div className="mt-4 mb-4" />
        <DocP>
          A Revenue-Backed Offering (RBO) is a creator's promise to distribute a fixed total amount
          of USDC to investors over time, sourced from their own verified revenue. Unlike equity,
          an RBO does not dilute the creator's ownership. Unlike debt, there are no interest
          compounding mechanisms.
        </DocP>
        <DocP>
          Each RBO specifies:
        </DocP>
        <BulletList items={[
          "Raise amount — the USDC the creator wants to receive upfront.",
          "Return multiple — always ≥ 122% of the raise (e.g., raise $10,000 → return $12,200+).",
          "Monthly settlement cap — the maximum amount the creator commits per settlement period.",
          "Offering duration — the window during which investors can commit capital.",
        ]} />

        <Callout color="pink">
          The 122% minimum return is not arbitrary — it is designed to ensure investors are fairly
          compensated for the time value of capital after the 3% protocol fee is factored in across
          a typical offering lifecycle.
        </Callout>

        <DocH2 id="kreoscore">KreoScore System</DocH2>
        <div className="mt-4 mb-4" />
        <DocP>
          KreoScore is an on-chain reputation score assigned to every creator. It ranges from 0
          (no history) to 6+ (elite track record). The score updates automatically after each
          offering event and is used to determine the creator's bond rate and raise ceiling.
        </DocP>

        <div className="grid sm:grid-cols-2 gap-4 my-6">
          {[
            { label: "First Offering", score: "No KreoScore", bond: "10%", color: "text-muted-foreground", border: "border-border" },
            { label: "Bronze", score: "KreoScore 1–2", bond: "8%", color: "text-creo-yellow", border: "border-creo-yellow/30" },
            { label: "Silver", score: "KreoScore 3–5", bond: "6%", color: "text-creo-teal", border: "border-creo-teal/30" },
            { label: "Gold", score: "KreoScore 6+", bond: "4%", color: "text-creo-pink", border: "border-creo-pink/30" },
          ].map(({ label, score, bond, color, border }) => (
            <div key={label} className={`rounded-xl border ${border} p-4 flex items-center justify-between`}>
              <div>
                <p className={`font-display font-bold text-2xl ${color}`}>{bond}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{score}</p>
              </div>
              <p className="font-display font-semibold text-sm text-foreground">{label}</p>
            </div>
          ))}
        </div>

        <DocP>
          Factors that positively impact KreoScore include on-time settlements, successful
          offering completions, and community endorsements. Oracle failures and verified
          technical errors are excluded from scoring.
        </DocP>

        <DocH2 id="commitment-bond">Commitment Bond</DocH2>
        <div className="mt-4 mb-4" />
        <DocP>
          The Commitment Bond is a refundable USDC deposit that every creator must provide before
          launching an offering. It is locked for the duration of the offering and serves as a
          skin-in-the-game signal to investors.
        </DocP>

        <div className="rounded-2xl border border-border bg-muted/20 divide-y divide-border my-6">
          {[
            { scenario: "On success", outcome: "100% returned + 2% bonus", color: "text-creo-teal", desc: "Complete your offering commitments and your full bond is returned, plus a 2% bonus reward." },
            { scenario: "On default", outcome: "Distributed to investors", color: "text-creo-pink", desc: "If a creator abandons an active offering, the bond is proportionally distributed to investors — not taken by the platform." },
            { scenario: "Oracle failure", outcome: "Zero penalty — excluded", color: "text-creo-yellow", desc: "Technical failures and API errors outside the creator's control are never counted against the bond." },
          ].map(({ scenario, outcome, color, desc }) => (
            <div key={scenario} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">{scenario}</p>
                <p className={`font-display font-semibold text-sm ${color}`}>{outcome}</p>
              </div>
              <p className="font-body text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <DocH2 id="settlements">Settlements</DocH2>
        <div className="mt-4 mb-4" />
        <DocP>
          Settlements are the monthly revenue contributions that a creator makes to their active
          offering pool. They are the mechanism through which investors receive their returns.
        </DocP>

        <div className="rounded-xl border border-border bg-muted/30 p-6 font-mono text-sm space-y-3 my-6">
          <p className="text-xs text-muted-foreground uppercase tracking-widest pb-2 border-b border-border">
            Settlement breakdown — example $1,000
          </p>
          {[
            { label: "Creator revenue contribution", value: "$1,000.00", color: "text-foreground" },
            { label: "Protocol fee (3%)", value: "−$30.00", color: "text-creo-pink" },
            { label: "Net distributed to investors", value: "$970.00", color: "text-creo-teal", bold: true },
            { label: "Additional investor charge", value: "none", color: "text-muted-foreground" },
          ].map(({ label, value, color, bold }) => (
            <div key={label} className="flex justify-between gap-4">
              <span className="text-muted-foreground">{label}</span>
              <span className={`${color} ${bold ? "font-bold" : ""}`}>{value}</span>
            </div>
          ))}
        </div>

        <DocP>
          If a settlement is delayed by a verified oracle error, it is not counted as a missed
          settlement. Creators have a grace window defined in the offering terms before a
          settlement is flagged as a default event.
        </DocP>
      </section>

      <Divider />

      {/* ── FOR CREATORS ─────────────────────────────────────────────────── */}
      <section id="for-creators">
        <div className="mb-8 pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-creo-yellow/30 bg-creo-yellow/8 text-creo-yellow text-xs font-semibold tracking-widest uppercase mb-5">
            For Creators
          </div>
          <DocH2 id="creator-overview">Overview</DocH2>
        </div>
        <div className="mt-4" />
        <DocP>
          KREO is built for digital creators, streamers, content producers, and online
          entrepreneurs who have consistent, verifiable revenue and need upfront capital
          to grow — without giving up equity or taking on traditional debt.
        </DocP>

        <div className="grid sm:grid-cols-2 gap-4 my-6">
          {[
            { icon: Zap, label: "72h capital delivery", desc: "Capital arrives in your wallet within 72 hours of offering close." },
            { icon: Coins, label: "3% only on settlements", desc: "No subscriptions, no upfront charges, no cut on your raise." },
            { icon: Star, label: "Build your KreoScore", desc: "Every completed offering unlocks better terms for your next raise." },
            { icon: Shield, label: "Bond returned + bonus", desc: "Succeed and get your bond back with a 2% reward." },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex gap-4 p-4 rounded-xl border border-border bg-muted/20">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-creo-yellow/10 border border-creo-yellow/20 flex items-center justify-center">
                <Icon className="h-4 w-4 text-creo-yellow" />
              </div>
              <div>
                <p className="font-display font-semibold text-sm text-foreground mb-0.5">{label}</p>
                <p className="font-body text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <DocH3 id="creator-kyc">KYC & Onboarding</DocH3>
        <DocP>
          Before launching an offering, all creators must complete identity verification (KYC)
          through our regulated partner, Sumsub. This is a one-time process and takes an average
          of 5–10 minutes.
        </DocP>
        <BulletList items={[
          "Government-issued photo ID (passport, national ID, or driver's licence).",
          "A selfie or short liveness video for identity matching.",
          "Basic personal details: name, date of birth, country of residence.",
          "Revenue channel verification — a link to your primary revenue platform (YouTube, Twitch, Spotify, etc.).",
        ]} />
        <DocP>
          Verification is typically completed within 24 hours. Once approved, you will be able
          to deposit your Commitment Bond and publish your first offering.
        </DocP>

        <DocH3 id="creator-offering">Creating an Offering</DocH3>
        <DocP>
          After KYC approval, navigate to the Creator Dashboard and select{" "}
          <InlineCode>New Offering</InlineCode>. You will be prompted to configure:
        </DocP>
        <BulletList items={[
          "Raise amount — how much USDC you want to receive upfront.",
          "Total return commitment — the total you agree to distribute back (min 122% of raise).",
          "Monthly settlement cap — your maximum contribution per settlement cycle.",
          "Offering window — how long the offering stays open for investors (e.g., 14 days).",
          "Commitment Bond — calculated automatically from your KreoScore and raise amount.",
        ]} />
        <Callout color="yellow">
          Your offering goes live on the public marketplace as soon as the Commitment Bond
          transaction is confirmed on-chain. Make sure all details are correct before publishing —
          offering terms cannot be edited once live.
        </Callout>

        <DocH3 id="creator-settlements">Managing Settlements</DocH3>
        <DocP>
          Once your offering is fully funded and capital is delivered, monthly settlement cycles
          begin. On each settlement date, you contribute your agreed revenue share via the
          Creator Dashboard.
        </DocP>
        <BulletList items={[
          "Navigate to Creator Dashboard → Settlements.",
          "Review the oracle-verified revenue figure for the period.",
          "Approve the USDC transfer from your connected wallet.",
          "The protocol automatically deducts the 3% fee and distributes the remainder.",
        ]} />
        <DocP>
          You can view your running total of settlements made, the amount remaining until
          offering completion, and your current KreoScore trend — all from the dashboard.
        </DocP>
      </section>

      <Divider />

      {/* ── FOR INVESTORS ─────────────────────────────────────────────────── */}
      <section id="for-investors">
        <div className="mb-8 pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-creo-teal/30 bg-creo-teal/8 text-creo-teal text-xs font-semibold tracking-widest uppercase mb-5">
            For Investors
          </div>
          <DocH2 id="investor-overview">Overview</DocH2>
        </div>
        <div className="mt-4" />
        <DocP>
          KREO gives investors access to a new asset class: real-world creator revenue streams
          tokenized on-chain. Instead of volatile tokens or opaque yield strategies, you invest
          in predictable USDC distributions backed by verifiable human economic activity.
        </DocP>

        <div className="grid sm:grid-cols-2 gap-4 my-6">
          {[
            { icon: TrendingUp, label: "122%+ minimum return", desc: "Every offering guarantees a minimum modelled return, already accounting for the 3% fee." },
            { icon: Coins, label: "Monthly USDC income", desc: "Distributions arrive automatically — no claiming, no gas on your end." },
            { icon: Lock, label: "Bond-backed protection", desc: "If a creator defaults, their Commitment Bond is distributed to you first." },
            { icon: Shield, label: "No additional investor fees", desc: "The 3% settlement fee is the only deduction and it's shared with the creator side." },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex gap-4 p-4 rounded-xl border border-border bg-muted/20">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-creo-teal/10 border border-creo-teal/20 flex items-center justify-center">
                <Icon className="h-4 w-4 text-creo-teal" />
              </div>
              <div>
                <p className="font-display font-semibold text-sm text-foreground mb-0.5">{label}</p>
                <p className="font-body text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <DocH3 id="investor-marketplace">Browsing the Marketplace</DocH3>
        <DocP>
          The KREO Marketplace lists all currently open offerings. Each listing shows:
        </DocP>
        <BulletList items={[
          "Creator name and verified revenue platform.",
          "Raise amount and total return commitment.",
          "KreoScore — the creator's on-chain reputation metric.",
          "Offering progress — how much of the target has already been committed.",
          "Time remaining until the offering closes.",
        ]} />
        <DocP>
          Click any offering to view the full creator profile, historical settlement performance
          (for returning creators), and revenue analytics. To invest, connect your wallet and
          approve the USDC transfer.
        </DocP>

        <DocH3 id="investor-returns">Returns & Distributions</DocH3>
        <DocP>
          Your USDC distributions begin after the offering closes and the first settlement cycle
          completes. Distributions are proportional to your stake in the offering.
        </DocP>

        <div className="rounded-xl border border-border bg-muted/30 p-6 font-mono text-sm space-y-2 my-6">
          <p className="text-xs text-muted-foreground uppercase tracking-widest pb-2 border-b border-border">
            Example — $1,000 invest in a $10,000 offering (10% stake)
          </p>
          {[
            { label: "Your stake", value: "10%", color: "text-foreground" },
            { label: "Minimum total return (122%)", value: "$1,220.00", color: "text-creo-teal" },
            { label: "Protocol fee share (3% of settlements)", value: "priced in", color: "text-muted-foreground" },
            { label: "Monthly distribution (example)", value: "~$97.00", color: "text-creo-teal bold" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex justify-between gap-4">
              <span className="text-muted-foreground">{label}</span>
              <span className={color}>{value}</span>
            </div>
          ))}
        </div>

        <DocH3 id="investor-protection">Risk Protection</DocH3>
        <DocP>
          KREO is designed so that investor protection is the default, not an afterthought.
          Several mechanisms work together to limit downside risk:
        </DocP>
        <BulletList items={[
          "Commitment Bond — distributed to investors on creator default.",
          "KYC verification — all creators are identity-verified before any offering goes live.",
          "Oracle verification — revenue data is verified on-chain before each settlement is accepted.",
          "KreoScore gating — first-time creators have smaller raise ceilings, limiting exposure.",
          "On-chain settlement — every distribution is a transparent, auditable transaction.",
        ]} />
        <Callout color="teal">
          KREO does not guarantee returns. Past settlements and KreoScore are indicators of
          creator reliability, not contractual guarantees. Always review the offering terms and
          creator analytics before committing capital.
        </Callout>
      </section>

      <Divider />

      {/* ── SMART CONTRACTS ──────────────────────────────────────────────── */}
      <section id="smart-contracts">
        <div className="mb-8 pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-creo-pink/30 bg-creo-pink/8 text-creo-pink text-xs font-semibold tracking-widest uppercase mb-5">
            Smart Contracts
          </div>
          <DocH2 id="architecture">Architecture</DocH2>
        </div>
        <div className="mt-4" />
        <DocP>
          The KREO protocol is implemented as a set of audited smart contracts deployed on EVM
          compatible networks. The architecture is intentionally minimal — each contract has
          a single, well-defined responsibility.
        </DocP>

        <div className="rounded-2xl border border-border bg-muted/20 divide-y divide-border my-6">
          {[
            { contract: "KreoOffering.sol", role: "Core", desc: "Manages offering lifecycle: creation, funding, settlement, completion, and default handling." },
            { contract: "KreoBond.sol", role: "Bond", desc: "Holds and releases Commitment Bond deposits. Handles bonus payouts and investor distributions on default." },
            { contract: "KreoScore.sol", role: "Reputation", desc: "On-chain KreoScore ledger. Updated automatically by the protocol after each offering event." },
            { contract: "KreoOracle.sol", role: "Oracle", desc: "Verifies creator revenue data submitted during each settlement cycle." },
            { contract: "KreoTreasury.sol", role: "Fees", desc: "Collects and manages the 3% protocol fee from each settlement." },
          ].map(({ contract, role, desc }) => (
            <div key={contract} className="p-5 flex gap-4">
              <div className="flex-shrink-0">
                <p className="font-mono text-sm text-creo-teal font-semibold">{contract}</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5 uppercase tracking-widest">{role}</p>
              </div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <DocH2 id="onchain-transparency">On-Chain Transparency</DocH2>
        <div className="mt-4 mb-4" />
        <DocP>
          Every action on KREO — offering creation, investor commitment, settlement, fee
          collection, and bond release — is an on-chain transaction. There is no off-chain
          database that can be manipulated after the fact.
        </DocP>
        <DocP>
          This means:
        </DocP>
        <BulletList items={[
          "Any investor can independently verify settlement history for any creator.",
          "Fee amounts are fixed in contract code — the platform cannot unilaterally change them.",
          "KreoScore cannot be gamed — it is updated deterministically by contract logic.",
          "Default events are triggered by contract conditions, not platform discretion.",
        ]} />
        <Callout color="pink">
          Smart contract audits are conducted by independent third-party security firms before
          each major protocol upgrade. Audit reports are published publicly and linked from the
          KREO GitHub repository.
        </Callout>

        {/* CTA */}
        <div className="mt-14 rounded-2xl border border-border bg-card/50 relative overflow-hidden">
          <div className="h-1 bg-gradient-teal-pink" />
          <div className="p-8 text-center">
            <h3 className="font-display font-bold text-foreground text-xl mb-3">
              Ready to get started?
            </h3>
            <p className="font-body text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              Join as a creator and raise capital, or explore live offerings as an investor.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-creo-teal/10 border border-creo-teal/30 text-creo-teal font-body text-sm font-semibold hover:bg-creo-teal/20 transition-colors"
              >
                Browse Marketplace <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/onboarding/creator"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-creo-pink text-primary-foreground font-body text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Start as a Creator <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="h-20" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const Documentation = () => {
  const [activeId, setActiveId] = useState("what-is-kreo");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Track active section on scroll
  useEffect(() => {
    const allIds = NAV_SECTIONS.flatMap((s) => s.items.map((i) => i.id));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleSelect = (id: string) => {
    scrollToId(id);
    setActiveId(id);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="w-12 h-12 rounded-full bg-creo-pink text-primary-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
          aria-label="Toggle navigation"
        >
          {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="lg:hidden fixed top-16 left-0 bottom-0 w-72 bg-background border-r border-border z-40 overflow-y-auto"
        >
          <Sidebar activeId={activeId} onSelect={handleSelect} />
        </motion.div>
      )}

      <div className="flex pt-16">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-border">
          <Sidebar activeId={activeId} onSelect={handleSelect} />
        </aside>

        {/* Main content */}
        <main ref={contentRef} className="flex-1 min-w-0">
          <DocContent />
        </main>
      </div>

      <FooterSection />
    </div>
  );
};

export default Documentation;
