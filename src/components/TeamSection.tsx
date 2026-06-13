import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Twitter, Github, Linkedin, ArrowRight } from "lucide-react";

const Farcaster = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 1000 1000" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M257.778 155.556H742.222V844.445H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.445H257.778V155.556Z" />
    <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.445H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z" />
    <path d="M675.556 746.667C663.283 746.667 653.333 756.616 653.333 768.889V795.556H648.889C636.616 795.556 626.667 805.505 626.667 817.778V844.445H875.556V817.778C875.556 805.505 865.606 795.556 853.333 795.556H848.889V768.889C848.889 756.616 838.94 746.667 826.667 746.667V351.111H851.111L880 253.333H702.222V746.667H675.556Z" />
  </svg>
);

// ── Kreo persona avatars — revealed on hover (like og-studio's real-photo reveal) ─

const AvatarKundan = () => (
  <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="ks-bg" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stopColor="#2a0535" />
        <stop offset="100%" stopColor="#080010" />
      </radialGradient>
      <radialGradient id="ks-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ec4899" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="400" height="400" fill="url(#ks-bg)" />
    <rect width="400" height="400" fill="url(#ks-glow)" />
    {[0,1,2,3,4,5,6,7,8].map(r => [0,1,2,3,4,5,6,7,8].map(c => (
      <circle key={`${r}-${c}`} cx={c*50+25} cy={r*50+25} r="1.2" fill="#ec4899" opacity="0.18" />
    )))}
    <path d="M60 400 L60 310 Q80 270 140 260 L200 280 L260 260 Q320 270 340 310 L340 400 Z" fill="#1a0828" />
    <path d="M185 275 L200 285 L215 275 L215 400 L185 400 Z" fill="#120620" />
    <circle cx="178" cy="278" r="5" fill="#ec4899" opacity="0.7" />
    <circle cx="222" cy="278" r="5" fill="#ec4899" opacity="0.7" />
    <rect x="175" y="295" width="50" height="40" rx="8" fill="#c8905a" />
    <rect x="105" y="120" width="190" height="190" rx="55" fill="#d4a06a" />
    <ellipse cx="200" cy="125" rx="95" ry="55" fill="#0f010f" />
    <rect x="105" y="140" width="190" height="40" fill="#0f010f" />
    <ellipse cx="115" cy="180" rx="18" ry="28" fill="#0f010f" />
    <ellipse cx="285" cy="180" rx="18" ry="28" fill="#0f010f" />
    <path d="M145 120 Q155 90 165 120" fill="#0f010f" />
    <path d="M175 115 Q185 80 195 115" fill="#0f010f" />
    <path d="M205 115 Q215 80 225 115" fill="#0f010f" />
    <path d="M230 120 Q242 92 252 120" fill="#0f010f" />
    <ellipse cx="106" cy="220" rx="14" ry="20" fill="#c08050" />
    <ellipse cx="294" cy="220" rx="14" ry="20" fill="#c08050" />
    <rect x="130" y="198" width="60" height="42" rx="14" fill="white" />
    <rect x="210" y="198" width="60" height="42" rx="14" fill="white" />
    <circle cx="160" cy="219" r="16" fill="#2d0855" />
    <circle cx="240" cy="219" r="16" fill="#2d0855" />
    <circle cx="160" cy="219" r="9" fill="#0d0020" />
    <circle cx="240" cy="219" r="9" fill="#0d0020" />
    <circle cx="166" cy="213" r="4" fill="white" opacity="0.9" />
    <circle cx="246" cy="213" r="4" fill="white" opacity="0.9" />
    <rect x="126" y="194" width="68" height="50" rx="12" fill="none" stroke="#ec4899" strokeWidth="5" />
    <rect x="206" y="194" width="68" height="50" rx="12" fill="none" stroke="#ec4899" strokeWidth="5" />
    <rect x="130" y="198" width="60" height="42" rx="9" fill="#ec4899" opacity="0.08" />
    <rect x="210" y="198" width="60" height="42" rx="9" fill="#ec4899" opacity="0.08" />
    <line x1="194" y1="219" x2="206" y2="219" stroke="#ec4899" strokeWidth="4" strokeLinecap="round" />
    <line x1="126" y1="219" x2="106" y2="215" stroke="#ec4899" strokeWidth="4" strokeLinecap="round" />
    <line x1="274" y1="219" x2="294" y2="215" stroke="#ec4899" strokeWidth="4" strokeLinecap="round" />
    <path d="M194 255 Q200 268 206 255" stroke="#b07840" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M172 288 Q192 305 220 290" stroke="#8a5030" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M355 345 L378 365 L355 385 L332 365 Z" fill="#ec4899" opacity="0.9" />
    <path d="M355 352 L370 365 L355 378 L340 365 Z" fill="rgba(255,255,255,0.18)" />
    <g stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <line x1="351" y1="357" x2="351" y2="373" />
      <line x1="351" y1="365" x2="358" y2="357" />
      <line x1="353" y1="362" x2="358" y2="373" />
    </g>
    <circle cx="360" cy="40" r="50" fill="#ec4899" opacity="0.1" />
    <circle cx="40" cy="360" r="40" fill="#7c3aed" opacity="0.1" />
  </svg>
);

