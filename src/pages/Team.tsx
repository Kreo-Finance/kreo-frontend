import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Github, Twitter, Linkedin } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";

/** Farcaster logo icon (custom SVG — not in lucide-react) */
const Farcaster = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 1000 1000" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M257.778 155.556H742.222V844.445H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.445H257.778V155.556Z" />
    <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.445H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z" />
    <path d="M675.556 746.667C663.283 746.667 653.333 756.616 653.333 768.889V795.556H648.889C636.616 795.556 626.667 805.505 626.667 817.778V844.445H875.556V817.778C875.556 805.505 865.606 795.556 853.333 795.556H848.889V768.889C848.889 756.616 838.94 746.667 826.667 746.667V351.111H851.111L880 253.333H702.222V746.667H675.556Z" />
  </svg>
);

// ─── NFT Avatars ──────────────────────────────────────────────────────────────

/** Kundan — 0XNERD — pink-themed hacker PFP */
const NftAvatarKundan = () => (
  <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="k-bg" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stopColor="#2a0535" />
        <stop offset="100%" stopColor="#080010" />
      </radialGradient>
      <radialGradient id="k-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ec4899" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Background */}
    <rect width="400" height="400" fill="url(#k-bg)" />
    <rect width="400" height="400" fill="url(#k-glow)" />

    {/* Dot grid */}
    {[0,1,2,3,4,5,6,7,8].map(r => [0,1,2,3,4,5,6,7,8].map(c => (
      <circle key={`${r}-${c}`} cx={c*50+25} cy={r*50+25} r="1.2" fill="#ec4899" opacity="0.18" />
    )))}

    {/* Hoodie body */}
    <path d="M60 400 L60 310 Q80 270 140 260 L200 280 L260 260 Q320 270 340 310 L340 400 Z" fill="#1a0828" />
    {/* Hoodie center seam / zipper detail */}
    <path d="M185 275 L200 285 L215 275 L215 400 L185 400 Z" fill="#120620" />
    {/* Hood drawstring */}
    <circle cx="178" cy="278" r="5" fill="#ec4899" opacity="0.7" />
    <circle cx="222" cy="278" r="5" fill="#ec4899" opacity="0.7" />

    {/* Neck */}
    <rect x="175" y="295" width="50" height="40" rx="8" fill="#c8905a" />

    {/* Head */}
    <rect x="105" y="120" width="190" height="190" rx="55" fill="#d4a06a" />

    {/* Hair — messy top */}
    <ellipse cx="200" cy="125" rx="95" ry="55" fill="#0f010f" />
    <rect x="105" y="140" width="190" height="40" fill="#0f010f" />
    {/* Side hair tufts */}
    <ellipse cx="115" cy="180" rx="18" ry="28" fill="#0f010f" />
    <ellipse cx="285" cy="180" rx="18" ry="28" fill="#0f010f" />
    {/* Hair spikes */}
    <path d="M145 120 Q155 90 165 120" fill="#0f010f" />
    <path d="M175 115 Q185 80 195 115" fill="#0f010f" />
    <path d="M205 115 Q215 80 225 115" fill="#0f010f" />
    <path d="M230 120 Q242 92 252 120" fill="#0f010f" />

    {/* Ears */}
    <ellipse cx="106" cy="220" rx="14" ry="20" fill="#c08050" />
    <ellipse cx="294" cy="220" rx="14" ry="20" fill="#c08050" />

    {/* Whites of eyes */}
    <rect x="130" y="198" width="60" height="42" rx="14" fill="white" />
    <rect x="210" y="198" width="60" height="42" rx="14" fill="white" />

    {/* Irises */}
    <circle cx="160" cy="219" r="16" fill="#2d0855" />
    <circle cx="240" cy="219" r="16" fill="#2d0855" />
    <circle cx="160" cy="219" r="9" fill="#0d0020" />
    <circle cx="240" cy="219" r="9" fill="#0d0020" />
    {/* Eye shine */}
    <circle cx="166" cy="213" r="4" fill="white" opacity="0.9" />
    <circle cx="246" cy="213" r="4" fill="white" opacity="0.9" />

    {/* Pixel glasses */}
    <rect x="126" y="194" width="68" height="50" rx="12" fill="none" stroke="#ec4899" strokeWidth="5" />
    <rect x="206" y="194" width="68" height="50" rx="12" fill="none" stroke="#ec4899" strokeWidth="5" />
    {/* lens tint */}
    <rect x="130" y="198" width="60" height="42" rx="9" fill="#ec4899" opacity="0.08" />
    <rect x="210" y="198" width="60" height="42" rx="9" fill="#ec4899" opacity="0.08" />
    {/* bridge */}
    <line x1="194" y1="219" x2="206" y2="219" stroke="#ec4899" strokeWidth="4" strokeLinecap="round" />
    {/* temples */}
    <line x1="126" y1="219" x2="106" y2="215" stroke="#ec4899" strokeWidth="4" strokeLinecap="round" />
    <line x1="274" y1="219" x2="294" y2="215" stroke="#ec4899" strokeWidth="4" strokeLinecap="round" />

    {/* Nose */}
    <path d="M194 255 Q200 268 206 255" stroke="#b07840" strokeWidth="3" strokeLinecap="round" fill="none" />

    {/* Smirk */}
    <path d="M172 288 Q192 305 220 290" stroke="#8a5030" strokeWidth="4" strokeLinecap="round" fill="none" />

    {/* Kreo diamond badge — bottom right */}
    <path d="M355 345 L378 365 L355 385 L332 365 Z" fill="#ec4899" opacity="0.9" />
    <path d="M355 352 L370 365 L355 378 L340 365 Z" fill="rgba(255,255,255,0.18)" />
    <g stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <line x1="351" y1="357" x2="351" y2="373" />
      <line x1="351" y1="365" x2="358" y2="357" />
      <line x1="353" y1="362" x2="358" y2="373" />
    </g>

    {/* Corner glow accents */}
    <circle cx="360" cy="40" r="50" fill="#ec4899" opacity="0.1" />
    <circle cx="40" cy="360" r="40" fill="#7c3aed" opacity="0.1" />
  </svg>
);

