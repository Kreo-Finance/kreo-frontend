import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Star, Shield, ArrowUpRight, CheckCircle2 } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

const monthlyData = [
  { month: "Sep 2025", earnings: 5200 },
  { month: "Oct 2025", earnings: 5800 },
  { month: "Nov 2025", earnings: 5600 },
  { month: "Dec 2025", earnings: 5950 },
  { month: "Jan 2026", earnings: 6200 },
  { month: "Feb 2026", earnings: 5800 },
];

const maxEarnings = Math.max(...monthlyData.map(d => d.earnings));

const scoreTiers = [
  { tier: "Newcomer", range: "0-99", current: false },
  { tier: "Established", range: "100-299", current: true },
  { tier: "Trusted", range: "300-599", current: false },
  { tier: "Elite", range: "600+", current: false },
];

const CreatorAnalytics = () => {
  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Background Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-1/4 h-[400px] w-[400px] rounded-full bg-creo-teal/5 blur-[100px] animate-pulse-slow" />
        <div className="absolute -right-20 bottom-1/4 h-[500px] w-[500px] rounded-full bg-creo-pink/5 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <DashboardSidebar type="creator" />

      <main className="flex-1 pt-16 relative">
        <div className="p-6 lg:p-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground mb-2">Analytics</h1>
            <p className="font-body text-muted-foreground font-medium">Detailed performance metrics and reputation tracking.</p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Earnings Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-xl font-bold text-foreground">Revenue Performance</h2>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-creo-teal/10 border border-creo-teal/20 text-creo-teal">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-body text-xs font-bold uppercase tracking-wider">+3.4% GROWTH</span>
                </div>
              </div>
              
              {/* Dynamic bar chart */}
              <div className="flex items-end gap-3 h-52 px-2">
                {monthlyData.map((d, i) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-3 group">
                    <span className="font-body text-[10px] font-bold text-muted-foreground group-hover:text-foreground transition-colors">${(d.earnings / 1000).toFixed(1)}k</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.earnings / maxEarnings) * 140}px` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                      className="w-full bg-gradient-hero rounded-t-lg transition-all hover:opacity-80 relative overflow-hidden group/bar"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/bar:translate-y-0 transition-transform duration-500" />
                    </motion.div>
                    <span className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {d.month.split(" ")[0].slice(0, 3)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
                <div className="space-y-1">
                  <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest">3-Month Avg</p>
                  <p className="font-display text-2xl font-bold text-foreground">$5,983</p>
                </div>
                <div className="space-y-1">
                  <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Consistency</p>
                  <p className="font-display text-2xl font-bold text-creo-teal neon-glow-teal">94%</p>
                </div>
                <div className="space-y-1">
                  <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reputation</p>
                  <p className="font-display text-2xl font-bold text-creo-pink neon-glow-pink">High</p>
                </div>
              </div>
            </motion.div>

            {/* CreoScore */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card rounded-2xl p-8"
            >
              <h2 className="font-display text-xl font-bold text-foreground mb-8">CreoScore Status</h2>
              
              {/* Score display */}
              <div className="flex items-center justify-center mb-10">
                <div className="relative flex h-44 w-44 items-center justify-center">
                  <svg className="absolute h-full w-full rotate-[-90deg]">
                    <circle
                      cx="88"
                      cy="88"
                      r="80"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-white/5"
                    />
                    <motion.circle
                      cx="88"
                      cy="88"
                      r="80"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray="502.4"
                      initial={{ strokeDashoffset: 502.4 }}
                      animate={{ strokeDashoffset: 502.4 * (1 - 185/800) }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="text-creo-pink"
                    />
                  </svg>
                  <div className="text-center relative z-10">
                    <p className="font-display text-5xl font-bold text-creo-pink neon-glow-pink">185</p>
                    <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Established</p>
                  </div>
                </div>
              </div>

              {/* Tier Progress */}
              <div className="space-y-4">
                {scoreTiers.map((t, i) => (
                  <motion.div 
                    key={t.tier} 
                    className="flex items-center gap-4 group"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    <div className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${t.current ? "bg-creo-pink shadow-[0_0_10px_rgba(255,51,153,0.5)] scale-125" : "bg-white/10 group-hover:bg-white/20"}`} />
                    <span className={`font-display text-sm font-bold flex-1 tracking-wide ${t.current ? "text-creo-pink" : "text-muted-foreground group-hover:text-foreground transition-colors"}`}>
                      {t.tier}
                    </span>
                    <span className="font-body text-[11px] font-bold text-muted-foreground tabular-nums">{t.range}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="font-body text-[10px] font-bold text-muted-foreground mb-4 uppercase tracking-widest">Active Tier Benefits:</p>
                <ul className="space-y-2">
                  <li className="font-body text-sm text-foreground flex items-center gap-3 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-creo-teal" />
                    Reduced bond requirement: 4%
                  </li>
                  <li className="font-body text-sm text-foreground flex items-center gap-3 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-creo-teal" />
                    Higher fundraising capacity
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Revenue Sources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-8 lg:col-span-2"
            >
              <h2 className="font-display text-xl font-bold text-foreground mb-6">Verified Revenue Channels</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { source: "Alchemy Sponsorships", amount: "$1,000/mo", verified: true, method: "Stripe Invoice API", color: "text-creo-teal" },
                  { source: "DeFi Course Sales", amount: "$1,485/mo", verified: true, method: "Gumroad API", color: "text-creo-pink" },
                  { source: "Substack Newsletter", amount: "$2,000/mo", verified: true, method: "Stripe Subscription", color: "text-creo-yellow" },
                  { source: "Consulting", amount: "$1,515/mo", verified: true, method: "Stripe Invoice API", color: "text-creo-teal" },
                ].map((s, i) => (
                  <motion.div 
                    key={s.source} 
                    className="rounded-xl bg-white/5 border border-white/10 p-5 hover:bg-white/[0.08] transition-all group/source"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.source}</span>
                      <Shield className="h-3.5 w-3.5 text-creo-teal" />
                    </div>
                    <p className={`font-display text-2xl font-bold mb-1 ${s.color}`}>{s.amount}</p>
                    <p className="font-body text-[11px] font-bold text-muted-foreground mt-1 tracking-tight group-hover/source:text-foreground transition-colors">{s.method}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatorAnalytics;
