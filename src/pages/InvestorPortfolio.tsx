import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Coins,
  Wallet,
  Loader2,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import {
  useReadContracts,
  useWriteContract,
  useAccount,
  useSwitchChain,
} from "wagmi";
import { baseSepolia } from "viem/chains";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import WalletGate from "@/components/WalletGate";
import { useInvestorPortfolio } from "@/hooks/useInvestorPortfolio";
import { useClaimEarnings } from "@/hooks/useClaimEarnings";
import { useToast } from "@/hooks/use-toast";
import { SETTLEMENT_ABI } from "@/abi/Settlement";
import {
  getContractAddresses,
  BASE_SEPOLIA_CHAIN_ID,
  formatUsdc,
} from "@/config/contracts";
import type { PortfolioPosition } from "@/lib/api/investor";

const BASESCAN = (hash: string) => `https://sepolia.basescan.org/tx/${hash}`;

function fmtSettled(ts: bigint): string {
  if (ts === 0n) return "No settlements yet";
  const d = new Date(Number(ts) * 1000);
  return `Last settled: ${d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toUpperCase();
  const cls =
    s === "ACTIVE"
      ? "bg-creo-teal/10 text-creo-teal border-creo-teal/20"
      : s === "FUNDRAISING"
      ? "bg-creo-pink/10 text-creo-pink border-creo-pink/20"
      : s === "DEFAULTED"
      ? "bg-destructive/10 text-destructive border-destructive/20"
      : "bg-muted/40 text-muted-foreground border-border/40";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider ${cls}`}
    >
      {status}
    </span>
  );
}

interface PositionCardProps {
  h: PortfolioPosition;
  lastSettled: bigint;
  autoClaimEnabled: boolean;
  onAutoClaimToggle: (enabled: boolean) => void;
  isAutoClaimPending: boolean;
  onClaim: () => void;
  isThisClaiming: boolean;
  isAnyBusy: boolean;
  claimTxHash?: `0x${string}`;
  claimError?: string | null;
}

