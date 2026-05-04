import { motion } from "framer-motion";
import {
  TrendingUp, DollarSign, Shield, Star,
  AlertCircle, RefreshCw, Wallet,
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import CreoScorePanel from "@/components/dashboard/CreoScorePanel";
import WalletGate from "@/components/WalletGate";
import { useCreatorVaultData } from "@/hooks/useCreatorVaultData";
import { formatUsdc, formatBps, VARIANCE_TIER_LABELS } from "@/config/contracts";
import { Coins } from "lucide-react";
import { formatUnits } from "viem";

// ── helpers ────────────────────────────────────────────────────────────────

function SkeletonText({ w = "w-20" }: { w?: string }) {
  return <span className={`inline-block h-4 ${w} rounded bg-muted animate-pulse`} />;
}

const TIER_COLORS: Record<string, string> = {
  LOW: "text-creo-teal",
  MEDIUM: "text-creo-yellow",
  HIGH: "text-destructive",
};

// ── component ──────────────────────────────────────────────────────────────

const CreatorDashboard = () => {
  const { address, isConnected } = useAccount();
  const displayName = isConnected && address
    ? `${address.slice(0, 5)}...${address.slice(-4)}`
    : "Guest";

  const vault = useCreatorVaultData(address as `0x${string}` | undefined);

  const tierLabel = vault.varianceTier !== undefined
    ? (VARIANCE_TIER_LABELS[vault.varianceTier] ?? "—")
    : undefined;

  const scoreNum = vault.socialProofScore !== undefined
    ? Number(vault.socialProofScore)
    : 0;

  const stats = [
    {
      label: "Avg Monthly Earnings",
      value: vault.isLoading ? null : formatUsdc(vault.avgMonthlyEarnings),
      sub: vault.isLoading ? null : `${vault.monthsRecorded ?? 0} months recorded`,
      icon: TrendingUp,
      color: "text-creo-teal",
      bg: "bg-creo-teal/10",
    },
    {
      label: "Conservative Floor",
      value: vault.isLoading ? null : formatUsdc(vault.conservativeFloor),
      sub: vault.isLoading ? null : tierLabel ? (
        <span className={`font-semibold ${TIER_COLORS[tierLabel] ?? ""}`}>
          {tierLabel} variance
        </span>
      ) : "—",
      icon: DollarSign,
      color: "text-creo-pink",
      bg: "bg-creo-pink/10",
    },
    {
      label: "Bond Deposit",
      value: vault.isLoading ? null : formatUsdc(vault.bondDeposit),
      sub: vault.isLoading ? null : `Rate: ${formatBps(vault.bondRateBps)}`,
      icon: Shield,
      color: "text-creo-yellow",
      bg: "bg-creo-yellow/10",
    },
    {
      label: "KreoScore",
      value: vault.isLoading ? null : scoreNum > 0 ? String(scoreNum) : "—",
      sub: vault.isLoading ? null : `${vault.offeringCompletions ?? 0} offering${(vault.offeringCompletions ?? 0) !== 1 ? "s" : ""} completed`,
      icon: Star,
      color: "text-creo-pink",
      bg: "bg-creo-pink/10",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar type="creator" />

      <main className="flex-1 pt-16 lg:pt-0">
        <WalletGate message="Connect your wallet to view your creator dashboard, offerings, and earnings.">
          <div className="p-6 lg:p-8 max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">
                  Welcome back, {displayName}
                </h1>
                <p className="font-body text-muted-foreground mt-1">
                  Here's how your offerings are performing.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => vault.refetch()}
                  disabled={vault.isLoading}
                  className="text-muted-foreground hover:text-foreground"
                  title="Refresh on-chain data"
                >
                  <RefreshCw className={`h-4 w-4 ${vault.isLoading ? "animate-spin" : ""}`} />
                </Button>
                <Link to="/creator/offerings">
                  <Button className="bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90">
                    <Coins className="h-4 w-4 mr-2" />
                    New Offering
                  </Button>
                </Link>
              </div>
            </div>

            {/* Error banner */}
            {vault.isError && (
              <div className="mb-6 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-body text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Failed to load on-chain data. Check your network or{" "}
                <button
                  className="underline"
                  onClick={() => vault.refetch()}
                >
                  retry
                </button>.
              </div>
            )}

            {/* Wallet Balances */}
            {(vault.ethBalance || vault.usdcBalance) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex flex-wrap gap-4"
              >
                {vault.ethBalance && (
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="font-body text-xs text-muted-foreground">ETH</span>
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {Number(
                        formatUnits(vault.ethBalance.value, vault.ethBalance.decimals)
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
                {vault.usdcBalance && (
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="font-body text-xs text-muted-foreground">USDC</span>
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {Number(vault.usdcBalance.formatted).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground">
                    {stat.value === null ? <SkeletonText w="w-24" /> : stat.value}
                  </p>
                  <p className="font-body text-xs text-muted-foreground mt-1">{stat.label}</p>
                  {stat.sub !== null && (
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      {stat.sub === null ? <SkeletonText /> : stat.sub}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Earnings Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-border bg-card p-6 mb-8"
            >
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Earnings Overview
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="font-body text-xs text-muted-foreground">Last Verified Month</p>
                  <p className="font-display text-sm font-bold text-foreground mt-1">
                    {vault.isLoading ? <SkeletonText /> : formatUsdc(vault.lastVerifiedEarnings)}
                  </p>
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground">Conservative Monthly</p>
                  <p className="font-display text-sm font-bold text-foreground mt-1">
                    {vault.isLoading ? <SkeletonText /> : formatUsdc(vault.conservativeMonthly)}
                  </p>
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground">Variance Tier</p>
                  <p className={`font-display text-sm font-bold mt-1 ${tierLabel ? TIER_COLORS[tierLabel] : "text-foreground"}`}>
                    {vault.isLoading ? <SkeletonText /> : (tierLabel ?? "—")}
                  </p>
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground">Months on Record</p>
                  <p className="font-display text-sm font-bold text-foreground mt-1">
                    {vault.isLoading
                      ? <SkeletonText w="w-8" />
                      : vault.monthsRecorded !== undefined
                      ? `${vault.monthsRecorded} / 6`
                      : "—"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CreoScore Panel */}
            <CreoScorePanel
              score={scoreNum}
              creatorAddress={isConnected && address ? address : ""}
            />
          </div>
        </WalletGate>
      </main>
    </div>
  );
};

export default CreatorDashboard;
