import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Youtube,
  Twitter,
  Github,
  ArrowRight,
  ChevronRight,
  Bookmark,
  TrendingUp,
  Coins,
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

type TierNumber = 0 | 1 | 2 | 3;

// ── Mock data keyed by creator id / address ──────────────────────────────────
const MOCK_PROFILES: Record<
  string,
  {
    name: string;
    address: string;
    ensName: string | null;
    score: number;
    tier: TierNumber;
    tagline: string;
    social: { youtube?: string; twitter?: string; github?: string };
    stats: {
      offeringsCompleted: number;
      totalRaised: string;
      settlementRate: number;
      avgROI: number;
    };
    earningsHistory: number[]; // 6-slot ring buffer in USDC dollars
    offerings: {
      id: number;
      revenueShare: string;
      duration: string;
      raised: string;
      status: "ACTIVE" | "COMPLETED" | "PENDING_RELEASE";
    }[];
  }
> = {
  "1": {
    name: "Rahul Mehta",
    address: "0xA1cC000000000000000000000000000000001001",
    ensName: "rahul.eth",
    score: 185,
    tier: 1,
    tagline: "Established Creator on Kreo Finance",
    social: {
      youtube: "RahulMehtaDeFi",
      twitter: "@rahul_defi",
      github: "rahulmehta",
    },
    stats: {
      offeringsCompleted: 1,
      totalRaised: "$12,000",
      settlementRate: 100,
      avgROI: 12.3,
    },
    earningsHistory: [5200, 5600, 5900, 6100, 5800, 6200],
    offerings: [
      {
        id: 1,
        revenueShare: "40%",
        duration: "6 months",
        raised: "$12,000",
        status: "ACTIVE",
      },
    ],
  },
  "3": {
    name: "Alex Kim",
    address: "0xA1cC000000000000000000000000000000001003",
    ensName: null,
    score: 310,
    tier: 2,
    tagline: "Trusted Creator on Kreo Finance",
    social: {
      youtube: "AlexKimSolidity",
      twitter: "@alexkim_web3",
      github: "alexkimdev",
    },
    stats: {
      offeringsCompleted: 2,
      totalRaised: "$25,000",
      settlementRate: 100,
      avgROI: 10.5,
    },
    earningsHistory: [7000, 7400, 8100, 8500, 8200, 8600],
    offerings: [
      {
        id: 2,
        revenueShare: "30%",
        duration: "9 months",
        raised: "$25,000",
        status: "ACTIVE",
      },
      {
        id: 1,
        revenueShare: "28%",
        duration: "6 months",
        raised: "$18,000",
        status: "COMPLETED",
      },
    ],
  },
  "7": {
    name: "Priya Sharma",
    address: "0xA1cC000000000000000000000000000000001007",
    ensName: "priya.eth",
    score: 720,
    tier: 3,
    tagline: "Elite Creator on Kreo Finance",
    social: {
      youtube: "PriyaWeb3",
      twitter: "@priya_web3",
      github: "priyasharma",
    },
    stats: {
      offeringsCompleted: 5,
      totalRaised: "$120,000",
      settlementRate: 98,
      avgROI: 8.9,
    },
    earningsHistory: [11000, 12500, 13200, 14100, 14500, 14800],
    offerings: [
      {
        id: 3,
        revenueShare: "20%",
        duration: "12 months",
        raised: "$40,000",
        status: "ACTIVE",
      },
      {
        id: 2,
        revenueShare: "22%",
        duration: "9 months",
        raised: "$35,000",
        status: "COMPLETED",
      },
      {
        id: 1,
        revenueShare: "25%",
        duration: "6 months",
        raised: "$25,000",
        status: "COMPLETED",
      },
    ],
  },
};

const FALLBACK_PROFILE = MOCK_PROFILES["1"];

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

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-creo-teal/10 text-creo-teal",
  COMPLETED: "bg-muted text-muted-foreground",
  PENDING_RELEASE: "bg-creo-yellow/10 text-creo-yellow",
};

const MONTH_LABELS = ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"];

// ─────────────────────────────────────────────────────────────────────────────

