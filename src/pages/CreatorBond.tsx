import { motion } from "framer-motion";
import { Shield, Lock, CheckCircle2, AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import WalletGate from "@/components/WalletGate";
import { useAccount } from "wagmi";
import { useRevenueShareData } from "@/hooks/useRevenueShareData";
import { useCreatorVaultData } from "@/hooks/useCreatorVaultData";

const fmtUsdc = (v: bigint | undefined): string => {
  if (v === undefined) return "—";
  const num = Number(v) / 1_000_000;
  return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Map bond rate bps → tier name (mirrors contract constants)
const BOND_BPS_TO_TIER: Record<number, string> = {
  500: "Newcomer",
  400: "Established",
  300: "Trusted",
  200: "Elite",
};

const BOND_TIERS = [
  { tier: "Newcomer",    pct: "5%", bps: 500, amount: "$600"  },
  { tier: "Established", pct: "4%", bps: 400, amount: "$480"  },
  { tier: "Trusted",     pct: "3%", bps: 300, amount: "$360"  },
  { tier: "Elite",       pct: "2%", bps: 200, amount: "$240"  },
];

// Maps offering status → human bond state
const BOND_STATUS_LABEL: Record<number, string> = {
  0: "Locked",   // FUNDRAISING
  1: "Locked",   // PENDING_RELEASE
  2: "Locked",   // ACTIVE
  3: "Returned", // COMPLETED
  4: "Released", // EXPIRED
  5: "Slashed",  // DEFAULTED
};

const BOND_STATUS_STYLE: Record<string, string> = {
  Locked:   "text-creo-yellow",
  Returned: "text-creo-teal",
  Released: "text-muted-foreground",
  Slashed:  "text-destructive",
};

const CreatorBond = () => {
  const { address } = useAccount();

  const rsData    = useRevenueShareData(address);
  const vaultData = useCreatorVaultData(address);

  const { offering, activeOfferingId, hasActiveOffering, isLoading: rsLoading } = rsData;
  const { bondDeposit, bondRateBps, isLoading: vaultLoading } = vaultData;

  const isLoading = rsLoading || vaultLoading;

  // Bond display values
  const bondStatusLabel = offering?.status !== undefined
    ? (BOND_STATUS_LABEL[offering.status] ?? "—")
    : "—";
  const bondStatusStyle = BOND_STATUS_STYLE[bondStatusLabel] ?? "text-muted-foreground";
  const expectedReturn  = bondDeposit !== undefined
    ? bondDeposit + (bondDeposit * 2n / 100n)
    : undefined;

  const settledMonths = offering?.settledMonths ?? 0;
  const totalMonths   = offering ? Number(offering.durationMonths) : 0;
  const progressPct   = totalMonths > 0
    ? Math.min(100, Math.round((settledMonths / totalMonths) * 100))
    : 0;

  // Which tier row to highlight
  const creatorBps      = bondRateBps !== undefined ? Number(bondRateBps) : undefined;
  const creatorTierName = creatorBps !== undefined ? BOND_BPS_TO_TIER[creatorBps] : undefined;

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar type="creator" />

      <main className="flex-1 pt-16 lg:pt-0">
        <WalletGate message="Connect your wallet to view your commitment bond status.">
          <div className="p-6 lg:p-8 max-w-4xl mx-auto">

            {/* Page header */}
            <div className="flex items-center justify-between mb-2">
              <h1 className="font-display text-3xl font-bold text-foreground">Commitment Bond</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { rsData.refetch(); vaultData.refetch(); }}
                disabled={isLoading}
                className="text-muted-foreground hover:text-foreground"
                title="Refresh on-chain data"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
            <p className="font-body text-muted-foreground mb-8">
              Your commitment bond shows investors you're serious. Earn it back with a bonus on completion.
            </p>

            {/* Loading */}
            {isLoading && (
              <div className="rounded-xl border border-border bg-card p-6 mb-8 flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <p className="font-body text-muted-foreground">Loading bond data…</p>
              </div>
            )}

            {/* Current Bond */}
            {!isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl border-2 ${hasActiveOffering ? "border-creo-yellow/30" : "border-border"} bg-card p-8 mb-8`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-creo-yellow/10">
                    <Shield className="h-7 w-7 text-creo-yellow" />
                  </div>

                  <div className="flex-1">
                    {hasActiveOffering && offering ? (
                      <>
                        <h2 className="font-display text-xl font-semibold text-foreground mb-1">Active Bond</h2>
                        <p className="font-body text-sm text-muted-foreground mb-4">
                          Offering #{activeOfferingId.toString()}
                        </p>

                        <div className="grid gap-4 sm:grid-cols-3 mb-6">
                          <div>
                            <p className="font-body text-xs text-muted-foreground">Bond Amount</p>
                            <p className="font-display text-2xl font-bold text-creo-yellow">
                              {fmtUsdc(bondDeposit)} USDC
                            </p>
                          </div>
                          <div>
                            <p className="font-body text-xs text-muted-foreground">Status</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Lock className={`h-4 w-4 ${bondStatusStyle}`} />
                              <p className={`font-display text-lg font-bold ${bondStatusStyle}`}>
                                {bondStatusLabel}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="font-body text-xs text-muted-foreground">Expected Return</p>
                            <p className="font-display text-2xl font-bold text-creo-teal">
                              {fmtUsdc(expectedReturn)} USDC
                            </p>
                            <p className="font-body text-xs text-creo-teal">+2% completion bonus</p>
                          </div>
                        </div>

                        {/* Settlement progress */}
                        <div>
                          <div className="flex justify-between font-body text-xs text-muted-foreground mb-2">
                            <span>{settledMonths} of {totalMonths} months complete</span>
                            <span>{totalMonths - settledMonths} months remaining</span>
                          </div>
                          <div className="h-3 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              className="h-full bg-creo-yellow rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPct}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h2 className="font-display text-xl font-semibold text-foreground mb-1">No Active Bond</h2>
                        <p className="font-body text-sm text-muted-foreground">
                          {bondDeposit && bondDeposit > 0n
                            ? `${fmtUsdc(bondDeposit)} USDC is on deposit — create an offering to lock it.`
                            : "Create an offering to lock your commitment bond and start raising."}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

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
                      Complete all settlement months → bond returns with 2% bonus. KreoScore increases.
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
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Bond Requirements by Tier
              </h2>
              <table className="w-full font-body text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 text-left text-muted-foreground font-medium">Tier</th>
                    <th className="py-3 text-right text-muted-foreground font-medium">Bond %</th>
                    <th className="py-3 text-right text-muted-foreground font-medium">
                      Example ($12K raise)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {BOND_TIERS.map((t) => {
                    const isYou = creatorTierName === t.tier;
                    return (
                      <tr
                        key={t.tier}
                        className={`border-b border-border ${isYou ? "bg-creo-pink/5" : ""}`}
                      >
                        <td className={`py-3 font-medium ${isYou ? "text-creo-pink" : "text-foreground"}`}>
                          {t.tier} {isYou && "← You"}
                        </td>
                        <td className="py-3 text-right text-muted-foreground">{t.pct}</td>
                        <td className="py-3 text-right text-muted-foreground">{t.amount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>

          </div>
        </WalletGate>
      </main>
    </div>
  );
};

export default CreatorBond;