/** Tushar — teal-themed engineer PFP with headphones */
const NftAvatarTushar = () => (
  <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="t-bg" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stopColor="#01201e" />
        <stop offset="100%" stopColor="#010810" />
      </radialGradient>
      <radialGradient id="t-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Background */}
    <rect width="400" height="400" fill="url(#t-bg)" />
    <rect width="400" height="400" fill="url(#t-glow)" />

    {/* Hex grid pattern */}
    {[0,1,2,3].map(r => [0,1,2,3,4].map(c => (
      <path
        key={`${r}-${c}`}
        d={`M${c*90 + (r%2)*45 + 20} ${r*80 + 20} l18 10 l0 20 l-18 10 l-18 -10 l0 -20 Z`}
        fill="none" stroke="#14b8a6" strokeWidth="0.7" opacity="0.15"
      />
    )))}

    {/* Body — tech jacket */}
    <path d="M55 400 L55 305 Q80 265 145 255 L200 278 L255 255 Q320 265 345 305 L345 400 Z" fill="#051a20" />
    {/* Jacket collar / lapels */}
    <path d="M200 278 L175 265 L165 255 L185 400 Z" fill="#072830" />
    <path d="M200 278 L225 265 L235 255 L215 400 Z" fill="#072830" />
    {/* Jacket accent stripe */}
    <path d="M145 255 Q160 260 165 290 L155 400 L145 400 Z" fill="#14b8a6" opacity="0.25" />
    <path d="M255 255 Q240 260 235 290 L245 400 L255 400 Z" fill="#14b8a6" opacity="0.25" />

    {/* Neck */}
    <rect x="176" y="292" width="48" height="38" rx="8" fill="#b87c4a" />

    {/* Head */}
    <rect x="108" y="118" width="184" height="188" rx="52" fill="#c8904e" />

    {/* Hair — neat short */}
    <ellipse cx="200" cy="122" rx="92" ry="50" fill="#120810" />
    <rect x="108" y="138" width="184" height="35" fill="#120810" />
    {/* Side hair */}
    <rect x="108" y="145" width="22" height="60" rx="11" fill="#120810" />
    <rect x="270" y="145" width="22" height="60" rx="11" fill="#120810" />
    {/* Fade lines */}
    <path d="M108 175 Q120 168 130 175" stroke="#1e1010" strokeWidth="2" fill="none" opacity="0.6" />
    <path d="M270 175 Q282 168 292 175" stroke="#1e1010" strokeWidth="2" fill="none" opacity="0.6" />

    {/* Headphones arc */}
    <path d="M100 200 Q100 100 200 100 Q300 100 300 200" stroke="#14b8a6" strokeWidth="10" strokeLinecap="round" fill="none" />
    {/* Headphone cups */}
    <rect x="82" y="195" width="36" height="55" rx="16" fill="#0d3030" stroke="#14b8a6" strokeWidth="3" />
    <rect x="282" y="195" width="36" height="55" rx="16" fill="#0d3030" stroke="#14b8a6" strokeWidth="3" />
    {/* Cup speaker mesh */}
    <circle cx="100" cy="222" r="12" fill="#14b8a6" opacity="0.2" />
    <circle cx="300" cy="222" r="12" fill="#14b8a6" opacity="0.2" />
    <circle cx="100" cy="222" r="6" fill="#14b8a6" opacity="0.4" />
    <circle cx="300" cy="222" r="6" fill="#14b8a6" opacity="0.4" />

    {/* Ears (partially hidden under cups) */}
    <ellipse cx="109" cy="222" rx="12" ry="18" fill="#b07040" />
    <ellipse cx="291" cy="222" rx="12" ry="18" fill="#b07040" />

    {/* Eyes */}
    <ellipse cx="163" cy="218" rx="25" ry="23" fill="white" />
    <ellipse cx="237" cy="218" rx="25" ry="23" fill="white" />
    <circle cx="163" cy="220" r="16" fill="#0a3040" />
    <circle cx="237" cy="220" r="16" fill="#0a3040" />
    <circle cx="163" cy="220" r="9" fill="#010d14" />
    <circle cx="237" cy="220" r="9" fill="#010d14" />
    {/* Teal iris ring */}
    <circle cx="163" cy="220" r="13" fill="none" stroke="#14b8a6" strokeWidth="2" opacity="0.5" />
    <circle cx="237" cy="220" r="13" fill="none" stroke="#14b8a6" strokeWidth="2" opacity="0.5" />
    {/* Eye shine */}
    <circle cx="170" cy="213" r="4.5" fill="white" opacity="0.85" />
    <circle cx="244" cy="213" r="4.5" fill="white" opacity="0.85" />

    {/* Eyebrows */}
    <path d="M142 196 Q163 188 184 196" stroke="#120810" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M216 196 Q237 188 258 196" stroke="#120810" strokeWidth="5" strokeLinecap="round" fill="none" />

    {/* Nose */}
    <path d="M194 252 Q200 266 206 252" stroke="#a06830" strokeWidth="3" strokeLinecap="round" fill="none" />

    {/* Confident smile */}
    <path d="M170 285 Q200 308 230 285" stroke="#7a4820" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    <path d="M170 285 Q200 308 230 285" stroke="#7a4820" strokeWidth="4.5" strokeLinecap="round" fill="none" />

    {/* Kreo diamond badge — bottom right */}
    <path d="M355 345 L378 365 L355 385 L332 365 Z" fill="#14b8a6" opacity="0.9" />
    <path d="M355 352 L370 365 L355 378 L340 365 Z" fill="rgba(255,255,255,0.18)" />
    <g stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <line x1="351" y1="357" x2="351" y2="373" />
      <line x1="351" y1="365" x2="358" y2="357" />
      <line x1="353" y1="362" x2="358" y2="373" />
    </g>

    {/* Corner glow accents */}
    <circle cx="360" cy="40" r="55" fill="#14b8a6" opacity="0.1" />
    <circle cx="40" cy="360" r="40" fill="#0d9488" opacity="0.1" />
  </svg>
);