function PositionCard({
  h,
  lastSettled,
  autoClaimEnabled,
  onAutoClaimToggle,
  isAutoClaimPending,
  onClaim,
  isThisClaiming,
  isAnyBusy,
  claimTxHash,
  claimError,
}: PositionCardProps) {
  const addrShort = `${h.creatorAddress.slice(0, 6)}…${h.creatorAddress.slice(-4)}`;
  const initials = h.creatorAddress.slice(2, 4).toUpperCase();
  const hasClaimable = BigInt(h.claimableUsdc) > 0n;
  const isConfirmed = isThisClaiming && !!claimTxHash && !isAnyBusy;

  return (
    <div className="rounded-lg border border-border p-4 hover:border-creo-pink/30 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        {/* Creator info */}
        <div className="flex items-center gap-3 lg:w-52 shrink-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-creo-pink/10">
            <span className="font-display text-xs font-bold text-creo-pink">
              {initials}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-display text-sm font-semibold text-foreground truncate">
              {addrShort}
            </p>
            <p className="font-body text-xs text-muted-foreground truncate">
              Offering #{h.offeringId}
            </p>
          </div>
        </div>

        {/* Token holdings */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
          <div>
            <p className="font-body text-xs text-muted-foreground">Invested</p>
            <p className="font-display text-sm font-bold text-foreground">
              {h.investedFormatted}
            </p>
          </div>
          <div>
            <p className="font-body text-xs text-muted-foreground">
              Revenue Tokens
            </p>
            <p className="font-display text-sm font-bold text-foreground">
              {h.rstFormatted}
            </p>
          </div>
          <div>
            <p className="font-body text-xs text-muted-foreground">
              Creator Tokens
            </p>
            <p className="font-display text-sm font-bold text-creo-teal">
              {h.creatorTokenAmount}
            </p>
          </div>
          <div>
            <p className="font-body text-xs text-muted-foreground">Claimable</p>
            <p className="font-display text-sm font-bold text-creo-yellow">
              {h.claimableFormatted}
            </p>
            <p className="font-body text-[10px] text-muted-foreground/60 mt-0.5">
              {fmtSettled(lastSettled)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <StatusBadge status={h.status} />
            <span className="font-body text-xs text-muted-foreground">
              {h.durationMonths} mo
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={onClaim}
              disabled={!hasClaimable || isAnyBusy}
              className="border-creo-teal/30 text-creo-teal hover:bg-creo-teal/10 disabled:opacity-40"
            >
              {isThisClaiming && isAnyBusy ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                  <span className="font-body text-xs">Claiming…</span>
                </>
              ) : isConfirmed ? (
                <>
                  <CheckCircle2 className="h-3 w-3 mr-1.5 text-creo-teal" />
                  <span className="font-body text-xs">Claimed</span>
                </>
              ) : (
                <span className="font-body text-xs">Claim</span>
              )}
            </Button>
          </div>

          {/* Tx link */}
          {isThisClaiming && claimTxHash && (
            <a
              href={BASESCAN(claimTxHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-body text-[10px] text-creo-teal hover:underline self-end"
            >
              Basescan <ExternalLink className="h-2.5 w-2.5" />
            </a>
          )}

          {/* Error */}
          {isThisClaiming && claimError && (
            <p className="font-body text-[10px] text-destructive max-w-[180px]">
              {claimError}
            </p>
          )}

          {/* Auto-claim toggle */}
          <div className="flex items-center gap-2 self-end">
            <span className="font-body text-[10px] text-muted-foreground">
              Auto-claim
            </span>
            <Switch
              checked={autoClaimEnabled}
              onCheckedChange={onAutoClaimToggle}
              disabled={isAutoClaimPending}
              className="data-[state=checked]:bg-creo-teal scale-75"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const InvestorPortfolio = () => {
  const { summary, positions, isLoading, isError, refetch } =
    useInvestorPortfolio();
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { toast } = useToast();
  const contracts = getContractAddresses(BASE_SEPOLIA_CHAIN_ID);

  // ── Claim earnings ────────────────────────────────────────────────────────
  const {
    claimSingle,
    claimAll,
    txHash: claimTxHash,
    isBusy: isClaimBusy,
    isSuccess: claimSuccess,
    claimMode,
    claimedAmount,
    activeOfferingId,
    errorMsg: claimError,
    resetAll: resetClaim,
  } = useClaimEarnings();

  // Show toast + refresh on claim confirmed
  useEffect(() => {
    if (!claimSuccess) return;
    const amtStr = formatUsdc(claimedAmount);
    toast({
      title: `Received ${amtStr} USDC`,
      description: "Earnings claimed successfully.",
    });
    refetch();
    const t = setTimeout(resetClaim, 4000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimSuccess]);

  // ── Settlement timestamps (multicall) ─────────────────────────────────────
  const { data: settlementData } = useReadContracts({
    contracts: positions.map((p) => ({
      address: contracts?.SETTLEMENT as `0x${string}`,
      abi: SETTLEMENT_ABI,
      functionName: "s_lastSettlementTimestamp" as const,
      args: [BigInt(p.offeringId)] as [bigint],
    })),
    query: { enabled: positions.length > 0 && !!contracts },
  });

  function getLastSettled(idx: number): bigint {
    const result = settlementData?.[idx]?.result;
    return typeof result === "bigint" ? result : 0n;
  }

  // ── Auto-claim state ──────────────────────────────────────────────────────
  const [autoClaimState, setAutoClaimState] = useState<Record<string, boolean>>(
    {}
  );
  const [autoClaimPendingId, setAutoClaimPendingId] = useState<string | null>(
    null
  );

  // Read initial on-chain auto-claim state
  const { data: autoClaimData } = useReadContracts({
    contracts: positions.map((p) => ({
      address: contracts?.SETTLEMENT as `0x${string}`,
      abi: SETTLEMENT_ABI,
      functionName: "s_autoClaim" as const,
      args: [address as `0x${string}`, BigInt(p.offeringId)] as [
        `0x${string}`,
        bigint,
      ],
    })),
    query: { enabled: positions.length > 0 && !!contracts && !!address },
  });

  useEffect(() => {
    if (!autoClaimData?.length) return;
    const state: Record<string, boolean> = {};
    positions.forEach((p, i) => {
      state[p.offeringId] = (autoClaimData[i]?.result as boolean) ?? false;
    });
    setAutoClaimState(state);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoClaimData]);

  const { writeContract: writeAutoClaim } = useWriteContract();

  async function handleAutoClaimToggle(offeringId: string, enabled: boolean) {
    setAutoClaimState((prev) => ({ ...prev, [offeringId]: enabled }));
    if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
      try {
        await switchChainAsync({ chainId: BASE_SEPOLIA_CHAIN_ID });
      } catch {
        setAutoClaimState((prev) => ({ ...prev, [offeringId]: !enabled }));
        return;
      }
    }
    setAutoClaimPendingId(offeringId);
    writeAutoClaim(
      {
        chainId: BASE_SEPOLIA_CHAIN_ID,
        address: contracts!.SETTLEMENT,
        abi: SETTLEMENT_ABI,
        functionName: "enableAutoClaim",
        args: [[BigInt(offeringId)], enabled],
        account: address,
        chain: baseSepolia,
        gas: BigInt(100_000),
        maxFeePerGas: BigInt(10_000_000_000),
        maxPriorityFeePerGas: BigInt(1_000_000_000),
      },
      {
        onSuccess: () => setAutoClaimPendingId(null),
        onError: () => {
          setAutoClaimState((prev) => ({ ...prev, [offeringId]: !enabled }));
          setAutoClaimPendingId(null);
        },
      }
    );
  }

  // ── Claim All ─────────────────────────────────────────────────────────────
  const claimableIds = positions
    .filter((p) => BigInt(p.claimableUsdc) > 0n)
    .map((p) => p.offeringId);
  const totalClaimable = positions.reduce(
    (acc, p) => acc + BigInt(p.claimableUsdc),
    0n
  );
  const totalClaimableStr = formatUsdc(totalClaimable);
  const isClaimAllBusy = isClaimBusy && claimMode === "all";

  const statsConfig = [
    {
      label: "Total Invested",
      value: summary.totalInvested,
      icon: DollarSign,
      color: "text-creo-pink",
      bg: "bg-creo-pink/10",
    },
    {
      label: "Total Earned",
      value: summary.totalEarned,
      icon: TrendingUp,
      color: "text-creo-yellow",
      bg: "bg-creo-yellow/10",
    },
    {
      label: "Avg. Yield",
      value: summary.avgYield,
      icon: Coins,
      color: "text-creo-teal",
      bg: "bg-creo-teal/10",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar type="investor" />

      <main className="flex-1 pt-16 lg:pt-0">
        <WalletGate message="Connect your wallet to view your portfolio and holdings.">
          <div className="p-6 lg:p-8 max-w-6xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">
                  Portfolio
                </h1>
                <p className="font-body text-muted-foreground mt-1">
                  Your revenue share and creator token holdings.
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Button
                  onClick={() => claimAll(claimableIds)}
                  disabled={claimableIds.length === 0 || isClaimBusy}
                  className="bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40"
                >
                  {isClaimAllBusy ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Claiming…
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4 mr-2" />
                      Claim All — {totalClaimableStr}
                    </>
                  )}
                </Button>
                {isClaimAllBusy && claimTxHash && (
                  <a
                    href={BASESCAN(claimTxHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-body text-[10px] text-creo-teal hover:underline"
                  >
                    View on Basescan <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
                {claimMode === "all" && claimError && (
                  <p className="font-body text-[10px] text-destructive max-w-[240px] text-right">
                    {claimError}
                  </p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3 mb-8">
              {statsConfig.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg} mb-3`}
                  >
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  {isLoading ? (
                    <div className="h-8 w-20 rounded bg-muted animate-pulse mb-1" />
                  ) : (
                    <p className="font-display text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  )}
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Holdings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-border bg-card p-6 mb-8"
            >
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Active Holdings
              </h2>

              {isLoading && (
                <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="font-body text-sm">Loading positions…</span>
                </div>
              )}

              {isError && !isLoading && (
                <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                  <p className="font-body text-sm text-destructive">
                    Failed to load portfolio. Check your connection and try
                    again.
                  </p>
                </div>
              )}

              {!isLoading && !isError && positions.length === 0 && (
                <p className="font-body text-sm text-muted-foreground py-8 text-center">
                  No active positions yet. Head to the{" "}
                  <a
                    href="/marketplace"
                    className="text-creo-teal hover:underline"
                  >
                    Marketplace
                  </a>{" "}
                  to invest.
                </p>
              )}

              {!isLoading && !isError && positions.length > 0 && (
                <div className="space-y-4">
                  {positions.map((h, idx) => (
                    <PositionCard
                      key={`${h.offeringId}-${h.creatorAddress}`}
                      h={h}
                      lastSettled={getLastSettled(idx)}
                      autoClaimEnabled={autoClaimState[h.offeringId] ?? false}
                      onAutoClaimToggle={(enabled) =>
                        handleAutoClaimToggle(h.offeringId, enabled)
                      }
                      isAutoClaimPending={autoClaimPendingId === h.offeringId}
                      onClaim={() => claimSingle(h.offeringId)}
                      isThisClaiming={
                        activeOfferingId === h.offeringId && claimMode === "single"
                      }
                      isAnyBusy={isClaimBusy}
                      claimTxHash={
                        activeOfferingId === h.offeringId && claimMode === "single"
                          ? claimTxHash
                          : undefined
                      }
                      claimError={
                        activeOfferingId === h.offeringId && claimMode === "single"
                          ? claimError
                          : null
                      }
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Claim History — static placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Claim History
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full font-body text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-2 text-left text-muted-foreground font-medium">
                        Date
                      </th>
                      <th className="py-3 px-2 text-right text-muted-foreground font-medium">
                        Amount
                      </th>
                      <th className="py-3 px-2 text-left text-muted-foreground font-medium">
                        Creator
                      </th>
                      <th className="py-3 px-2 text-right text-muted-foreground font-medium">
                        Tx Hash
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center font-body text-sm text-muted-foreground"
                      >
                        Claim history coming soon.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </WalletGate>
      </main>
    </div>
  );
};

export default InvestorPortfolio;
