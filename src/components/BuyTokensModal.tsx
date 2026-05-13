import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Loader2,
  ArrowRight,
  Coins,
  TrendingUp,
  Zap,
  DollarSign,
  Clock,
} from "lucide-react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useAccount,
  useSwitchChain,
} from "wagmi";
import { parseEventLogs, BaseError, ContractFunctionRevertedError } from "viem";
import { baseSepolia } from "viem/chains";
import { REVENUE_SHARE_ABI } from "@/abi/RevenueShare";
import { CREATOR_TOKEN_ABI } from "@/abi/CreatorToken";
import {
  getContractAddresses,
  BASE_SEPOLIA_CHAIN_ID,
} from "@/config/contracts";
import { investorApi } from "@/lib/api/investor";
import type { MarketplaceListing } from "@/hooks/useMarketplaceData";

// ── Constants ──────────────────────────────────────────────────────────────────
const BASESCAN = (hash: string) => `https://sepolia.basescan.org/tx/${hash}`;

const ERC20_ABI = [
  {
    name: "approve",
    type: "function" as const,
    stateMutability: "nonpayable" as const,
    inputs: [
      { name: "spender", type: "address" as const },
      { name: "amount", type: "uint256" as const },
    ],
    outputs: [{ name: "", type: "bool" as const }],
  },
  {
    name: "allowance",
    type: "function" as const,
    stateMutability: "view" as const,
    inputs: [
      { name: "owner", type: "address" as const },
      { name: "spender", type: "address" as const },
    ],
    outputs: [{ name: "", type: "uint256" as const }],
  },
  {
    name: "balanceOf",
    type: "function" as const,
    stateMutability: "view" as const,
    inputs: [{ name: "account", type: "address" as const }],
    outputs: [{ name: "", type: "uint256" as const }],
  },
] as const;

// ── Error mapping ──────────────────────────────────────────────────────────────
const CONTRACT_ERRORS: Record<string, string> = {
  RevenueShare__ZeroAmount: "Investment amount cannot be zero.",
  RevenueShare__OfferingNotFundraising:
    "This offering is no longer accepting investments.",
  RevenueShare__OfferingNotFound: "Offering not found on-chain.",
  RevenueShare__FundraiseClosed:
    "The fundraise window for this offering has closed.",
  RevenueShare__CreatorPaused:
    "This creator's account is currently paused — investments are not accepted.",
  RevenueShare__CapitalFrozen: "Capital is currently frozen for this offering.",
  RevenueShare__TransferFailed:
    "USDC transfer failed. Check your balance and approval.",
};

function extractError(err: unknown): string {
  if (err instanceof BaseError) {
    const revert = err.walk((e) => e instanceof ContractFunctionRevertedError);
    if (revert instanceof ContractFunctionRevertedError) {
      const name = revert.data?.errorName ?? "";
      return CONTRACT_ERRORS[name] ?? name ?? err.shortMessage;
    }
    return err.shortMessage;
  }
  if (err instanceof Error) return err.message;
  return "Unknown error. Please try again.";
}

