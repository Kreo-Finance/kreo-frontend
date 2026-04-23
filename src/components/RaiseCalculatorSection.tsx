import { useState, useRef, useId, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ShieldCheck, ChevronDown,
  DollarSign, Percent, Clock,
  Wallet, TrendingUp, Lock, AlertTriangle,
} from "lucide-react";

// ─── Protocol constants ───────────────────────────────────────────────────────
const COVERAGE  = 1.22;
const FEE       = 0.03;
const BOND_PCT  = 0.10;
const BOND_BONUS= 0.02;
const MIN_RETAIN= 0.35;
const MIN_ABS   = 500;
const MAX_SHARE = 70;

// ─── Three modes ─────────────────────────────────────────────────────────────
type Mode = "A" | "B" | "C";
const MODES = [
  { id: "A" as Mode, icon: Percent,    label: "What % do I give?"     },
  { id: "B" as Mode, icon: DollarSign, label: "How much can I raise?"  },
  { id: "C" as Mode, icon: Clock,      label: "How long will it take?" },
];

// ─── Math ─────────────────────────────────────────────────────────────────────
interface Out {
  primary: number;
  shareDisplay: number;
  keepPerMonth: number;
  investorPerMonth: number;
  netCapital: number;
  grossRaise: number;
  bondRequired: number;
  totalRepay: number;
  isViable: boolean;
  warnRetain: boolean;
  warnHighShare: boolean;
  fixMonths?: number;
  fixRaise?: number;
  fixShare?: number;
}

function calcA(income: number, raise: number, months: number): Out {
  const share    = income && raise && months ? (raise * COVERAGE * 100) / (income * months) : 0;
  const viable   = share > 0 && share <= MAX_SHARE;
  const disp     = Math.min(share, MAX_SHARE);
  const invPerMo = (income * disp) / 100;
  const keep     = income - invPerMo;
  return {
    primary: disp, shareDisplay: disp,
    keepPerMonth: keep, investorPerMonth: invPerMo,
    netCapital: raise * (1 - FEE), grossRaise: raise,
    bondRequired: raise * BOND_PCT, totalRepay: raise * COVERAGE,
    isViable: viable,
    warnRetain: viable && keep < Math.max(income * MIN_RETAIN, MIN_ABS),
    warnHighShare: disp > 60,
    fixMonths: !viable ? Math.ceil((raise * COVERAGE * 100) / (income * MAX_SHARE)) : undefined,
    fixRaise:  !viable ? Math.floor(((income * MAX_SHARE * months) / (COVERAGE * 100)) / 500) * 500 : undefined,
  };
}
function calcB(income: number, share: number, months: number): Out {
  const raise    = income && share && months ? (income * share * months) / (COVERAGE * 100) : 0;
  const invPerMo = (income * share) / 100;
  const keep     = income - invPerMo;
  const viable   = raise > 0 && share <= MAX_SHARE;
  return {
    primary: raise, shareDisplay: share,
    keepPerMonth: keep, investorPerMonth: invPerMo,
    netCapital: raise * (1 - FEE), grossRaise: raise,
    bondRequired: raise * BOND_PCT, totalRepay: raise * COVERAGE,
    isViable: viable,
    warnRetain: viable && keep < Math.max(income * MIN_RETAIN, MIN_ABS),
    warnHighShare: share > 60,
  };
}
function calcC(income: number, raise: number, share: number): Out {
  const months   = income && raise && share ? Math.ceil((raise * COVERAGE * 100) / (income * share)) : 0;
  const invPerMo = (income * share) / 100;
  const keep     = income - invPerMo;
  const viable   = months > 0 && months <= 120 && share <= MAX_SHARE;
  return {
    primary: months, shareDisplay: share,
    keepPerMonth: keep, investorPerMonth: invPerMo,
    netCapital: raise * (1 - FEE), grossRaise: raise,
    bondRequired: raise * BOND_PCT, totalRepay: raise * COVERAGE,
    isViable: viable,
    warnRetain: viable && keep < Math.max(income * MIN_RETAIN, MIN_ABS),
    warnHighShare: share > 60,
    fixShare: !viable && months > 120 ? Math.ceil((raise * COVERAGE * 100) / (income * 120)) : undefined,
    fixRaise: !viable && months > 120 ? Math.floor(((income * share * 120) / (COVERAGE * 100)) / 500) * 500 : undefined,
  };
}

