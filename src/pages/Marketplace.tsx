import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Star, Shield, ArrowRight, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
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

const colorMap: Record<string, { bg: string; text: string }> = {
  "creo-pink": { bg: "bg-creo-pink/10", text: "text-creo-pink" },
  "creo-teal": { bg: "bg-creo-teal/10", text: "text-creo-teal" },
  "creo-yellow": { bg: "bg-creo-yellow/10", text: "text-creo-yellow" },
};

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

  const renderCard = (c: (typeof creators)[0], i: number) => {
    const colors = colorMap[c.color];
    const tierNum = (TIER_MAP[c.tier] ?? 0) as TierNumber;
    return (
      <motion.div
        key={c.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.07 }}
        className="relative rounded-xl border border-border bg-card p-6 transition-all hover:border-creo-pink/30 hover:shadow-glow-pink group"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${colors.bg}`}
            >
              <span className={`font-display text-sm font-bold ${colors.text}`}>
                {c.avatar}
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold text-foreground truncate">
                {c.name}
              </h3>
              <p className="font-body text-xs text-muted-foreground truncate">
                {c.category} · {c.subscribers} subs
              </p>
            </div>
          </div>
          {/* Tier badge replaces old risk pill */}
          <div className="ml-2 shrink-0">
            <CreoScoreBadge tier={tierNum} size="sm" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <p className="font-body text-xs text-muted-foreground">
              Yield Est.
            </p>
            <p className="font-display text-sm font-bold text-creo-teal">
              {c.yieldEstimate}
            </p>
          </div>
          <div>
            <p className="font-body text-xs text-muted-foreground">Share</p>
            <p className="font-display text-sm font-bold text-foreground">
              {c.revenueShare}
            </p>
          </div>
          <div>
            <p className="font-body text-xs text-muted-foreground">Duration</p>
            <p className="font-display text-sm font-bold text-foreground">
              {c.duration}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between font-body text-xs text-muted-foreground mb-1">
            <span>{c.raised} raised</span>
            <span>{c.target} target</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-hero rounded-full transition-all"
              style={{ width: `${c.progress}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-creo-yellow" />
              <span className="font-body text-xs text-muted-foreground">
                {c.creoScore}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-creo-teal" />
              <span className="font-body text-xs text-muted-foreground">
                {c.bondAmount}
              </span>
            </div>
          </div>
          <Link to={`/creator/${c.id}`}>
            <Button
              size="sm"
              variant="outline"
              className="border-creo-pink/50 text-creo-pink hover:bg-creo-pink hover:text-white hover:border-creo-pink font-body text-xs gap-1.5 transition-all"
            >
              <User className="h-3 w-3" />
              View Profile
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-4xl font-bold text-foreground">
              Creator <span className="text-gradient-hero">Marketplace</span>
            </h1>
            <p className="mt-2 font-body text-muted-foreground">
              Discover creators, analyze earnings, and invest in real revenue
              streams.
            </p>
          </motion.div>

          {/* Search, Filters & Sort */}
          <div className="flex flex-col gap-3 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="flex items-center flex-1 rounded-lg border border-border bg-card px-4 py-2.5">
                <Search className="h-4 w-4 text-muted-foreground mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by name, category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 font-body text-sm text-foreground hover:border-creo-pink/40 transition-colors w-full sm:w-auto"
                >
                  <span className="text-muted-foreground text-xs">Sort:</span>
                  <span>{currentSortLabel}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${sortOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 mt-1 w-44 rounded-lg border border-border bg-card shadow-lg z-10">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => {
                          setSort(opt.key);
                          setSortOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 font-body text-sm transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-muted ${
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
                    filter === f ? "bg-gradient-hero text-primary-foreground" : ""
                  }
                >
                  <span className="font-body text-xs capitalize">{f}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Elite section header */}
          {sort === "top" && eliteCreators.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="font-display text-lg font-semibold text-creo-yellow">
                  ⭐ Elite Creators
                </span>
                <div className="h-px flex-1 bg-creo-yellow/20" />
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {eliteCreators.map((c, i) => renderCard(c, i))}
              </div>
              {restCreators.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-display text-sm font-medium text-muted-foreground">
                    All Creators
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              )}
            </motion.div>
          )}

          {/* Main grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(sort === "top" ? restCreators : filtered).map((c, i) =>
              renderCard(c, i + (sort === "top" ? eliteCreators.length : 0))
            )}
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="font-body text-muted-foreground">
                No creators match your search.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Marketplace;
