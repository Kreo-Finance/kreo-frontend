import { motion } from "framer-motion";
import { Wallet, ShieldCheck, Coins, TrendingUp, ArrowDown } from "lucide-react";

const creatorSteps = [
  {
    icon: Wallet,
    number: "01",
    title: "Connect & Verify",
    description: "Link your wallet and Stripe account. Complete KYC in minutes. We verify 6 months of consistent earnings automatically.",
    accent: "creo-pink",
  },
  {
    icon: ShieldCheck,
    number: "02",
    title: "Deposit Bond",
    description: "Deposit 5% commitment bond to show investors you're serious. Earn it back with a bonus when your offering completes.",
    accent: "creo-teal",
  },
  // {
  //   icon: Coins,
  //   number: "03",
  //   title: "Tokenize & Launch",
  //   description: "Set your revenue share %, duration, and fundraise target. Smart contract mints your Revenue Share Tokens — you're live.",
  //   accent: "creo-yellow",
  // },
  {
    icon: TrendingUp,
    number: "03",
    title: "Get Funded",
    description: "Set your revenue share %, duration, and fundraise target. Investors fund your offering with USDC. You receive capital instantly (minus 3% fee).",
    accent: "creo-pink",
  },
];

const investorSteps = [
  {
    icon: Wallet,
    number: "01",
    title: "Browse Marketplace",
    description: "Explore creator offerings filtered by yield, risk score, earnings history, and CreoScore reputation tier.",
    accent: "creo-teal",
  },
  {
    icon: Coins,
    number: "02",
    title: "Invest USDC",
    description: "Purchase Revenue Share Tokens. Creator Tokens auto-mint to your wallet in the same transaction — zero extra cost.",
    accent: "creo-pink",
  },
  {
    icon: TrendingUp,
    number: "03",
    title: "Earn Real Yield",
    description: "Monthly oracle-verified settlements update your claimable balance. Claim USDC anytime or enable auto-claim.",
    accent: "creo-yellow",
  }
  // {
  //   icon: ShieldCheck,
  //   number: "04",
  //   title: "Protected by Bonds",
  //   description: "Creator commitment bonds ensure accountability. If a creator defaults, their bond distributes to you pro-rata.",
  //   accent: "creo-teal",
  // },
];

const StepCard = ({ step, index }: { step: typeof creatorSteps[0]; index: number }) => {
  const colorMap: Record<string, { bg: string; text: string; dot: string }> = {
    "creo-pink": { bg: "bg-creo-pink/10", text: "text-creo-pink", dot: "bg-creo-pink" },
    "creo-teal": { bg: "bg-creo-teal/10", text: "text-creo-teal", dot: "bg-creo-teal" },
    "creo-yellow": { bg: "bg-creo-yellow/10", text: "text-creo-yellow", dot: "bg-creo-yellow" },
  };
  const colors = colorMap[step.accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12 }}
      className="relative flex gap-4"
    >
      {/* Vertical connector */}
      {index < 2 && (
        <div className="absolute left-6 top-14 bottom-0 w-px bg-border" />
      )}
      
      {/* Icon circle */}
      <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${colors.bg}`}>
        <step.icon className={`h-5 w-5 ${colors.text}`} />
      </div>

      {/* Content */}
      <div className="pb-10">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-display text-xs font-bold ${colors.text}`}>{step.number}</span>
          <h3 className="font-display text-lg font-semibold text-foreground">{step.title}</h3>
        </div>
        <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-sm">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
};

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
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
            Whether you're a creator seeking capital or an investor chasing real yield — getting started takes minutes.
          </p>
        </motion.div>

        <div className="grid gap-16 lg:gap-8 lg:grid-cols-2">
          {/* Creator Flow */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-creo-pink/30 bg-creo-pink/5 px-4 py-2"
            >
              <span className="h-2 w-2 rounded-full bg-creo-pink" />
              <span className="font-display text-sm font-semibold text-creo-pink">For Creators</span>
            </motion.div>
            <div className="space-y-0">
              {creatorSteps.map((step, i) => (
                <StepCard key={step.number} step={step} index={i} />
              ))}
            </div>
          </div>

          {/* Investor Flow */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-creo-teal/30 bg-creo-teal/5 px-4 py-2"
            >
              <span className="h-2 w-2 rounded-full bg-creo-teal" />
              <span className="font-display text-sm font-semibold text-creo-teal">For Investors</span>
            </motion.div>
            <div className="space-y-0">
              {investorSteps.map((step, i) => (
                <StepCard key={step.number} step={step} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