const AvatarTushar = () => (
  <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="ts-bg" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stopColor="#01201e" />
        <stop offset="100%" stopColor="#010810" />
      </radialGradient>
      <radialGradient id="ts-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="400" height="400" fill="url(#ts-bg)" />
    <rect width="400" height="400" fill="url(#ts-glow)" />
    {[0,1,2,3].map(r => [0,1,2,3,4].map(c => (
      <path key={`${r}-${c}`} d={`M${c*90+(r%2)*45+20} ${r*80+20} l18 10 l0 20 l-18 10 l-18 -10 l0 -20 Z`} fill="none" stroke="#14b8a6" strokeWidth="0.7" opacity="0.15" />
    )))}
    <path d="M55 400 L55 305 Q80 265 145 255 L200 278 L255 255 Q320 265 345 305 L345 400 Z" fill="#051a20" />
    <path d="M200 278 L175 265 L165 255 L185 400 Z" fill="#072830" />
    <path d="M200 278 L225 265 L235 255 L215 400 Z" fill="#072830" />
    <path d="M145 255 Q160 260 165 290 L155 400 L145 400 Z" fill="#14b8a6" opacity="0.25" />
    <path d="M255 255 Q240 260 235 290 L245 400 L255 400 Z" fill="#14b8a6" opacity="0.25" />
    <rect x="176" y="292" width="48" height="38" rx="8" fill="#b87c4a" />
    <rect x="108" y="118" width="184" height="188" rx="52" fill="#c8904e" />
    <ellipse cx="200" cy="122" rx="92" ry="50" fill="#120810" />
    <rect x="108" y="138" width="184" height="35" fill="#120810" />
    <rect x="108" y="145" width="22" height="60" rx="11" fill="#120810" />
    <rect x="270" y="145" width="22" height="60" rx="11" fill="#120810" />
    <path d="M100 200 Q100 100 200 100 Q300 100 300 200" stroke="#14b8a6" strokeWidth="10" strokeLinecap="round" fill="none" />
    <rect x="82" y="195" width="36" height="55" rx="16" fill="#0d3030" stroke="#14b8a6" strokeWidth="3" />
    <rect x="282" y="195" width="36" height="55" rx="16" fill="#0d3030" stroke="#14b8a6" strokeWidth="3" />
    <circle cx="100" cy="222" r="12" fill="#14b8a6" opacity="0.2" />
    <circle cx="300" cy="222" r="12" fill="#14b8a6" opacity="0.2" />
    <circle cx="100" cy="222" r="6" fill="#14b8a6" opacity="0.4" />
    <circle cx="300" cy="222" r="6" fill="#14b8a6" opacity="0.4" />
    <ellipse cx="109" cy="222" rx="12" ry="18" fill="#b07040" />
    <ellipse cx="291" cy="222" rx="12" ry="18" fill="#b07040" />
    <ellipse cx="163" cy="218" rx="25" ry="23" fill="white" />
    <ellipse cx="237" cy="218" rx="25" ry="23" fill="white" />
    <circle cx="163" cy="220" r="16" fill="#0a3040" />
    <circle cx="237" cy="220" r="16" fill="#0a3040" />
    <circle cx="163" cy="220" r="9" fill="#010d14" />
    <circle cx="237" cy="220" r="9" fill="#010d14" />
    <circle cx="163" cy="220" r="13" fill="none" stroke="#14b8a6" strokeWidth="2" opacity="0.5" />
    <circle cx="237" cy="220" r="13" fill="none" stroke="#14b8a6" strokeWidth="2" opacity="0.5" />
    <circle cx="170" cy="213" r="4.5" fill="white" opacity="0.85" />
    <circle cx="244" cy="213" r="4.5" fill="white" opacity="0.85" />
    <path d="M142 196 Q163 188 184 196" stroke="#120810" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M216 196 Q237 188 258 196" stroke="#120810" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M194 252 Q200 266 206 252" stroke="#a06830" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M170 285 Q200 308 230 285" stroke="#7a4820" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    <path d="M355 345 L378 365 L355 385 L332 365 Z" fill="#14b8a6" opacity="0.9" />
    <path d="M355 352 L370 365 L355 378 L340 365 Z" fill="rgba(255,255,255,0.18)" />
    <g stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <line x1="351" y1="357" x2="351" y2="373" />
      <line x1="351" y1="365" x2="358" y2="357" />
      <line x1="353" y1="362" x2="358" y2="373" />
    </g>
    <circle cx="360" cy="40" r="55" fill="#14b8a6" opacity="0.1" />
    <circle cx="40" cy="360" r="40" fill="#0d9488" opacity="0.1" />
  </svg>
);

const AvatarAyushi = () => (
  <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="ay-bg" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stopColor="#1a1000" />
        <stop offset="100%" stopColor="#060400" />
      </radialGradient>
      <radialGradient id="ay-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#eab308" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="400" height="400" fill="url(#ay-bg)" />
    <rect width="400" height="400" fill="url(#ay-glow)" />
    {[0,1,2,3,4].map(r => [0,1,2,3,4].map(c => (
      <path key={`${r}-${c}`} d={`M${c*80+40} ${r*80+20} L${c*80+54} ${r*80+40} L${c*80+40} ${r*80+60} L${c*80+26} ${r*80+40} Z`} fill="none" stroke="#eab308" strokeWidth="0.6" opacity="0.12" />
    )))}
    <path d="M55 400 L55 300 Q80 258 148 248 L200 272 L252 248 Q320 258 345 300 L345 400 Z" fill="#1a1200" />
    <path d="M200 272 L170 258 L158 248 L182 400 Z" fill="#261800" />
    <path d="M200 272 L230 258 L242 248 L218 400 Z" fill="#261800" />
    <circle cx="183" cy="270" r="4" fill="#eab308" opacity="0.85" />
    <circle cx="217" cy="270" r="4" fill="#eab308" opacity="0.85" />
    <rect x="176" y="290" width="48" height="40" rx="8" fill="#c89050" />
    <rect x="106" y="115" width="188" height="192" rx="55" fill="#d4a060" />
    <rect x="86" y="138" width="228" height="270" rx="30" fill="#1a0800" />
    <ellipse cx="200" cy="120" rx="96" ry="52" fill="#1a0800" />
    <rect x="106" y="133" width="188" height="40" fill="#1a0800" />
    <rect x="86" y="143" width="28" height="210" rx="14" fill="#1a0800" />
    <rect x="286" y="143" width="28" height="210" rx="14" fill="#1a0800" />
    <path d="M200 120 Q182 138 172 162" stroke="#2a1000" strokeWidth="3" fill="none" opacity="0.7" />
    <ellipse cx="107" cy="218" rx="13" ry="19" fill="#c08048" />
    <ellipse cx="293" cy="218" rx="13" ry="19" fill="#c08048" />
    <circle cx="107" cy="226" r="5" fill="#eab308" opacity="0.9" />
    <ellipse cx="107" cy="236" rx="3" ry="5" fill="#eab308" opacity="0.8" />
    <circle cx="293" cy="226" r="5" fill="#eab308" opacity="0.9" />
    <ellipse cx="293" cy="236" rx="3" ry="5" fill="#eab308" opacity="0.8" />
    <ellipse cx="163" cy="214" rx="26" ry="24" fill="white" />
    <ellipse cx="237" cy="214" rx="26" ry="24" fill="white" />
    <circle cx="163" cy="216" r="17" fill="#3d1f00" />
    <circle cx="237" cy="216" r="17" fill="#3d1f00" />
    <circle cx="163" cy="216" r="10" fill="#0f0600" />
    <circle cx="237" cy="216" r="10" fill="#0f0600" />
    <circle cx="163" cy="216" r="14" fill="none" stroke="#eab308" strokeWidth="2" opacity="0.55" />
    <circle cx="237" cy="216" r="14" fill="none" stroke="#eab308" strokeWidth="2" opacity="0.55" />
    <circle cx="170" cy="209" r="4.5" fill="white" opacity="0.85" />
    <circle cx="244" cy="209" r="4.5" fill="white" opacity="0.85" />
    <path d="M140 192 Q163 183 186 193" stroke="#1a0800" strokeWidth="5.5" strokeLinecap="round" fill="none" />
    <path d="M214 193 Q237 183 260 192" stroke="#1a0800" strokeWidth="5.5" strokeLinecap="round" fill="none" />
    <path d="M193 250 Q200 264 207 250" stroke="#a06030" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M168 280 Q200 305 232 280" stroke="#9a4820" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M355 345 L378 365 L355 385 L332 365 Z" fill="#eab308" opacity="0.9" />
    <path d="M355 352 L370 365 L355 378 L340 365 Z" fill="rgba(255,255,255,0.18)" />
    <g stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <line x1="351" y1="357" x2="351" y2="373" />
      <line x1="351" y1="365" x2="358" y2="357" />
      <line x1="353" y1="362" x2="358" y2="373" />
    </g>
    <circle cx="360" cy="40" r="55" fill="#eab308" opacity="0.1" />
    <circle cx="40" cy="360" r="40" fill="#d97706" opacity="0.1" />
  </svg>
);

// ── Team data ─────────────────────────────────────────────────────────────────
// nftUrl: public NFT shown on the card face (Nouns DAO — CC0 license)
// Replace with any Doodles / Azuki / preferred collection URL

type Socials = {
  twitter?: string;
  github?: string;
  linkedin?: string;
  farcaster?: string;
};

const team: Array<{
  id: string;
  handle: string;
  name: string;
  role: string;
  accent: string;
  bio: string;
  nftUrl: string;
  Avatar: React.ComponentType;
  socials: Socials;
}> = [
  {
    id: "kundan",
    handle: "0XNERD",
    name: "Kundan Kumar",
    role: "Founder & CEO",
    accent: "creo-pink",
    bio: "4x ETHGlobal winner. Founded Kreo Finance after seeing creators with verified income get rejected by banks.",
    nftUrl: "https://noun.pics/1.png",
    Avatar: AvatarKundan,
    socials: {
      twitter: "https://twitter.com/CodeBlocker52",
      github: "https://github.com/CodeBlocker52",
      linkedin: "https://linkedin.com/in/kundan-kumar",
      farcaster: "https://farcaster.xyz/0xnerd",
    },
  },
  {
    id: "tushar",
    handle: "TUSHAR",
    name: "Tushar",
    role: "Co-Founder & CTO",
    accent: "creo-teal",
    bio: "Protocol engineer specialising in oracle infrastructure, settlement systems, and Chainlink integration.",
    nftUrl: "https://noun.pics/42.png",
    Avatar: AvatarTushar,
    socials: {
      twitter: "https://twitter.com/tushar",
      github: "https://github.com/tushar",
      linkedin: "https://linkedin.com/in/tushar",
      farcaster: "https://farcaster.xyz/0xtushar",
    },
  },
  {
    id: "ayushi",
    handle: "AYUSHI",
    name: "Ayushi Mehta",
    role: "CMO",
    accent: "creo-yellow",
    bio: "Growth strategist driving creator adoption, brand positioning, and go-to-market for Kreo Finance.",
    nftUrl: "https://noun.pics/200.png",
    Avatar: AvatarAyushi,
    socials: {
      twitter: "https://twitter.com/ayushimehta",
      linkedin: "https://linkedin.com/in/ayushi-mehta",
    },
  },
];

// ── FadeIn ────────────────────────────────────────────────────────────────────

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

// ── TeamCard ──────────────────────────────────────────────────────────────────

function TeamCard({ member, index }: { member: typeof team[0]; index: number }) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const color = `hsl(var(--${member.accent}))`;
  const alpha = (o: number) => `hsl(var(--${member.accent}) / ${o})`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 56 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.14, ease: [0.22, 1, 0.36, 1] }}
      className="group relative w-full rounded-2xl overflow-hidden cursor-pointer transition-transform duration-500 hover:-translate-y-3"
      style={{
        height: "380px",
        border: `1px solid hsl(var(--border))`,
        borderTop: `3px solid ${color}`,
        boxShadow: `0 0 0 0 ${alpha(0)}`,
      }}
      onClick={() => navigate(`/team#${member.id}`)}
      whileHover={{ boxShadow: `0 32px 64px -16px ${alpha(0.25)}` }}
    >
      {/* ── Default: public NFT image ───────────────────────────────── */}
      <div
        className="absolute inset-0 transition-all duration-500 group-hover:opacity-0 group-hover:scale-110"
        style={{ background: alpha(0.04) }}
      >
        {/* NFT image — full bleed */}
        <img
          src={member.nftUrl}
          alt={member.handle}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center top", imageRendering: "pixelated" }}
          loading="lazy"
        />
        {/* Top handle ribbon */}
        <div
          className="absolute top-0 left-0 right-0 px-5 pt-4 pb-10 bg-gradient-to-b from-black/75 to-transparent"
        >
          <span
            className="font-mono text-[11px] font-black tracking-[0.35em] uppercase"
            style={{ color }}
          >
            {member.handle}
          </span>
        </div>
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Subtle accent glow at top */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% -10%, ${alpha(0.22)}, transparent 60%)`,
          }}
        />
      </div>

      {/* ── Hover: Kreo persona avatar + member info (og-studio reveal) ─ */}
      <div
        className="absolute inset-0 flex flex-col p-5 translate-y-full group-hover:translate-y-0"
        style={{
          background: "hsl(var(--card))",
          transitionProperty: "transform",
          transitionDuration: "520ms",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Custom Kreo persona avatar */}
        <div
          className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 mb-4"
          style={{ border: `2px solid ${alpha(0.3)}`, boxShadow: `0 8px 24px ${alpha(0.2)}` }}
        >
          <member.Avatar />
        </div>

        {/* Name + handle */}
        <h3
          className="font-display font-bold text-foreground leading-tight"
          style={{ fontSize: "1.25rem" }}
        >
          {member.name}
        </h3>
        <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground/60 mt-0.5 mb-3">
          @{member.handle}
        </p>

        {/* Role badge */}
        <span
          className="font-body text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full w-fit mb-4"
          style={{
            background: alpha(0.1),
            color,
            border: `1px solid ${alpha(0.3)}`,
          }}
        >
          {member.role}
        </span>

        {/* Bio */}
        <p className="font-body text-xs text-muted-foreground leading-relaxed flex-1">
          {member.bio}
        </p>

        {/* Social links + CTA */}
        <div
          className="flex items-center justify-between pt-3 mt-3"
          style={{ borderTop: "1px solid hsl(var(--border))" }}
        >
          <div className="flex gap-1.5">
            {member.socials.twitter && (
              <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-3 w-3" />
              </a>
            )}
            {member.socials.github && (
              <a href={member.socials.github} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-3 w-3" />
              </a>
            )}
            {member.socials.linkedin && (
              <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-3 w-3" />
              </a>
            )}
            {member.socials.farcaster && (
              <a href={member.socials.farcaster} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <Farcaster className="h-3 w-3" />
              </a>
            )}
          </div>
          <span
            className="font-body text-[11px] font-semibold flex items-center gap-1"
            style={{ color }}
          >
            View Profile <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>

    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function TeamSection() {
  return (
    <section id="team" className="border-t border-border relative overflow-hidden bg-background">
      {/* Fine grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground) / 0.02) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.02) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      {/* Top gradient wash */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, hsl(var(--creo-teal) / 0.5), hsl(var(--creo-pink) / 0.5), transparent)" }}
      />

      {/* Header */}
      <FadeIn className="relative container mx-auto px-4 pt-20 md:pt-28 pb-14 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[hsl(var(--creo-teal))/30] bg-[hsl(var(--creo-teal))/8] text-[hsl(var(--creo-teal))] text-xs font-semibold tracking-widest uppercase mb-6">
          The Team
        </div>
        <h2
          className="font-display font-bold leading-[0.95] tracking-tight"
          style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
        >
          The Builders{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "var(--gradient-teal-pink)" }}
          >
            Behind Kreo.
          </span>
        </h2>
        <p className="font-body text-muted-foreground text-lg mt-6 max-w-xl mx-auto">
          Not consultants who discovered crypto last year. Builders who have been
          shipping real DeFi — and who decided creator finance deserved better.
        </p>
      </FadeIn>

      {/* Cards area — TEAM sits behind, letters peek above & below cards */}
      <div className="relative overflow-hidden" style={{ paddingTop: "80px", paddingBottom: "80px" }}>

        {/* "KREO TEAM" scrolling watermark — same loop technique as TestimonialsSection */}
        <div
          className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none"
          aria-hidden
        >
          <motion.div
            className="flex items-center flex-nowrap"
            animate={{ x: ["-50%", "0%"] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            {[0, 1].map((i) => (
              <span key={i} className="flex items-center flex-shrink-0">
                <span
                  className="font-display font-black whitespace-nowrap"
                  style={{
                    fontSize: "min(52vw, 620px)",
                    lineHeight: 0.85,
                    letterSpacing: "-0.01em",
                    WebkitTextStroke: "clamp(2px, 0.3vw, 4px) hsl(var(--creo-pink) / 0.6)",
                    color: "transparent",
                  }}
                >
                  KREO TEAM
                </span>
                {/* separator between loops */}
                <span
                  className="font-display font-black flex-shrink-0"
                  style={{
                    fontSize: "min(14vw, 160px)",
                    color: "hsl(var(--creo-pink) / 0.35)",
                    margin: "0 2vw",
                    lineHeight: 1,
                  }}
                >
                  ◆
                </span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Cards grid — floats on top of TEAM text */}
        <div className="relative z-10 w-[90%] max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7 lg:gap-9">
          {team.map((member, i) => (
            <TeamCard key={member.id} member={member} index={i} />
          ))}
        </div>
      </div>

    </section>
  );
}
