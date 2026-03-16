import { motion } from "framer-motion";
import { Plus, Coins, Shield, Users, Clock, CheckCircle2 } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";

const offerings = [
  {
    id: 1,
    title: "DeFi Course Revenue Share",
    status: "Active",
    statusColor: "text-creo-teal bg-creo-teal/10",
    raised: "$12,000",
    target: "$12,000",
    progress: 100,
    revenueShare: "40%",
    duration: "6 months",
    remaining: "4 months",
    investors: 47,
    bondAmount: "$600",
    bondStatus: "Locked",
    monthlyEarnings: "$6,000",
    totalDistributed: "$7,180",
  },
  {
    id: 2,
    title: "Advanced Solidity Bootcamp",
    status: "Draft",
    statusColor: "text-muted-foreground bg-muted",
    raised: "$0",
    target: "$8,000",
    progress: 0,
    revenueShare: "35%",
    duration: "6 months",
    remaining: "6 months",
    investors: 0,
    bondAmount: "$400",
    bondStatus: "Not Deposited",
    monthlyEarnings: "—",
    totalDistributed: "$0",
  },
];

const CreatorOfferings = () => {
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
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
          >
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">My Offerings</h1>
              <p className="font-body text-muted-foreground mt-2 font-medium">Manage and track your active revenue share campaigns.</p>
            </div>
            <Button className="bg-gradient-hero font-display text-sm font-bold text-primary-foreground hover:shadow-glow-pink transition-all duration-300 rounded-xl px-6 h-12">
              <Plus className="h-5 w-5 mr-2" />
              Create New Offering
            </Button>
          </motion.div>

          <div className="space-y-8">
            {offerings.map((o, i) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="glass-card rounded-2xl p-8 hover:border-white/20 transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="font-display text-2xl font-bold text-foreground group-hover:text-creo-teal transition-colors">{o.title}</h3>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-body text-xs font-bold uppercase tracking-wider ${o.statusColor} border border-transparent`}>
                        {o.status === "Active" && <span className="h-2 w-2 rounded-full bg-creo-teal animate-pulse" />}
                        {o.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
                      <div className="space-y-1">
                        <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Revenue Share</p>
                        <p className="font-display text-xl font-bold text-foreground">{o.revenueShare}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Duration</p>
                        <p className="font-display text-xl font-bold text-foreground">{o.duration}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Investors</p>
                        <div className="flex items-center gap-1.5 text-foreground">
                          <Users className="h-4 w-4 text-creo-pink" />
                          <p className="font-display text-xl font-bold">{o.investors}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Bond Status</p>
                        <div className="flex items-center gap-1.5">
                          <Shield className={`h-4 w-4 ${o.bondStatus === "Locked" ? "text-creo-yellow" : "text-muted-foreground"}`} />
                          <p className="font-display text-base font-bold text-foreground">{o.bondAmount}</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between font-body text-xs font-bold text-muted-foreground mb-2 px-1">
                        <span className="uppercase tracking-widest">{o.raised} raised</span>
                        <span className="text-foreground">{o.progress}% TARGET MET</span>
                      </div>
                      <div className="h-3 rounded-full bg-white/5 border border-white/5 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${o.progress}%` }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className="h-full bg-gradient-hero rounded-full" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Side Stats */}
                  <div className="flex flex-row lg:flex-col gap-4 lg:w-56">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex-1 group/stat hover:bg-white/[0.08] transition-all">
                      <p className="font-body text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-widest">Monthly Earnings</p>
                      <p className="font-display text-2xl font-bold text-creo-teal neon-glow-teal">{o.monthlyEarnings}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex-1 group/stat hover:bg-white/[0.08] transition-all">
                      <p className="font-body text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-widest">Distributed</p>
                      <p className="font-display text-2xl font-bold text-creo-pink neon-glow-pink">{o.totalDistributed}</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 py-2">
                       <Clock className="h-4 w-4 text-muted-foreground" />
                       <p className="font-body text-xs font-bold text-muted-foreground uppercase tracking-widest">{o.remaining} remaining</p>
                    </div>
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

export default CreatorOfferings;
