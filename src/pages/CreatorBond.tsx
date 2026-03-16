import { motion } from "framer-motion";
import { Shield, Lock, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";

const bondHistory = [
  { offering: "DeFi Course Revenue Share", amount: "$600", status: "Locked", date: "Oct 15, 2025", returnDate: "Apr 15, 2026" },
];

const CreatorBond = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar type="creator" />

      <main className="flex-1 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Commitment Bond</h1>
          <p className="font-body text-muted-foreground mb-8">
            Your commitment bond shows investors you're serious. Earn it back with a bonus on completion.
          </p>

          {/* Current Bond */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border-2 border-creo-yellow/30 bg-card p-8 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-creo-yellow/10">
                <Shield className="h-7 w-7 text-creo-yellow" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-xl font-semibold text-foreground mb-1">Active Bond</h2>
                <p className="font-body text-sm text-muted-foreground mb-4">DeFi Course Revenue Share</p>

                <div className="grid gap-4 sm:grid-cols-3 mb-6">
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Bond Amount</p>
                    <p className="font-display text-2xl font-bold text-creo-yellow">$600 USDC</p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Lock className="h-4 w-4 text-creo-yellow" />
                      <p className="font-display text-lg font-bold text-creo-yellow">Locked</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Expected Return</p>
                    <p className="font-display text-2xl font-bold text-creo-teal">$612 USDC</p>
                    <p className="font-body text-xs text-creo-teal">+2% completion bonus</p>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between font-body text-xs text-muted-foreground mb-2">
                    <span>2 of 6 months complete</span>
                    <span>4 months remaining</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-creo-yellow rounded-full" style={{ width: "33%" }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* How Bonds Work */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border bg-card p-6 mb-8"
          >
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">How Bonds Work</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-creo-teal shrink-0 mt-0.5" />
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">Success Path</p>
                  <p className="font-body text-xs text-muted-foreground">
                    Complete all settlement months → bond returns with 2% bonus. CreoScore increases.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-creo-yellow shrink-0 mt-0.5" />
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">Default Path</p>
                  <p className="font-body text-xs text-muted-foreground">
                    Earnings drop &gt;40% for 3 consecutive months → bond distributes to investors pro-rata.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bond Tiers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">Bond Requirements by Tier</h2>
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 text-left text-muted-foreground font-medium">Tier</th>
                  <th className="py-3 text-right text-muted-foreground font-medium">Bond %</th>
                  <th className="py-3 text-right text-muted-foreground font-medium">Example ($12K raise)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tier: "Newcomer", pct: "5%", amount: "$600", active: false },
                  { tier: "Established", pct: "4%", amount: "$480", active: true },
                  { tier: "Trusted", pct: "3%", amount: "$360", active: false },
                  { tier: "Elite", pct: "2%", amount: "$240", active: false },
                ].map((t) => (
                  <tr key={t.tier} className={`border-b border-border ${t.active ? "bg-creo-pink/5" : ""}`}>
                    <td className={`py-3 font-medium ${t.active ? "text-creo-pink" : "text-foreground"}`}>
                      {t.tier} {t.active && "← You"}
                    </td>
                    <td className="py-3 text-right text-muted-foreground">{t.pct}</td>
                    <td className="py-3 text-right text-muted-foreground">{t.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CreatorBond;
