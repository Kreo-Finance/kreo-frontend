import { useState, useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Search,
  Star,
  Shield,
  ChevronDown,
  User,
  Users,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import CreoScoreBadge from "@/components/ui/CreoScoreBadge";
import { Link } from "react-router-dom";

type TierNumber = 0 | 1 | 2 | 3;

const TIER_MAP: Record<string, TierNumber> = {
  Newcomer: 0,
  Established: 1,
  Trusted: 2,
  Elite: 3,
};

const creators = [
  {
    id: 1,
    name: "Rahul Mehta",
    category: "DeFi Educator",
    subscribers: "80K",
    monthlyEarnings: "$6,000",
    revenueShare: "40%",
    duration: "6 months",
    target: "$12,000",
    raised: "$12,000",
    progress: 100,
    yieldEstimate: "12.3%",
    riskRating: "Green",
    creoScore: 185,
    tier: "Established",
    socialProofScore: 72,
    bondAmount: "$600",
    investors: 47,
    avatar: "RM",
    color: "creo-pink",
    status: "Funded",
  },
  {
    id: 2,
    name: "Sarah Chen",
    category: "Crypto Newsletter",
    subscribers: "25K",
    monthlyEarnings: "$4,500",
    revenueShare: "35%",
    duration: "6 months",
    target: "$8,500",
    raised: "$6,200",
    progress: 73,
    yieldEstimate: "11.8%",
    riskRating: "Green",
    creoScore: 120,
    tier: "Established",
    socialProofScore: 55,
    bondAmount: "$425",
    investors: 31,
    avatar: "SC",
    color: "creo-teal",
    status: "Active",
  },
  {
    id: 3,
    name: "Alex Kim",
    category: "Solidity Instructor",
    subscribers: "45K",
    monthlyEarnings: "$8,200",
    revenueShare: "30%",
    duration: "9 months",
    target: "$25,000",
    raised: "$18,500",
    progress: 74,
    yieldEstimate: "10.5%",
    riskRating: "Green",
    creoScore: 310,
    tier: "Trusted",
    socialProofScore: 88,
    bondAmount: "$1,250",
    investors: 62,
    avatar: "AK",
    color: "creo-yellow",
    status: "Active",
  },
  {
    id: 4,
    name: "Marcus Johnson",
    category: "Web3 Podcast",
    subscribers: "35K",
    monthlyEarnings: "$5,500",
    revenueShare: "45%",
    duration: "6 months",
    target: "$15,000",
    raised: "$4,800",
    progress: 32,
    yieldEstimate: "13.1%",
    riskRating: "Yellow",
    creoScore: 55,
    tier: "Newcomer",
    socialProofScore: 30,
    bondAmount: "$750",
    investors: 18,
    avatar: "MJ",
    color: "creo-pink",
    status: "Active",
  },
  {
    id: 5,
    name: "Lisa Wang",
    category: "DeFi Researcher",
    subscribers: "60K",
    monthlyEarnings: "$7,800",
    revenueShare: "25%",
    duration: "12 months",
    target: "$20,000",
    raised: "$20,000",
    progress: 100,
    yieldEstimate: "9.8%",
    riskRating: "Green",
    creoScore: 450,
    tier: "Trusted",
    socialProofScore: 94,
    bondAmount: "$1,000",
    investors: 85,
    avatar: "LW",
    color: "creo-teal",
    status: "Funded",
  },
  {
    id: 6,
    name: "David Park",
    category: "Blockchain Dev",
    subscribers: "18K",
    monthlyEarnings: "$3,200",
    revenueShare: "50%",
    duration: "6 months",
    target: "$5,000",
    raised: "$1,500",
    progress: 30,
    yieldEstimate: "14.2%",
    riskRating: "Green",
    creoScore: 20,
    tier: "Newcomer",
    socialProofScore: 18,
    bondAmount: "$250",
    investors: 8,
    avatar: "DP",
    color: "creo-yellow",
    status: "Active",
  },
  {
    id: 7,
    name: "Priya Sharma",
    category: "Web3 Strategy",
    subscribers: "120K",
    monthlyEarnings: "$14,500",
    revenueShare: "20%",
    duration: "12 months",
    target: "$40,000",
    raised: "$38,200",
    progress: 96,
    yieldEstimate: "8.9%",
    riskRating: "Green",
    creoScore: 720,
    tier: "Elite",
    socialProofScore: 99,
    bondAmount: "$2,000",
    investors: 142,
    avatar: "PS",
    color: "creo-yellow",
    status: "Active",
  },
  {
    id: 8,
    name: "James Rivera",
    category: "DeFi Protocol Dev",
    subscribers: "95K",
    monthlyEarnings: "$11,200",
    revenueShare: "22%",
    duration: "9 months",
    target: "$35,000",
    raised: "$35,000",
    progress: 100,
    yieldEstimate: "9.4%",
    riskRating: "Green",
    creoScore: 660,
    tier: "Elite",
    socialProofScore: 97,
    bondAmount: "$1,750",
    investors: 118,
    avatar: "JR",
    color: "creo-pink",
    status: "Funded",
  },
];

type SortKey = "top" | "newest" | "highest" | "yield";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "top", label: "Top Creators" },
  { key: "newest", label: "Newest" },
  { key: "highest", label: "Highest Raise" },
  { key: "yield", label: "Best Yield" },
];

