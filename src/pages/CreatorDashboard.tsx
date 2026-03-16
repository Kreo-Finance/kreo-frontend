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
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar type="creator" />

      <main className="flex-1 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Welcome back, Rahul</h1>
              <p className="font-body text-muted-foreground mt-1">Here's how your offerings are performing.</p>
            </div>
            <Link to="/creator/offerings">
              <Button className="bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90">
                <Coins className="h-4 w-4 mr-2" />
                New Offering
              </Button>
            </Link>
          </div>

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
                  <span className={`flex items-center gap-1 font-body text-xs font-medium ${stat.up ? "text-creo-teal" : "text-destructive"}`}>
                    {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.change}
                  </span>
                </div>
                <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Active Offering */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-border bg-card p-6 mb-8"
          >
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">Active Offering</h2>
            {offerings.map((o) => (
              <div key={o.id} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="font-body text-xs text-muted-foreground">Offering</p>
                  <p className="font-display text-sm font-semibold text-foreground">{o.title}</p>
                  <span className="inline-flex items-center gap-1 mt-1 rounded-full bg-creo-teal/10 px-2 py-0.5 font-body text-xs font-medium text-creo-teal">
                    <span className="h-1.5 w-1.5 rounded-full bg-creo-teal" />
                    {o.status}
                  </span>
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground">Raised / Target</p>
                  <p className="font-display text-sm font-bold text-foreground">{o.raised} / {o.target}</p>
                  <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-hero rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground">Revenue Share</p>
                  <p className="font-display text-sm font-bold text-foreground">{o.sharePercent} for {o.duration}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">{o.remaining} remaining</p>
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground">Bond Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="h-4 w-4 text-creo-yellow" />
                    <p className="font-display text-sm font-semibold text-creo-yellow">{o.bondStatus}</p>
                  </div>
                  <p className="font-body text-xs text-muted-foreground mt-1">{o.investors} investors</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Settlement History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">Settlement History</h2>
            <div className="overflow-x-auto">
              <table className="w-full font-body text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 px-2 text-left text-muted-foreground font-medium">Month</th>
                    <th className="py-3 px-2 text-right text-muted-foreground font-medium">Earnings</th>
                    <th className="py-3 px-2 text-right text-muted-foreground font-medium">Distributed</th>
                    <th className="py-3 px-2 text-right text-muted-foreground font-medium">Claimed</th>
                    <th className="py-3 px-2 text-right text-muted-foreground font-medium">Pending</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSettlements.map((s) => (
                    <tr key={s.month} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-2 font-medium text-foreground">{s.month}</td>
                      <td className="py-3 px-2 text-right text-foreground">{s.earnings}</td>
                      <td className="py-3 px-2 text-right text-creo-teal">{s.distributed}</td>
                      <td className="py-3 px-2 text-right text-muted-foreground">{s.claimed}</td>
                      <td className="py-3 px-2 text-right text-creo-yellow">{s.pending}</td>
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

export default CreatorDashboard;
