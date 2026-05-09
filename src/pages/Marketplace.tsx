import { useState, useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Search,
  Star,
  Shield,
  ChevronDown,
  ExternalLink,
  Users,
  TrendingUp,
  Zap,
  BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import CreoScoreBadge from "@/components/ui/CreoScoreBadge";
import { useMarketplaceData } from "@/hooks/useMarketplaceData";
import type { MarketplaceListing } from "@/hooks/useMarketplaceData";
import { formatUsdc } from "@/config/contracts";

type SortKey = "top" | "newest" | "highest" | "yield";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "top", label: "Top Creators" },
  { key: "newest", label: "Newest" },
  { key: "highest", label: "Highest Raise" },
  { key: "yield", label: "Best Yield" },
];

const CARD_COLORS = ["creo-pink", "creo-teal", "creo-yellow"] as const;
type CardColor = (typeof CARD_COLORS)[number];

const colorMap: Record<CardColor, { bg: string; text: string; border: string; accent: string }> = {
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

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function getAvatarInitials(addr: string): string {
  return addr.slice(2, 4).toUpperCase();
}

function getCardColor(offeringId: bigint): CardColor {
  return CARD_COLORS[Number(offeringId) % 3];
}

// ─── Scroll-triggered fade-in ──────────────────────────────────────────────
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

// ─── Loading skeleton card ──────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
      <div className="h-[2px] w-full bg-muted" />
      <div className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-28 rounded bg-muted" />
              <div className="h-3 w-20 rounded bg-muted" />
            </div>
          </div>
          <div className="h-6 w-16 rounded-full bg-muted" />
        </div>
        <div className="grid grid-cols-3 gap-2 mb-5 p-3 rounded-xl bg-muted/30">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-1">
              <div className="h-2 w-12 rounded bg-muted" />
              <div className="h-4 w-10 rounded bg-muted" />
            </div>
          ))}
        </div>
        <div className="mb-5 space-y-2">
          <div className="flex justify-between">
            <div className="h-3 w-20 rounded bg-muted" />
            <div className="h-3 w-16 rounded bg-muted" />
          </div>
          <div className="h-1.5 rounded-full bg-muted" />
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex gap-3">
            <div className="h-3 w-10 rounded bg-muted" />
            <div className="h-3 w-12 rounded bg-muted" />
          </div>
          <div className="h-7 w-24 rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}

