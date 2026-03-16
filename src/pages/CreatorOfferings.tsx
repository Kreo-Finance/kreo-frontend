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
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar type="creator" />

      <main className="flex-1 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">My Offerings</h1>
              <p className="font-body text-muted-foreground mt-1">Manage your revenue share offerings.</p>
            </div>
            <Button className="bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Create Offering
            </Button>
          </div>

          <div className="space-y-6">
            {offerings.map((o, i) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-display text-xl font-semibold text-foreground">{o.title}</h3>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-body text-xs font-medium ${o.statusColor}`}>
                        {o.status === "Active" && <span className="h-1.5 w-1.5 rounded-full bg-creo-teal" />}
                        {o.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="font-body text-xs text-muted-foreground">Revenue Share</p>
                        <p className="font-display text-lg font-bold text-foreground">{o.revenueShare}</p>
                      </div>
                      <div>
                        <p className="font-body text-xs text-muted-foreground">Duration</p>
                        <p className="font-display text-lg font-bold text-foreground">{o.duration}</p>
                      </div>
                      <div>
                        <p className="font-body text-xs text-muted-foreground">Investors</p>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <p className="font-display text-lg font-bold text-foreground">{o.investors}</p>
                        </div>
                      </div>
                      <div>
                        <p className="font-body text-xs text-muted-foreground">Bond</p>
                        <div className="flex items-center gap-1">
                          <Shield className={`h-4 w-4 ${o.bondStatus === "Locked" ? "text-creo-yellow" : "text-muted-foreground"}`} />
                          <p className="font-display text-sm font-bold text-foreground">{o.bondAmount}</p>
                        </div>
                        <p className="font-body text-xs text-muted-foreground">{o.bondStatus}</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between font-body text-xs text-muted-foreground mb-1">
                        <span>{o.raised} raised</span>
                        <span>{o.target} target</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-gradient-hero rounded-full transition-all" style={{ width: `${o.progress}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Side Stats */}
                  <div className="flex flex-row lg:flex-col gap-4 lg:w-48">
                    <div className="rounded-lg border border-border p-3 flex-1">
                      <p className="font-body text-xs text-muted-foreground mb-1">Monthly Earnings</p>
                      <p className="font-display text-lg font-bold text-creo-teal">{o.monthlyEarnings}</p>
                    </div>
                    <div className="rounded-lg border border-border p-3 flex-1">
                      <p className="font-body text-xs text-muted-foreground mb-1">Total Distributed</p>
                      <p className="font-display text-lg font-bold text-creo-pink">{o.totalDistributed}</p>
                    </div>
                    <div className="rounded-lg border border-border p-3 flex-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <p className="font-body text-xs text-muted-foreground">{o.remaining} left</p>
                      </div>
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
