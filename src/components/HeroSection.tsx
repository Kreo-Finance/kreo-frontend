import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const HeroSection = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

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
        <div className="absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-creo-pink/20 blur-[140px] animate-pulse-slow" />
        <div className="absolute -right-32 top-1/3 h-[500px] w-[500px] rounded-full bg-creo-teal/20 blur-[140px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-creo-yellow/15 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container relative mx-auto flex flex-col items-center px-4 pt-10 lg:pt-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-2"
        >
          <span className="h-2 w-2 rounded-full bg-creo-teal animate-pulse-glow" />
          <span className="font-body text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Built on Base — Phase 1 Coming Q2 2026
          </span>
        </motion.div>

        {/* Headline Slider */}
        <div className="relative h-[160px] xs:h-[180px] sm:h-[200px] md:h-[250px] lg:h-[280px] w-full max-w-5xl flex items-center justify-center overflow-hidden">
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
              className="absolute w-full text-center font-display text-[2rem] leading-[1.1] sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter px-4"
            >
              {current.top}{" "}
              <span className="text-gradient-hero drop-shadow-[0_0_30px_hsl(var(--creo-pink)/0.3)]">{current.highlight}</span>{" "}
              {current.connector}{" "}
              <span className="text-creo-yellow drop-shadow-[0_0_30px_hsl(var(--creo-yellow)/0.3)]">{current.accent}</span>
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2.5 mt-6 mb-4"
        >
          {headlines.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={`transition-all duration-500 rounded-full ${
                i === index
                  ? "w-8 h-2 bg-gradient-hero"
                  : "w-2 h-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to headline ${i + 1}`}
            />
          ))}
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 max-w-2xl text-center font-body text-base text-muted-foreground/80 sm:text-lg md:text-xl lg:text-2xl px-2 leading-relaxed"
        >
          Tokenize your future earnings. Get funded instantly. Investors earn real yield
          backed by <span className="text-foreground font-medium">verifiable creator revenue</span> — not speculation.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex flex-col items-center gap-6 sm:flex-row"
        >
          <Button
            size="lg"
            className="bg-gradient-hero px-10 py-7 font-display text-lg font-bold text-primary-foreground shadow-glow-pink hover:scale-105 transition-all duration-300 rounded-xl"
          >
            Start Selling
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <div className="flex items-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-3 hover:border-white/20 transition-all focus-within:border-creo-teal/50">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for your Creators ..."
              className="bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground/50 outline-none w-52 sm:w-72 ml-3"
            />
          </div>
        </motion.div>

        {/* Floating Characters */}
        <div className="relative mt-24 flex w-full max-w-5xl items-end justify-center gap-6 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="animate-float"
          >
            <div className="glass-card rounded-3xl p-4 md:p-6 mb-4">
              <img
                src={heroCreator}
                alt="Web3 Creator character on skateboard"
                className="w-32 md:w-48 lg:w-56 drop-shadow-2xl"
              />
              <p className="mt-4 text-center font-display text-xs font-bold tracking-widest text-creo-pink uppercase">
                CREATOR
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="animate-float-slow"
          >
            <div className="glass-card rounded-3xl p-4 md:p-6 mb-4">
              <img
                src={heroInvestor}
                alt="Web3 Investor character with coins"
                className="w-32 md:w-48 lg:w-56 drop-shadow-2xl"
              />
              <p className="mt-4 text-center font-display text-xs font-bold tracking-widest text-creo-teal uppercase">
                INVESTOR
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-16 mb-12 flex flex-wrap items-center justify-center gap-10 md:gap-20 py-8 px-12 glass-card rounded-3xl"
        >
          {[
            { value: "$500B+", label: "Creator Economy", color: "text-creo-pink" },
            { value: "12-13%", label: "Projected Yield APY", color: "text-creo-teal" },
            { value: "3-5%", label: "Platform Fee", color: "text-creo-yellow" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`font-display text-3xl font-bold md:text-4xl ${stat.color}`}>
                {stat.value}
              </div>
              <div className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
