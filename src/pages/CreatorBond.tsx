import { motion } from "framer-motion";
import { Shield, Lock, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";

const bondHistory = [
  { offering: "DeFi Course Revenue Share", amount: "$600", status: "Locked", date: "Oct 15, 2025", returnDate: "Apr 15, 2026" },
];

const CreatorBond = () => {
  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Background Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-1/4 h-[400px] w-[400px] rounded-full bg-creo-teal/5 blur-[100px] animate-pulse-slow" />
        <div className="absolute -right-20 bottom-1/4 h-[500px] w-[500px] rounded-full bg-creo-pink/5 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <DashboardSidebar type="creator" />

      <main className="flex-1 pt-16 relative">
        <div className="p-6 lg:p-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground mb-2">Commitment Bond</h1>
            <p className="font-body text-muted-foreground font-medium">
              Your commitment bond demonstrates your skin in the game. Full recovery with bonus upon successful completion.
            </p>
          </motion.div>

          {/* Current Bond */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl p-8 mb-10 border-creo-yellow/20 bg-creo-yellow/[0.02]"
          >
            <div className="flex items-start gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-creo-yellow/10 border border-creo-yellow/20 shadow-[0_0_20px_rgba(255,191,0,0.1)]">
                <Shield className="h-8 w-8 text-creo-yellow" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-display text-2xl font-bold text-foreground">Active Bond Profile</h2>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-creo-yellow/10 border border-creo-yellow/20 text-creo-yellow font-display text-[10px] font-bold uppercase tracking-widest">
                    <Lock className="h-3 w-3" /> Locked
                  </span>
                </div>
                <p className="font-body text-sm text-muted-foreground mb-6 font-medium">Associated with: DeFi Course Revenue Share</p>

                <div className="grid gap-6 sm:grid-cols-3 mb-8">
                  <div className="space-y-1">
                    <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Bond Amount</p>
                    <p className="font-display text-2xl font-bold text-foreground tabular-nums">$600 <span className="text-xs text-muted-foreground font-medium ml-1">USDC</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</p>
                    <p className="font-display text-2xl font-bold text-creo-yellow tabular-nums">1/1 Active</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Expected Return</p>
                    <div className="flex items-baseline gap-1">
                       <p className="font-display text-2xl font-bold text-creo-teal tabular-nums">$612</p>
                       <span className="text-[10px] font-bold text-creo-teal uppercase">+2% BONUS</span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between font-body text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">
                    <span>2 of 6 months complete</span>
                    <span className="text-foreground">4 months remaining</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/5 border border-white/5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "33%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-creo-yellow rounded-full shadow-[0_0_15px_rgba(255,191,0,0.3)]" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Guidelines & Mechanics */}
          <div className="grid gap-8 sm:grid-cols-2 mb-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6 border-creo-teal/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-creo-teal/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-creo-teal" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">Success Path</h3>
              </div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Complete all settlement milestones on time. Your bond will be automatically released to your wallet with the completion bonus.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6 border-creo-yellow/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-creo-yellow/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-creo-yellow" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">Default Risk</h3>
              </div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Missing 3 consecutive settlements or a drop in revenue &gt;40% triggers a default. Bond is distributed to investors as insurance.
              </p>
            </motion.div>
          </div>

          {/* Bond Tiers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="font-display text-xl font-bold text-foreground mb-6">Bond Requirements by Tier</h2>
            <div className="overflow-hidden rounded-xl border border-white/5">
              <table className="w-full font-body text-sm">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5 text-left">
                    <th className="py-4 px-6 text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Tier</th>
                    <th className="py-4 px-6 text-right text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Required Bond %</th>
                    <th className="py-4 px-6 text-right text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Example ($12K Raise)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { tier: "Newcomer", pct: "5%", amount: "$600", active: false },
                    { tier: "Established", pct: "4%", amount: "$480", active: true },
                    { tier: "Trusted", pct: "3%", amount: "$360", active: false },
                    { tier: "Elite", pct: "2%", amount: "$240", active: false },
                  ].map((t) => (
                    <tr key={t.tier} className={`group transition-colors ${t.active ? "bg-creo-pink/[0.03]" : "hover:bg-white/[0.01]"}`}>
                      <td className={`py-5 px-6 font-display font-bold ${t.active ? "text-creo-pink" : "text-foreground"}`}>
                        <div className="flex items-center gap-2">
                          {t.tier}
                          {t.active && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-creo-pink/20 text-creo-pink uppercase tracking-widest">Your Tier</span>}
                        </div>
                      </td>
                      <td className="py-5 px-6 text-right font-medium text-muted-foreground tabular-nums group-hover:text-foreground transition-colors">{t.pct}</td>
                      <td className="py-5 px-6 text-right font-bold text-foreground tabular-nums">{t.amount}</td>
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

export default CreatorBond;
