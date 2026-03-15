import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Mehta",
    role: "DeFi Educator · 80K Subscribers",
    avatar: "RM",
    quote: "Banks rejected me three times. Creo got me $12K in 48 hours. My bond returned with a bonus after 6 months. This is how creator finance should work.",
    yield: "$12,000 raised",
    color: "border-creo-pink",
    bg: "bg-creo-pink/10",
    textColor: "text-creo-pink",
  },
  {
    name: "Priya Sharma",
    role: "DeFi Investor",
    avatar: "PS",
    quote: "I invested $500 across three creators. 12% annualized yield backed by real Stripe earnings, not token inflation. Plus I'm stacking Creator Tokens for Phase 2.",
    yield: "12.3% APY earned",
    color: "border-creo-teal",
    bg: "bg-creo-teal/10",
    textColor: "text-creo-teal",
  },
  {
    name: "Alex Kim",
    role: "Solidity Instructor · Gumroad",
    avatar: "AK",
    quote: "The commitment bond scared me at first, but it actually builds investor trust. My second offering filled 3x faster because of my CreoScore.",
    yield: "$25,000 raised",
    color: "border-creo-yellow",
    bg: "bg-creo-yellow/10",
    textColor: "text-creo-yellow",
  },
  {
    name: "Sarah Chen",
    role: "Crypto Newsletter Writer",
    avatar: "SC",
    quote: "Substack takes a huge cut. Creo let me tokenize my newsletter revenue at 3% fees. Investors love the transparency of on-chain settlements.",
    yield: "$8,500 raised",
    color: "border-creo-pink",
    bg: "bg-creo-pink/10",
    textColor: "text-creo-pink",
  },
  {
    name: "Marcus Johnson",
    role: "Web3 Podcast Host",
    avatar: "MJ",
    quote: "I needed studio equipment. Creo turned my sponsorship revenue into instant capital. The monthly settlement runs itself — I just focus on creating.",
    yield: "$15,000 raised",
    color: "border-creo-teal",
    bg: "bg-creo-teal/10",
    textColor: "text-creo-teal",
  },
  {
    name: "David Park",
    role: "Yield Strategist",
    avatar: "DP",
    quote: "After years of yield farming with inflationary tokens, Creo is refreshing. Real cash flows from real businesses. The bond system gives me confidence.",
    yield: "13.1% APY earned",
    color: "border-creo-yellow",
    bg: "bg-creo-yellow/10",
    textColor: "text-creo-yellow",
  },
];

type Testimonial = typeof testimonials[0];

const TestimonialCard = ({ t }: { t: Testimonial }) => (
  <div
    className={`w-[380px] flex-shrink-0 rounded-xl border-l-4 ${t.color} bg-card p-6 transition-all hover:shadow-glow-pink`}
  >
    <Quote className="h-6 w-6 text-muted-foreground/30 mb-3" />
    <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
      "{t.quote}"
    </p>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${t.bg}`}>
          <span className={`font-display text-xs font-bold ${t.textColor}`}>{t.avatar}</span>
        </div>
        <div>
          <p className="font-display text-sm font-semibold text-foreground">{t.name}</p>
          <p className="font-body text-xs text-muted-foreground">{t.role}</p>
        </div>
      </div>
      <span className={`font-display text-xs font-bold ${t.textColor}`}>{t.yield}</span>
    </div>
  </div>
);

const row1 = testimonials.slice(0, 3);
const row2 = testimonials.slice(3, 6);

const marqueeTransition = {
  duration: 28,
  repeat: Infinity,
  ease: "linear" as const,
  repeatType: "loop" as const,
};

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="font-display text-4xl font-bold md:text-5xl">
            Loved by <span className="text-creo-yellow">creators</span> & <span className="text-creo-teal">investors</span>
          </h2>
          <p className="mt-4 font-body text-lg text-muted-foreground max-w-xl mx-auto">
            Real stories from the Creo community — creators getting funded and investors earning real yield.
          </p>
        </motion.div>
      </div>

      {/* Row 1: left → right */}
      <div className="overflow-hidden mb-6">
        <motion.div
          animate={{ x: ["-50%", "0%"] }}
          transition={marqueeTransition}
          className="flex gap-6 w-max"
        >
          {[...row1, ...row1, ...row1, ...row1].map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </motion.div>
      </div>

      {/* Row 2: right → left */}
      <div className="overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={marqueeTransition}
          className="flex gap-6 w-max"
        >
          {[...row2, ...row2, ...row2, ...row2].map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
