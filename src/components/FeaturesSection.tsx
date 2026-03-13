import { motion, useMotionValue, useTransform, type Variants } from "framer-motion";
import { Coins, Shield, Zap, BarChart3, Lock, Users } from "lucide-react";
import { useRef, MouseEvent } from "react";

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

/* ——— Framer Motion variants ——— */
const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 14, mass: 0.8 },
  },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const tagVariant: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20, delay: 0.15 },
  },
};

/* ——— Tilt Card component ——— */
interface FeatureCardProps {
  feature: (typeof features)[number];
  index: number;
}

const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Subtle 3-D tilt driven by cursor position
  const rotateX = useTransform(mouseY, [0, 1], [5, -5]);
  const rotateY = useTransform(mouseX, [0, 1], [-5, 5]);

  // Radial spotlight that follows the cursor
  const spotlightX = useTransform(mouseX, (v) => `${v * 100}%`);
  const spotlightY = useTransform(mouseY, (v) => `${v * 100}%`);

  const handleMouse = (e: MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariant}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
        transformStyle: "preserve-3d",
      }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.06]
        bg-gradient-to-br from-white/[0.04] to-white/[0.01]
        backdrop-blur-md p-[1px] transition-colors duration-500
        ${feature.borderHover}`}
    >
      {/* ——— Gradient border glow ——— */}
      <div
        className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-20`}
      />

      {/* ——— Cursor spotlight ——— */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: useTransform(
            [spotlightX, spotlightY],
            ([x, y]: string[]) =>
              `radial-gradient(420px circle at ${x} ${y}, ${feature.accentColor.replace(")", " / 0.08)")}, transparent 70%)`
          ),
        }}
      />

      {/* ——— Card inner ——— */}
      <div className="relative z-10 rounded-2xl bg-creo-card/90 p-7 sm:p-8 h-full">
        {/* Decorative corner accent */}
        <div
          className={`absolute -right-12 -top-12 h-28 w-28 rounded-full bg-gradient-to-br ${feature.gradient} opacity-[0.06] blur-2xl transition-all duration-700 group-hover:opacity-[0.12] group-hover:blur-xl`}
        />

        {/* Icon */}
        <motion.div
          className={`relative mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl
            bg-gradient-to-br ${feature.gradient} bg-clip-padding
            ${feature.iconGlow}
            transition-shadow duration-500 group-hover:shadow-none`}
          whileHover={{ rotate: [0, -8, 8, -4, 0], transition: { duration: 0.5 } }}
          style={{ transformStyle: "preserve-3d", translateZ: 30 }}
        >
          {/* inner glass */}
          <div className="absolute inset-[1px] rounded-[11px] bg-creo-dark/80 backdrop-blur" />
          <feature.icon className="relative z-10 h-6 w-6 text-white" />
        </motion.div>

        {/* Title */}
        <h3
          className="mb-2.5 font-display text-lg font-semibold tracking-tight text-foreground
            transition-colors duration-300 group-hover:text-white sm:text-xl"
        >
          {feature.title}
        </h3>

        {/* Description */}
        <p className="font-body text-sm leading-relaxed text-muted-foreground/80 transition-colors duration-300 group-hover:text-muted-foreground">
          {feature.description}
        </p>

        {/* Bottom accent line */}
        <div className="relative mt-6 h-[2px] w-full overflow-hidden rounded-full bg-white/[0.04]">
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${feature.gradient}`}
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{
              duration: 1.2,
              delay: 0.3 + index * 0.1,
              ease: [0.25, 0.46, 0.45, 0.94] as const,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

/* ——— Main Section ——— */
const FeaturesSection = () => {
  return (
    <section id="features" className="relative overflow-hidden py-28 sm:py-36">
      {/* ——— Background ambient blobs ——— */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-creo-pink/[0.04] blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-creo-teal/[0.05] blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-creo-yellow/[0.03] blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* ——— Header ——— */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mb-20 text-center"
        >
          {/* Pill tag */}
          <motion.div variants={tagVariant} className="mb-6 flex justify-center">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-creo-pink/20
                bg-creo-pink/[0.06] px-4 py-1.5 text-xs font-medium tracking-wider text-creo-pink
                uppercase backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-creo-pink opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-creo-pink" />
              </span>
              Core Protocol
            </span>
          </motion.div>

          <motion.h2
            variants={headingVariants}
            className="font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl"
          >
            Sell{" "}
            <span className="relative">
              <span className="text-gradient-hero">anything</span>
              {/* Underline decoration */}
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
            variants={headingVariants}
            className="mx-auto mt-5 max-w-2xl font-body text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Courses, sponsorships, newsletters — whatever you earn, Creo turns it
            into investable, on-chain revenue streams.
          </motion.p>
        </motion.div>

        {/* ——— Cards grid ——— */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