const CreatorProfile = () => {
  const { address: paramAddress } = useParams<{ address: string }>();
  const { address: connectedAddress, isConnected } = useAccount();
  const [offeringsTab, setOfferingsTab] = useState<"active" | "completed">("active");
  const [bookmarked, setBookmarked] = useState(false);

  const profile = MOCK_PROFILES[paramAddress ?? ""] ?? FALLBACK_PROFILE;

  const displayAddr = profile.ensName
    ? profile.ensName
    : `${profile.address.slice(0, 6)}...${profile.address.slice(-4)}`;

  const isOwner =
    isConnected &&
    connectedAddress?.toLowerCase() === profile.address.toLowerCase();

  // Chart data
  const avg =
    profile.earningsHistory.reduce((a, b) => a + b, 0) /
    profile.earningsHistory.length;

  const chartData = profile.earningsHistory.map((val, i) => ({
    month: MONTH_LABELS[i],
    value: val,
    aboveAvg: val >= avg,
  }));

  // Offerings tabs
  const activeOfferings = profile.offerings.filter(
    (o) => o.status === "ACTIVE" || o.status === "PENDING_RELEASE"
  );
  const completedOfferings = profile.offerings.filter(
    (o) => o.status === "COMPLETED"
  );
  const shownOfferings =
    offeringsTab === "active" ? activeOfferings : completedOfferings;

  // Progress to next tier
  const nextTierStart = TIER_NEXT_START[profile.tier];
  const tierStart = TIER_START[profile.tier];
  const tierEnd =
    nextTierStart !== null ? nextTierStart - 1 : profile.score;
  const progressPct =
    profile.tier === 3
      ? 100
      : Math.min(
          100,
          Math.round(
            ((profile.score - tierStart) / (tierEnd - tierStart + 1)) * 100
          )
        );
  const pointsToNext =
    nextTierStart !== null ? nextTierStart - profile.score : 0;

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
                    {profile.score}
                  </span>
                </div>

                {/* Divider + tier name */}
                <div className="flex flex-col gap-2 mb-1">
                  <CreoScoreBadge tier={profile.tier} size="md" />
                  <span className="font-display text-lg font-semibold text-foreground">
                    {TIER_NAMES[profile.tier]}
                  </span>
                  <span className="font-body text-xs text-muted-foreground">
                    {profile.tagline}
                  </span>
                </div>
              </div>

              {/* Invest button — pushed to right on sm+ */}
              <div className="sm:ml-auto">
                <Button
                  className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-body font-semibold gap-2 h-11 px-6"
                >
                  <Coins className="h-4 w-4" />
                  Invest Now
                </Button>
                <p className="font-body text-xs text-muted-foreground mt-1.5 text-center">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  {profile.stats.avgROI}% avg ROI
                </p>
              </div>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap gap-4">
              {profile.social.youtube && (
                <a
                  href={`https://youtube.com/@${profile.social.youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`YouTube: ${profile.social.youtube}`}
                  className="flex items-center gap-1.5 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Youtube className="h-3.5 w-3.5 text-destructive" />
                  {profile.social.youtube}
                </a>
              )}
              {profile.social.twitter && (
                <a
                  href={`https://twitter.com/${profile.social.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Twitter: ${profile.social.twitter}`}
                  className="flex items-center gap-1.5 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Twitter className="h-3.5 w-3.5 text-creo-teal" />
                  {profile.social.twitter}
                </a>
              )}
              {profile.social.github && (
                <a
                  href={`https://github.com/${profile.social.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`GitHub: ${profile.social.github}`}
                  className="flex items-center gap-1.5 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-3.5 w-3.5 text-muted-foreground" />
                  {profile.social.github}
                </a>
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
                value: profile.stats.offeringsCompleted,
              },
              { label: "Total Raised",         value: profile.stats.totalRaised },
              {
                label: "Settlement Rate",
                value: `${profile.stats.settlementRate}%`,
              },
              { label: "Avg Investor ROI",      value: `${profile.stats.avgROI}%` },
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
              Last 6 months
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
                    key={o.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-border p-4 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="font-body text-xs text-muted-foreground">
                        #{o.id}
                      </span>
                      <span className="font-body text-sm text-foreground font-medium">
                        {o.revenueShare} share
                      </span>
                      <span className="font-body text-xs text-muted-foreground">
                        {o.duration}
                      </span>
                      <span className="font-display text-sm font-bold text-foreground">
                        {o.raised}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-body text-xs font-medium ${STATUS_STYLES[o.status]}`}
                      >
                        {o.status.replace("_", " ")}
                      </span>
                      <Link
                        to={`/marketplace`}
                        className="flex items-center gap-1 font-body text-xs text-creo-pink hover:underline"
                        aria-label={`View offering #${o.id}`}
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
                <CreoScoreBadge tier={profile.tier} size="md" />
              </div>

              <div className="flex items-end gap-3 mb-4">
                <span className="font-display text-4xl font-bold text-foreground">
                  {profile.score}
                </span>
                <span className="font-body text-sm text-muted-foreground mb-1">
                  {TIER_NAMES[profile.tier]}
                </span>
              </div>

              {profile.tier < 3 ? (
                <>
                  <div
                    role="progressbar"
                    aria-valuenow={progressPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`KreoScore progress toward ${TIER_NAMES[(profile.tier + 1) as TierNumber]}`}
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
                      {TIER_NAMES[(profile.tier + 1) as TierNumber]}
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
        </div>
      </main>
    </div>
  );
};

export default CreatorProfile;