const Marketplace = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "funded">("all");
  const [sort, setSort] = useState<SortKey>("top");
  const [sortOpen, setSortOpen] = useState(false);

  const { listings, stats, isLoading, isError } = useMarketplaceData();

  const filtered = useMemo(() => {
    const base = listings.filter((l) => {
      const matchSearch =
        search === "" ||
        l.creator.toLowerCase().includes(search.toLowerCase()) ||
        l.statusLabel.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === "all" ||
        (filter === "active" && l.status === 0) ||
        (filter === "funded" && l.status >= 2);
      return matchSearch && matchFilter;
    });

    return [...base].sort((a, b) => {
      if (sort === "top") {
        if (b.scoreTier !== a.scoreTier) return b.scoreTier - a.scoreTier;
        if (b.kreoScore !== a.kreoScore) return b.kreoScore - a.kreoScore;
        return Number(a.offeringId - b.offeringId);
      }
      if (sort === "newest") return Number(b.offeringId - a.offeringId);
      if (sort === "highest") return Number(b.fundraiseTarget - a.fundraiseTarget);
      if (sort === "yield") return b.yieldEstimate - a.yieldEstimate;
      return 0;
    });
  }, [listings, search, filter, sort]);

  const eliteCreators = sort === "top" ? filtered.filter((l) => l.scoreTier === 3) : [];
  const restCreators = sort === "top" ? filtered.filter((l) => l.scoreTier !== 3) : filtered;

  const currentSortLabel = SORT_OPTIONS.find((o) => o.key === sort)?.label ?? "Sort";

  const renderCard = (l: MarketplaceListing, i: number) => {
    const color = getCardColor(l.offeringId);
    const colors = colorMap[color];
    const avatar = getAvatarInitials(l.creator);
    const yieldStr = l.yieldEstimate > 0 ? `${l.yieldEstimate.toFixed(1)}%` : "—";
    const shareStr = `${(Number(l.revenueSharePct) / 100).toFixed(0)}%`;
    const durationStr = `${Number(l.durationMonths)} mo`;
    const raisedStr = formatUsdc(l.totalRaised);
    const targetStr = formatUsdc(l.fundraiseTarget);
    const bondStr = l.bondDeposit > 0n ? formatUsdc(l.bondDeposit) : "—";

    return (
      <motion.div
        key={l.offeringId.toString()}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl border border-border bg-card overflow-hidden group hover:border-creo-pink/40 transition-all duration-300 hover:shadow-glow-pink flex flex-col"
      >
        <div className={`h-[2px] w-full ${colors.accent} opacity-70`} />
        <div
          className="absolute inset-0 opacity-[0.045] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 15% 0%, hsl(var(--${color})), transparent 55%)`,
          }}
        />

        <div className="relative p-6 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors.bg} border ${colors.border}`}
              >
                <span className={`font-display text-sm font-bold ${colors.text}`}>
                  {avatar}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-base font-semibold text-foreground truncate">
                  {truncateAddress(l.creator)}
                </h3>
                <p className="font-body text-xs text-muted-foreground truncate mt-0.5">
                  Offering #{l.offeringId.toString()} · {l.statusLabel}
                </p>
              </div>
            </div>
            <div className="ml-2 shrink-0">
              <CreoScoreBadge tier={l.scoreTier} size="sm" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-5 p-3 rounded-xl bg-muted/30 border border-border/50">
            <div>
              <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Yield
              </p>
              <p className="font-display text-sm font-bold text-creo-teal">{yieldStr}</p>
            </div>
            <div>
              <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Share
              </p>
              <p className="font-display text-sm font-bold text-foreground">{shareStr}</p>
            </div>
            <div>
              <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Duration
              </p>
              <p className="font-display text-sm font-bold text-foreground">{durationStr}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-5">
            <div className="flex justify-between font-body text-xs mb-2">
              <span className="font-semibold text-foreground">{raisedStr} raised</span>
              <span className="text-muted-foreground">
                {l.progress}% of {targetStr}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-gradient-hero rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${l.progress}%` }}
                transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-creo-yellow" />
                <span className="font-body text-xs text-muted-foreground font-medium">
                  {l.kreoScore}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-creo-teal" />
                <span className="font-body text-xs text-muted-foreground font-medium">
                  {bondStr}
                </span>
              </div>
            </div>
            <a
              href={`https://sepolia.basescan.org/address/${l.creator}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                variant="outline"
                className="border-creo-pink/40 text-creo-pink hover:bg-creo-pink hover:text-white hover:border-creo-pink font-body text-xs gap-1.5 transition-all"
              >
                <ExternalLink className="h-3 w-3" />
                Basescan
              </Button>
            </a>
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
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--creo-pink)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--creo-pink)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
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
                label: "Active Creators",
                value: isLoading ? "—" : stats.uniqueCreators,
                color: "text-creo-pink",
              },
              {
                icon: Zap,
                label: "Open Offerings",
                value: isLoading ? "—" : stats.openOfferings,
                color: "text-creo-teal",
              },
              {
                icon: TrendingUp,
                label: "Total Raised",
                value: isLoading ? "—" : formatUsdc(stats.totalRaisedUSDC6),
                color: "text-creo-yellow",
              },
              {
                icon: BarChart3,
                label: "Total Offerings",
                value: isLoading ? "—" : stats.totalOfferings,
                color: "text-creo-pink",
              },
            ].map((stat, i) => (
              <FadeIn
                key={stat.label}
                delay={i * 0.07}
                className="px-6 py-8 flex flex-col items-center text-center gap-2"
              >
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
                  placeholder="Search by address or status…"
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
                    className={`h-3.5 w-3.5 text-muted-foreground transition-transform ml-1 ${
                      sortOpen ? "rotate-180" : ""
                    }`}
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
                          sort === opt.key ? "text-creo-pink" : "text-foreground"
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
                  <span className="font-body text-xs capitalize tracking-wide">{f}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. CREATOR GRID ──────────────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-12 md:py-16">

          {/* Loading skeleton */}
          {isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Error state */}
          {isError && !isLoading && (
            <FadeIn className="py-24 text-center">
              <p className="font-body text-muted-foreground text-lg">
                Failed to load marketplace data.
              </p>
              <p className="font-body text-xs text-muted-foreground mt-2">
                Check your network connection or try again.
              </p>
            </FadeIn>
          )}

          {/* Loaded content */}
          {!isLoading && !isError && (
            <>
              {/* Elite spotlight */}
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
                    {eliteCreators.map((l, i) => renderCard(l, i))}
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
              {filtered.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {(sort === "top" ? restCreators : filtered).map((l, i) =>
                    renderCard(l, i + (sort === "top" ? eliteCreators.length : 0))
                  )}
                </div>
              ) : (
                <FadeIn className="py-24 text-center">
                  <p className="font-body text-muted-foreground text-lg">
                    {listings.length === 0
                      ? "No offerings found on-chain yet."
                      : "No creators match your search."}
                  </p>
                  <p className="font-body text-xs text-muted-foreground mt-2">
                    {listings.length === 0
                      ? "Be the first to create an offering."
                      : "Try a different search or filter."}
                  </p>
                </FadeIn>
              )}
            </>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default Marketplace;
