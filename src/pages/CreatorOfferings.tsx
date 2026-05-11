import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Shield, Clock, AlertCircle, Loader2,
  ExternalLink, Calendar, RefreshCw, TrendingUp, XCircle, Unlock,
} from "lucide-react";
import { Coins } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import WalletGate from "@/components/WalletGate";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from "wagmi";
import { useRevenueShareData } from "@/hooks/useRevenueShareData";
import { useCreatorVaultData } from "@/hooks/useCreatorVaultData";
import { REVENUE_SHARE_ABI } from "@/abi/RevenueShare";
import { getContractAddresses, BASE_SEPOLIA_CHAIN_ID } from "@/config/contracts";
import { baseSepolia } from "viem/chains";
import { BaseError, ContractFunctionRevertedError } from "viem";
import { CreateOfferingModal } from "@/components/CreateOfferingModal";

// ── Formatters ──────────────────────────────────────────────────────────────

const fmtUsdc = (v: bigint | undefined): string => {
  if (v === undefined) return "—";
  const num = Number(v) / 1_000_000;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
  return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const fmtDeadline = (ts: bigint | undefined): string => {
  if (!ts) return "—";
  return new Date(Number(ts) * 1000).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
};

const timeRemaining = (deadline: bigint | undefined): string => {
  if (!deadline) return "—";
  const remaining = Number(deadline) - Math.floor(Date.now() / 1000);
  if (remaining <= 0) return "Closed";
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h left`;
  return "< 1h left";
};

// ── Error handling ───────────────────────────────────────────────────────────

const EXTEND_ERRORS: Record<string, string> = {
  RevenueShare__DeadlineAlreadyExtended: "Deadline has already been extended once.",
  RevenueShare__ExtensionTooLong: "Extension exceeds the 14-day maximum.",
  RevenueShare__OfferingNotFundraising: "Offering is not in fundraising status.",
  RevenueShare__FundraiseClosed: "The fundraise window has already closed.",
  RevenueShare__OfferingNotFound: "Offering not found on-chain.",
  RevenueShare__DeadlineNotReached: "Fundraise deadline has not passed yet. Wait until the deadline expires.",
  RevenueShare__OfferingNotPendingRelease: "Offering is not in Pending Release status.",
  RevenueShare__CapitalReleaseTooEarly: "The 3-day fraud detection window has not passed yet. Please wait.",
  RevenueShare__CapitalFrozen: "Capital release has been frozen by the protocol. Contact support.",
};

function extractError(err: unknown): string {
  if (err instanceof BaseError) {
    const revert = err.walk((e) => e instanceof ContractFunctionRevertedError);
    if (revert instanceof ContractFunctionRevertedError) {
      const name = revert.data?.errorName ?? "";
      return EXTEND_ERRORS[name] ?? name ?? err.shortMessage;
    }
    return err.shortMessage;
  }
  if (err instanceof Error) return err.message;
  return "Unknown error. Please try again.";
}

// ── Status styles ────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  "Fundraising":     "text-creo-teal bg-creo-teal/10",
  "Pending Release": "text-creo-yellow bg-creo-yellow/10",
  "Active":          "text-creo-teal bg-creo-teal/10",
  "Completed":       "text-creo-teal bg-creo-teal/10",
  "Expired":         "text-muted-foreground bg-muted",
  "Defaulted":       "text-destructive bg-destructive/10",
};

// ── Main component ───────────────────────────────────────────────────────────

const CreatorOfferings = () => {
  const { address, isConnected, chainId: walletChainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const contracts = getContractAddresses(BASE_SEPOLIA_CHAIN_ID);

  const [offeringModalOpen, setOfferingModalOpen] = useState(false);
  const [showExtend, setShowExtend] = useState(false);
  const [extensionDays, setExtensionDays] = useState(7);

  const rsData = useRevenueShareData(address as `0x${string}` | undefined);
  const vaultData = useCreatorVaultData(address as `0x${string}` | undefined);

  const {
    activeOfferingId, hasActiveOffering, offering,
    offeringStatusLabel, isLoading, isError,
  } = rsData;

  // ── Extend deadline tx ─────────────────────────────────────────────────────
  const {
    writeContract: writeExtend,
    data: extendTxHash,
    isPending: isExtending,
    error: extendWriteError,
    reset: resetExtend,
  } = useWriteContract();
  const { isLoading: extendConfirming, isSuccess: extendSuccess } =
    useWaitForTransactionReceipt({ hash: extendTxHash });

  useEffect(() => {
    if (extendSuccess) {
      rsData.refetch();
      setShowExtend(false);
      resetExtend();
    }
  }, [extendSuccess]);

  // ── Close offering tx ──────────────────────────────────────────────────────
  const {
    writeContract: writeClose,
    data: closeTxHash,
    isPending: isClosing,
    error: closeWriteError,
    reset: resetClose,
  } = useWriteContract();
  const { isLoading: closeConfirming, isSuccess: closeSuccess } =
    useWaitForTransactionReceipt({ hash: closeTxHash });

  useEffect(() => {
    if (closeSuccess) {
      rsData.refetch();
      resetClose();
    }
  }, [closeSuccess]);

  async function handleClose() {
    if (!contracts || !activeOfferingId) return;
    // Pre-flight: offering must be fundraising and deadline must have passed
    if (offering?.status !== 0) return;
    if (deadlineIsLive) return;
    if (walletChainId !== BASE_SEPOLIA_CHAIN_ID) {
      try { await switchChainAsync({ chainId: BASE_SEPOLIA_CHAIN_ID }); } catch { return; }
    }
    writeClose({
      chainId: BASE_SEPOLIA_CHAIN_ID,
      address: contracts.REVENUE_SHARE,
      abi: REVENUE_SHARE_ABI,
      functionName: "closeOffering",
      args: [activeOfferingId],
      account: address!,
      chain: baseSepolia,
      gas: BigInt(300_000),
      maxFeePerGas: BigInt(10_000_000_000),
      maxPriorityFeePerGas: BigInt(1_000_000_000),
    });
  }

  // ── Release capital tx ─────────────────────────────────────────────────────
  const {
    writeContract: writeRelease,
    data: releaseTxHash,
    isPending: isReleasing,
    error: releaseWriteError,
    reset: resetRelease,
  } = useWriteContract();
  const { isLoading: releaseConfirming, isSuccess: releaseSuccess } =
    useWaitForTransactionReceipt({ hash: releaseTxHash });

  useEffect(() => {
    if (releaseSuccess) {
      rsData.refetch();
      resetRelease();
    }
  }, [releaseSuccess]);

  async function handleRelease() {
    if (!contracts || !activeOfferingId) return;
    if (offering?.status !== 1) return;
    if (!releaseWindowOpen) return;
    if (walletChainId !== BASE_SEPOLIA_CHAIN_ID) {
      try { await switchChainAsync({ chainId: BASE_SEPOLIA_CHAIN_ID }); } catch { return; }
    }
    writeRelease({
      chainId: BASE_SEPOLIA_CHAIN_ID,
      address: contracts.REVENUE_SHARE,
      abi: REVENUE_SHARE_ABI,
      functionName: "releaseCapital",
      args: [activeOfferingId],
      account: address!,
      chain: baseSepolia,
      gas: BigInt(300_000),
      maxFeePerGas: BigInt(10_000_000_000),
      maxPriorityFeePerGas: BigInt(1_000_000_000),
    });
  }

  async function handleExtend() {
    if (!contracts || !activeOfferingId) return;
    if (walletChainId !== BASE_SEPOLIA_CHAIN_ID) {
      try { await switchChainAsync({ chainId: BASE_SEPOLIA_CHAIN_ID }); } catch { return; }
    }
    writeExtend({
      chainId: BASE_SEPOLIA_CHAIN_ID,
      address: contracts.REVENUE_SHARE,
      abi: REVENUE_SHARE_ABI,
      functionName: "extendDeadline",
      args: [activeOfferingId, BigInt(extensionDays * 24 * 60 * 60)],
      account: address!,
      chain: baseSepolia,
      gas: BigInt(200_000),
      maxFeePerGas: BigInt(10_000_000_000),
      maxPriorityFeePerGas: BigInt(1_000_000_000),
    });
  }

  // ── Derived values ─────────────────────────────────────────────────────────
  const statusLabel = offeringStatusLabel ?? "—";
  const statusStyle = STATUS_STYLES[statusLabel] ?? "text-muted-foreground bg-muted";

  const progress = offering && offering.fundraiseTarget > 0n
    ? Number((offering.totalRaised * 100n) / offering.fundraiseTarget)
    : 0;

  const revenueShareDisplay = offering?.revenueSharePct !== undefined
    ? `${Number(offering.revenueSharePct) / 100}%`
    : "—";

  const deadlineIsLive = offering?.fundraiseDeadline !== undefined
    && Date.now() / 1000 < Number(offering.fundraiseDeadline);

  // FUNDRAISING = status 0, must not have extended, deadline not passed
  const canExtend =
    offering?.status === 0 &&
    !offering?.deadlineExtended &&
    deadlineIsLive;

  // Can close: status FUNDRAISING and deadline has passed
  const canClose = offering?.status === 0 && !deadlineIsLive;

  // Can release: status PENDING_RELEASE and 3-day window has elapsed
  const releaseWindowOpen =
    offering?.status === 1 &&
    offering.capitalReleaseTimestamp !== undefined &&
    offering.capitalReleaseTimestamp > 0n &&
    BigInt(Math.floor(Date.now() / 1000)) >= offering.capitalReleaseTimestamp;
  const canRelease = offering?.status === 1 && releaseWindowOpen;

  const timeUntilRelease = (): string => {
    const ts = offering?.capitalReleaseTimestamp;
    if (!ts || ts === 0n) return "—";
    const remaining = Number(ts) - Math.floor(Date.now() / 1000);
    if (remaining <= 0) return "Ready";
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const mins = Math.floor((remaining % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar type="creator" />

      <main className="flex-1 pt-16 lg:pt-0">
        <WalletGate message="Connect your wallet to view and manage your offerings.">
          <div className="p-6 lg:p-8 max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">My Offerings</h1>
                <p className="font-body text-muted-foreground mt-1">Manage your revenue share offerings.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => rsData.refetch()}
                  disabled={isLoading}
                  className="text-muted-foreground hover:text-foreground"
                  title="Refresh on-chain data"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
                <Button
                  onClick={() => setOfferingModalOpen(true)}
                  disabled={hasActiveOffering}
                  title={hasActiveOffering ? "You already have an active offering" : "Create a new offering"}
                  className="bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  <Coins className="h-4 w-4 mr-2" />
                  New Offering
                </Button>
              </div>
            </div>

            {/* Error banner */}
            {isError && (
              <div className="mb-6 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-body text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Failed to load on-chain data.{" "}
                <button className="underline" onClick={() => rsData.refetch()}>Retry</button>
              </div>
            )}

            {/* Loading state */}
            {isLoading && (
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <p className="font-body text-muted-foreground">Loading offering data…</p>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !hasActiveOffering && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border-2 border-dashed border-border bg-card p-10 flex flex-col items-center text-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Coins className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-foreground">No active offering</p>
                  <p className="font-body text-sm text-muted-foreground mt-1">
                    Create a revenue share offering to start raising capital from investors.
                  </p>
                </div>
                <Button
                  onClick={() => setOfferingModalOpen(true)}
                  className="bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Offering
                </Button>
              </motion.div>
            )}

            {/* Active offering card */}
            {!isLoading && hasActiveOffering && offering && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border bg-card p-6"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      Offering #{activeOfferingId.toString()}
                    </h3>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-body text-xs font-semibold ${statusStyle}`}>
                      {offering.status === 0 && (
                        <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                      )}
                      {statusLabel}
                    </span>
                    {offering.deadlineExtended && (
                      <span className="font-body text-xs text-muted-foreground px-2 py-0.5 rounded-full border border-border">
                        Extended
                      </span>
                    )}
                  </div>

                  {/* Close Offering — visible when FUNDRAISING, enabled only after deadline */}
                  {offering.status === 0 && (
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClose}
                        disabled={!canClose || isClosing || closeConfirming}
                        title={
                          deadlineIsLive
                            ? "Available after the fundraise deadline passes"
                            : "Close the fundraise and begin the 3-day capital release window"
                        }
                        className="border-destructive/30 text-destructive hover:bg-destructive/10 font-display disabled:opacity-40"
                      >
                        {isClosing || closeConfirming ? (
                          <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                          {closeConfirming ? "Confirming…" : "Closing…"}</>
                        ) : (
                          <><XCircle className="h-3.5 w-3.5 mr-1.5" />Close Offering</>
                        )}
                      </Button>
                      {closeWriteError && (
                        <p className="font-body text-xs text-destructive text-right max-w-[220px]">
                          {extractError(closeWriteError)}
                        </p>
                      )}
                      {closeTxHash && (
                        <a
                          href={`https://sepolia.basescan.org/tx/${closeTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 font-body text-xs text-creo-teal hover:underline"
                        >
                          View on Basescan <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Main stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Revenue Share</p>
                    <p className="font-display text-xl font-bold text-foreground">{revenueShareDisplay}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Duration</p>
                    <p className="font-display text-xl font-bold text-foreground">
                      {Number(offering.durationMonths)}mo
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Settled Months</p>
                    <p className="font-display text-xl font-bold text-foreground">
                      {offering.settledMonths} / {Number(offering.durationMonths)}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Bond on File</p>
                    <div className="flex items-center gap-1.5">
                      <Shield className="h-4 w-4 text-creo-yellow" />
                      <p className="font-display text-base font-bold text-foreground">
                        {fmtUsdc(vaultData.bondDeposit)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Secondary stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Floor Used</p>
                    <p className="font-display text-sm font-bold text-creo-teal">
                      {fmtUsdc(offering.conservativeFloorUsed)}
                      <span className="text-xs text-muted-foreground font-normal">/mo</span>
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Trust Cap</p>
                    <p className="font-display text-sm font-bold text-foreground">
                      {offering.trustCapPct}%
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Deadline</p>
                    <p className="font-display text-sm font-bold text-foreground">
                      {fmtDeadline(offering.fundraiseDeadline)}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Time Remaining</p>
                    <div className="flex items-center gap-1">
                      <Clock className={`h-3.5 w-3.5 ${deadlineIsLive ? "text-creo-teal" : "text-muted-foreground"}`} />
                      <p className={`font-display text-sm font-bold ${deadlineIsLive ? "text-creo-teal" : "text-muted-foreground"}`}>
                        {timeRemaining(offering.fundraiseDeadline)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fundraise progress */}
                <div className="mb-6">
                  <div className="flex justify-between font-body text-xs text-muted-foreground mb-1.5">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {fmtUsdc(offering.totalRaised)} raised
                    </span>
                    <span>{fmtUsdc(offering.fundraiseTarget)} target</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-hero rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    {progress.toFixed(1)}% funded
                  </p>
                </div>

                {/* Extend deadline section */}
                {canExtend && (
                  <div className="pt-4 border-t border-border">
                    <AnimatePresence mode="wait">
                      {!showExtend ? (
                        <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowExtend(true)}
                            className="border-creo-teal/30 text-creo-teal hover:bg-creo-teal/10 font-display"
                          >
                            <Calendar className="h-3.5 w-3.5 mr-1.5" />
                            Extend Deadline
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="form"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="flex flex-col gap-3"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-body text-sm font-bold text-foreground">Extend fundraise by</p>
                            <p className="font-body text-xs text-muted-foreground">Max 14 days · one-time only</p>
                          </div>
                          <div className="flex gap-2">
                            {[3, 7, 10, 14].map((d) => (
                              <button
                                key={d}
                                type="button"
                                onClick={() => setExtensionDays(d)}
                                className={`rounded-xl border-2 px-3 py-2 font-body text-sm font-bold transition-all ${
                                  extensionDays === d
                                    ? "border-creo-teal bg-creo-teal/10 text-creo-teal"
                                    : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
                                }`}
                              >
                                {d}d
                              </button>
                            ))}
                          </div>
                          {extendWriteError && (
                            <p className="font-body text-xs text-destructive">{extractError(extendWriteError)}</p>
                          )}
                          {extendTxHash && (
                            <a
                              href={`https://sepolia.basescan.org/tx/${extendTxHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 font-body text-xs text-creo-teal hover:underline"
                            >
                              View on Basescan <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleExtend}
                              disabled={isExtending || extendConfirming}
                              className="bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90"
                            >
                              {isExtending || extendConfirming ? (
                                <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                                {extendConfirming ? "Confirming…" : "Submitting…"}</>
                              ) : `Extend by ${extensionDays} days`}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => { setShowExtend(false); resetExtend(); }}
                              className="text-muted-foreground"
                            >
                              Cancel
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Already-extended notice */}
                {!canExtend && offering.status === 0 && offering.deadlineExtended && (
                  <div className="pt-4 border-t border-border">
                    <p className="font-body text-xs text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Deadline has been extended once — no further extensions allowed.
                    </p>
                  </div>
                )}

                {/* Release Capital section — shown when PENDING_RELEASE */}
                {offering.status === 1 && (
                  <div className="pt-4 border-t border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="font-body text-sm font-bold text-foreground flex items-center gap-1.5">
                          <Unlock className="h-3.5 w-3.5 text-creo-teal" />
                          Capital Release
                        </p>
                        {!releaseWindowOpen && offering.capitalReleaseTimestamp > 0n && (
                          <p className="font-body text-xs text-muted-foreground mt-0.5">
                            Available in {timeUntilRelease()} · {fmtDeadline(offering.capitalReleaseTimestamp)}
                          </p>
                        )}
                        {releaseWindowOpen && (
                          <p className="font-body text-xs text-creo-teal mt-0.5">
                            Fraud window cleared — capital is ready to release.
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <Button
                          size="sm"
                          onClick={handleRelease}
                          disabled={!canRelease || isReleasing || releaseConfirming}
                          title={
                            !releaseWindowOpen
                              ? "Wait for the 3-day fraud detection window to pass"
                              : "Release raised capital to your wallet (3% fee deducted)"
                          }
                          className="bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40"
                        >
                          {isReleasing || releaseConfirming ? (
                            <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                            {releaseConfirming ? "Confirming…" : "Releasing…"}</>
                          ) : (
                            <><Unlock className="h-3.5 w-3.5 mr-1.5" />Release Capital</>
                          )}
                        </Button>
                        {releaseWriteError && (
                          <p className="font-body text-xs text-destructive text-right max-w-[220px]">
                            {extractError(releaseWriteError)}
                          </p>
                        )}
                        {releaseTxHash && (
                          <a
                            href={`https://sepolia.basescan.org/tx/${releaseTxHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 font-body text-xs text-creo-teal hover:underline"
                          >
                            View on Basescan <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </WalletGate>
      </main>

      {/* Create Offering Modal */}
      {isConnected && address && (
        <CreateOfferingModal
          open={offeringModalOpen}
          onOpenChange={setOfferingModalOpen}
          creatorAddress={address}
          vaultData={vaultData}
        />
      )}
    </div>
  );
};

export default CreatorOfferings;
