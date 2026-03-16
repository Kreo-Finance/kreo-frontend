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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-4xl font-bold text-foreground">
              Creator <span className="text-gradient-hero">Marketplace</span>
            </h1>
            <p className="mt-2 font-body text-muted-foreground">
              Discover creators, analyze earnings, and invest in real revenue streams.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center flex-1 rounded-lg border border-border bg-card px-4 py-2.5">
              <Search className="h-4 w-4 text-muted-foreground mr-3" />
              <input
                type="text"
                placeholder="Search by name, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "active", "funded"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className={filter === f ? "bg-gradient-hero text-primary-foreground" : ""}
                >
                  <span className="font-body text-xs capitalize">{f}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c, i) => {
              const colors = colorMap[c.color];
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl border border-border bg-card p-6 transition-all hover:border-creo-pink/30 hover:shadow-glow-pink group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-full ${colors.bg}`}>
                        <span className={`font-display text-sm font-bold ${colors.text}`}>{c.avatar}</span>
                      </div>
                      <div>
                        <h3 className="font-display text-base font-semibold text-foreground">{c.name}</h3>
                        <p className="font-body text-xs text-muted-foreground">{c.category} · {c.subscribers} subs</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 font-body text-xs font-medium ${riskColors[c.riskRating]}`}>
                      {c.riskRating}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <p className="font-body text-xs text-muted-foreground">Yield Est.</p>
                      <p className="font-display text-sm font-bold text-creo-teal">{c.yieldEstimate}</p>
                    </div>
                    <div>
                      <p className="font-body text-xs text-muted-foreground">Share</p>
                      <p className="font-display text-sm font-bold text-foreground">{c.revenueShare}</p>
                    </div>
                    <div>
                      <p className="font-body text-xs text-muted-foreground">Duration</p>
                      <p className="font-display text-sm font-bold text-foreground">{c.duration}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between font-body text-xs text-muted-foreground mb-1">
                      <span>{c.raised} raised</span>
                      <span>{c.target} target</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-gradient-hero rounded-full transition-all" style={{ width: `${c.progress}%` }} />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-creo-yellow" />
                        <span className="font-body text-xs text-muted-foreground">{c.creoScore} · {c.tier}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3.5 w-3.5 text-creo-teal" />
                        <span className="font-body text-xs text-muted-foreground">{c.bondAmount}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-creo-pink hover:text-creo-pink group-hover:bg-creo-pink/10">
                      <span className="font-body text-xs">Invest</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
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