// ── Formatters ─────────────────────────────────────────────────────────────────
const fmtUSD = (v: number) =>
  v >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(2)}M`
    : v >= 1_000
    ? `$${(v / 1_000).toFixed(2)}K`
    : `$${v.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

function truncateAddr(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

// ── Step dots ──────────────────────────────────────────────────────────────────
function StepDots({ current }: { current: number }) {
  const labels = ["Amount", "Approve", "Invest"];
  return (
    <div className="flex items-center gap-2">
      {labels.map((l, i) => (
        <div key={l} className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 ${
              i < current
                ? "text-creo-teal"
                : i === current
                ? "text-foreground"
                : "text-muted-foreground/40"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                i < current
                  ? "bg-creo-teal border-creo-teal text-background"
                  : i === current
                  ? "border-creo-teal text-creo-teal"
                  : "border-border text-muted-foreground"
              }`}
            >
              {i < current ? "✓" : i + 1}
            </div>
            <span className="font-body text-xs font-semibold hidden sm:block">
              {l}
            </span>
          </div>
          {i < labels.length - 1 && (
            <div
              className={`h-px w-6 ${i < current ? "bg-creo-teal" : "bg-border"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Tx line ────────────────────────────────────────────────────────────────────
function TxLine({
  label,
  txHash,
  isConfirming,
  isConfirmed,
}: {
  label: string;
  txHash?: `0x${string}`;
  isConfirming: boolean;
  isConfirmed: boolean;
}) {
  if (!txHash) return null;
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/40 px-4 py-3">
      <div className="flex items-center gap-2.5">
        {isConfirming ? (
          <Loader2 className="h-4 w-4 animate-spin text-creo-teal" />
        ) : isConfirmed ? (
          <CheckCircle2 className="h-4 w-4 text-creo-teal" />
        ) : (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
        <span className="font-body text-sm text-foreground">{label}</span>
        {isConfirmed && (
          <span className="font-body text-xs text-creo-teal">Confirmed</span>
        )}
      </div>
      <a
        href={BASESCAN(txHash)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 font-body text-xs text-creo-teal hover:underline shrink-0"
      >
        Basescan <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}

// ── Main Modal ─────────────────────────────────────────────────────────────────
export function BuyTokensModal({
  open,
  onOpenChange,
  listing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: MarketplaceListing;
}) {
  const {
    address: investorAddress,
    chainId: walletChainId,
    isConnected,
  } = useAccount();
  const contracts = getContractAddresses(BASE_SEPOLIA_CHAIN_ID);
  const { switchChainAsync } = useSwitchChain();

  // ── Form / flow state ──────────────────────────────────────────────────
  const [usdcDollars, setUsdcDollars] = useState<number>(100);
  const [step, setStep] = useState(0); // 0=amount, 1=approve, 2=invest, 3=success
  const [postError, setPostError] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [resultRst, setResultRst] = useState("");
  const [resultCt, setResultCt] = useState("");

  // ── Derived values ──────────────────────────────────────────────────────
  const usdcAmount = BigInt(Math.round(usdcDollars * 1_000_000));
  const remaining =
    listing.fundraiseTarget > listing.totalRaised
      ? listing.fundraiseTarget - listing.totalRaised
      : 0n;
  const remainingDollars = Number(remaining) / 1_000_000;
  const exceedsRemaining = remaining > 0n && usdcAmount > remaining;
  const nowSecs = Math.floor(Date.now() / 1000);
  const deadlinePassed =
    Number(listing.fundraiseDeadline) > 0 &&
    nowSecs > Number(listing.fundraiseDeadline);

  // ── Read RST_PER_USDC constant ─────────────────────────────────────────
  const { data: rstPerUsdc } = useReadContract({
    address: contracts?.REVENUE_SHARE,
    abi: REVENUE_SHARE_ABI,
    functionName: "RST_PER_USDC",
    args: [],
    query: { enabled: !!contracts, staleTime: Infinity },
  });
  const rstPreview =
    rstPerUsdc !== undefined
      ? Number(usdcAmount * (rstPerUsdc as bigint)) / 1e18
      : null;
  const ctPreview = usdcDollars;

  // ── Read isRegistered(creator) from CreatorToken ───────────────────────
  const { data: isRegisteredData, isLoading: isRegisteredLoading } =
    useReadContract({
      address: contracts?.CREATOR_TOKEN,
      abi: CREATOR_TOKEN_ABI,
      functionName: "isRegistered",
      args: [listing.creator],
      query: { enabled: step === 1 && !!contracts, staleTime: 15_000 },
    });
  const creatorRegistered = isRegisteredData === true;

  // ── Read USDC allowance ────────────────────────────────────────────────
  const {
    data: allowanceRaw,
    refetch: refetchAllowance,
    isFetching: allowanceFetching,
  } = useReadContract({
    address: contracts?.USDC,
    abi: ERC20_ABI,
    functionName: "allowance",
    args:
      contracts && investorAddress
        ? [investorAddress, contracts.REVENUE_SHARE]
        : undefined,
    query: {
      enabled: step === 1 && !!contracts && !!investorAddress,
      staleTime: 5_000,
    },
  });
  const allowanceSufficient =
    allowanceRaw !== undefined && (allowanceRaw as bigint) >= usdcAmount;

  // ── Read USDC balance ──────────────────────────────────────────────────
  const { data: usdcBalance } = useReadContract({
    address: contracts?.USDC,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: investorAddress ? [investorAddress] : undefined,
    query: {
      enabled: step === 0 && !!contracts && !!investorAddress,
      staleTime: 15_000,
    },
  });
  const balanceDollars =
    usdcBalance !== undefined
      ? Number(usdcBalance as bigint) / 1_000_000
      : null;
  const exceedsBalance =
    balanceDollars !== null && usdcDollars > balanceDollars;

  // ── Tx: USDC approve ───────────────────────────────────────────────────
  const {
    writeContract: writeApprove,
    data: approveTxHash,
    isPending: isApproving,
    error: approveWriteError,
    reset: resetApprove,
  } = useWriteContract();
  const { isLoading: approveConfirming, isSuccess: approveSuccess } =
    useWaitForTransactionReceipt({ hash: approveTxHash });
  const awaitingAllowanceConfirm = approveSuccess && !allowanceSufficient;

  // After approve confirmed, refetch allowance
  useEffect(() => {
    if (approveSuccess) {
      refetchAllowance();
      const t = setTimeout(() => refetchAllowance(), 2000);
      return () => clearTimeout(t);
    }
  }, [approveSuccess]);

  // ── Tx: buyTokens ──────────────────────────────────────────────────────
  const {
    writeContract: writeBuy,
    data: buyTxHash,
    isPending: isBuying,
    error: buyWriteError,
    reset: resetBuy,
  } = useWriteContract();
  const {
    isLoading: buyConfirming,
    isSuccess: buySuccess,
    data: buyReceipt,
  } = useWaitForTransactionReceipt({ hash: buyTxHash });

  // After buyTokens confirmed, post to API → success screen
  useEffect(() => {
    if (!buySuccess || !buyReceipt || isPosting) return;

    async function finalize() {
      setIsPosting(true);
      setPostError("");
      try {
        const parsedLogs = parseEventLogs({
          abi: REVENUE_SHARE_ABI,
          eventName: "TokensPurchased",
          logs: buyReceipt!.logs,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ev = (parsedLogs[0] as any)?.args;
        const rstAmt: bigint = ev?.rstAmount ?? 0n;
        const ctAmt: bigint = ev?.creatorTokensMinted ?? 0n;
        const usdcAmt: bigint = ev?.usdcAmount ?? usdcAmount;

        setResultRst(rstAmt.toString());
        setResultCt(ctAmt.toString());

        await investorApi.buyTokens({
          offeringId: listing.offeringId.toString(),
          usdcAmount: usdcAmt.toString(),
          rstAmount: rstAmt.toString(),
          ctAmount: ctAmt.toString(),
        });

        setStep(3);
      } catch (err) {
        setPostError(
          err instanceof Error
            ? err.message
            : "Investment recorded on-chain but failed to sync with backend."
        );
      } finally {
        setIsPosting(false);
      }
    }

    finalize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buySuccess, buyReceipt]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setStep(0);
      setPostError("");
      setIsPosting(false);
      setResultRst("");
      setResultCt("");
      resetApprove();
      resetBuy();
    }
  }, [open]);

  // ── Handlers ───────────────────────────────────────────────────────────
  async function handleApprove() {
    if (walletChainId !== BASE_SEPOLIA_CHAIN_ID) {
      try {
        await switchChainAsync({ chainId: BASE_SEPOLIA_CHAIN_ID });
      } catch {
        return;
      }
    }
    writeApprove({
      chainId: BASE_SEPOLIA_CHAIN_ID,
      address: contracts!.USDC,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [contracts!.REVENUE_SHARE, usdcAmount],
      account: investorAddress,
      chain: baseSepolia,
      gas: BigInt(100_000),
      maxFeePerGas: BigInt(10_000_000_000),
      maxPriorityFeePerGas: BigInt(1_000_000_000),
    });
  }

  async function handleBuy() {
    setPostError("");
    if (walletChainId !== BASE_SEPOLIA_CHAIN_ID) {
      try {
        await switchChainAsync({ chainId: BASE_SEPOLIA_CHAIN_ID });
      } catch {
        return;
      }
    }
    writeBuy({
      chainId: BASE_SEPOLIA_CHAIN_ID,
      address: contracts!.REVENUE_SHARE,
      abi: REVENUE_SHARE_ABI,
      functionName: "buyTokens",
      args: [listing.offeringId, usdcAmount],
      account: investorAddress,
      chain: baseSepolia,
      gas: BigInt(400_000),
      maxFeePerGas: BigInt(10_000_000_000),
      maxPriorityFeePerGas: BigInt(1_000_000_000),
    });
  }

  const amountValid =
    usdcDollars >= 1 &&
    !exceedsRemaining &&
    !exceedsBalance &&
    !deadlinePassed;
  const canInvest =
    isConnected && !!investorAddress && !!contracts && amountValid;

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-background border-border p-0 gap-0 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="font-display text-base font-bold text-foreground">
              Buy Tokens
            </DialogTitle>
            <StepDots current={step >= 3 ? 3 : step} />
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">

          {/* ── STEP 0: Amount ──────────────────────────────────────────── */}
          {step === 0 && (
            <motion.div
              key="amount"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="p-6 flex flex-col gap-4"
            >
              {/* Offering info */}
              <div className="rounded-xl border border-border bg-muted/20 px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-body text-xs text-muted-foreground">
                    Offering #{listing.offeringId.toString()}
                  </p>
                  <p className="font-display text-sm font-bold text-foreground mt-0.5">
                    {truncateAddr(listing.creator)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                    Remaining
                  </p>
                  <p className="font-display text-sm font-bold text-creo-teal">
                    {remaining > 0n ? fmtUSD(remainingDollars) : "Full"}
                  </p>
                </div>
              </div>

              {deadlinePassed && (
                <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <p className="font-body text-sm text-destructive">
                    The fundraise deadline for this offering has passed.
                  </p>
                </div>
              )}

              {!isConnected && (
                <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <p className="font-body text-sm text-destructive">
                    Connect your wallet to invest.
                  </p>
                </div>
              )}

              {/* USDC input */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="font-body text-sm font-bold text-foreground">
                    USDC Amount
                  </p>
                  {balanceDollars !== null && (
                    <p className="font-body text-xs text-muted-foreground">
                      Balance:{" "}
                      <span className="text-foreground font-semibold">
                        {fmtUSD(balanceDollars)}
                      </span>
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 rounded-xl border-2 border-border bg-background/60 px-4 py-3 focus-within:border-creo-teal/50 transition-colors">
                  <DollarSign className="h-4 w-4 text-creo-teal shrink-0" />
                  <input
                    type="number"
                    min={1}
                    value={usdcDollars}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (!isNaN(v) && v >= 0) {
                        const capped =
                          remainingDollars > 0
                            ? Math.min(v, remainingDollars)
                            : v;
                        setUsdcDollars(capped);
                      }
                    }}
                    className="flex-1 min-w-0 bg-transparent border-none outline-none font-display text-xl font-bold tabular-nums text-right text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                {exceedsBalance && (
                  <p className="font-body text-xs text-destructive">
                    Amount exceeds your USDC balance ({fmtUSD(balanceDollars!)}).
                  </p>
                )}
                {exceedsRemaining && (
                  <p className="font-body text-xs text-destructive">
                    Amount exceeds remaining capacity ({fmtUSD(remainingDollars)}).
                  </p>
                )}
                {remainingDollars > 0 && (
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0.25, 0.5, 0.75, 1].map((pct, idx) => {
                      const val = Math.floor(remainingDollars * pct);
                      const label =
                        idx < 3 ? `${(pct * 100).toFixed(0)}%` : "MAX";
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setUsdcDollars(val)}
                          className="rounded-lg border border-border bg-muted/20 hover:bg-muted/40 px-2 py-1.5 font-body text-xs font-bold text-muted-foreground hover:text-foreground transition-all"
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="rounded-xl border-2 border-border bg-background/40 p-4 flex flex-col gap-3">
                <p className="font-body text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  You will receive (estimated)
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-creo-teal/10 border border-creo-teal/20 flex items-center justify-center">
                      <TrendingUp className="h-3.5 w-3.5 text-creo-teal" />
                    </div>
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                        RST
                      </p>
                      <p className="font-display text-sm font-bold text-creo-teal">
                        {rstPreview !== null
                          ? rstPreview.toLocaleString("en-US", {
                              maximumFractionDigits: 2,
                            })
                          : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-creo-pink/10 border border-creo-pink/20 flex items-center justify-center">
                      <Zap className="h-3.5 w-3.5 text-creo-pink" />
                    </div>
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                        Creator Tokens
                      </p>
                      <p className="font-display text-sm font-bold text-creo-pink">
                        {ctPreview.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="font-body text-[10px] text-muted-foreground/60">
                  Revenue share:{" "}
                  {(Number(listing.revenueSharePct) / 100).toFixed(0)}% ·{" "}
                  {Number(listing.durationMonths)} months
                </p>
              </div>

              <Button
                onClick={() => setStep(1)}
                disabled={!canInvest}
                className="w-full bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Continue to Approve <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* ── STEP 1: Approve USDC ────────────────────────────────────── */}
          {step === 1 && (
            <motion.div
              key="approve"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
              className="p-6 flex flex-col gap-4"
            >
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  Approve USDC
                </h3>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  Grant the RevenueShare contract permission to pull{" "}
                  <span className="font-semibold text-foreground">
                    {fmtUSD(usdcDollars)}
                  </span>{" "}
                  USDC from your wallet.
                </p>
              </div>

              {/* Amount summary */}
              <div className="rounded-xl border-2 border-creo-teal/20 bg-creo-teal/[0.04] px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-body text-xs text-muted-foreground">
                    Investing
                  </p>
                  <p className="font-display text-2xl font-bold text-creo-teal mt-0.5">
                    {fmtUSD(usdcDollars)}
                  </p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">
                    Offering #{listing.offeringId.toString()} ·{" "}
                    {truncateAddr(listing.creator)}
                  </p>
                </div>
                <Coins className="h-7 w-7 text-creo-teal/30" />
              </div>

              {/* Creator registration check */}
              {isRegisteredLoading ? (
                <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/20 px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
                  <p className="font-body text-sm text-muted-foreground">
                    Checking creator registration…
                  </p>
                </div>
              ) : !creatorRegistered ? (
                <div className="flex items-start gap-2 rounded-xl border border-creo-yellow/30 bg-creo-yellow/10 px-4 py-3">
                  <Clock className="h-4 w-4 text-creo-yellow shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-sm font-semibold text-creo-yellow">
                      Creator not yet registered
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      This creator's token contract registration is pending
                      protocol approval. Investments will be available once
                      the backend completes their onboarding.
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Approve step — only shown when creator is registered */}
              {!isRegisteredLoading && creatorRegistered && (
                <div
                  className={`rounded-xl border-2 p-4 transition-all ${
                    allowanceSufficient || approveSuccess
                      ? "border-creo-teal/20 bg-creo-teal/[0.03]"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {allowanceSufficient || approveSuccess ? (
                        <CheckCircle2 className="h-4 w-4 text-creo-teal" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-border flex items-center justify-center font-body text-[11px] font-bold text-muted-foreground">
                          1
                        </div>
                      )}
                      <span className="font-body text-sm font-bold text-foreground">
                        Approve USDC
                      </span>
                    </div>
                    {(allowanceSufficient || approveSuccess) && (
                      <span className="font-body text-xs text-creo-teal">
                        Done
                      </span>
                    )}
                  </div>
                  <p className="font-body text-xs text-muted-foreground mb-3 ml-7">
                    Approve the RevenueShare contract to spend{" "}
                    <span className="font-semibold text-foreground">
                      {fmtUSD(usdcDollars)}
                    </span>{" "}
                    USDC.
                  </p>
                  {!allowanceSufficient && !approveSuccess && (
                    walletChainId !== BASE_SEPOLIA_CHAIN_ID ? (
                      <Button
                        size="sm"
                        onClick={() =>
                          switchChainAsync({ chainId: BASE_SEPOLIA_CHAIN_ID })
                        }
                        className="ml-7 bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
                      >
                        Switch to Base Sepolia
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={handleApprove}
                        disabled={
                          !isConnected || isApproving || approveConfirming
                        }
                        className="ml-7 bg-creo-teal/10 text-creo-teal hover:bg-creo-teal/20 border border-creo-teal/20"
                      >
                        {isApproving || approveConfirming ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                            Approving…
                          </>
                        ) : (
                          "Approve USDC"
                        )}
                      </Button>
                    )
                  )}
                  {approveWriteError && (
                    <p className="font-body text-xs text-destructive mt-2 ml-7">
                      {extractError(approveWriteError)}
                    </p>
                  )}
                </div>
              )}

              <TxLine
                label="USDC Approval"
                txHash={approveTxHash}
                isConfirming={approveConfirming}
                isConfirmed={approveSuccess}
              />

              {/* Proceed once approved */}
              <AnimatePresence>
                {(allowanceSufficient || approveSuccess) &&
                  !awaitingAllowanceConfirm && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <Button
                        onClick={() => setStep(2)}
                        className="w-full bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90"
                      >
                        Continue to Invest{" "}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </motion.div>
                  )}
                {awaitingAllowanceConfirm && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 py-2"
                  >
                    <Loader2 className="h-4 w-4 animate-spin text-creo-teal" />
                    <span className="font-body text-sm text-muted-foreground">
                      Confirming allowance…
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => setStep(0)}
                className="font-body text-xs text-muted-foreground hover:text-foreground text-center"
              >
                ← Back to amount
              </button>
            </motion.div>
          )}

          {/* ── STEP 2: Invest ──────────────────────────────────────────── */}
          {step === 2 && (
            <motion.div
              key="invest"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
              className="p-6 flex flex-col gap-4"
            >
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  Confirm Investment
                </h3>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  RSTs and Creator Tokens will be minted to your wallet in the
                  same transaction.
                </p>
              </div>

              {/* Summary grid */}
              <div className="rounded-xl border-2 border-border bg-card p-4 grid grid-cols-2 gap-3">
                {[
                  { l: "You Invest", v: fmtUSD(usdcDollars) },
                  { l: "Offering ID", v: `#${listing.offeringId.toString()}` },
                  {
                    l: "Revenue Share",
                    v: `${(Number(listing.revenueSharePct) / 100).toFixed(0)}%`,
                  },
                  {
                    l: "Duration",
                    v: `${Number(listing.durationMonths)} months`,
                  },
                  {
                    l: "RST (est.)",
                    v:
                      rstPreview !== null
                        ? rstPreview.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                          })
                        : "—",
                  },
                  { l: "Creator Tokens", v: ctPreview.toLocaleString() },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <p className="font-body text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                      {l}
                    </p>
                    <p className="font-display text-sm font-bold text-foreground mt-0.5">
                      {v}
                    </p>
                  </div>
                ))}
              </div>

              <TxLine
                label="Buy Tokens"
                txHash={buyTxHash}
                isConfirming={buyConfirming || isPosting}
                isConfirmed={buySuccess && !isPosting}
              />

              {(buyWriteError || postError) && (
                <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <p className="font-body text-sm text-destructive">
                    {buyWriteError ? extractError(buyWriteError) : postError}
                  </p>
                </div>
              )}

              <Button
                onClick={handleBuy}
                disabled={isBuying || buyConfirming || isPosting}
                className="w-full bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                {isBuying || buyConfirming || isPosting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isPosting
                      ? "Saving…"
                      : buyConfirming
                      ? "Confirming…"
                      : "Submitting…"}
                  </>
                ) : (
                  <>
                    Invest {fmtUSD(usdcDollars)}{" "}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>

              {!buyTxHash && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="font-body text-xs text-muted-foreground hover:text-foreground text-center"
                >
                  ← Back
                </button>
              )}
            </motion.div>
          )}

          {/* ── STEP 3: Success ─────────────────────────────────────────── */}
          {step === 3 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="p-8 flex flex-col items-center gap-5 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-creo-teal/10 border-2 border-creo-teal/20 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-creo-teal" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Investment Confirmed!
                </h3>
                <p className="font-body text-sm text-muted-foreground mt-1.5">
                  You've successfully invested{" "}
                  <span className="font-semibold text-foreground">
                    {fmtUSD(usdcDollars)}
                  </span>{" "}
                  in Offering #{listing.offeringId.toString()}.
                </p>
              </div>

              {buyTxHash && (
                <a
                  href={BASESCAN(buyTxHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-body text-sm text-creo-teal hover:underline"
                >
                  View on Basescan <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              <div className="grid grid-cols-3 gap-3 w-full">
                {[
                  { l: "USDC Invested", v: fmtUSD(usdcDollars) },
                  {
                    l: "RST Received",
                    v: resultRst
                      ? (() => {
                          const n = Number(BigInt(resultRst)) / 1e18;
                          return n > 1e6
                            ? `${(n / 1e6).toFixed(2)}M`
                            : n.toLocaleString("en-US", {
                                maximumFractionDigits: 2,
                              });
                        })()
                      : "—",
                  },
                  {
                    l: "Creator Tokens",
                    v: resultCt
                      ? Number(BigInt(resultCt)).toLocaleString()
                      : "—",
                  },
                ].map(({ l, v }) => (
                  <div
                    key={l}
                    className="rounded-xl border border-border bg-card p-3 text-left"
                  >
                    <p className="font-body text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                      {l}
                    </p>
                    <p className="font-display text-base font-bold text-foreground mt-0.5">
                      {v}
                    </p>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => onOpenChange(false)}
                className="w-full bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Done
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
