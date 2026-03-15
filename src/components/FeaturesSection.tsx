import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Coins, Shield, Zap, BarChart3, Lock, Users } from "lucide-react";
import { useRef, type MouseEvent } from "react";

const features = [
  {
    icon: Coins,
    title: "Revenue Tokenization",
    description:
      "Creators tokenize future earnings into ERC20 Revenue Share Tokens. Investors buy tokens and earn proportional monthly USDC distributions.",
    gradient: "from-creo-pink via-creo-pink/60 to-creo-teal",
    iconGlow: "shadow-[0_0_24px_hsl(340_82%_65%/0.45)]",
    accentColor: "hsl(340 82% 65%)",
    borderHover: "hover:border-creo-pink/40",
  },
  {
    icon: Users,
    title: "Creator Tokens",
    description:
      "Auto-minted loyalty primitives. When you invest, Creator Tokens land in your wallet automatically — same transaction, zero extra cost.",
    gradient: "from-creo-teal via-creo-teal/60 to-creo-yellow",
    iconGlow: "shadow-[0_0_24px_hsl(168_72%_48%/0.45)]",
    accentColor: "hsl(168 72% 48%)",
    borderHover: "hover:border-creo-teal/40",
  },
  {
    icon: Shield,
    title: "Commitment Bond",
    description:
      "Creators deposit 5% as a commitment bond. Returned with bonus on success. Distributed to investors on default. Skin in the game.",
    gradient: "from-creo-yellow via-creo-yellow/60 to-creo-pink",
    iconGlow: "shadow-[0_0_24px_hsl(45_100%_58%/0.45)]",
    accentColor: "hsl(45 100% 58%)",
    borderHover: "hover:border-creo-yellow/40",
  },
  {
    icon: BarChart3,
    title: "CreoScore",
    description:
      "Soulbound on-chain reputation. Earned through successful completions. Visible to all investors. Better scores unlock better terms.",
    gradient: "from-creo-pink via-creo-teal/60 to-creo-teal",
    iconGlow: "shadow-[0_0_24px_hsl(340_82%_65%/0.45)]",
    accentColor: "hsl(340 82% 65%)",
    borderHover: "hover:border-creo-pink/40",
  },
  {
    icon: Zap,
    title: "Instant Settlement",
    description:
      "One transaction per creator, regardless of investor count. Claimable balance pattern — gas efficient and secure.",
    gradient: "from-creo-teal via-creo-pink/60 to-creo-pink",
    iconGlow: "shadow-[0_0_24px_hsl(168_72%_48%/0.45)]",
    accentColor: "hsl(168 72% 48%)",
    borderHover: "hover:border-creo-teal/40",
  },
  {
    icon: Lock,
    title: "Trustless & On-Chain",
    description:
      "Smart contracts execute all settlements. No intermediary. Every earning, every distribution verifiable on Polygon.",
    gradient: "from-creo-yellow via-creo-pink/60 to-creo-teal",
    iconGlow: "shadow-[0_0_24px_hsl(45_100%_58%/0.45)]",
    accentColor: "hsl(45 100% 58%)",
    borderHover: "hover:border-creo-yellow/40",
  },
];

// Card dimensions for the deck-deal offset calculation
const CARD_W = 380;
const GAP    = 24;

// Delay for each card: row 1 deals first, row 2 deals after
const ROW1_BASE  = 0;    // row 1 starts immediately
const ROW2_BASE  = 1.4;  // row 2 starts after row 1 finishes
const DEAL_STEP  = 0.28; // gap between each card being dealt
const CYCLE_MS   = 5600;

type Feature = (typeof features)[number];

