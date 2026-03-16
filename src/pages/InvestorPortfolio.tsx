import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Coins, Wallet, ArrowUpRight, Clock } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";

const portfolioStats = [
  { label: "Total Invested", value: "$2,500", icon: DollarSign, color: "text-creo-pink", bg: "bg-creo-pink/10" },
  { label: "Claimable Now", value: "$148.50", icon: Wallet, color: "text-creo-teal", bg: "bg-creo-teal/10" },
  { label: "Total Earned", value: "$412.30", icon: TrendingUp, color: "text-creo-yellow", bg: "bg-creo-yellow/10" },
  { label: "Avg. Yield", value: "12.8%", icon: Coins, color: "text-creo-pink", bg: "bg-creo-pink/10" },
];

const holdings = [
  {
    creator: "Rahul Mehta",
    avatar: "RM",
    category: "DeFi Educator",
    invested: "$500",
    revenueTokens: "500 RST",
    creatorTokens: "500 $RAHUL",
    claimable: "$58.20",
    totalEarned: "$178.50",
    yield: "12.3%",
    remaining: "4 months",
    status: "Active",
  },
  {
    creator: "Sarah Chen",
    avatar: "SC",
    category: "Crypto Newsletter",
    invested: "$1,000",
    revenueTokens: "1,000 RST",
    creatorTokens: "1,000 $SARAH",
    claimable: "$72.80",
    totalEarned: "$145.60",
    yield: "11.8%",
    remaining: "5 months",
    status: "Active",
  },
  {
    creator: "Alex Kim",
    avatar: "AK",
    category: "Solidity Instructor",
    invested: "$1,000",
    revenueTokens: "1,000 RST",
    creatorTokens: "1,000 $ALEX",
    claimable: "$17.50",
    totalEarned: "$88.20",
    yield: "10.5%",
    remaining: "8 months",
    status: "Active",
  },
];

const claimHistory = [
  { date: "Mar 1, 2026", amount: "$125.40", creator: "Multiple", txHash: "0x1a2b...3c4d" },
  { date: "Feb 1, 2026", amount: "$118.90", creator: "Multiple", txHash: "0x5e6f...7g8h" },
  { date: "Jan 1, 2026", amount: "$98.50", creator: "Rahul Mehta", txHash: "0x9i0j...1k2l" },
];

const InvestorPortfolio = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar type="investor" />

      <main className="flex-1 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Portfolio</h1>
              <p className="font-body text-muted-foreground mt-1">Your revenue share and creator token holdings.</p>
            </div>
            <Button className="bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90">
              <Wallet className="h-4 w-4 mr-2" />
              Claim All — $148.50
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {portfolioStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg} mb-3`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{stat.label}</p>
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
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">Active Holdings</h2>
            <div className="space-y-4">
              {holdings.map((h) => (
                <div key={h.creator} className="rounded-lg border border-border p-4 hover:border-creo-pink/30 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Creator Info */}
                    <div className="flex items-center gap-3 lg:w-48">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-creo-pink/10">
                        <span className="font-display text-xs font-bold text-creo-pink">{h.avatar}</span>
                      </div>
                      <div>
                        <p className="font-display text-sm font-semibold text-foreground">{h.creator}</p>
                        <p className="font-body text-xs text-muted-foreground">{h.category}</p>
                      </div>
                    </div>

                    {/* Token Holdings */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                      <div>
                        <p className="font-body text-xs text-muted-foreground">Invested</p>
                        <p className="font-display text-sm font-bold text-foreground">{h.invested}</p>
                      </div>
                      <div>
                        <p className="font-body text-xs text-muted-foreground">Revenue Tokens</p>
                        <p className="font-display text-sm font-bold text-foreground">{h.revenueTokens}</p>
                      </div>
                      <div>
                        <p className="font-body text-xs text-muted-foreground">Creator Tokens</p>
                        <p className="font-display text-sm font-bold text-creo-teal">{h.creatorTokens}</p>
                      </div>
                      <div>
                        <p className="font-body text-xs text-muted-foreground">Claimable</p>
                        <p className="font-display text-sm font-bold text-creo-yellow">{h.claimable}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="font-body text-xs">{h.remaining}</span>
                      </div>
                      <Button size="sm" variant="outline" className="border-creo-teal/30 text-creo-teal hover:bg-creo-teal/10">
                        <span className="font-body text-xs">Claim</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Claim History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">Claim History</h2>
            <div className="overflow-x-auto">
              <table className="w-full font-body text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 px-2 text-left text-muted-foreground font-medium">Date</th>
                    <th className="py-3 px-2 text-right text-muted-foreground font-medium">Amount</th>
                    <th className="py-3 px-2 text-left text-muted-foreground font-medium">Creator</th>
                    <th className="py-3 px-2 text-right text-muted-foreground font-medium">Tx Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {claimHistory.map((c) => (
                    <tr key={c.txHash} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-2 text-foreground">{c.date}</td>
                      <td className="py-3 px-2 text-right font-medium text-creo-teal">{c.amount}</td>
                      <td className="py-3 px-2 text-muted-foreground">{c.creator}</td>
                      <td className="py-3 px-2 text-right">
                        <a href="#" className="text-creo-pink hover:underline flex items-center justify-end gap-1">
                          {c.txHash}
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default InvestorPortfolio;
