import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  ArrowRight,
  ChevronRight,
  Bookmark,
  TrendingUp,
  Coins,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Navbar from "@/components/Navbar";
import CreoScoreBadge from "@/components/ui/CreoScoreBadge";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { useCreatorProfile } from "@/hooks/useCreatorProfile";
import type { OfferingDisplay } from "@/lib/api/creator";

type TierNumber = 0 | 1 | 2 | 3;

const TIER_NAMES: Record<TierNumber, string> = {
  0: "Newcomer",
  1: "Established",
  2: "Trusted",
  3: "Elite",
};

const TIER_NEXT_START: Record<TierNumber, number | null> = {
  0: 100,
  1: 300,
  2: 600,
  3: null,
};

const TIER_START: Record<TierNumber, number> = { 0: 0, 1: 100, 2: 300, 3: 600 };

const SCORE_TIER_MAP: Record<string, TierNumber> = {
  NEWCOMER: 0,
  ESTABLISHED: 1,
  TRUSTED: 2,
  ELITE: 3,
};

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-creo-teal/10 text-creo-teal",
  FUNDRAISING: "bg-creo-teal/10 text-creo-teal",
  COMPLETED: "bg-muted text-muted-foreground",
  SETTLED: "bg-muted text-muted-foreground",
  PENDING_RELEASE: "bg-creo-yellow/10 text-creo-yellow",
};

function getOfferingId(o: OfferingDisplay): string {
  return String(o.offeringId);
}

// revenueSharePct from API is basis points (5000 = 50%)
function getRevenueShare(o: OfferingDisplay): string {
  return `${(o.revenueSharePct / 100).toFixed(0)}%`;
}