// ─── Formatters ───────────────────────────────────────────────────────────────
const fmtUSD = (v: number) =>
  v >= 1e6 ? `$${(v/1e6).toFixed(1)}M` : v >= 1000 ? `$${(v/1000).toFixed(1)}K` : `$${Math.round(v).toLocaleString()}`;
const fmtMonths = (m: number) => {
  if (!m || m <= 0) return "—";
  if (m > 120) return "> 10 yrs";
  const y = Math.floor(m / 12), mo = m % 12;
  if (y === 0)  return m === 1 ? "1 month" : `${m} months`;
  if (mo === 0) return y === 1 ? "1 year"  : `${y} years`;
  return `${y}y ${mo}mo`;
};

// ─── Tick presets ─────────────────────────────────────────────────────────────
type Tick = { value: number; label: string };
const INCOME_TICKS: Tick[] = [
  { value: 500,   label: "$500" }, { value: 2000, label: "$2K"  },
  { value: 5000,  label: "$5K"  }, { value: 10000,label: "$10K" },
  { value: 20000, label: "$20K" },
];
const RAISE_TICKS: Tick[] = [
  { value: 1000,  label: "$1K"  }, { value: 10000, label: "$10K" },
  { value: 25000, label: "$25K" }, { value: 50000, label: "$50K" },
  { value: 100000,label: "$100K"},
];
const MONTH_TICKS: Tick[] = [
  { value: 3, label: "3m" }, { value: 6,  label: "6m"  },
  { value: 12,label: "1y" }, { value: 24, label: "2y"  },
  { value: 36,label: "3y" },
];
const SHARE_TICKS: Tick[] = [
  { value: 10,label: "10%" }, { value: 20, label: "20%" },
  { value: 35,label: "35%" }, { value: 50, label: "50%" },
  { value: 70,label: "70%" },
];

// ─── FadeIn ───────────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >{children}</motion.div>
  );
}

