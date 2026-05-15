import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Coins,
  Wallet,
  Loader2,
  AlertCircle,
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import WalletGate from "@/components/WalletGate";
import { useInvestorPortfolio } from "@/hooks/useInvestorPortfolio";
import type { PortfolioPosition } from "@/lib/api/investor";

function StatusBadge({ status }: { status: string }) {
  const s = status.toUpperCase();
  const cls =
    s === "ACTIVE"
      ? "bg-creo-teal/10 text-creo-teal border-creo-teal/20"
      : s === "FUNDRAISING"
      ? "bg-creo-pink/10 text-creo-pink border-creo-pink/20"
      : s === "DEFAULTED"
      ? "bg-destructive/10 text-destructive border-destructive/20"
      : "bg-muted/40 text-muted-foreground border-border/40";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider ${cls}`}
    >
      {status}
    </span>
  );
}

function PositionCard({ h }: { h: PortfolioPosition }) {
  const addrShort = `${h.creatorAddress.slice(0, 6)}…${h.creatorAddress.slice(-4)}`;
  const initials = h.creatorAddress.slice(2, 4).toUpperCase();

  return (
    <div className="rounded-lg border border-border p-4 hover:border-creo-pink/30 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Creator info */}
        <div className="flex items-center gap-3 lg:w-52">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-creo-pink/10">
            <span className="font-display text-xs font-bold text-creo-pink">
              {initials}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-display text-sm font-semibold text-foreground truncate">
              {addrShort}
            </p>
            <p className="font-body text-xs text-muted-foreground truncate">
              Offering #{h.offeringId}
            </p>
          </div>
        </div>

        {/* Token holdings */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
          <div>
            <p className="font-body text-xs text-muted-foreground">Invested</p>
            <p className="font-display text-sm font-bold text-foreground">
              {h.investedFormatted}
            </p>
          </div>
          <div>
            <p className="font-body text-xs text-muted-foreground">
              Revenue Tokens
            </p>
            <p className="font-display text-sm font-bold text-foreground">
              {h.rstFormatted}
            </p>
          </div>
          <div>
            <p className="font-body text-xs text-muted-foreground">
              Creator Tokens
            </p>
            <p className="font-display text-sm font-bold text-creo-teal">
              {h.creatorTokenAmount}
            </p>
          </div>
          <div>
            <p className="font-body text-xs text-muted-foreground">Claimable</p>
            <p className="font-display text-sm font-bold text-creo-yellow">
              {h.claimableFormatted}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <StatusBadge status={h.status} />
          <span className="font-body text-xs text-muted-foreground">
            {h.durationMonths} mo
          </span>
          <Button
            size="sm"
            variant="outline"
            className="border-creo-teal/30 text-creo-teal hover:bg-creo-teal/10"
          >
            <span className="font-body text-xs">Claim</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

const InvestorPortfolio = () => {
  const { summary, positions, isLoading, isError } = useInvestorPortfolio();

  const statsConfig = [
    {
      label: "Total Invested",
      value: summary.totalInvested,
      icon: DollarSign,
      color: "text-creo-pink",
      bg: "bg-creo-pink/10",
    },
    {
      label: "Total Earned",
      value: summary.totalEarned,
      icon: TrendingUp,
      color: "text-creo-yellow",
      bg: "bg-creo-yellow/10",
    },
    {
      label: "Avg. Yield",
      value: summary.avgYield,
      icon: Coins,
      color: "text-creo-teal",
      bg: "bg-creo-teal/10",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar type="investor" />

      <main className="flex-1 pt-16 lg:pt-0">
        <WalletGate message="Connect your wallet to view your portfolio and holdings.">
          <div className="p-6 lg:p-8 max-w-6xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">
                  Portfolio
                </h1>
                <p className="font-body text-muted-foreground mt-1">
                  Your revenue share and creator token holdings.
                </p>
              </div>
              <Button className="bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90">
                <Wallet className="h-4 w-4 mr-2" />
                Claim All
              </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3 mb-8">
              {statsConfig.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg} mb-3`}
                  >
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  {isLoading ? (
                    <div className="h-8 w-20 rounded bg-muted animate-pulse mb-1" />
                  ) : (
                    <p className="font-display text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  )}
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Holdings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-border bg-card p-6 mb-8"
            >
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Active Holdings
              </h2>

              {isLoading && (
                <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="font-body text-sm">Loading positions…</span>
                </div>
              )}

              {isError && !isLoading && (
                <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                  <p className="font-body text-sm text-destructive">
                    Failed to load portfolio. Check your connection and try again.
                  </p>
                </div>
              )}

              {!isLoading && !isError && positions.length === 0 && (
                <p className="font-body text-sm text-muted-foreground py-8 text-center">
                  No active positions yet. Head to the{" "}
                  <a href="/marketplace" className="text-creo-teal hover:underline">
                    Marketplace
                  </a>{" "}
                  to invest.
                </p>
              )}

              {!isLoading && !isError && positions.length > 0 && (
                <div className="space-y-4">
                  {positions.map((h) => (
                    <PositionCard key={`${h.offeringId}-${h.creatorAddress}`} h={h} />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Claim History — static placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Claim History
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full font-body text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-2 text-left text-muted-foreground font-medium">
                        Date
                      </th>
                      <th className="py-3 px-2 text-right text-muted-foreground font-medium">
                        Amount
                      </th>
                      <th className="py-3 px-2 text-left text-muted-foreground font-medium">
                        Creator
                      </th>
                      <th className="py-3 px-2 text-right text-muted-foreground font-medium">
                        Tx Hash
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center font-body text-sm text-muted-foreground"
                      >
                        Claim history coming soon.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </WalletGate>
      </main>
    </div>
  );
};

export default InvestorPortfolio;
