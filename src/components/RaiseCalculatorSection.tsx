import { useState, useRef, useId, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Calculator,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  Wallet,
  AlertTriangle,
  DollarSign,
  Percent,
  TrendingDown,
  Lock,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────────
type CalcMode = "max-raise" | "time-to-raise";

// ─── Protocol constants ──────────────────────────────────────────────────────────
const COVERAGE_RATIO = 1.22;
const PROTOCOL_FEE = 0.03;
const BOND_RATE = 0.05;
const BOND_BONUS = 0.02;
const MIN_RETAIN_BPS = 0.35;
const MIN_RETAIN_ABS = 500;

// ─── Math engine ─────────────────────────────────────────────────────────────────
function calcMaxRaise(floor: number, share: number, months: number) {
  const monthlyPayout = (floor * share) / 100;
  const totalPayout = monthlyPayout * months;
  const maxRaise = totalPayout / COVERAGE_RATIO;
  const netCapital = maxRaise * (1 - PROTOCOL_FEE);
  const bondRequired = maxRaise * BOND_RATE;
  const bondReturn = bondRequired * (1 + BOND_BONUS);
  const keepPerMonth = floor - monthlyPayout;
  const minRetain = Math.max(floor * MIN_RETAIN_BPS, MIN_RETAIN_ABS);
  const isViable = keepPerMonth >= minRetain;
  return {
    maxRaise,
    netCapital,
    monthlyPayout,
    totalPayout,
    bondRequired,
    bondReturn,
    keepPerMonth,
    minRetain,
    isViable,
  };
}

function calcMonthsNeeded(floor: number, share: number, target: number) {
  if (!floor || !share || !target) return 0;
  return Math.ceil((target * COVERAGE_RATIO * 100) / (floor * share));
}

// ─── Formatters ──────────────────────────────────────────────────────────────────
function fmtUSD(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${Math.round(v).toLocaleString()}`;
}

function fmtMonths(m: number): string {
  if (m <= 0) return "—";
  if (m > 360) return "> 30 yrs";
  const years = Math.floor(m / 12);
  const months = m % 12;
  if (years === 0) return m === 1 ? "1 month" : `${m} months`;
  if (months === 0) return years === 1 ? "1 year" : `${years} years`;
  return `${years}y ${months}mo`;
}

// ─── FadeIn ───────────────────────────────────────────────────────────────────────
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

// ─── Tick config ─────────────────────────────────────────────────────────────────
type TickMark = { value: number; label: string };

const DURATION_TICKS: TickMark[] = [
  { value: 1, label: "1m" },
  { value: 6, label: "6m" },
  { value: 12, label: "12m" },
  { value: 24, label: "24m" },
  { value: 36, label: "36m" },
  { value: 60, label: "60m" },
];
const DURATION_SLIDER_MAX = 60;

const SHARE_TICKS: TickMark[] = [
  { value: 1, label: "1%" },
  { value: 15, label: "15%" },
  { value: 30, label: "30%" },
  { value: 45, label: "45%" },
  { value: 60, label: "60%" },
  { value: 70, label: "70%" },
];
const SHARE_SLIDER_MAX = 70;

// Updated floor price intervals
const FLOOR_TICKS: TickMark[] = [
  { value: 1000, label: "$1K" },
  { value: 8000, label: "$8K" },
  { value: 15000, label: "$15K" },
  { value: 25000, label: "$25K" },
  { value: 40000, label: "$40K" },
  { value: 50000, label: "$50K" },
];
const FLOOR_SLIDER_MAX = 50_000;
const FLOOR_INPUT_MAX = 1_000_000;

const TARGET_TICKS: TickMark[] = [
  { value: 10000, label: "$10K" },
  { value: 50000, label: "$50K" },
  { value: 100000, label: "$100K" },
  { value: 150000, label: "$150K" },
  { value: 200000, label: "$200K" },
];
const TARGET_SLIDER_MAX = 2_00_000;

// ─── KreoInputSlider ──────────────────────────────────────────────────────────────
interface InputSliderProps {
  label: string;
  hint?: string;
  value: number;
  sliderMin: number;
  sliderMax: number;
  inputMax?: number;
  step: number;
  onChange: (v: number) => void;
  ticks: TickMark[];
  accentColor: string;
  accentHsl: string;
  accentSecondaryHsl: string;
  inputPrefix?: string;
  inputSuffix?: string;
}

function KreoInputSlider({
  label,
  hint,
  value,
  sliderMin,
  sliderMax,
  inputMax,
  step,
  onChange,
  ticks,
  accentColor,
  accentHsl,
  accentSecondaryHsl,
  inputPrefix,
  inputSuffix,
}: InputSliderProps) {
  const id = useId();
  const clampedForSlider = Math.min(sliderMax, Math.max(sliderMin, value));
  const pct = ((clampedForSlider - sliderMin) / (sliderMax - sliderMin)) * 100;

  const [raw, setRaw] = useState(String(value));
  useEffect(() => {
    setRaw(String(value));
  }, [value]);

  const commit = (str: string) => {
    const parsed = parseFloat(str);
    if (!isNaN(parsed)) {
      const maxAllowed = inputMax ?? sliderMax;
      const clamped = Math.min(maxAllowed, Math.max(sliderMin, parsed));
      onChange(clamped);
      setRaw(String(clamped));
    } else {
      setRaw(String(value));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <span className="font-body text-sm font-bold text-foreground">
          {label}
        </span>
        {hint && (
          <span className="text-[11px] font-normal text-muted-foreground/60">
            {hint}
          </span>
        )}
      </div>

      <div
        className={`
          flex items-center w-full rounded-xl
          border-2 border-border bg-background
          px-4 py-2.5 gap-3
          transition-all duration-150
          hover:border-${accentColor}/40
          focus-within:border-${accentColor}/70
        `}
      >
        {inputPrefix && (
          <span
            className={`font-body text-base font-bold text-${accentColor} shrink-0 select-none`}
          >
            {inputPrefix}
          </span>
        )}
        <input
          id="raise-calculator"
          type="number"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && commit(raw)}
          min={sliderMin}
          max={inputMax ?? sliderMax}
          step={step}
          className={`
            flex-1 min-w-0 bg-transparent border-none outline-none
            font-display text-xl font-bold tabular-nums text-right text-foreground
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
          `}
        />
        {inputSuffix && (
          <span className="font-body text-sm font-bold text-muted-foreground shrink-0 select-none">
            {inputSuffix}
          </span>
        )}
      </div>

      <div className="relative h-6 flex items-center mt-0.5">
        <div className="absolute inset-x-0 h-[4px] rounded-full bg-border/50" />
        <div
          className="absolute left-0 h-[4px] rounded-full pointer-events-none"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(to right, ${accentHsl}, ${accentSecondaryHsl})`,
          }}
        />
        <input
          type="range"
          min={sliderMin}
          max={sliderMax}
          step={step}
          value={clampedForSlider}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-6"
          style={{ zIndex: 2 }}
        />
        <div
          className="absolute w-4 h-4 rounded-full border-[3px] border-background shadow-md pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)`, background: accentHsl }}
        />
      </div>

      <div className="relative h-7">
        {ticks.map((tick) => {
          const tickPct =
            ((tick.value - sliderMin) / (sliderMax - sliderMin)) * 100;
          const isActive = value === tick.value;
          return (
            <button
              key={tick.value}
              type="button"
              onClick={() => onChange(tick.value)}
              className="absolute flex flex-col items-center gap-[3px] group"
              style={{
                left: `${tickPct}%`,
                transform: "translateX(-50%)",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <div
                className="w-px h-[5px] transition-colors"
                style={{
                  background: isActive ? accentHsl : "hsl(var(--border))",
                }}
              />
              <span
                className={`font-body text-[10px] font-bold whitespace-nowrap transition-colors ${
                  isActive
                    ? `text-${accentColor}`
                    : "text-foreground/50 dark:text-white/60 group-hover:text-foreground dark:group-hover:text-white"
                }`}
              >
                {tick.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── StatRow — horizontal stat bar (label left, value right) ─────────────────────
function StatRow({
  label,
  value,
  sub,
  accentColor = "creo-teal",
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  accentColor?: string;
  icon?: React.ElementType;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl border-2 border-border bg-background hover:border-${accentColor}/40 transition-colors`}
    >
      <div className="flex items-center gap-2 min-w-0">
        {Icon && (
          <div
            className={`w-6 h-6 rounded-md bg-${accentColor}/10 border border-${accentColor}/20 flex items-center justify-center shrink-0`}
          >
            <Icon className={`h-3 w-3 text-${accentColor}`} />
          </div>
        )}
        <div className="min-w-0">
          <p className="font-body text-[11px] font-extrabold tracking-widest uppercase text-foreground/80 leading-none mb-0.5">
            {label}
          </p>
          {sub && (
            <p className="font-body text-[10px] font-semibold text-muted-foreground/60 leading-snug truncate">
              {sub}
            </p>
          )}
        </div>
      </div>
      <p
        className={`font-display text-base font-bold tabular-nums text-${accentColor} shrink-0`}
      >
        {value}
      </p>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────────
export default function RaiseCalculatorSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, margin: "-80px" });

  const [mode, setMode] = useState<CalcMode>("max-raise");
  const [floorPrice, setFloorPrice] = useState(4_250);
  const [sharePercent, setSharePercent] = useState(20);
  const [duration, setDuration] = useState(12);
  const [targetRaise, setTargetRaise] = useState(50_000);

  const mr = calcMaxRaise(floorPrice, sharePercent, duration);
  const monthsNeeded = calcMonthsNeeded(floorPrice, sharePercent, targetRaise);
  const timeMonthly = (floorPrice * sharePercent) / 100;
  const timePayout = timeMonthly * monthsNeeded;

  const primaryValue =
    mode === "max-raise" ? fmtUSD(mr.maxRaise) : fmtMonths(monthsNeeded);
  const primarySub =
    mode === "max-raise"
      ? `at ${sharePercent.toFixed(1)}% share over ${fmtMonths(duration)}`
      : `to raise ${fmtUSD(targetRaise)} at ${sharePercent.toFixed(1)}% share`;

  const tooLong = mode === "time-to-raise" && monthsNeeded > 360;
  const tooSmall = mode === "max-raise" && mr.maxRaise < 500 && floorPrice > 0;
  const warnRetain = mode === "max-raise" && !mr.isViable && floorPrice > 0;
  const warnHighShare = sharePercent > 60;

  const TEAL_HSL = "hsl(var(--creo-teal))";
  const PINK_HSL = "hsl(var(--creo-pink))";

  return (
    <section id="raise-calculator" className="border-t border-border">
      {/* ── Section header ────────────────────────────────────────────────── */}
      <FadeIn className="container mx-auto px-4 pt-10 md:pt-14 pb-6 md:pb-8 max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-creo-teal/40 bg-creo-teal/[0.08] text-creo-teal text-xs font-semibold tracking-widest uppercase mb-4">
          <Calculator className="h-3 w-3" />
          Raise Calculator
        </div>
        <h2
          className="font-display font-bold leading-[0.95] tracking-tight"
          style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
        >
          How much can{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "var(--gradient-teal-pink)" }}
          >
            you raise?
          </span>
        </h2>
        <p className="font-body text-muted-foreground text-sm mt-3 max-w-xl mx-auto">
          Get your raise in real-time — every figure is computed from the same
          variance model that runs on-chain.
        </p>
      </FadeIn>

      {/* ── Calculator body ───────────────────────────────────────────────── */}
      <div ref={gridRef} className="border-t border-b border-border">
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
          {/* Mode tabs */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="flex gap-2 p-1.5 rounded-xl border-2 border-border bg-muted/30 w-fit mx-auto mb-5"
          >
            {(
              [
                {
                  id: "max-raise" as CalcMode,
                  label: "Max Raise",
                  Icon: TrendingUp,
                },
                {
                  id: "time-to-raise" as CalcMode,
                  label: "Time to Raise",
                  Icon: Clock,
                },
              ] as const
            ).map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                className={`
                  relative flex items-center gap-2 px-6 py-3 rounded-lg
                  font-body text-sm font-bold transition-all duration-200
                  ${mode === id ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
                `}
              >
                {mode === id && (
                  <motion.div
                    layoutId="calc-tab-bg"
                    className="absolute inset-0 rounded-lg border-2 border-creo-teal/40 bg-background shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  className={`relative h-4 w-4 ${mode === id ? "text-creo-teal" : ""}`}
                />
                <span className="relative">{label}</span>
              </button>
            ))}
          </motion.div>

          {/* Two-column grid — items-stretch so both columns share same height */}
          <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-stretch">
            {/* ── LEFT: Inputs ─────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="relative rounded-2xl border-2 border-border hover:border-creo-teal/30 bg-background/60 overflow-hidden transition-colors"
            >
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                  background:
                    "radial-gradient(ellipse at 10% 10%, hsl(var(--creo-teal)), transparent 60%)",
                }}
              />

              <div className="relative p-5 md:p-6 flex flex-col gap-5 h-full">
                <KreoInputSlider
                  label="Floor Price"
                  hint="(conservative monthly earnings)"
                  value={floorPrice}
                  sliderMin={1000}
                  sliderMax={FLOOR_SLIDER_MAX}
                  inputMax={FLOOR_INPUT_MAX}
                  step={100}
                  onChange={setFloorPrice}
                  ticks={FLOOR_TICKS}
                  accentColor="creo-teal"
                  accentHsl={TEAL_HSL}
                  accentSecondaryHsl={PINK_HSL}
                  inputPrefix="$"
                  inputSuffix="/mo"
                />

                <KreoInputSlider
                  label="Revenue Share per Month"
                  value={sharePercent}
                  sliderMin={1}
                  sliderMax={SHARE_SLIDER_MAX}
                  step={0.5}
                  onChange={setSharePercent}
                  ticks={SHARE_TICKS}
                  accentColor="creo-pink"
                  accentHsl={PINK_HSL}
                  accentSecondaryHsl={TEAL_HSL}
                  inputSuffix="%"
                />

                <AnimatePresence>
                  {warnHighShare && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: -24 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 0 }}
                      exit={{ opacity: 0, height: 0, marginTop: -24 }}
                      className="overflow-hidden -mt-6"
                    >
                      <div className="flex items-start gap-3 rounded-xl border-2 border-creo-pink/40 bg-creo-pink/[0.06] px-4 py-3">
                        <AlertTriangle className="h-4 w-4 text-creo-pink shrink-0 mt-0.5" />
                        <p className="font-body text-xs font-semibold text-foreground/80 leading-relaxed">
                          Share above 60% is very high. Investors may flag this
                          as unsustainable — consider staying at 60% or below.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {mode === "max-raise" ? (
                    <motion.div
                      key="dur"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <KreoInputSlider
                        label="Offering Duration"
                        value={duration}
                        sliderMin={1}
                        sliderMax={DURATION_SLIDER_MAX}
                        inputMax={360}
                        step={1}
                        onChange={setDuration}
                        ticks={DURATION_TICKS}
                        accentColor="creo-teal"
                        accentHsl={TEAL_HSL}
                        accentSecondaryHsl={PINK_HSL}
                        inputSuffix="mo"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="target"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <KreoInputSlider
                        label="Target Raise Amount"
                        value={targetRaise}
                        sliderMin={5_000}
                        sliderMax={TARGET_SLIDER_MAX}
                        step={1_000}
                        onChange={setTargetRaise}
                        ticks={TARGET_TICKS}
                        accentColor="creo-pink"
                        accentHsl={PINK_HSL}
                        accentSecondaryHsl={TEAL_HSL}
                        inputPrefix="$"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {warnRetain && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-start gap-3 rounded-xl border-2 border-creo-pink/40 bg-creo-pink/[0.06] px-4 py-3.5">
                        <AlertTriangle className="h-4 w-4 text-creo-pink shrink-0 mt-0.5" />
                        <p className="font-body text-sm font-semibold text-foreground/80 leading-relaxed">
                          You'd keep{" "}
                          <span className="text-creo-pink font-bold">
                            {fmtUSD(mr.keepPerMonth)}/mo
                          </span>
                          , below the{" "}
                          <span className="text-foreground font-bold">
                            {fmtUSD(mr.minRetain)}
                          </span>{" "}
                          protocol minimum. Reduce share % or raise your floor
                          price.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex-1" />
              </div>
            </motion.div>

            {/* ── RIGHT: Results ────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="flex flex-col gap-2"
            >
              {/* Hero result card */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-border hover:border-creo-pink/40 bg-background transition-colors">
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.06]"
                  style={{
                    background:
                      "radial-gradient(ellipse at 80% 20%, hsl(var(--creo-pink)), transparent 65%)",
                  }}
                />
                <div className="relative px-5 pt-4 pb-2 flex flex-col gap-1">
                  <p className="font-body text-[10px] font-bold tracking-widest uppercase text-muted-foreground/70">
                    {mode === "max-raise"
                      ? "Maximum Raise Amount"
                      : "Duration Required"}
                  </p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={
                        mode === "max-raise"
                          ? mr.maxRaise.toFixed(0)
                          : monthsNeeded
                      }
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="font-display font-bold text-transparent bg-clip-text leading-none"
                      style={{
                        backgroundImage: "var(--gradient-teal-pink)",
                        fontSize: "clamp(2rem, 5vw, 2.8rem)",
                      }}
                    >
                      {primaryValue}
                    </motion.p>
                  </AnimatePresence>
                  <p className="font-body text-sm font-semibold text-muted-foreground mt-0.5">
                    {primarySub}
                  </p>
                </div>

                {/* Coverage ratio bar */}
                <div className="relative px-5 pb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-body text-[10px] font-bold text-muted-foreground/70 tracking-widest uppercase">
                      Coverage ratio
                    </span>
                    <span className="font-body text-[11px] font-bold text-creo-teal tabular-nums">
                      {mode === "max-raise"
                        ? mr.maxRaise > 0
                          ? "1.22×"
                          : "—"
                        : monthsNeeded > 0 && targetRaise > 0
                          ? `${(timePayout / targetRaise).toFixed(2)}×`
                          : "—"}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-border/60 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background:
                          "linear-gradient(to right, hsl(var(--creo-teal)), hsl(var(--creo-pink)))",
                      }}
                      animate={{
                        width:
                          mode === "max-raise"
                            ? mr.maxRaise > 0
                              ? "100%"
                              : "0%"
                            : monthsNeeded > 0
                              ? `${Math.min(timePayout / targetRaise / 2, 1) * 100}%`
                              : "0%",
                      }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    />
                  </div>
                  <p className="font-body text-[11px] font-medium text-muted-foreground/50 mt-1.5">
                    Protocol minimum: 1.22× investor coverage required
                  </p>
                </div>
              </div>

              {/* ── Stat rows — horizontal layout fills space cleanly ─── */}
              <div className="flex flex-col gap-1.5">
                {mode === "max-raise" ? (
                  <>
                    <StatRow
                      label="Net Capital"
                      value={fmtUSD(mr.netCapital)}
                      sub="After 3% protocol fee"
                      accentColor="creo-teal"
                      icon={DollarSign}
                    />
                    <StatRow
                      label="Monthly Payout"
                      value={`${fmtUSD(mr.monthlyPayout)}/mo`}
                      sub="Investors earn per month"
                      accentColor="creo-pink"
                      icon={TrendingUp}
                    />
                    <StatRow
                      label="You Keep / Month"
                      value={fmtUSD(mr.keepPerMonth)}
                      sub={
                        mr.isViable
                          ? "Above protocol minimum ✓"
                          : "Below min — adjust share %"
                      }
                      accentColor={mr.isViable ? "creo-teal" : "creo-pink"}
                      icon={Wallet}
                    />
                    <StatRow
                      label="Bond Required"
                      value={fmtUSD(mr.bondRequired)}
                      sub={`Returns ${fmtUSD(mr.bondReturn)} on success`}
                      accentColor="creo-teal"
                      icon={Lock}
                    />
                    <StatRow
                      label="Total Investor Payout"
                      value={fmtUSD(mr.totalPayout)}
                      sub={`Over ${fmtMonths(duration)}`}
                      accentColor="creo-pink"
                      icon={Percent}
                    />
                  </>
                ) : (
                  <>
                    <StatRow
                      label="Monthly Payout"
                      value={`${fmtUSD(timeMonthly)}/mo`}
                      sub="Investors earn per month"
                      accentColor="creo-teal"
                      icon={TrendingUp}
                    />
                    <StatRow
                      label="Total Payout"
                      value={fmtUSD(timePayout)}
                      sub={`Over ${fmtMonths(monthsNeeded)}`}
                      accentColor="creo-pink"
                      icon={DollarSign}
                    />
                    <StatRow
                      label="Net Capital"
                      value={fmtUSD(targetRaise * (1 - PROTOCOL_FEE))}
                      sub="After 3% protocol fee"
                      accentColor="creo-teal"
                      icon={Wallet}
                    />
                    <StatRow
                      label="Min. Monthly Retain"
                      value={fmtUSD(
                        Math.max(floorPrice * MIN_RETAIN_BPS, MIN_RETAIN_ABS),
                      )}
                      sub="Protocol floor (35% or $500)"
                      accentColor="creo-pink"
                      icon={TrendingDown}
                    />
                    <StatRow
                      label="Coverage Ratio"
                      value={
                        monthsNeeded > 0 && targetRaise > 0
                          ? `${(timePayout / targetRaise).toFixed(2)}×`
                          : "—"
                      }
                      sub="Must exceed 1.22× minimum"
                      accentColor="creo-teal"
                      icon={ShieldCheck}
                    />
                  </>
                )}
              </div>

              {/* Validity alerts */}
              <AnimatePresence>
                {tooLong && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-start gap-3 rounded-xl border-2 border-creo-pink/40 bg-creo-pink/[0.06] px-4 py-3.5">
                      <AlertTriangle className="h-4 w-4 text-creo-pink shrink-0 mt-0.5" />
                      <p className="font-body text-sm font-semibold text-foreground/80 leading-relaxed">
                        Duration exceeds 30 years. Increase share % or reduce
                        your target raise.
                      </p>
                    </div>
                  </motion.div>
                )}
                {tooSmall && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-start gap-3 rounded-xl border-2 border-creo-pink/40 bg-creo-pink/[0.06] px-4 py-3.5">
                      <AlertTriangle className="h-4 w-4 text-creo-pink shrink-0 mt-0.5" />
                      <p className="font-body text-sm font-semibold text-foreground/80 leading-relaxed">
                        Projected raise is very low — increase share %,
                        duration, or your floor price.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Protocol footnote */}
              <div className="rounded-xl border-2 border-border bg-muted/20 px-4 py-2.5">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-creo-teal" />
                    <span className="font-body text-[11px] font-semibold text-muted-foreground/70">
                      1.22× coverage enforced
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-3.5 w-3.5 text-creo-pink" />
                    <span className="font-body text-[11px] font-semibold text-muted-foreground/70">
                      3% protocol fee on release
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calculator className="h-3.5 w-3.5 text-creo-teal" />
                    <span className="font-body text-[11px] font-semibold text-muted-foreground/70">
                      5% bond · +2% returned on success
                    </span>
                  </div>
                </div>
              </div>

              {/* Spacer + CTA pinned to bottom */}
              <div className="flex-1" />

              <a
                href="/onboarding/creator"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-hero text-primary-foreground font-body text-sm font-bold py-3 hover:opacity-90 transition-opacity"
              >
                Start your raise
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>

          {/* Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-4 text-center font-body text-xs font-medium text-muted-foreground/50"
          >
            Estimates only. Actual raise limits are confirmed after
            oracle-verified earnings and KYC.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
