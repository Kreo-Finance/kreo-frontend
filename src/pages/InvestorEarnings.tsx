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
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Background Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-1/4 h-[400px] w-[400px] rounded-full bg-creo-teal/5 blur-[100px] animate-pulse-slow" />
        <div className="absolute -right-20 bottom-1/4 h-[500px] w-[500px] rounded-full bg-creo-pink/5 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <DashboardSidebar type="investor" />

      <main className="flex-1 pt-16 relative">
        <div className="p-6 lg:p-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10"
          >
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground mb-2">Earnings Registry</h1>
              <p className="font-body text-muted-foreground font-medium">Claim and track your revenue distributions from creator settlements.</p>
            </div>
            <Button className="bg-gradient-hero font-display text-sm font-bold text-primary-foreground hover:shadow-glow-pink transition-all duration-300 rounded-xl px-8 h-12">
              <Wallet className="h-5 w-5 mr-3" />
              Claim All Distributions — ${totalClaimable.toFixed(2)}
            </Button>
          </motion.div>

          {/* Auto-claim toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 mb-10 flex items-center justify-between border-creo-teal/10"
          >
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors duration-500 ${autoClaim ? "bg-creo-teal/10" : "bg-white/5"}`}>
                <TrendingUp className={`h-6 w-6 transition-colors duration-500 ${autoClaim ? "text-creo-teal" : "text-muted-foreground"}`} />
              </div>
              <div className="space-y-0.5">
                <p className="font-display text-lg font-bold text-foreground">Smart Auto-Claim</p>
                <p className="font-body text-sm text-muted-foreground font-medium">
                  Automatically claim earnings weekly via trustless execution. Reduces gas overhead.
                </p>
              </div>
            </div>
            <button
              onClick={() => setAutoClaim(!autoClaim)}
              className="relative h-8 w-14 rounded-full bg-white/5 border border-white/10 transition-colors duration-500 hover:border-white/20"
            >
              <motion.div
                animate={{ x: autoClaim ? 24 : 4 }}
                className={`h-6 w-6 rounded-full shadow-lg ${autoClaim ? "bg-creo-teal shadow-[0_0_15px_rgba(45,212,191,0.5)]" : "bg-muted-foreground/30"}`}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </motion.div>

          {/* Earnings per creator */}
          <div className="space-y-6">
            {earningsByCreator.map((e, i) => (
              <motion.div
                key={e.creator}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="glass-card rounded-2xl p-6 hover:border-white/20 transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Creator Info */}
                  <div className="flex items-center gap-4 lg:w-56 shrink-0">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-gradient-hero flex items-center justify-center p-[2px]">
                        <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                          <span className="font-display text-sm font-bold text-creo-pink">{e.avatar}</span>
                        </div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-creo-teal border-4 border-background" />
                    </div>
                    <div>
                      <p className="font-display text-base font-bold text-foreground group-hover:text-creo-teal transition-colors">{e.creator}</p>
                      <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Verified Creator</p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 flex-1">
                    <div className="space-y-1">
                      <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Available</p>
                      <p className="font-display text-2xl font-bold text-creo-yellow neon-glow-pink" style={{ '--glow-color': 'rgba(255,191,0,0.3)' } as any}>{e.claimable}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Lifetime</p>
                      <p className="font-display text-2xl font-bold text-creo-teal neon-glow-teal">{e.totalEarned}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Last Payout</p>
                      <p className="font-display text-base font-bold text-foreground mt-1">{e.lastSettlement}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Next Cycle</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p className="font-display text-sm font-bold text-foreground">{e.nextSettlement}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="shrink-0 flex items-center">
                    <Button size="lg" className="w-full sm:w-auto border-creo-teal/30 text-creo-teal hover:bg-creo-teal/10 hover:border-creo-teal transition-all rounded-xl font-display text-xs font-bold uppercase tracking-widest" variant="outline">
                      Claim Rewards
                    </Button>
                  </div>
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
