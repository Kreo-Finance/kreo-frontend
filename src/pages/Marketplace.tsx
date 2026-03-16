import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, TrendingUp, Shield, Star, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

const creators = [
  {
    id: 1,
    name: "Rahul Mehta",
    category: "DeFi Educator",
    subscribers: "80K",
    monthlyEarnings: "$6,000",
    revenueShare: "40%",
    duration: "6 months",
    target: "$12,000",
    raised: "$12,000",
    progress: 100,
    yieldEstimate: "12.3%",
    riskRating: "Green",
    creoScore: 185,
    tier: "Established",
    bondAmount: "$600",
    investors: 47,
    avatar: "RM",
    color: "creo-pink",
    status: "Funded",
  },
  {
    id: 2,
    name: "Sarah Chen",
    category: "Crypto Newsletter",
    subscribers: "25K",
    monthlyEarnings: "$4,500",
    revenueShare: "35%",
    duration: "6 months",
    target: "$8,500",
    raised: "$6,200",
    progress: 73,
    yieldEstimate: "11.8%",
    riskRating: "Green",
    creoScore: 120,
    tier: "Established",
    bondAmount: "$425",
    investors: 31,
    avatar: "SC",
    color: "creo-teal",
    status: "Active",
  },
  {
    id: 3,
    name: "Alex Kim",
    category: "Solidity Instructor",
    subscribers: "45K",
    monthlyEarnings: "$8,200",
    revenueShare: "30%",
    duration: "9 months",
    target: "$25,000",
    raised: "$18,500",
    progress: 74,
    yieldEstimate: "10.5%",
    riskRating: "Green",
    creoScore: 310,
    tier: "Trusted",
    bondAmount: "$1,250",
    investors: 62,
    avatar: "AK",
    color: "creo-yellow",
    status: "Active",
  },
  {
    id: 4,
    name: "Marcus Johnson",
    category: "Web3 Podcast",
    subscribers: "35K",
    monthlyEarnings: "$5,500",
    revenueShare: "45%",
    duration: "6 months",
    target: "$15,000",
    raised: "$4,800",
    progress: 32,
    yieldEstimate: "13.1%",
    riskRating: "Yellow",
    creoScore: 55,
    tier: "Newcomer",
    bondAmount: "$750",
    investors: 18,
    avatar: "MJ",
    color: "creo-pink",
    status: "Active",
  },
  {
    id: 5,
    name: "Lisa Wang",
    category: "DeFi Researcher",
    subscribers: "60K",
    monthlyEarnings: "$7,800",
    revenueShare: "25%",
    duration: "12 months",
    target: "$20,000",
    raised: "$20,000",
    progress: 100,
    yieldEstimate: "9.8%",
    riskRating: "Green",
    creoScore: 450,
    tier: "Trusted",
    bondAmount: "$1,000",
    investors: 85,
    avatar: "LW",
    color: "creo-teal",
    status: "Funded",
  },
  {
    id: 6,
    name: "David Park",
    category: "Blockchain Dev",
    subscribers: "18K",
    monthlyEarnings: "$3,200",
    revenueShare: "50%",
    duration: "6 months",
    target: "$5,000",
    raised: "$1,500",
    progress: 30,
    yieldEstimate: "14.2%",
    riskRating: "Green",
    creoScore: 20,
    tier: "Newcomer",
    bondAmount: "$250",
    investors: 8,
    avatar: "DP",
    color: "creo-yellow",
    status: "Active",
  },
];

const riskColors: Record<string, string> = {
  Green: "text-creo-teal bg-creo-teal/10",
  Yellow: "text-creo-yellow bg-creo-yellow/10",
  Red: "text-destructive bg-destructive/10",
};

const colorMap: Record<string, { bg: string; text: string }> = {
  "creo-pink": { bg: "bg-creo-pink/10", text: "text-creo-pink" },
  "creo-teal": { bg: "bg-creo-teal/10", text: "text-creo-teal" },
  "creo-yellow": { bg: "bg-creo-yellow/10", text: "text-creo-yellow" },
};