const colorMap: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  "creo-pink": {
    bg: "bg-creo-pink/10",
    text: "text-creo-pink",
    border: "border-creo-pink/20",
    accent: "bg-creo-pink",
  },
  "creo-teal": {
    bg: "bg-creo-teal/10",
    text: "text-creo-teal",
    border: "border-creo-teal/20",
    accent: "bg-creo-teal",
  },
  "creo-yellow": {
    bg: "bg-creo-yellow/10",
    text: "text-creo-yellow",
    border: "border-creo-yellow/20",
    accent: "bg-creo-yellow",
  },
};

// ─── Scroll-triggered fade-in (same pattern as Pricing) ──────────────────────
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

const Marketplace = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "funded">("all");
  const [sort, setSort] = useState<SortKey>("top");
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    const base = creators.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === "all" ||
        (filter === "active" && c.status === "Active") ||
        (filter === "funded" && c.status === "Funded");
      return matchSearch && matchFilter;
    });

    return [...base].sort((a, b) => {
      if (sort === "top") {
        const tA = TIER_MAP[a.tier] ?? 0;
        const tB = TIER_MAP[b.tier] ?? 0;
        if (tB !== tA) return tB - tA;
        if (b.socialProofScore !== a.socialProofScore)
          return b.socialProofScore - a.socialProofScore;
        return a.id - b.id;
      }
      if (sort === "newest") return b.id - a.id;
      if (sort === "highest") {
        const parseAmt = (s: string) =>
          parseFloat(s.replace(/[$,K]/g, "")) *
          (s.includes("K") ? 1000 : 1);
        return parseAmt(b.target) - parseAmt(a.target);
      }
      if (sort === "yield") {
        return parseFloat(b.yieldEstimate) - parseFloat(a.yieldEstimate);
      }
      return 0;
    });
  }, [search, filter, sort]);

  const eliteCreators =
    sort === "top" ? filtered.filter((c) => c.tier === "Elite") : [];
  const restCreators =
    sort === "top" ? filtered.filter((c) => c.tier !== "Elite") : filtered;

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.key === sort)?.label ?? "Sort";

  // Marketplace stats
  const totalInvestors = creators.reduce((sum, c) => sum + c.investors, 0);
  const activeCount = creators.filter((c) => c.status === "Active").length;
  const fundedCount = creators.filter((c) => c.status === "Funded").length;

  const renderCard = (c: (typeof creators)[0], i: number) => {
    const colors = colorMap[c.color];
    const tierNum = (TIER_MAP[c.tier] ?? 0) as TierNumber;
    return (
      <motion.div
        key={c.id}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl border border-border bg-card overflow-hidden group hover:border-creo-pink/40 transition-all duration-300 hover:shadow-glow-pink flex flex-col"
      >
        {/* Per-creator color accent bar */}
        <div className={`h-[2px] w-full ${colors.accent} opacity-70`} />

        {/* Subtle radial glow behind card */}
        <div
          className="absolute inset-0 opacity-[0.045] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 15% 0%, hsl(var(--${c.color})), transparent 55%)`,
          }}
        />

        <div className="relative p-6 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors.bg} border ${colors.border}`}
              >
                <span
                  className={`font-display text-sm font-bold ${colors.text}`}
                >
                  {c.avatar}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-base font-semibold text-foreground truncate">
                  {c.name}
                </h3>
                <p className="font-body text-xs text-muted-foreground truncate mt-0.5">
                  {c.category} · {c.subscribers} subs
                </p>
              </div>
            </div>
            <div className="ml-2 shrink-0">
              <CreoScoreBadge tier={tierNum} size="sm" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-5 p-3 rounded-xl bg-muted/30 border border-border/50">
            <div>
              <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Yield
              </p>
              <p className="font-display text-sm font-bold text-creo-teal">
                {c.yieldEstimate}
              </p>
            </div>
            <div>
              <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Share
              </p>
              <p className="font-display text-sm font-bold text-foreground">
                {c.revenueShare}
              </p>
            </div>
            <div>
              <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Duration
              </p>
              <p className="font-display text-sm font-bold text-foreground">
                {c.duration}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-5">
            <div className="flex justify-between font-body text-xs mb-2">
              <span className="font-semibold text-foreground">{c.raised} raised</span>
              <span className="text-muted-foreground">
                {c.progress}% of {c.target}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-hero rounded-full transition-all"
                style={{ width: `${c.progress}%` }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-creo-yellow" />
                <span className="font-body text-xs text-muted-foreground font-medium">
                  {c.creoScore}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-creo-teal" />
                <span className="font-body text-xs text-muted-foreground font-medium">
                  {c.bondAmount}
                </span>
              </div>
            </div>
            <Link to={`/creator/${c.id}`}>
              <Button
                size="sm"
                variant="outline"
                className="border-creo-pink/40 text-creo-pink hover:bg-creo-pink hover:text-white hover:border-creo-pink font-body text-xs gap-1.5 transition-all"
              >
                <User className="h-3 w-3" />
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Grid mesh */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--creo-pink)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--creo-pink)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow orb */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-gradient-to-r from-[hsl(var(--creo-pink))] to-[hsl(var(--creo-teal))] opacity-[0.12] blur-[100px] pointer-events-none" />

        <div className="relative container mx-auto px-4 pt-24 pb-16 md:pt-36 md:pb-24 text-center max-w-4xl">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[hsl(var(--creo-pink))/30] bg-[hsl(var(--creo-pink))/8] text-creo-pink text-xs font-semibold tracking-widest uppercase mb-6">
              Marketplace
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>
            <h1
              className="font-display font-bold leading-[0.95] tracking-tight mb-6"
              style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
            >
              Invest in{" "}
              <span className="text-gradient-hero">real creators.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover creators, analyze earnings, and back real revenue
              streams. Every offering is bond-backed, on-chain, and fully
              transparent.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── 2. STATS STRIP ───────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {[
              {
                icon: Users,
                label: "Total Creators",
                value: creators.length,
                color: "text-creo-pink",
              },
              {
                icon: Zap,
                label: "Active Offerings",
                value: activeCount,
                color: "text-creo-teal",
              },
              {
                icon: TrendingUp,
                label: "Fully Funded",
                value: fundedCount,
                color: "text-creo-yellow",
              },
              {
                icon: Star,
                label: "Total Investors",
                value: `${totalInvestors}+`,
                color: "text-creo-pink",
              },
            ].map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.07} className="px-6 py-8 flex flex-col items-center text-center gap-2">
                <stat.icon className={`h-5 w-5 ${stat.color} mb-1`} />
                <p className={`font-display text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="font-body text-xs text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. SEARCH, FILTER & SORT ─────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="flex items-center flex-1 rounded-xl border border-border bg-card px-4 py-3 gap-3 focus-within:border-creo-pink/40 transition-colors">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Search by name or category…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 font-body text-sm text-foreground hover:border-creo-pink/40 transition-colors w-full sm:w-auto"
                >
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">
                    Sort
                  </span>
                  <span className="font-medium">{currentSortLabel}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-muted-foreground transition-transform ml-1 ${sortOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 mt-1 w-48 rounded-xl border border-border bg-card shadow-lg z-10 overflow-hidden">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => {
                          setSort(opt.key);
                          setSortOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 font-body text-sm transition-colors hover:bg-muted ${
                          sort === opt.key
                            ? "text-creo-pink"
                            : "text-foreground"
                        }`}
                      >
                        {opt.label}
                        {sort === opt.key && (
                          <span className="h-1.5 w-1.5 rounded-full bg-creo-pink" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status filters */}
            <div className="flex gap-2">
              {(["all", "active", "funded"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className={
                    filter === f
                      ? "bg-gradient-hero text-primary-foreground rounded-lg"
                      : "rounded-lg border-border hover:border-creo-pink/40"
                  }
                >
                  <span className="font-body text-xs capitalize tracking-wide">
                    {f}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. CREATOR GRID ──────────────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-12 md:py-16">

          {/* Elite section */}
          {sort === "top" && eliteCreators.length >= 2 && (
            <FadeIn className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-creo-yellow/40" />
                <p className="font-body text-xs font-semibold tracking-widest uppercase text-creo-yellow">
                  Elite Creators
                </p>
                <div className="h-px flex-1 bg-creo-yellow/20" />
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
                {eliteCreators.map((c, i) => renderCard(c, i))}
              </div>
              {restCreators.length > 0 && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-8 bg-border" />
                  <p className="font-body text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                    All Creators
                  </p>
                  <div className="h-px flex-1 bg-border" />
                </div>
              )}
            </FadeIn>
          )}

          {/* Main grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(sort === "top" ? restCreators : filtered).map((c, i) =>
              renderCard(c, i + (sort === "top" ? eliteCreators.length : 0))
            )}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <FadeIn className="py-24 text-center">
              <p className="font-body text-muted-foreground text-lg">
                No creators match your search.
              </p>
              <p className="font-body text-xs text-muted-foreground mt-2">
                Try a different name or category.
              </p>
            </FadeIn>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default Marketplace;