// ─── Team data ────────────────────────────────────────────────────────────────
const team = [
  {
    name: "Kundan Kumar",
    handle: "0XNERD",
    role: "Founder & CEO",
    roleColor: "text-creo-pink",
    roleBg: "bg-creo-pink/10 border-creo-pink/20",
    Avatar: NftAvatarKundan,
    initials: "KK",
    initialsColor: "text-creo-pink",
    initialsBg: "bg-creo-pink/10 border-creo-pink/20",
    accentColor: "creo-pink",
    bio: "4x ETHGlobal winner and Lead Blockchain Engineer with 5+ years building across EVM, Solana, Starknet, and Move ecosystems. Founded Kreo Finance after watching a creator friend with $4,200/month in verified AdSense income get rejected by his bank — and realising the capital infrastructure for creators was fundamentally broken. Previously built protocols across yield optimization, hedging, staking, and creator finance verticals. Hackathon wins include SaucerHedge (ETHOnline), BitYield (Starknet Re{solve} champion), and ReVaultron (Hedera).",
    focus: "Protocol architecture, smart contracts, investor relations, and go-to-market.",
    links: {
      twitter: "https://twitter.com/CodeBlocker52",
      github: "https://github.com/CodeBlocker52",
      linkedin: "https://linkedin.com/in/kundan-kumar",
      farcaster:"https://farcaster.xyz/0xnerd"
    },
    highlights: [
      "4x ETHGlobal winner",
      "Starknet Re{solve} champion",
      "Defi Protocol Engineer across EVM, Solana, Starknet, and Move ecosystems",
    ],
  },
  {
    name: "Tushar",
    handle: "Tushar",
    role: "Co-Founder & CTO",
    roleColor: "text-creo-teal",
    roleBg: "bg-creo-teal/10 border-creo-teal/20",
    Avatar: NftAvatarTushar,
    initials: "T",
    initialsColor: "text-creo-teal",
    initialsBg: "bg-creo-teal/10 border-creo-teal/20",
    accentColor: "creo-teal",
    bio: "Protocol engineer specialising in oracle infrastructure, settlement systems, and DeFi protocol design. At Kreo Finance, Tushar owns the settlement service architecture, Chainlink Functions integration, and the monthly oracle pipeline that drives trustless creator revenue verification on-chain. Deep background in building financial infrastructure that operates without centralized intermediaries — the engineering conviction at the heart of Kreo's design.",
    focus: "Settlement service, Chainlink oracle pipeline, backend infrastructure, and protocol security.",
    links: {
      twitter: "https://twitter.com/tushar",
      github: "https://github.com/tushar",
      linkedin: "https://linkedin.com/in/tushar",
      farcaster: "https://farcaster.xyz/0xtushar",
    },
    highlights: [
      "Settlement & oracle architecture",
      "Chainlink Functions integration",
      "DeFi protocol engineering",
    ],
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

// ─── Social link button ───────────────────────────────────────────────────────
function SocialLink({
  href,
  icon: Icon,
  label,
  accent,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  accent: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors
        border-border hover:border-${accent}/40 hover:bg-${accent}/10 text-muted-foreground hover:text-${accent}`}
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

const Team = () => {
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
              The Team
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>
            <h1
              className="font-display font-bold leading-[0.95] tracking-tight mb-6"
              style={{ fontSize: "clamp(3.5rem, 11vw, 8rem)" }}
            >
              Built by{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "var(--gradient-teal-pink)" }}
              >
                builders.
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Kreo Finance is founded by blockchain engineers who have shipped
              real DeFi protocols — not consultants who discovered crypto last
              year. Every architectural decision reflects years of hands-on
              protocol building.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── 2. TEAM PROFILES ──────────────────────────────────────────────── */}
      <section className="border-t border-border">
        {team.map((member, idx) => (
          <FadeIn key={member.name} delay={idx * 0.06}>
            <div
              className={`border-b border-border ${
                idx % 2 === 0 ? "" : "bg-card/30"
              }`}
            >
              <div className="container mx-auto px-4 py-16 md:py-20 max-w-5xl">
                <div className="grid md:grid-cols-[280px_1fr] gap-10 md:gap-16 items-start">

                  {/* Left — avatar + name + socials */}
                  <div className="flex flex-col items-start gap-5">

                    {/* Avatar */}
                    <div
                      className={`w-32 h-32 md:w-44 md:h-44 rounded-2xl border ${member.initialsBg} overflow-hidden`}
                    >
                      <member.Avatar />
                    </div>

                    {/* Name + handle */}
                    <div>
                      <h2
                        className="font-display font-bold leading-tight"
                        style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)" }}
                      >
                        {member.name}
                      </h2>
                      <p className="font-body text-sm text-muted-foreground mt-0.5">
                        @{member.handle}
                      </p>
                    </div>

                    {/* Role badge */}
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold tracking-widest uppercase ${member.roleBg} ${member.roleColor}`}
                    >
                      {member.role}
                    </div>

                    {/* Social links */}
                    <div className="flex gap-2">
                      <SocialLink
                        href={member.links.twitter}
                        icon={Twitter}
                        label="Twitter"
                        accent={member.accentColor}
                      />
                      <SocialLink
                        href={member.links.github}
                        icon={Github}
                        label="GitHub"
                        accent={member.accentColor}
                      />
                      <SocialLink
                        href={member.links.linkedin}
                        icon={Linkedin}
                        label="LinkedIn"
                        accent={member.accentColor}
                      />
                      <SocialLink
                        href={member.links.farcaster}
                        icon={Farcaster}
                        label="Farcaster"
                        accent={member.accentColor}
                      />
                    </div>
                  </div>

                  {/* Right — bio + highlights */}
                  <div className="flex flex-col gap-6">

                    {/* Bio */}
                    <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>

                    {/* Focus area */}
                    <div className={`rounded-xl border ${member.roleBg} px-5 py-4`}>
                      <p
                        className={`font-body text-xs font-semibold tracking-widest uppercase ${member.roleColor} mb-1`}
                      >
                        At Kreo Finance
                      </p>
                      <p className="font-body text-sm text-muted-foreground">
                        {member.focus}
                      </p>
                    </div>

                    {/* Highlight chips */}
                    <div className="flex flex-wrap gap-2">
                      {member.highlights.map((h) => (
                        <span
                          key={h}
                          className="font-body text-xs px-3 py-1.5 rounded-lg border border-border bg-muted/40 text-muted-foreground"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </section>

      {/* ── 3. CTA — mirrors Pricing page CTA exactly ─────────────────────── */}
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
                Your Capital.
              </span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.08}>
            <p className="font-body text-muted-foreground text-lg mb-10">
              Built by engineers who believe the financial system was not
              designed for creators — and who decided to fix it.
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
                  Start as a Creator{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
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

export default Team;