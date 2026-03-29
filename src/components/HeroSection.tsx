import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { joinWaitlist } from "@/services/waitlist";
import heroCreator from "@/assets/hero-creator.png";
import heroInvestor from "@/assets/hero-investor.png";

const headlines = [
  {
    top: "Go from",
    highlight: "0",
    connector: "to",
    accent: "Funded!",
  },
  {
    top: "The On-Chain",
    highlight: "Marketplace",
    connector: "for Creators",
    accent: "Revenue",
  },
  // {
  //   top: "Global, Permissionless",
  //   highlight: "&",
  //   connector: "Liquid — Built for",
  //   accent: "Creators",
  // },
  {
    top: "A New Paradigm",
    highlight: "of Trust",
    connector: "for Creators &",
    accent: "Investors",
  },
];

const SLIDE_DURATION = 4000; // ms per slide

function useCountUp(to: number, duration = 1800, trigger: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    setValue(0);
    const start = performance.now();
    const frame = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(eased * to));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [trigger, to, duration]);
  return value;
}

function AnimatedStat({ value, inView }: { value: string; inView: boolean }) {
  const rangeMatch = value.match(/^(\d+)-(\d+)(.*)$/);
  const singleMatch = !rangeMatch ? value.match(/^([^0-9]*)(\d+)(.*)$/) : null;

  const lo = rangeMatch ? parseInt(rangeMatch[1]) : 0;
  const hi = rangeMatch ? parseInt(rangeMatch[2]) : 0;
  const single = singleMatch ? parseInt(singleMatch[2]) : 0;

  const countLo = useCountUp(lo, 1800, inView && !!rangeMatch);
  const countHi = useCountUp(hi, 1800, inView && !!rangeMatch);
  const countSingle = useCountUp(single, 1800, inView && !!singleMatch);

  if (rangeMatch) {
    return (
      <>
        {countLo}-{countHi}
        {rangeMatch[3]}
      </>
    );
  }
  if (singleMatch) {
    return (
      <>
        {singleMatch[1]}
        {countSingle}
        {singleMatch[3]}
      </>
    );
  }
  return <>{value}</>;
}

const HeroSection = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await joinWaitlist(email);
      setSubmitted(true);
      setEmail("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!submitted && !error) return;

    const timeout = setTimeout(() => {
      setSubmitted(false);
      setError("");
      setEmail("");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [submitted, error]);

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % headlines.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 48 : -48,
      opacity: 0,
      filter: "blur(6px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -48 : 48,
      opacity: 0,
      filter: "blur(6px)",
    }),
  };

  const current = headlines[index];

  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-creo-pink/10 blur-[120px]" />
        <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-creo-teal/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-creo-yellow/10 blur-[100px]" />
      </div>

      <div className="container relative mx-auto  flex flex-col items-center px-4 pt-10 lg:pt-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2"
        >
          <span className="h-2 w-2 rounded-full bg-creo-teal animate-pulse-glow" />
          <span className="font-body text-xs font-medium text-muted-foreground">
            Built on Base — Mainnet Live Coming Q2 2026
          </span>
        </motion.div>

        {/* Headline Slider */}
        <div className="relative h-[160px] xs:h-[180px] sm:h-[200px] md:h-[250px] lg:h-[280px] w-full max-w-4xl flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.h1
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                y: { type: "spring", stiffness: 260, damping: 28 },
                opacity: { duration: 0.35 },
                filter: { duration: 0.35 },
              }}
              className="absolute w-full text-center font-display text-[1.75rem] leading-snug sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight px-4"
            >
              {current.top}{" "}
              <span className="text-gradient-hero">{current.highlight}</span>{" "}
              {current.connector}{" "}
              <span className="text-creo-yellow">{current.accent}</span>
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2 mt-4 mb-4"
        >
          {/* {headlines.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={`transition-all duration-300 rounded-full ${
                i === index
                  ? "w-6 h-2 bg-creo-pink"
                  : "w-2 h-2 bg-muted-foreground/40 hover:bg-muted-foreground/70"
              }`}
              aria-label={`Go to headline ${i + 1}`}
            />
          ))} */}
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 max-w-2xl text-center font-body text-sm text-muted-foreground sm:text-base md:text-xl px-2"
        >
          Tokenize your future earnings. Get funded instantly. Investors earn
          real yield backed by verifiable creator revenue — not speculation.
        </motion.p>

        {/* CTA — Waitlist email capture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 w-full max-w-md flex flex-col items-center gap-3"
        >
          {submitted ? (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted px-6 py-4 text-center">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-creo-teal" />
              <p className="font-body text-sm text-foreground">
                Welcome! You&apos;re on the list!
              </p>
            </div>
          ) : (
            <>
              <form
                onSubmit={handleWaitlistSubmit}
                className="flex w-full items-center rounded-full border border-border bg-muted p-1.5 pl-5"
              >
                <Mail className="mr-3 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={loading}
                  className="ml-2 rounded-full bg-gradient-hero px-5 py-2 font-display text-sm font-semibold text-primary-foreground shadow-glow-pink hover:opacity-90 disabled:opacity-60 flex-shrink-0"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Join Waitlist
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
          {error && (
            <p className="font-body text-xs text-destructive">{error}</p>
          )}
        </motion.div>

        {/* Floating Characters */}
        <div className="relative mt-16 flex w-full max-w-5xl items-end justify-center gap-4 md:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="animate-float"
          >
            <img
              src={heroCreator}
              alt="Web3 Creator character on skateboard"
              className="w-36 md:w-52 lg:w-60 drop-shadow-2xl"
            />
            <p className="mt-2 text-center font-display text-xs font-semibold text-creo-pink">
              CREATOR
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="animate-float-slow"
          >
            <img
              src={heroInvestor}
              alt="Web3 Investor character with coins"
              className="w-36 md:w-52 lg:w-60 drop-shadow-2xl"
            />
            <p className="mt-2 text-center font-display text-xs font-semibold text-creo-teal">
              INVESTOR
            </p>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-12 mb-8 flex flex-wrap items-center justify-center gap-8 md:gap-16"
        >
          {[
            { value: "$500B+", label: "Creator Economy" },
            { value: "12-13%", label: "Projected Yield APY" },
            { value: "3-5%", label: "Platform Fee" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl font-bold text-foreground md:text-3xl">
                <AnimatedStat value={stat.value} inView={statsInView} />
              </div>
              <div className="font-body text-xs text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
