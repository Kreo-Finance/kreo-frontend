import { motion } from "framer-motion";
import { Wallet, TrendingUp, Clock, ArrowUpRight, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";

const earningsByCreator = [
  { creator: "Rahul Mehta", avatar: "RM", claimable: "$58.20", totalEarned: "$178.50", lastSettlement: "Feb 28, 2026", nextSettlement: "Mar 29, 2026" },
  { creator: "Sarah Chen", avatar: "SC", claimable: "$72.80", totalEarned: "$145.60", lastSettlement: "Feb 28, 2026", nextSettlement: "Mar 29, 2026" },
  { creator: "Alex Kim", avatar: "AK", claimable: "$17.50", totalEarned: "$88.20", lastSettlement: "Feb 28, 2026", nextSettlement: "Mar 29, 2026" },
];

const InvestorEarnings = () => {
  const [autoClaim, setAutoClaim] = useState(false);
  const totalClaimable = earningsByCreator.reduce((sum, e) => sum + parseFloat(e.claimable.replace("$", "")), 0);

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar type="investor" />

      <main className="flex-1 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Earnings</h1>
              <p className="font-body text-muted-foreground mt-1">Claim your USDC distributions from creator settlements.</p>
            </div>
            <Button className="bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90">
              <Wallet className="h-4 w-4 mr-2" />
              Claim All — ${totalClaimable.toFixed(2)}
            </Button>
          </div>

          {/* Auto-claim toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-5 mb-8 flex items-center justify-between"
          >
            <div>
              <p className="font-display text-sm font-semibold text-foreground">Auto-Claim</p>
              <p className="font-body text-xs text-muted-foreground">
                Automatically claim earnings weekly via trusted executor. No manual action needed.
              </p>
            </div>
            <button
              onClick={() => setAutoClaim(!autoClaim)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {autoClaim ? (
                <ToggleRight className="h-8 w-8 text-creo-teal" />
              ) : (
                <ToggleLeft className="h-8 w-8" />
              )}
            </button>
          </motion.div>

          {/* Earnings per creator */}
          <div className="space-y-4">
            {earningsByCreator.map((e, i) => (
              <motion.div
                key={e.creator}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 sm:w-48">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-creo-pink/10">
                      <span className="font-display text-xs font-bold text-creo-pink">{e.avatar}</span>
                    </div>
                    <p className="font-display text-sm font-semibold text-foreground">{e.creator}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                    <div>
                      <p className="font-body text-xs text-muted-foreground">Claimable</p>
                      <p className="font-display text-lg font-bold text-creo-yellow">{e.claimable}</p>
                    </div>
                    <div>
                      <p className="font-body text-xs text-muted-foreground">Total Earned</p>
                      <p className="font-display text-lg font-bold text-creo-teal">{e.totalEarned}</p>
                    </div>
                    <div>
                      <p className="font-body text-xs text-muted-foreground">Last Settlement</p>
                      <p className="font-body text-sm text-foreground">{e.lastSettlement}</p>
                    </div>
                    <div>
                      <p className="font-body text-xs text-muted-foreground">Next Settlement</p>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <p className="font-body text-sm text-foreground">{e.nextSettlement}</p>
                      </div>
                    </div>
                  </div>

                  <Button size="sm" variant="outline" className="border-creo-teal/30 text-creo-teal hover:bg-creo-teal/10 shrink-0">
                    Claim {e.claimable}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvestorEarnings;
