import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Star, Shield, ArrowUpRight } from "lucide-react";
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
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar type="creator" />

      <main className="flex-1 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="font-body text-muted-foreground mb-8">Your earnings performance and reputation.</p>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Earnings Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-semibold text-foreground">Monthly Earnings</h2>
                <div className="flex items-center gap-1 text-creo-teal">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="font-body text-sm font-medium">+3.4% avg</span>
                </div>
              </div>

              {/* Simple bar chart */}
              <div className="flex items-end gap-3 h-48">
                {monthlyData.map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="font-body text-xs text-muted-foreground">${(d.earnings / 1000).toFixed(1)}k</span>
                    <div
                      className="w-full bg-gradient-hero rounded-t-md transition-all hover:opacity-80"
                      style={{ height: `${(d.earnings / maxEarnings) * 140}px` }}
                    />
                    <span className="font-body text-xs text-muted-foreground">
                      {d.month.split(" ")[0].slice(0, 3)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="font-body text-xs text-muted-foreground">3-Month Avg</p>
                  <p className="font-display text-lg font-bold text-foreground">$5,983</p>
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground">Consistency</p>
                  <p className="font-display text-lg font-bold text-creo-teal">94%</p>
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground">Drop Alert</p>
                  <p className="font-display text-lg font-bold text-creo-teal">None</p>
                </div>
              </div>
            </motion.div>

            {/* CreoScore */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h2 className="font-display text-lg font-semibold text-foreground mb-6">CreoScore</h2>

              {/* Score display */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-4 border-creo-pink/30">
                  <div className="text-center">
                    <p className="font-display text-4xl font-bold text-creo-pink">185</p>
                    <p className="font-body text-xs text-muted-foreground">Established</p>
                  </div>
                </div>
              </div>

              {/* Tier Progress */}
              <div className="space-y-3">
                {scoreTiers.map((t) => (
                  <div key={t.tier} className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${t.current ? "bg-creo-pink" : "bg-muted"}`} />
                    <span className={`font-display text-sm font-medium flex-1 ${t.current ? "text-creo-pink" : "text-muted-foreground"}`}>
                      {t.tier}
                    </span>
                    <span className="font-body text-xs text-muted-foreground">{t.range}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <p className="font-body text-xs text-muted-foreground mb-2">Benefits at current tier:</p>
                <ul className="space-y-1">
                  <li className="font-body text-sm text-muted-foreground flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-creo-teal" />
                    Reduced bond: 4% (was 5%)
                  </li>
                  <li className="font-body text-sm text-muted-foreground flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-creo-teal" />
                    Higher fundraise cap
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Revenue Sources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-border bg-card p-6 lg:col-span-2"
            >
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">Revenue Sources</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { source: "Alchemy Sponsorships", amount: "$1,000/mo", verified: true, method: "Stripe Invoice API" },
                  { source: "DeFi Course Sales", amount: "$1,485/mo", verified: true, method: "Stripe API (Gumroad)" },
                  { source: "Substack Newsletter", amount: "$2,000/mo", verified: true, method: "Stripe Subscription" },
                  { source: "Consulting", amount: "$1,515/mo", verified: true, method: "Stripe Invoice API" },
                ].map((s) => (
                  <div key={s.source} className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-body text-xs text-muted-foreground">{s.source}</span>
                      {s.verified && (
                        <span className="flex items-center gap-1 rounded-full bg-creo-teal/10 px-2 py-0.5 font-body text-xs text-creo-teal">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <p className="font-display text-xl font-bold text-foreground">{s.amount}</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">{s.method}</p>
                  </div>
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