/* ── Single card with cursor spotlight + hover glow ── */
const FeatureCard = ({
  feature,
  dealDelay,
  deckIndex, // 0 = leftmost slot, used to compute start offset
}: {
  feature: Feature;
  dealDelay: number;
  deckIndex: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX  = useMotionValue(0.5);
  const mouseY  = useMotionValue(0.5);

  const spotlightX  = useTransform(mouseX, (v) => `${v * 100}%`);
  const spotlightY  = useTransform(mouseY, (v) => `${v * 100}%`);
  const spotlightBg = useTransform(
    [spotlightX, spotlightY],
    ([x, y]: string[]) =>
      `radial-gradient(420px circle at ${x} ${y}, ${feature.accentColor.replace(")", " / 0.08)")}, transparent 70%)`
  );

  const handleMouse = (e: MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };
  const handleMouseLeave = () => { mouseX.set(0.5); mouseY.set(0.5); };

  // Each card starts stacked at the leftmost slot (deckIndex 0).
  // Offset = how far it needs to travel left from its final position.
  const startX = -(deckIndex * (CARD_W + GAP));

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      /* Deal animation: slide from deck to final position */
      initial={{ x: startX, opacity: 0, rotate: -deckIndex * 3, scale: 1 - deckIndex * 0.04 }}
      animate={{ x: 0,      opacity: 1, rotate: 0,              scale: 1 }}
      transition={{
        delay:     dealDelay,
        type:      "spring",
        stiffness: 110,
        damping:   18,
        mass:      0.9,
      }}
      className={`group relative w-[${CARD_W}px] overflow-hidden rounded-2xl border border-white/[0.06]
        bg-gradient-to-br from-white/[0.04] to-white/[0.01]
        backdrop-blur-md transition-colors duration-500 ${feature.borderHover}`}
      style={{ width: CARD_W, flexShrink: 0 }}
    >
      {/* Gradient border glow */}
      <div
        className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-20`}
      />

      {/* Cursor spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: spotlightBg }}
      />

      {/* Inner */}
      <div className="relative z-10 rounded-2xl bg-creo-card/90 p-7 sm:p-8 h-full">
        {/* Corner ambient */}
        <div
          className={`absolute -right-12 -top-12 h-28 w-28 rounded-full bg-gradient-to-br ${feature.gradient} opacity-[0.06] blur-2xl transition-all duration-700 group-hover:opacity-[0.12] group-hover:blur-xl`}
        />

        {/* Icon */}
        <motion.div
          className={`relative mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl
            bg-gradient-to-br ${feature.gradient} ${feature.iconGlow}
            transition-shadow duration-500 group-hover:shadow-none`}
          whileHover={{ rotate: [0, -8, 8, -4, 0], transition: { duration: 0.5 } }}
        >
          <div className="absolute inset-[1px] rounded-[11px] bg-creo-dark/80 backdrop-blur" />
          <feature.icon className="relative z-10 h-6 w-6 text-white" />
        </motion.div>

        {/* Title */}
        <h3 className="mb-2.5 font-display text-lg font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-white sm:text-xl">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="font-body text-sm leading-relaxed text-muted-foreground/80 transition-colors duration-300 group-hover:text-muted-foreground">
          {feature.description}
        </p>

        {/* Bottom accent bar */}
        <div className="relative mt-6 h-[2px] w-full overflow-hidden rounded-full bg-white/[0.04]">
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${feature.gradient}`}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: dealDelay + 0.4, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>
      </div>
    </motion.div>
  );
};

/* ── Main Section ── */
const FeaturesSection = () => {
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setAnimKey((k) => k + 1), CYCLE_MS);
    return () => clearInterval(t);
  }, []);

  const row1 = features.slice(0, 3);
  const row2 = features.slice(3, 6);

  return (
    <section id="features" className="relative overflow-hidden py-28 sm:py-36">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-creo-pink/[0.04] blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-creo-teal/[0.05] blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-creo-yellow/[0.03] blur-[80px]" />
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          className="mb-20 text-center"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } } }}
            className="mb-6 flex justify-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-creo-pink/20 bg-creo-pink/[0.06] px-4 py-1.5 text-xs font-medium tracking-wider text-creo-pink uppercase backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-creo-pink opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-creo-pink" />
              </span>
              Core Protocol
            </span>
          </motion.div>

          <motion.h2
            variants={{ hidden: { opacity: 0, y: 30, filter: "blur(8px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const } } }}
            className="font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl"
          >
            Sell{" "}
            <span className="relative">
              <span className="text-gradient-hero">anything</span>
              <motion.span
                className="absolute -bottom-1.5 left-0 h-[3px] w-full rounded-full bg-gradient-hero"
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              />
            </span>
          </motion.h2>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 30, filter: "blur(8px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const } } }}
            className="mx-auto mt-5 max-w-2xl font-body text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Courses, sponsorships, newsletters — whatever you earn, Creo turns it into investable, on-chain revenue streams.
          </motion.p>
        </motion.div>

        {/* Card rows — keyed so they re-mount and re-deal on each cycle */}
        <div key={animKey} className="flex flex-col gap-6">

          {/* Row 1 */}
          <div className="flex gap-6 justify-center flex-wrap">
            {row1.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                deckIndex={i}
                dealDelay={ROW1_BASE + i * DEAL_STEP}
              />
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex gap-6 justify-center flex-wrap">
            {row2.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                deckIndex={i}
                dealDelay={ROW2_BASE + i * DEAL_STEP}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