// ─── Slider ───────────────────────────────────────────────────────────────────
function Slider({ value, min, max, step, ticks, onChange, accent = "teal" }: {
  value: number; min: number; max: number; step: number;
  ticks: Tick[]; onChange: (v: number) => void; accent?: "teal" | "pink";
}) {
  const pct = ((Math.min(max, Math.max(min, value)) - min) / (max - min)) * 100;
  const hsl = accent === "teal" ? "hsl(var(--creo-teal))" : "hsl(var(--creo-pink))";
  const txt = accent === "teal" ? "text-creo-teal" : "text-creo-pink";
  return (
    <div className="flex flex-col gap-0">
      <div className="relative h-6 flex items-center">
        <div className="absolute inset-x-0 h-[3px] rounded-full bg-border/60" />
        <div className="absolute left-0 h-[3px] rounded-full pointer-events-none"
          style={{ width: `${pct}%`, background: hsl }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-6" style={{ zIndex: 2 }} />
        <div className="absolute w-[15px] h-[15px] rounded-full border-[3px] border-background shadow pointer-events-none"
          style={{ left: `calc(${pct}% - 7.5px)`, background: hsl }} />
      </div>
      <div className="relative h-[22px]">
        {ticks.map(t => {
          const tp = ((t.value - min) / (max - min)) * 100;
          const active = value === t.value;
          return (
            <button key={t.value} type="button" onClick={() => onChange(t.value)}
              className="absolute flex flex-col items-center gap-[2px]"
              style={{ left: `${tp}%`, transform: "translateX(-50%)", background: "none", border: "none", padding: 0, cursor: "pointer" }}>
              <div className="w-px h-[4px]" style={{ background: active ? hsl : "hsl(var(--border))" }} />
              <span className={`font-body text-[10px] font-bold whitespace-nowrap ${active ? txt : "text-muted-foreground/50"}`}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Field (label + input + slider) ──────────────────────────────────────────
function Field({ label, value, min, max, step, ticks, onChange, prefix, suffix, accent = "teal", inputMax }: {
  label: string; value: number; min: number; max: number; step: number;
  ticks: Tick[]; onChange: (v: number) => void;
  prefix?: string; suffix?: string; accent?: "teal" | "pink"; inputMax?: number;
}) {
  const id = useId();
  const [raw, setRaw] = useState(String(value));
  useEffect(() => { setRaw(String(value)); }, [value]);
  const commit = (s: string) => {
    const n = parseFloat(s);
    if (!isNaN(n)) { const c = Math.min(inputMax ?? max, Math.max(min, n)); onChange(c); setRaw(String(c)); }
    else setRaw(String(value));
  };
  const ac = accent === "teal" ? "text-creo-teal" : "text-creo-pink";
  const fb = accent === "teal" ? "focus-within:border-creo-teal/50" : "focus-within:border-creo-pink/50";
  return (
    <div className="flex flex-col gap-2.5">
      <p className="font-body text-sm font-bold text-foreground">{label}</p>
      <div className={`flex items-center gap-2 rounded-xl border-2 border-border bg-background/60 px-4 py-3 transition-colors ${fb} hover:border-border/80`}>
        {prefix && <span className={`font-body text-base font-bold ${ac} shrink-0`}>{prefix}</span>}
        <input id={id} type="number" value={raw}
          onChange={(e) => setRaw(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && commit(raw)}
          min={min} max={inputMax ?? max} step={step}
          className="flex-1 min-w-0 bg-transparent border-none outline-none font-display text-xl font-bold tabular-nums text-right text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
        {suffix && <span className="font-body text-sm font-bold text-muted-foreground shrink-0">{suffix}</span>}
      </div>
      <Slider value={value} min={min} max={max} step={step} ticks={ticks} onChange={onChange} accent={accent} />
    </div>
  );
}

// ─── Stat row (matches screenshot style) ─────────────────────────────────────
function StatRow({ label, sub, value, accent = "teal", icon: Icon }: {
  label: string; sub?: string; value: string;
  accent?: "teal" | "pink" | "yellow"; icon?: React.ElementType;
}) {
  const iconBg  = { teal: "bg-creo-teal/10 border-creo-teal/20",   pink: "bg-creo-pink/10 border-creo-pink/20",   yellow: "bg-creo-yellow/10 border-creo-yellow/20" }[accent];
  const iconTxt = { teal: "text-creo-teal", pink: "text-creo-pink", yellow: "text-creo-yellow" }[accent];
  const valTxt  = { teal: "text-creo-teal", pink: "text-creo-pink", yellow: "text-creo-yellow" }[accent];
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border-2 border-border bg-background/60 hover:border-border/80 transition-colors">
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && (
          <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon className={`h-3.5 w-3.5 ${iconTxt}`} />
          </div>
        )}
        <div className="min-w-0">
          <p className="font-body text-[11px] font-extrabold tracking-widest uppercase text-foreground/80 leading-none">{label}</p>
          {sub && <p className="font-body text-[10px] text-muted-foreground/60 mt-0.5 truncate">{sub}</p>}
        </div>
      </div>
      <p className={`font-display text-base font-bold tabular-nums shrink-0 ${valTxt}`}>{value}</p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function RaiseCalculatorSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const [mode,    setMode]    = useState<Mode>("A");
  const [income,  setIncome]  = useState(2_000);
  const [raise,   setRaise]   = useState(10_000);
  const [months,  setMonths]  = useState(12);
  const [share,   setShare]   = useState(20);
  const [showHow, setShowHow] = useState(false);

  const out =
    mode === "A" ? calcA(income, raise, months) :
    mode === "B" ? calcB(income, share, months) :
                   calcC(income, raise, share);

  const primaryLabel =
    mode === "A" ? "Share you give"  :
    mode === "B" ? "Maximum raise"   :
                   "Time needed";

  const primaryValue =
    mode === "A" ? `${out.primary.toFixed(1)}%`  :
    mode === "B" ? fmtUSD(out.primary)            :
                   fmtMonths(out.primary);

  const primarySub =
    mode === "A" ? `of your ${fmtUSD(income)}/mo income` :
    mode === "B" ? `${fmtUSD(out.netCapital)} after 3% fee` :
                   `at ${share}% share`;

  return (
    <section id="raise-calculator" className="border-t border-border">

      {/* Header */}
      <FadeIn className="container mx-auto px-4 pt-8 pb-6 max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-creo-teal/40 bg-creo-teal/[0.07] text-creo-teal text-xs font-semibold tracking-widest uppercase mb-3">
          Raise Calculator
        </div>
        <h2 className="font-display font-bold tracking-tight"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.05 }}>
          How much can{" "}
          <span className="text-transparent bg-clip-text"
            style={{ backgroundImage: "var(--gradient-teal-pink)" }}>
            you raise?
          </span>
        </h2>
        <p className="font-body text-muted-foreground text-sm mt-2">
          Pick what you already know. We calculate the rest.
        </p>
      </FadeIn>

      {/* Main card */}
      <div ref={ref} className="border-t border-b border-border">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border-2 border-border bg-card/40 overflow-hidden"
          >

            {/* ── Mode tabs ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-3 border-b-2 border-border">
              {MODES.map(({ id, icon: Icon, label }) => (
                <button key={id} type="button" onClick={() => setMode(id)}
                  className={`relative flex items-center justify-center gap-2.5 px-4 py-3.5 transition-colors
                    ${id !== "C" ? "border-r-2 border-border" : ""}
                    ${mode === id
                      ? "bg-creo-teal/[0.06] text-creo-teal"
                      : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/20"
                    }`}>
                  {mode === id && (
                    <motion.div layoutId="mode-bar"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-creo-teal"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                  )}
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="font-body text-sm font-bold hidden sm:block">{label}</span>
                </button>
              ))}
            </div>

            {/* ── Two column body ───────────────────────────────────────── */}
            <div className="grid md:grid-cols-[1fr_380px]">

              {/* LEFT — inputs */}
              <div className="relative p-6 md:p-8 md:border-r-2 border-border flex flex-col gap-6">
                {/* subtle glow */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                  style={{ background: "radial-gradient(ellipse at 10% 20%, hsl(var(--creo-teal)), transparent 60%)" }} />

                {/* Income — always shown */}
                <div className="relative">
                  <Field label="Monthly income"
                    value={income} min={200} max={20_000} inputMax={500_000} step={100}
                    ticks={INCOME_TICKS} onChange={setIncome}
                    prefix="$" suffix="/mo" accent="teal" />
                </div>

                {/* Row 2: raise (A+C) or share% (B) */}
                <div className="relative">
                  <AnimatePresence mode="wait">
                    {mode === "B" ? (
                      <motion.div key="share-b"
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}>
                        <Field label="Revenue share you can give"
                          value={share} min={1} max={70} step={0.5}
                          ticks={SHARE_TICKS} onChange={setShare}
                          suffix="% /mo" accent="pink" />
                      </motion.div>
                    ) : (
                      <motion.div key="raise"
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}>
                        <Field label="Target raise amount"
                          value={raise} min={500} max={100_000} inputMax={1_000_000} step={500}
                          ticks={RAISE_TICKS} onChange={setRaise}
                          prefix="$" accent="pink" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Row 3: months (A+B) or share% (C) */}
                <div className="relative">
                  <AnimatePresence mode="wait">
                    {mode === "C" ? (
                      <motion.div key="share-c"
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}>
                        <Field label="Revenue share you can give"
                          value={share} min={1} max={70} step={0.5}
                          ticks={SHARE_TICKS} onChange={setShare}
                          suffix="% /mo" accent="teal" />
                      </motion.div>
                    ) : (
                      <motion.div key="months"
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}>
                        <Field label="Offering duration"
                          value={months} min={1} max={36} inputMax={120} step={1}
                          ticks={MONTH_TICKS} onChange={setMonths}
                          suffix="months" accent="teal" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* RIGHT — outputs */}
              <div className="relative p-6 md:p-8 flex flex-col gap-3">
                <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                  style={{ background: "radial-gradient(ellipse at 90% 10%, hsl(var(--creo-pink)), transparent 60%)" }} />

                <AnimatePresence mode="wait">
                  {!out.isViable && income > 0 ? (

                    /* Not viable */
                    <motion.div key="nv" className="relative flex flex-col gap-3 h-full"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}>
                      <div className="flex items-start gap-3 rounded-xl border-2 border-creo-pink/30 bg-creo-pink/[0.06] px-4 py-4">
                        <AlertTriangle className="h-4 w-4 text-creo-pink shrink-0 mt-0.5" />
                        <div>
                          <p className="font-body text-sm font-bold text-foreground">Needs adjustment</p>
                          <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">
                            {mode === "A" && `${fmtUSD(raise)} in ${fmtMonths(months)} requires ${out.primary.toFixed(0)}% share — above the 70% cap.`}
                            {mode === "C" && `At ${share}% share, ${fmtUSD(raise)} takes ${fmtMonths(out.primary)} — over the 10-year maximum.`}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        {out.fixMonths && (
                          <button type="button" onClick={() => setMonths(out.fixMonths!)}
                            className="rounded-xl border-2 border-creo-teal/30 bg-creo-teal/[0.05] hover:bg-creo-teal/[0.10] transition-colors px-4 py-3 text-left">
                            <p className="font-body text-[10px] font-bold tracking-widest uppercase text-creo-teal/80">Extend to</p>
                            <p className="font-display text-lg font-bold text-foreground mt-0.5">{fmtMonths(out.fixMonths)}</p>
                          </button>
                        )}
                        {out.fixRaise && out.fixRaise > 0 && (
                          <button type="button" onClick={() => setRaise(out.fixRaise!)}
                            className="rounded-xl border-2 border-creo-pink/30 bg-creo-pink/[0.05] hover:bg-creo-pink/[0.10] transition-colors px-4 py-3 text-left">
                            <p className="font-body text-[10px] font-bold tracking-widest uppercase text-creo-pink/80">Lower raise to</p>
                            <p className="font-display text-lg font-bold text-foreground mt-0.5">{fmtUSD(out.fixRaise)}</p>
                          </button>
                        )}
                        {out.fixShare && (
                          <button type="button" onClick={() => setShare(out.fixShare!)}
                            className="rounded-xl border-2 border-creo-teal/30 bg-creo-teal/[0.05] hover:bg-creo-teal/[0.10] transition-colors px-4 py-3 text-left">
                            <p className="font-body text-[10px] font-bold tracking-widest uppercase text-creo-teal/80">Increase share to</p>
                            <p className="font-display text-lg font-bold text-foreground mt-0.5">{out.fixShare}%</p>
                          </button>
                        )}
                      </div>
                    </motion.div>

                  ) : (

                    /* Viable */
                    <motion.div key="ok" className="relative flex flex-col gap-3 h-full"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}>

                      {/* Hero result */}
                      <div className="relative overflow-hidden rounded-xl border-2 border-border bg-background/60 px-5 py-4">
                        <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
                          style={{ background: "radial-gradient(ellipse at 80% 20%, hsl(var(--creo-pink)), transparent 65%)" }} />
                        <p className="font-body text-[10px] font-bold tracking-widest uppercase text-muted-foreground/70">
                          {primaryLabel}
                        </p>
                        <AnimatePresence mode="wait">
                          <motion.p key={primaryValue}
                            initial={{ opacity: 0, y: 6, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.97 }}
                            transition={{ duration: 0.15 }}
                            className="font-display font-bold text-transparent bg-clip-text leading-none mt-1"
                            style={{ backgroundImage: "var(--gradient-teal-pink)", fontSize: "clamp(2rem, 5vw, 2.8rem)" }}>
                            {primaryValue}
                          </motion.p>
                        </AnimatePresence>
                        <p className="font-body text-xs text-muted-foreground mt-1">{primarySub}</p>

                        {/* Coverage bar */}
                        <div className="mt-3">
                          <div className="flex justify-between mb-1.5">
                            <span className="font-body text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">Coverage ratio</span>
                            <span className="font-body text-[11px] font-bold text-creo-teal">1.22×</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-border/50 overflow-hidden">
                            <motion.div className="h-full rounded-full"
                              style={{ background: "linear-gradient(to right, hsl(var(--creo-teal)), hsl(var(--creo-pink)))" }}
                              animate={{ width: out.isViable ? "100%" : "0%" }}
                              transition={{ duration: 0.4, ease: "easeOut" }} />
                          </div>
                          <p className="font-body text-[10px] text-muted-foreground/40 mt-1">Protocol minimum always enforced on-chain</p>
                        </div>
                      </div>

                      {/* Stat rows */}
                      <StatRow label="Net Capital"      sub="After 3% protocol fee"
                        value={fmtUSD(out.netCapital)}
                        accent="teal" icon={DollarSign} />
                      <StatRow label="Investors get"    sub="Monthly USDC distribution"
                        value={`${fmtUSD(out.investorPerMonth)}/mo`}
                        accent="pink" icon={TrendingUp} />
                      <StatRow label="You keep"         sub={out.warnRetain ? "Below minimum — adjust" : "After sharing revenue"}
                        value={`${fmtUSD(out.keepPerMonth)}/mo`}
                        accent={out.warnRetain ? "pink" : "teal"} icon={Wallet} />
                      <StatRow label="Commitment bond"  sub={`Returned + 2% bonus on success`}
                        value={fmtUSD(out.bondRequired)}
                        accent="teal" icon={Lock} />

                      {/* Warnings */}
                      <AnimatePresence>
                        {(out.warnRetain || out.warnHighShare) && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="flex items-start gap-2 rounded-xl border-2 border-creo-pink/25 bg-creo-pink/[0.05] px-3 py-2.5">
                              <AlertTriangle className="h-3.5 w-3.5 text-creo-pink shrink-0 mt-0.5" />
                              <p className="font-body text-xs text-foreground/70 leading-snug">
                                {out.warnRetain
                                  ? `You'd keep ${fmtUSD(out.keepPerMonth)}/mo — below the protocol minimum. Reduce share or extend term.`
                                  : `Sharing above 60% is high. Consider extending the term to lower the monthly share.`}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* How calculated — collapsible */}
                      <div className="border-t border-border/40 pt-3 mt-auto">
                        <button type="button" onClick={() => setShowHow(v => !v)}
                          className="flex items-center gap-1.5 text-muted-foreground/50 hover:text-foreground transition-colors">
                          <span className="font-body text-xs font-semibold">How is this calculated?</span>
                          <motion.div animate={{ rotate: showHow ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="h-3 w-3" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {showHow && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                              <div className="pt-2 flex flex-col gap-0">
                                {[
                                  { l: "Gross raise",       v: fmtUSD(out.grossRaise),                                  b: false },
                                  { l: "Protocol fee (3%)", v: `−${fmtUSD(out.grossRaise * FEE)}`,                      b: false },
                                  { l: "You receive",       v: fmtUSD(out.netCapital),                                  b: true  },
                                  { l: "Bond (10%)",        v: `${fmtUSD(out.bondRequired)} → +2% back on success`,    b: false },
                                  { l: "Total repaid",      v: `${fmtUSD(out.totalRepay)} over ${fmtMonths(mode === "C" ? out.primary : months)}`, b: false },
                                ].map(row => (
                                  <div key={row.l} className="flex items-center justify-between gap-3 py-1.5 border-b border-border/30 last:border-0">
                                    <span className={`font-body text-[11px] ${row.b ? "font-bold text-foreground" : "text-muted-foreground"}`}>{row.l}</span>
                                    <span className={`font-body text-[11px] tabular-nums ${row.b ? "font-bold text-creo-teal" : "text-muted-foreground"}`}>{row.v}</span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* CTA */}
                      <a href="/onboarding/creator"
                        className="flex items-center justify-center gap-2 w-full rounded-xl py-3 font-body text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity mt-1"
                        style={{ background: "linear-gradient(to right, hsl(var(--creo-teal)), hsl(var(--creo-pink)))" }}>
                        Verify my income and start raising
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer strip */}
            <div className="border-t-2 border-border px-6 py-3 bg-muted/10">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-creo-teal/60" />
                  <span className="font-body text-[11px] font-semibold text-muted-foreground/60">1.22× coverage enforced on-chain</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 text-creo-pink/60" />
                  <span className="font-body text-[11px] font-semibold text-muted-foreground/60">3% protocol fee on capital release</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-creo-teal/60" />
                  <span className="font-body text-[11px] font-semibold text-muted-foreground/60">10% bond · returned +2% on success</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}