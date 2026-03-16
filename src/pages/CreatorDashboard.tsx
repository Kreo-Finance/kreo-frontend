import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Shield, Star, TrendingUp, Coins } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stats = [
  { label: "Total Raised", value: "$12,000", change: "+100%", up: true, icon: DollarSign, color: "text-creo-pink", bg: "bg-creo-pink/10" },
  { label: "Monthly Earnings", value: "$6,200", change: "+3.4%", up: true, icon: TrendingUp, color: "text-creo-teal", bg: "bg-creo-teal/10" },
  { label: "Active Investors", value: "47", change: "+12", up: true, icon: Users, color: "text-creo-yellow", bg: "bg-creo-yellow/10" },
  { label: "CreoScore", value: "185", change: "Established", up: true, icon: Star, color: "text-creo-pink", bg: "bg-creo-pink/10" },
];

const offerings = [
  {
    id: 1,
    title: "DeFi Course Revenue Share",
    status: "Active",
    raised: "$12,000",
    target: "$12,000",
    sharePercent: "40%",
    duration: "6 months",
    remaining: "4 months",
    investors: 47,
    bondStatus: "Locked — $600 USDC",
  },
];

const recentSettlements = [
  { month: "Feb 2026", earnings: "$5,800", distributed: "$2,320", claimed: "$2,180", pending: "$140" },
  { month: "Jan 2026", earnings: "$6,200", distributed: "$2,480", claimed: "$2,480", pending: "$0" },
  { month: "Dec 2025", earnings: "$5,950", distributed: "$2,380", claimed: "$2,380", pending: "$0" },
];

const CreatorDashboard = () => {
  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Background Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-creo-pink/5 blur-[120px] animate-pulse-slow" />
        <div className="absolute -right-1/4 -bottom-1/4 h-[600px] w-[600px] rounded-full bg-creo-teal/5 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <DashboardSidebar type="creator" />
      
      <main className="flex-1 pt-20 relative z-10">
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12"
          >
            <div>
              <h1 className="font-display text-4xl font-bold text-foreground tracking-tight">Welcome back, Rahul</h1>
              <p className="font-body text-muted-foreground mt-2 text-lg">Here&apos;s how your offerings are performing.</p>
            </div>
            <Link to="/creator/offerings">
              <Button className="bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-glow-pink h-11 px-6 rounded-xl">
                <Coins className="h-4 w-4 mr-2" />
                New Offering
              </Button>
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 transition-all hover:border-white/20 hover:neon-glow-pink group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <span className={`flex items-center gap-1 font-body text-xs font-semibold px-2 py-1 rounded-full ${stat.up ? "bg-creo-teal/10 text-creo-teal" : "bg-destructive/10 text-destructive"}`}>
                    {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.change}
                  </span>
                </div>
                <p className="font-display text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
                <p className="font-body text-sm text-muted-foreground mt-1 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Active Offering */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-8 mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-xl font-bold text-foreground">Active Offering</h2>
              <Button variant="ghost" size="sm" className="text-creo-pink hover:text-creo-pink hover:bg-creo-pink/10 font-medium">View All</Button>
            </div>
            {offerings.map((o) => (
              <div key={o.id} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <p className="font-body text-xs font-bold text-muted-foreground uppercase tracking-widest">Offering</p>
                  <p className="font-display text-lg font-bold text-foreground leading-tight">{o.title}</p>
                  <span className="inline-flex items-center gap-1.5 mt-1 rounded-full bg-creo-teal/10 px-3 py-1 font-body text-xs font-bold text-creo-teal border border-creo-teal/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-creo-teal animate-pulse" />
                    {o.status}
                  </span>
                </div>
                <div className="space-y-3">
                  <p className="font-body text-xs font-bold text-muted-foreground uppercase tracking-widest">Raised / Target</p>
                  <p className="font-display text-lg font-bold text-foreground">{o.raised} / {o.target}</p>
                  <div className="h-2.5 rounded-full bg-white/5 border border-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-hero rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-body text-xs font-bold text-muted-foreground uppercase tracking-widest">Revenue Share</p>
                  <p className="font-display text-lg font-bold text-foreground">{o.sharePercent} for {o.duration}</p>
                  <p className="font-body text-sm text-muted-foreground mt-1 font-medium">{o.remaining} remaining</p>
                </div>
                <div className="space-y-2">
                  <p className="font-body text-xs font-bold text-muted-foreground uppercase tracking-widest">Bond Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="h-5 w-5 text-creo-yellow" />
                    <p className="font-display text-lg font-bold text-creo-yellow">{o.bondStatus}</p>
                  </div>
                  <p className="font-body text-sm text-muted-foreground mt-1 font-medium">{o.investors} investors</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Settlement History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-xl font-bold text-foreground">Settlement History</h2>
              <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 font-medium">Export CSV</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full font-body text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="py-4 px-3 text-left text-muted-foreground font-bold uppercase tracking-wider text-xs">Month</th>
                    <th className="py-4 px-3 text-right text-muted-foreground font-bold uppercase tracking-wider text-xs">Earnings</th>
                    <th className="py-4 px-3 text-right text-muted-foreground font-bold uppercase tracking-wider text-xs">Distributed</th>
                    <th className="py-4 px-3 text-right text-muted-foreground font-bold uppercase tracking-wider text-xs">Claimed</th>
                    <th className="py-4 px-3 text-right text-muted-foreground font-bold uppercase tracking-wider text-xs">Pending</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentSettlements.map((s, idx) => (
                    <motion.tr 
                      key={s.month} 
                      className="hover:bg-white/[0.02] transition-colors group"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.05 }}
                    >
                      <td className="py-5 px-3 font-semibold text-foreground group-hover:text-creo-pink transition-colors">{s.month}</td>
                      <td className="py-5 px-3 text-right text-foreground font-medium">{s.earnings}</td>
                      <td className="py-5 px-3 text-right text-creo-teal font-bold">{s.distributed}</td>
                      <td className="py-5 px-3 text-right text-muted-foreground font-medium">{s.claimed}</td>
                      <td className="py-5 px-3 text-right text-creo-yellow font-bold">
                        <span className={s.pending !== "$0" ? "px-2 py-1 rounded bg-creo-yellow/10" : ""}>
                          {s.pending}
                        </span>
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

export default CreatorDashboard;