const Marketplace = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "funded">("all");

  const filtered = creators.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "active" && c.status === "Active") || (filter === "funded" && c.status === "Funded");
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-creo-pink/5 blur-[120px] animate-pulse-slow" />
        <div className="absolute -right-1/4 top-1/2 h-[600px] w-[600px] rounded-full bg-creo-teal/5 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <Navbar />
      <main className="pt-24 relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="font-display text-5xl font-bold text-foreground tracking-tight">
              Creator <span className="text-gradient-hero">Marketplace</span>
            </h1>
            <p className="mt-4 font-body text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Discover creators, analyze earnings, and invest in real revenue streams backed by verifiable on-chain data.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <div className="flex flex-col lg:flex-row gap-6 mb-12">
            <div className="flex items-center flex-1 glass-card rounded-2xl px-6 py-4 focus-within:border-white/20 transition-all">
              <Search className="h-5 w-5 text-muted-foreground mr-4" />
              <input
                type="text"
                placeholder="Search by name, category, or niche..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent font-body text-base text-foreground placeholder:text-muted-foreground/50 outline-none"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0">
              {(["all", "active", "funded"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "secondary"}
                  size="lg"
                  onClick={() => setFilter(f)}
                  className={`rounded-xl px-8 h-12 font-bold font-body transition-all ${filter === f ? "bg-gradient-hero text-primary-foreground shadow-glow-pink" : "bg-white/5 border-white/5 hover:bg-white/10"}`}
                >
                  <span className="capitalize">{f}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c, i) => {
              const colors = colorMap[c.color];
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card rounded-3xl p-7 transition-all hover:border-creo-pink/30 hover:neon-glow-pink hover:-translate-y-2 duration-300 group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colors.bg} ring-4 ring-white/5 transition-transform group-hover:scale-110 duration-300`}>
                        <span className={`font-display text-lg font-bold ${colors.text}`}>{c.avatar}</span>
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-foreground leading-tight group-hover:text-creo-pink transition-colors">{c.name}</h3>
                        <p className="font-body text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{c.category} · {c.subscribers}</p>
                      </div>
                    </div>
                    <span className={`rounded-xl px-3 py-1 font-body text-xs font-bold uppercase tracking-widest border ${riskColors[c.riskRating]}`}>
                      {c.riskRating}
                    </span>
                  </div>

                  {/* Stats Card */}
                  <div className="bg-white/5 rounded-2xl p-4 grid grid-cols-3 gap-4 mb-6 border border-white/5">
                    <div>
                      <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Yield Est.</p>
                      <p className="font-display text-sm font-bold text-creo-teal">{c.yieldEstimate}</p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Share</p>
                      <p className="font-display text-sm font-bold text-foreground">{c.revenueShare}</p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Months</p>
                      <p className="font-display text-sm font-bold text-foreground">{c.duration.split(' ')[0]}</p>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="mb-6">
                    <div className="flex justify-between font-body text-xs font-bold text-muted-foreground mb-2 px-1">
                      <span>{c.raised} RAISED</span>
                      <span className="text-foreground">{Math.round((parseInt(c.raised.replace(/\D/g,'')) / parseInt(c.target.replace(/\D/g,''))) * 100)}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/5 border border-white/5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${c.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-hero rounded-full transition-all" 
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-5 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 text-creo-yellow" />
                        <span className="font-body text-xs font-bold text-foreground">{c.creoScore}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Shield className="h-4 w-4 text-creo-teal" />
                        <span className="font-body text-xs font-bold text-muted-foreground">{c.bondAmount}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-creo-pink hover:text-creo-pink hover:bg-creo-pink/10 font-bold px-4 rounded-xl group-hover:bg-creo-pink/10 transition-all">
                      <span className="font-body text-sm">Invest</span>
                      <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Marketplace;
