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
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Background Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-creo-pink/5 blur-[120px] animate-pulse-slow" />
        <div className="absolute -right-1/4 -bottom-1/4 h-[600px] w-[600px] rounded-full bg-creo-teal/5 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <DashboardSidebar type="investor" />

      <main className="flex-1 pt-20 relative z-10">
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12"
          >
            <div>
              <h1 className="font-display text-4xl font-bold text-foreground tracking-tight">Portfolio</h1>
              <p className="font-body text-muted-foreground mt-2 text-lg">Your revenue share and creator token holdings.</p>
            </div>
            <Button className="bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-glow-pink h-11 px-6 rounded-xl">
              <Wallet className="h-4 w-4 mr-2" />
              Claim All — $148.50
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            {portfolioStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 transition-all hover:border-white/20 hover:neon-glow-pink group"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="font-display text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
                <p className="font-body text-sm text-muted-foreground mt-1 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Holdings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-8 mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-xl font-bold text-foreground">Active Holdings</h2>
              <Button variant="ghost" size="sm" className="text-creo-pink hover:text-creo-pink hover:bg-creo-pink/10 font-medium">Explore More</Button>
            </div>
            <div className="space-y-6">
              {holdings.map((h, idx) => (
                <motion.div 
                  key={h.creator} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:border-white/10 hover:bg-white/[0.04] transition-all group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Creator Info */}
                    <div className="flex items-center gap-4 lg:w-56 shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-creo-pink/10 ring-4 ring-creo-pink/5">
                        <span className="font-display text-sm font-bold text-creo-pink">{h.avatar}</span>
                      </div>
                      <div>
                        <p className="font-display text-base font-bold text-foreground group-hover:text-creo-pink transition-colors">{h.creator}</p>
                        <p className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wider">{h.category}</p>
                      </div>
                    </div>

                    {/* Token Holdings */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 flex-1">
                      <div className="space-y-1">
                        <p className="font-body text-xs font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Invested</p>
                        <p className="font-display text-base font-bold text-foreground">{h.invested}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-body text-xs font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Revenue Tokens</p>
                        <p className="font-display text-base font-bold text-foreground">{h.revenueTokens}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-body text-xs font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Creator Tokens</p>
                        <p className="font-display text-base font-bold text-creo-teal">{h.creatorTokens}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-body text-xs font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Claimable</p>
                        <p className="font-display text-base font-bold text-creo-yellow bg-creo-yellow/10 px-2 py-0.5 rounded-md inline-block">{h.claimable}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-1.5 text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="font-body text-xs font-bold">{h.remaining}</span>
                      </div>
                      <Button size="sm" className="bg-creo-teal text-creo-dark hover:bg-creo-teal/90 font-bold px-5 rounded-xl h-9">
                        Claim
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Claim History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-xl font-bold text-foreground">Claim History</h2>
              <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 font-medium">View Transaction Logs</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full font-body text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="py-4 px-3 text-left text-muted-foreground font-bold uppercase tracking-wider text-xs">Date</th>
                    <th className="py-4 px-3 text-right text-muted-foreground font-bold uppercase tracking-wider text-xs">Amount</th>
                    <th className="py-4 px-3 text-left text-muted-foreground font-bold uppercase tracking-wider text-xs">Creator</th>
                    <th className="py-4 px-3 text-right text-muted-foreground font-bold uppercase tracking-wider text-xs">Tx Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {claimHistory.map((c, idx) => (
                    <motion.tr 
                      key={c.txHash} 
                      className="hover:bg-white/[0.02] transition-all group"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + idx * 0.05 }}
                    >
                      <td className="py-5 px-3 text-foreground font-medium">{c.date}</td>
                      <td className="py-5 px-3 text-right font-bold text-creo-teal">{c.amount}</td>
                      <td className="py-5 px-3 text-muted-foreground font-semibold">{c.creator}</td>
                      <td className="py-5 px-3 text-right">
                        <a href="#" className="text-creo-pink hover:text-creo-pink/80 transition-colors inline-flex items-center justify-end gap-1 font-mono text-xs">
                          {c.txHash}
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      </td>
                    </motion.tr>
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