function getDuration(o: OfferingDisplay): string {
  return `${o.durationMonths} month${o.durationMonths !== 1 ? "s" : ""}`;
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="h-6 w-32 bg-muted rounded mb-5" />
        <div className="h-20 w-40 bg-muted rounded mb-5" />
        <div className="flex gap-4">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-4 w-24 bg-muted rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4">
            <div className="h-3 w-20 bg-muted rounded mb-2" />
            <div className="h-7 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="h-5 w-40 bg-muted rounded mb-4" />
        <div className="h-52 bg-muted rounded" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const CreatorProfile = () => {
  const { address: paramAddress } = useParams<{ address: string }>();
  const { address: connectedAddress, isConnected } = useAccount();
  const [offeringsTab, setOfferingsTab] = useState<"active" | "completed">("active");
  const [bookmarked, setBookmarked] = useState(false);

  const { profile, isLoading, isError } = useCreatorProfile(paramAddress);

  const tier = (SCORE_TIER_MAP[profile?.scoreTier ?? ""] ?? 0) as TierNumber;
  const score = profile?.kreoScore ?? 0;

  const displayAddr = profile
    ? `${profile.address.slice(0, 6)}...${profile.address.slice(-4)}`
    : paramAddress
    ? `${paramAddress.slice(0, 6)}...${paramAddress.slice(-4)}`
    : "—";

  const isOwner =
    isConnected &&
    !!profile &&
    connectedAddress?.toLowerCase() === profile.address.toLowerCase();

  // Chart data — earningsChart is an array of { month, amount, aboveAverage } objects
  const earningsHistory = profile?.earningsChart ?? [];
  const avg = profile?.averageMonthlyEarnings ?? 0;

  const chartData = earningsHistory.map((pt) => ({
    month: pt.month,
    value: pt.amount,
    aboveAvg: pt.aboveAverage,
  }));

  // Offerings tabs
  const activeOfferings = profile?.activeOfferings ?? [];
  const completedOfferings = profile?.completedOfferings ?? [];
  const shownOfferings = offeringsTab === "active" ? activeOfferings : completedOfferings;

  // Progress to next tier
  const nextTierStart = TIER_NEXT_START[tier];
  const tierStart = TIER_START[tier];
  const tierEnd = nextTierStart !== null ? nextTierStart - 1 : score;
  const progressPct =
    tier === 3
      ? 100
      : Math.min(
          100,
          Math.round(((score - tierStart) / (tierEnd - tierStart + 1)) * 100)
        );
  const pointsToNext = nextTierStart !== null ? nextTierStart - score : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back */}
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 font-body text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Marketplace
          </Link>

          {/* Loading */}
          {isLoading && <ProfileSkeleton />}

          {/* Error */}
          {isError && !isLoading && (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="font-display text-lg font-semibold text-foreground mb-2">
                Failed to load profile
              </p>
              <p className="font-body text-sm text-muted-foreground mb-6">
                Could not fetch data for{" "}
                <span className="font-medium text-foreground">{displayAddr}</span>.
              </p>
              <Link to="/marketplace">
                <Button variant="outline" size="sm" className="border-border gap-1.5">
                  Browse Marketplace
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          )}

          {/* Loaded */}
          {!isLoading && !isError && profile && (
            <>
              {/* ── SECTION 1: Creator Header ─────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border bg-card p-6 mb-6"
              >
                {/* Top row: address + bookmark */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-display text-xl font-semibold text-muted-foreground">
                      {displayAddr}
                    </h1>
                  </div>
                  <button
                    onClick={() => setBookmarked((v) => !v)}
                    aria-label={bookmarked ? "Remove bookmark" : "Bookmark this creator"}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all ${
                      bookmarked
                        ? "border-creo-yellow/60 bg-creo-yellow/10 text-creo-yellow"
                        : "border-border bg-muted/40 text-muted-foreground hover:border-creo-yellow/40 hover:text-creo-yellow"
                    }`}
                  >
                    <Bookmark
                      className="h-4 w-4"
                      fill={bookmarked ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                {/* Score + tier — hero section */}
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-5 pb-5 border-b border-border">
                  <div className="flex items-end gap-4">
                    {/* Big score number */}
                    <div className="flex flex-col">
                      <span className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                        CreoScore
                      </span>
                      <span className="font-display text-7xl font-bold leading-none text-foreground">
                        {score}
                      </span>
                    </div>

                    {/* Tier badge + name */}
                    <div className="flex flex-col gap-2 mb-1">
                      <CreoScoreBadge tier={tier} size="md" />
                      <span className="font-display text-lg font-semibold text-foreground">
                        {TIER_NAMES[tier]}
                      </span>
                      <span className="font-body text-xs text-muted-foreground">
                        {profile.scoreTierLabel}
                      </span>
                    </div>
                  </div>

                  {/* Invest button */}
                  <div className="sm:ml-auto">
                    <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-body font-semibold gap-2 h-11 px-6">
                      <Coins className="h-4 w-4" />
                      Invest Now
                    </Button>
                    <p className="font-body text-xs text-muted-foreground mt-1.5 text-center">
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      {profile.avgInvestorROI}% avg ROI
                    </p>
                  </div>
                </div>

                {/* Variance / floor info */}
                <div className="flex flex-wrap gap-4 text-xs font-body text-muted-foreground">
                  <span>
                    Floor:{" "}
                    <span className="text-foreground font-medium">
                      {profile.conservativeFloor}
                    </span>
                  </span>
                  <span>
                    Variance:{" "}
                    <span className="text-foreground font-medium">
                      {profile.varianceTier}
                    </span>
                  </span>
                  <span>
                    Months recorded:{" "}
                    <span className="text-foreground font-medium">
                      {profile.monthsRecorded}
                    </span>
                  </span>
                  {profile.isPaused && (
                    <span className="text-creo-yellow font-medium">⚠ Paused</span>
                  )}
                </div>
              </motion.div>

              {/* ── SECTION 2: Stats Row ──────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
              >
                {[
                  {
                    label: "Offerings Completed",
                    value: profile.offeringsCompleted,
                  },
                  { label: "Total Raised", value: profile.totalRaised },
                  {
                    label: "Settlement Rate",
                    value: `${profile.settlementRate}%`,
                  },
                  { label: "Avg Investor ROI", value: `${profile.avgInvestorROI}%` },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <p className="font-body text-xs text-muted-foreground mb-1">
                      {label}
                    </p>
                    <p className="font-display text-2xl font-bold text-foreground">
                      {value}
                    </p>
                  </div>
                ))}
              </motion.div>

              {/* ── SECTION 3: Revenue Trend Chart ───────────────────────── */}
              {chartData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl border border-border bg-card p-6 mb-6"
                >
                  <h2 className="font-display text-lg font-semibold text-foreground mb-1">
                    Verified Monthly Earnings
                  </h2>
                  <p className="font-body text-xs text-muted-foreground mb-5">
                    Last {chartData.length} month{chartData.length !== 1 ? "s" : ""}
                  </p>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="month"
                          tick={{
                            fontSize: 11,
                            fontFamily: "DM Sans",
                            fill: "hsl(var(--muted-foreground))",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                          tick={{
                            fontSize: 11,
                            fontFamily: "DM Sans",
                            fill: "hsl(var(--muted-foreground))",
                          }}
                          axisLine={false}
                          tickLine={false}
                          width={40}
                        />
                        <Tooltip
                          formatter={(v: number) =>
                            [`$${v.toLocaleString()}`, "Earnings"]
                          }
                          contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            fontFamily: "DM Sans",
                            fontSize: 12,
                            color: "hsl(var(--foreground))",
                          }}
                          cursor={{ fill: "hsl(var(--muted))" }}
                        />
                        <ReferenceLine
                          y={avg}
                          stroke="hsl(var(--muted-foreground))"
                          strokeDasharray="4 4"
                          strokeWidth={1.5}
                          label={{
                            value: "avg",
                            position: "insideTopRight",
                            fontSize: 10,
                            fontFamily: "DM Sans",
                            fill: "hsl(var(--muted-foreground))",
                          }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, i) => (
                            <Cell
                              key={`cell-${i}`}
                              fill={
                                entry.aboveAvg
                                  ? "hsl(var(--creo-teal))"
                                  : "hsl(var(--primary))"
                              }
                              fillOpacity={0.85}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-sm bg-creo-teal opacity-85" />
                      <span className="font-body text-xs text-muted-foreground">
                        Above average
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-sm bg-primary opacity-85" />
                      <span className="font-body text-xs text-muted-foreground">
                        Standard month
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── SECTION 4: Offerings ─────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl border border-border bg-card p-6 mb-6"
              >
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                  Offerings
                </h2>

                {/* Tab toggle */}
                <div className="flex gap-1 mb-5 rounded-lg bg-muted p-1 w-fit">
                  {(["active", "completed"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setOfferingsTab(tab)}
                      className={`px-4 py-1.5 rounded-md font-body text-sm font-medium transition-colors capitalize ${
                        offeringsTab === tab
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {shownOfferings.length > 0 ? (
                  <div className="space-y-3">
                    {shownOfferings.map((o) => (
                      <div
                        key={getOfferingId(o)}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-border p-4 hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="font-body text-xs text-muted-foreground">
                            #{getOfferingId(o)}
                          </span>
                          <span className="font-body text-sm text-foreground font-medium">
                            {getRevenueShare(o)} share
                          </span>
                          <span className="font-body text-xs text-muted-foreground">
                            {getDuration(o)}
                          </span>
                          <span className="font-display text-sm font-bold text-foreground">
                            {o.totalRaised}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 font-body text-xs font-medium ${
                              STATUS_STYLES[o.status] ?? "bg-muted text-muted-foreground"
                            }`}
                          >
                            {o.status.replace(/_/g, " ")}
                          </span>
                          <Link
                            to="/marketplace"
                            className="flex items-center gap-1 font-body text-xs text-creo-pink hover:underline"
                            aria-label={`View offering #${getOfferingId(o)}`}
                          >
                            View <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="font-body text-sm text-muted-foreground mb-3">
                      No {offeringsTab} offerings.
                    </p>
                    <Link to="/marketplace">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border gap-1"
                      >
                        Browse Marketplace
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                )}
              </motion.div>

              {/* ── SECTION 5: KreoScore Journey (only for owner) ────────── */}
              {isOwner && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-lg font-semibold text-foreground">
                      Your KreoScore Journey
                    </h2>
                    <CreoScoreBadge tier={tier} size="md" />
                  </div>

                  <div className="flex items-end gap-3 mb-4">
                    <span className="font-display text-4xl font-bold text-foreground">
                      {score}
                    </span>
                    <span className="font-body text-sm text-muted-foreground mb-1">
                      {TIER_NAMES[tier]}
                    </span>
                  </div>

                  {tier < 3 ? (
                    <>
                      <div
                        role="progressbar"
                        aria-valuenow={progressPct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`KreoScore progress toward ${TIER_NAMES[(tier + 1) as TierNumber]}`}
                        className="h-2.5 rounded-full bg-muted overflow-hidden mb-2"
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                          className="h-full rounded-full bg-creo-teal"
                        />
                      </div>
                      <p className="font-body text-xs text-muted-foreground mb-4">
                        {pointsToNext} points to{" "}
                        <span className="text-foreground font-medium">
                          {TIER_NAMES[(tier + 1) as TierNumber]}
                        </span>
                      </p>
                    </>
                  ) : (
                    <p className="font-body text-sm text-creo-yellow font-medium mb-4">
                      Maximum tier reached
                    </p>
                  )}

                  <Link to="/creator/dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-creo-pink hover:text-creo-pink hover:bg-creo-pink/10 pl-0"
                    >
                      View full progress in dashboard
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreatorProfile;
