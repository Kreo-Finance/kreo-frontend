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
  DollarSign, Wallet, TrendingUp, Lock, Shield,
  CheckCircle2, ExternalLink, AlertCircle, Loader2,
  ArrowRight, AlertTriangle,
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
import { CREO_VAULT_ABI } from "@/abi/CreoVault";
import { REVENUE_SHARE_ABI } from "@/abi/RevenueShare";
import { getContractAddresses, VARIANCE_TIER_LABELS, BASE_SEPOLIA_CHAIN_ID } from "@/config/contracts";
import { creatorApi } from "@/lib/api/creator";
import { useMaxFundraiseTarget, useRevenueShareData } from "@/hooks/useRevenueShareData";
import type { useCreatorVaultData } from "@/hooks/useCreatorVaultData";

// ── Constants ─────────────────────────────────────────────────────────────────
const PROTOCOL_FEE = 0.03;
const COVERAGE_RATIO = 1.22;
const MIN_RETAIN_PCT = 0.35;
const DEADLINE_OPTIONS = [7, 10, 14, 21, 30];
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
] as const;

// ── Error mapping ─────────────────────────────────────────────────────────────
const CONTRACT_ERRORS: Record<string, string> = {
  RevenueShare__ProtocolDefaultLockActive: "Your account has an active default lock and cannot create offerings.",
  RevenueShare__ActiveOfferingExists: "You already have an active offering. Complete it before creating another.",
  RevenueShare__SocialProofScoreTooLow: "KreoScore is below the required minimum of 40. Update your score first.",
  RevenueShare__SocialProofScoreStale: "KreoScore is stale (>30 days). Please refresh it before creating an offering.",
  RevenueShare__RevenueShareExceedsCap: "Revenue share exceeds the 70% protocol maximum.",
  RevenueShare__RaiseExceedsTrustCap: "Raise amount exceeds your trust cap for this offering.",
  RevenueShare__InsufficientRetainedIncome: "You must retain at least 35% of floor income after the revenue share.",
  RevenueShare__CoverageRatioNotMet: "Coverage ratio is below 1.22×. Increase duration or revenue share, or lower the raise.",
  RevenueShare__BondNotDeposited: "Bond not deposited. Please complete the bond deposit step.",
  RevenueShare__BondInsufficientForRaise: "Current bond deposit is insufficient for this raise amount.",
  RevenueShare__InsufficientHistoryForRaise: "At least 6 months of verified earnings history is required.",
  RevenueShare__CreatorPaused: "Your creator account is currently paused.",
  RevenueShare__InvalidDuration: "Offering duration must be between 3 and 12 months.",
  RevenueShare__DeadlineDurationExceedsMax: "Deadline duration exceeds the 30-day maximum.",
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

// ── Formatters ────────────────────────────────────────────────────────────────
const fmtUSD = (v: number) =>
  v >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(1)}M`
    : v >= 1_000
    ? `$${(v / 1_000).toFixed(1)}K`
    : `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ── Sub-components ────────────────────────────────────────────────────────────
type Tick = { value: number; label: string };

function Slider({
  value, min, max, step, ticks, onChange, accent = "teal",
}: {
  value: number; min: number; max: number; step: number;
  ticks: Tick[]; onChange: (v: number) => void; accent?: "teal" | "pink";
}) {
  const pct = ((Math.min(max, Math.max(min, value)) - min) / (max - min)) * 100;
  const hsl = accent === "teal" ? "hsl(var(--creo-teal))" : "hsl(var(--creo-pink))";
  const txt = accent === "teal" ? "text-creo-teal" : "text-creo-pink";
  return (
    <div className="flex flex-col gap-0">
      <div className="relative h-6 flex items-center">
        <div className="absolute inset-x-0 h-[3px] rounded-full bg-border/60" />
        <div className="absolute left-0 h-[3px] rounded-full pointer-events-none" style={{ width: `${pct}%`, background: hsl }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-6" style={{ zIndex: 2 }}
        />
        <div
          className="absolute w-[15px] h-[15px] rounded-full border-[3px] border-background shadow pointer-events-none"
          style={{ left: `calc(${pct}% - 7.5px)`, background: hsl }}
        />
      </div>
      <div className="relative h-[22px]">
        {ticks.map((t) => {
          const tp = ((t.value - min) / (max - min)) * 100;
          const active = value === t.value;
          return (
            <button
              key={t.value} type="button" onClick={() => onChange(t.value)}
              className="absolute flex flex-col items-center gap-[2px]"
              style={{ left: `${tp}%`, transform: "translateX(-50%)", background: "none", border: "none", padding: 0, cursor: "pointer" }}
            >
              <div className="w-px h-[4px]" style={{ background: active ? hsl : "hsl(var(--border))" }} />
              <span className={`font-body text-[10px] font-bold whitespace-nowrap ${active ? txt : "text-muted-foreground/50"}`}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatRow({
  label, sub, value, accent = "teal", icon: Icon,
}: {
  label: string; sub?: string; value: string;
  accent?: "teal" | "pink" | "yellow"; icon?: React.ElementType;
}) {
  const iconBg  = { teal: "bg-creo-teal/10 border-creo-teal/20",   pink: "bg-creo-pink/10 border-creo-pink/20",   yellow: "bg-creo-yellow/10 border-creo-yellow/20" }[accent];
  const iconTxt = { teal: "text-creo-teal", pink: "text-creo-pink", yellow: "text-creo-yellow" }[accent];
  const valTxt  = { teal: "text-creo-teal", pink: "text-creo-pink", yellow: "text-creo-yellow" }[accent];
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border-2 border-border bg-background/60 hover:border-border/80 transition-colors">
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && (
          <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon className={`h-3.5 w-3.5 ${iconTxt}`} />
          </div>
        )}
        <div className="min-w-0">
          <p className="font-body text-[11px] font-extrabold tracking-widest uppercase text-foreground/80 leading-none">{label}</p>
          {sub && <p className="font-body text-[10px] text-muted-foreground/60 mt-0.5 truncate">{sub}</p>}
        </div>
      </div>
      <p className={`font-display text-base font-bold tabular-nums shrink-0 ${valTxt}`}>{value}</p>
    </div>
  );
}

function TxLine({
  label, txHash, isConfirming, isConfirmed,
}: {
  label: string; txHash?: `0x${string}`; isConfirming: boolean; isConfirmed: boolean;
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
        {isConfirmed && <span className="font-body text-xs text-creo-teal">Confirmed</span>}
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

function StepDots({ current }: { current: number }) {
  const labels = ["Configure", "Bond", "Create"];
  return (
    <div className="flex items-center gap-2">
      {labels.map((l, i) => (
        <div key={l} className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 ${i < current ? "text-creo-teal" : i === current ? "text-foreground" : "text-muted-foreground/40"}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
              i < current ? "bg-creo-teal border-creo-teal text-background"
              : i === current ? "border-creo-teal text-creo-teal"
              : "border-border text-muted-foreground"
            }`}>
              {i < current ? "✓" : i + 1}
            </div>
            <span className="font-body text-xs font-semibold hidden sm:block">{l}</span>
          </div>
          {i < labels.length - 1 && (
            <div className={`h-px w-6 ${i < current ? "bg-creo-teal" : "bg-border"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Slider tick presets ────────────────────────────────────────────────────────
const SHARE_TICKS: Tick[] = [
  { value: 10, label: "10%" }, { value: 20, label: "20%" },
  { value: 35, label: "35%" }, { value: 50, label: "50%" },
  { value: 70, label: "70%" },
];
const DURATION_OPTIONS = [3, 6, 12, 24, 60];

// ── Types ─────────────────────────────────────────────────────────────────────
type VaultData = ReturnType<typeof useCreatorVaultData>;

// ── Main Modal ────────────────────────────────────────────────────────────────
export function CreateOfferingModal({
  open, onOpenChange, creatorAddress, vaultData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creatorAddress: `0x${string}`;
  vaultData: VaultData;
}) {
  const { chainId: walletChainId, isConnected } = useAccount();
  const contracts = getContractAddresses(BASE_SEPOLIA_CHAIN_ID);
  const { switchChainAsync } = useSwitchChain();
  const { hasActiveOffering, activeOfferingId } = useRevenueShareData(creatorAddress);

  // ── Form state ───────────────────────────────────────────────────────────
  const [sharePercent, setSharePercent] = useState(20);
  const [durationMonths, setDurationMonths] = useState<number | undefined>(undefined);
  const [raiseAmount, setRaiseAmount] = useState(10_000);
  const [deadlineDays, setDeadlineDays] = useState<number | undefined>(undefined);
  const [step, setStep] = useState(0); // 0=configure, 1=bond, 2=create, 3=success
  const [postError, setPostError] = useState("");
  const [offeringId, setOfferingId] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  // ── Derived on-chain values ───────────────────────────────────────────────
  const shareBps = BigInt(Math.round(sharePercent * 100));
  const raiseUsdc6 = BigInt(Math.round(raiseAmount * 1_000_000));
  const bondRateBps = vaultData.bondRateBps ?? 0n;
  const conservativeFloor = vaultData.conservativeFloor ?? 0n;
  const currentBond = vaultData.bondDeposit ?? 0n;
  const requiredBond = bondRateBps > 0n ? (raiseUsdc6 * bondRateBps) / 10000n : 0n;
  const bondSufficient = currentBond > 0n && currentBond >= requiredBond;

  // ── Display math ─────────────────────────────────────────────────────────
  const floorDisplay = Number(conservativeFloor) / 1_000_000;
  const netCapital = raiseAmount * (1 - PROTOCOL_FEE);
  const investorsPerMonth = floorDisplay * sharePercent / 100;
  const youKeep = floorDisplay - investorsPerMonth;
  const bondDisplayAmt = Number(requiredBond) / 1_000_000;
  const totalPayout = investorsPerMonth * (durationMonths ?? 0);
  const coverageRatio = raiseAmount > 0 ? totalPayout / raiseAmount : 0;
  const coverageMet = coverageRatio >= COVERAGE_RATIO;
  const retainOk = floorDisplay === 0 || youKeep >= floorDisplay * MIN_RETAIN_PCT;

  // ── On-chain max raise from RevenueShare (via dedicated hook) ────────────
  const {
    maxRaiseDollars,
    maxRaise: maxRaiseUsdc6,
    isLoading: maxRaiseLoading,
  } = useMaxFundraiseTarget(creatorAddress, shareBps, durationMonths ?? undefined);

  useEffect(() => {
    if (maxRaiseDollars > 0 && raiseAmount > maxRaiseDollars) {
      setRaiseAmount(Math.floor(maxRaiseDollars));
    }
  }, [maxRaiseDollars]);

  // ── USDC allowance for KreoVault ──────────────────────────────────────────
  const { data: allowanceRaw, refetch: refetchAllowance, isFetching: allowanceFetching } = useReadContract({
    address: contracts?.USDC,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: contracts ? [creatorAddress, contracts.KREO_VAULT] : undefined,
    query: { enabled: step === 1 && !!contracts, staleTime: 5_000 },
  });
  const allowanceSufficient =
    allowanceRaw !== undefined && (allowanceRaw as bigint) >= requiredBond;

  // ── Tx: USDC approve ─────────────────────────────────────────────────────
  const {
    writeContract: writeApprove,
    data: approveTxHash,
    isPending: isApproving,
    error: approveWriteError,
    reset: resetApprove,
  } = useWriteContract();
  const { isLoading: approveConfirming, isSuccess: approveSuccess } =
    useWaitForTransactionReceipt({ hash: approveTxHash });

  // True while waiting for the on-chain allowance read to confirm after approve tx
  const awaitingAllowanceConfirm = approveSuccess && !allowanceSufficient;

  // ── Tx: depositBond ──────────────────────────────────────────────────────
  const {
    writeContract: writeDeposit,
    data: depositTxHash,
    isPending: isDepositing,
    error: depositWriteError,
    reset: resetDeposit,
  } = useWriteContract();
  const { isLoading: depositConfirming, isSuccess: depositSuccess } =
    useWaitForTransactionReceipt({ hash: depositTxHash });

  // ── Tx: createOffering ───────────────────────────────────────────────────
  const {
    writeContract: writeCreate,
    data: createTxHash,
    isPending: isCreating,
    error: createWriteError,
    reset: resetCreate,
  } = useWriteContract();
  const { isLoading: createConfirming, isSuccess: createSuccess, data: createReceipt } =
    useWaitForTransactionReceipt({ hash: createTxHash });

  // After approve confirmed, refetch allowance so allowanceSufficient flips to true
  useEffect(() => {
    if (approveSuccess) {
      // Poll briefly to pick up the on-chain state after confirmation
      refetchAllowance();
      const t = setTimeout(() => refetchAllowance(), 2000);
      return () => clearTimeout(t);
    }
  }, [approveSuccess]);

  // After deposit confirmed, refetch vault to verify bond on-chain
  useEffect(() => {
    if (depositSuccess) vaultData.refetch();
  }, [depositSuccess]);

  // After createOffering confirmed, post to API → success screen
  useEffect(() => {
    if (!createSuccess || !createReceipt || isPosting) return;

    async function finalize() {
      setIsPosting(true);
      setPostError("");
      try {
        const parsedLogs = parseEventLogs({
          abi: REVENUE_SHARE_ABI,
          eventName: "OfferingCreated",
          logs: createReceipt!.logs,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eventOfferingId = (parsedLogs[0] as any)?.args?.offeringId;
        const idStr = eventOfferingId !== undefined ? eventOfferingId.toString() : "";
        setOfferingId(idStr);

        await creatorApi.createOffering({
          sharePercentage: sharePercent.toFixed(2),
          floorPrice: floorDisplay,
          raiseTarget: raiseAmount,
          duration: durationMonths,
          expiryTime: Math.floor(Date.now() / 1000) + deadlineDays! * 24 * 60 * 60,
          maxRaise: maxRaiseDollars,
          bondDeposited: Number(currentBond) / 1_000_000,
        });

        setStep(3);
      } catch (err) {
        setPostError(err instanceof Error ? err.message : "Failed to record offering on backend.");
      } finally {
        setIsPosting(false);
      }
    }

    finalize();
  }, [createSuccess, createReceipt]);

  // Error watcher — surfaces write errors the same way the reference code does
  useEffect(() => {
    if (approveWriteError) console.error("[approve]", approveWriteError);
  }, [approveWriteError]);
  useEffect(() => {
    if (depositWriteError) console.error("[deposit]", depositWriteError);
  }, [depositWriteError]);
  useEffect(() => {
    if (createWriteError) console.error("[create]", createWriteError);
  }, [createWriteError]);

  // Reset all state when modal closes
  useEffect(() => {
    if (!open) {
      setStep(0);
      setPostError("");
      setOfferingId("");
      setIsPosting(false);
      setDurationMonths(undefined);
      setDeadlineDays(undefined);
      resetApprove();
      resetDeposit();
      resetCreate();
    }
  }, [open]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handleContinue() {
    bondSufficient ? setStep(2) : setStep(1);
  }

  async function handleApprove() {
    if (walletChainId !== BASE_SEPOLIA_CHAIN_ID) {
      try {
        await switchChainAsync({ chainId: BASE_SEPOLIA_CHAIN_ID });
      } catch {
        return; // user rejected or switch failed — don't proceed
      }
    }
    writeApprove({
      chainId: BASE_SEPOLIA_CHAIN_ID,
      address: contracts!.USDC,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [contracts!.KREO_VAULT, requiredBond],
      account: creatorAddress,
      chain: baseSepolia,
      gas: BigInt(100_000),
      maxFeePerGas: BigInt(10_000_000_000),
      maxPriorityFeePerGas: BigInt(1_000_000_000),
    });
  }

  async function handleDeposit() {
    if (walletChainId !== BASE_SEPOLIA_CHAIN_ID) {
      try {
        await switchChainAsync({ chainId: BASE_SEPOLIA_CHAIN_ID });
      } catch {
        return;
      }
    }
    writeDeposit({
      chainId: BASE_SEPOLIA_CHAIN_ID,
      address: contracts!.KREO_VAULT,
      abi: CREO_VAULT_ABI,
      functionName: "depositBond",
      args: [requiredBond],
      account: creatorAddress,
      chain: baseSepolia,
      gas: BigInt(200_000),
      maxFeePerGas: BigInt(10_000_000_000),
      maxPriorityFeePerGas: BigInt(1_000_000_000),
    });
  }

  async function handleCreate() {
    setPostError("");
    if (walletChainId !== BASE_SEPOLIA_CHAIN_ID) {
      try {
        await switchChainAsync({ chainId: BASE_SEPOLIA_CHAIN_ID });
      } catch {
        return;
      }
    }
    writeCreate({
      address: contracts!.REVENUE_SHARE,
      abi: REVENUE_SHARE_ABI,
      functionName: "createOffering",
      args: [shareBps, BigInt(durationMonths!), raiseUsdc6, BigInt(deadlineDays! * 24 * 60 * 60)],
      account: creatorAddress,
      chain: baseSepolia,
      gas: BigInt(500_000),
      maxFeePerGas: BigInt(10_000_000_000),
      maxPriorityFeePerGas: BigInt(1_000_000_000),
    });
  }

  const durationValid = durationMonths !== undefined && durationMonths >= 3 && durationMonths <= 60;
  const deadlineValid = deadlineDays !== undefined && deadlineDays >= 1 && deadlineDays <= 30;

  const isViable =
    raiseAmount > 0 &&
    (maxRaiseDollars === 0 || raiseAmount <= maxRaiseDollars) &&
    coverageMet &&
    retainOk &&
    sharePercent <= 70 &&
    durationValid &&
    deadlineValid &&
    !hasActiveOffering;

  const bondRatePct = bondRateBps > 0n ? Number(bondRateBps) / 100 : 10;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl bg-background border-border p-0 gap-0 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="font-display text-base font-bold text-foreground">
              Create Revenue Share Offering
            </DialogTitle>
            <StepDots current={step >= 3 ? 3 : step} />
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">

          {/* ── STEP 0: Configure ─────────────────────────────────────────── */}
          {step === 0 && (
            <motion.div
              key="configure"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="grid md:grid-cols-[1fr_360px]"
            >
              {/* LEFT — inputs */}
              <div className="p-6 flex flex-col gap-5 md:border-r border-border">

                {/* Active offering error */}
                {hasActiveOffering && (
                  <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <p className="font-body text-sm text-destructive">
                      You already have an active offering (#{activeOfferingId?.toString()}).
                      Complete or close it before creating a new one.
                    </p>
                  </div>
                )}

                {/* Conservative floor card */}
                {conservativeFloor > 0n && (
                  <div className="rounded-xl border border-creo-teal/20 bg-creo-teal/[0.04] px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-body text-[10px] font-bold tracking-widest uppercase text-creo-teal/70">
                        Conservative Floor
                      </p>
                      <p className="font-display text-xl font-bold text-creo-teal mt-0.5">
                        {fmtUSD(floorDisplay)}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                      </p>
                      {vaultData.varianceTier !== undefined && (
                        <p className="font-body text-xs text-muted-foreground mt-0.5">
                          {VARIANCE_TIER_LABELS[vaultData.varianceTier]} variance · {vaultData.monthsRecorded ?? 0} months on record
                        </p>
                      )}
                    </div>
                    <Shield className="h-7 w-7 text-creo-teal/30" />
                  </div>
                )}

                {/* Revenue share slider */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <p className="font-body text-sm font-bold text-foreground">Revenue Share</p>
                    <div className="flex items-center gap-0.5">
                      <input
                        type="number"
                        min={1}
                        max={70}
                        step={0.5}
                        value={sharePercent}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          if (!isNaN(v) && v > 0) setSharePercent(v);
                        }}
                        onBlur={(e) => {
                          const v = parseFloat(e.target.value);
                          setSharePercent(isNaN(v) ? 1 : Math.max(1, Math.min(70, v)));
                        }}
                        className="w-14 text-right bg-transparent border-none outline-none font-display text-lg font-bold text-creo-pink [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="font-display text-lg font-bold text-creo-pink">%</span>
                    </div>
                  </div>
                  <Slider
                    value={sharePercent} min={1} max={70} step={0.5}
                    ticks={SHARE_TICKS} onChange={setSharePercent} accent="pink"
                  />
                </div>

                {/* Duration pills */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <p className="font-body text-sm font-bold text-foreground">Offering Duration</p>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={3}
                        max={60}
                        placeholder="mo"
                        value={durationMonths ?? ""}
                        onChange={(e) => {
                          if (e.target.value === "") { setDurationMonths(undefined); return; }
                          const v = parseInt(e.target.value);
                          if (!isNaN(v)) setDurationMonths(v);
                        }}
                        className="w-14 text-right bg-transparent border border-border/60 rounded-lg px-2 py-1 font-display text-sm font-bold text-foreground focus:border-creo-teal/50 outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="font-body text-xs text-muted-foreground">mo</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {DURATION_OPTIONS.map((m) => (
                      <button
                        key={m} type="button"
                        onClick={() => setDurationMonths(m)}
                        className={`rounded-xl border-2 px-3 py-2.5 font-body text-sm font-bold transition-all ${
                          durationMonths === m
                            ? "border-creo-teal bg-creo-teal/10 text-creo-teal"
                            : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
                        }`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                  {durationMonths !== undefined && durationMonths < 3 && (
                    <p className="font-body text-xs text-destructive">Minimum duration is 3 months.</p>
                  )}
                  {durationMonths !== undefined && durationMonths > 60 && (
                    <p className="font-body text-xs text-destructive">Maximum duration is 60 months (5 years).</p>
                  )}
                </div>

                {/* Fundraise deadline */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <p className="font-body text-sm font-bold text-foreground">Fundraise Deadline</p>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={1}
                        max={30}
                        placeholder="days"
                        value={deadlineDays ?? ""}
                        onChange={(e) => {
                          if (e.target.value === "") { setDeadlineDays(undefined); return; }
                          const v = parseInt(e.target.value);
                          if (!isNaN(v)) setDeadlineDays(v);
                        }}
                        className="w-16 text-right bg-transparent border border-border/60 rounded-lg px-2 py-1 font-display text-sm font-bold text-foreground focus:border-creo-teal/50 outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="font-body text-xs text-muted-foreground">days</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {DEADLINE_OPTIONS.map((d) => (
                      <button
                        key={d} type="button"
                        onClick={() => setDeadlineDays(d)}
                        className={`rounded-xl border-2 px-2 py-2.5 font-body text-sm font-bold transition-all ${
                          deadlineDays === d
                            ? "border-creo-teal bg-creo-teal/10 text-creo-teal"
                            : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
                        }`}
                      >
                        {d}d
                      </button>
                    ))}
                  </div>
                  {deadlineDays !== undefined && deadlineDays < 1 && (
                    <p className="font-body text-xs text-destructive">Minimum deadline is 1 day.</p>
                  )}
                  {deadlineDays !== undefined && deadlineDays > 30 && (
                    <p className="font-body text-xs text-destructive">Maximum deadline is 30 days.</p>
                  )}
                </div>

                {/* Raise amount */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <p className="font-body text-sm font-bold text-foreground">Raise Target</p>
                    {maxRaiseDollars > 0 && !maxRaiseLoading && (
                      <p className="font-body text-xs text-muted-foreground">
                        On-chain max: <span className="text-creo-teal font-semibold">{fmtUSD(maxRaiseDollars)}</span>
                      </p>
                    )}
                    {maxRaiseLoading && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border-2 border-border bg-background/60 px-4 py-3 focus-within:border-creo-teal/50 transition-colors">
                    <span className="font-body text-base font-bold text-creo-teal shrink-0">$</span>
                    <input
                      type="number"
                      value={raiseAmount}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (!isNaN(v) && v >= 0) {
                          setRaiseAmount(maxRaiseDollars > 0 ? Math.min(v, maxRaiseDollars) : v);
                        }
                      }}
                      min={100}
                      className="flex-1 min-w-0 bg-transparent border-none outline-none font-display text-xl font-bold tabular-nums text-right text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  {/* Quick-select buttons */}
                  {maxRaiseDollars > 0 && (
                    <div className="grid grid-cols-4 gap-1.5">
                      {[0.25, 0.5, 0.75, 1].map((pct, idx) => {
                        const val = Math.floor(maxRaiseDollars * pct);
                        const label = idx < 3 ? `${(pct * 100).toFixed(0)}%` : "MAX";
                        return (
                          <button
                            key={label} type="button"
                            onClick={() => setRaiseAmount(val)}
                            className="rounded-lg border border-border bg-muted/20 hover:bg-muted/40 px-2 py-1.5 font-body text-xs font-bold text-muted-foreground hover:text-foreground transition-all"
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT — live preview */}
              <div className="p-6 flex flex-col gap-3 bg-muted/[0.03]">
                <div className="relative overflow-hidden rounded-xl border-2 border-border bg-background/60 px-5 py-4">
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.07]"
                    style={{ background: "radial-gradient(ellipse at 80% 20%, hsl(var(--creo-pink)), transparent 65%)" }}
                  />
                  <p className="font-body text-[10px] font-bold tracking-widest uppercase text-muted-foreground/70">
                    Net Capital You Receive
                  </p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={netCapital.toFixed(0)}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="font-display font-bold text-transparent bg-clip-text leading-none mt-1"
                      style={{ backgroundImage: "var(--gradient-teal-pink)", fontSize: "clamp(1.8rem, 4vw, 2.4rem)" }}
                    >
                      {fmtUSD(netCapital)}
                    </motion.p>
                  </AnimatePresence>
                  <p className="font-body text-xs text-muted-foreground mt-1">after 3% protocol fee</p>

                  <div className="mt-3">
                    <div className="flex justify-between mb-1.5">
                      <span className="font-body text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">Coverage Ratio</span>
                      <span className={`font-body text-[11px] font-bold ${coverageMet ? "text-creo-teal" : "text-destructive"}`}>
                        {coverageRatio.toFixed(2)}× {coverageMet ? "✓" : "(min 1.22×)"}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-border/50 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(to right, hsl(var(--creo-teal)), hsl(var(--creo-pink)))" }}
                        animate={{ width: `${Math.min(100, (coverageRatio / COVERAGE_RATIO) * 100)}%` }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    </div>
                    <p className="font-body text-[10px] text-muted-foreground/40 mt-1">1.22× enforced on-chain</p>
                  </div>
                </div>

                <StatRow label="Investors Get" sub="Monthly USDC distribution"
                  value={`${fmtUSD(investorsPerMonth)}/mo`} accent="pink" icon={TrendingUp} />
                <StatRow label="You Keep" sub={retainOk ? "After revenue share" : "Below 35% minimum"}
                  value={`${fmtUSD(youKeep)}/mo`} accent={retainOk ? "teal" : "pink"} icon={Wallet} />
                <StatRow
                  label="Bond Required"
                  sub={`${bondRatePct}% of raise · returned +2% on success`}
                  value={fmtUSD(bondDisplayAmt)} accent="yellow" icon={Lock}
                />

                {/* Warnings */}
                <AnimatePresence>
                  {(!coverageMet || !retainOk) && raiseAmount > 0 && floorDisplay > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }} className="overflow-hidden"
                    >
                      <div className="flex items-start gap-2 rounded-xl border-2 border-creo-pink/25 bg-creo-pink/[0.05] px-3 py-2.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-creo-pink shrink-0 mt-0.5" />
                        <p className="font-body text-xs text-foreground/70 leading-snug">
                          {!coverageMet
                            ? "Coverage ratio below 1.22×. Increase duration, revenue share, or lower your raise amount."
                            : "You'd retain less than 35% of floor income. Reduce revenue share to pass on-chain validation."}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  onClick={handleContinue}
                  disabled={!isViable || maxRaiseLoading}
                  className="w-full bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90 mt-auto"
                >
                  {maxRaiseLoading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Calculating…</>
                  ) : bondSufficient ? (
                    <>Continue to Create <ArrowRight className="h-4 w-4 ml-2" /></>
                  ) : (
                    <>Continue to Bond Deposit <ArrowRight className="h-4 w-4 ml-2" /></>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 1: Bond Deposit ──────────────────────────────────────── */}
          {step === 1 && (
            <motion.div
              key="bond"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
              className="p-6 flex flex-col gap-4 max-w-xl mx-auto w-full"
            >
              <div>
                <h3 className="font-display text-base font-bold text-foreground">Deposit Bond</h3>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  A commitment bond is required before creating an offering. It's fully returned plus a 2% bonus when you complete all settlement months.
                </p>
              </div>

              {/* Bond amount card */}
              <div className="rounded-xl border-2 border-creo-yellow/20 bg-creo-yellow/[0.04] px-4 py-4 flex items-center justify-between">
                <div>
                  <p className="font-body text-xs text-muted-foreground">Bond Required</p>
                  <p className="font-display text-2xl font-bold text-creo-yellow mt-0.5">{fmtUSD(bondDisplayAmt)}</p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">
                    {bondRatePct}% of {fmtUSD(raiseAmount)} raise
                  </p>
                </div>
                <Lock className="h-7 w-7 text-creo-yellow/30" />
              </div>

              {/* Current bond */}
              <div className="rounded-xl border border-border bg-background/40 px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-body text-xs text-muted-foreground">Current Bond on File</p>
                  <p className="font-display text-base font-semibold text-foreground mt-0.5">
                    {fmtUSD(Number(currentBond) / 1_000_000)}
                  </p>
                </div>
                {currentBond > 0n && (
                  <span className="font-body text-xs font-semibold text-creo-teal px-2 py-0.5 rounded-full bg-creo-teal/10 border border-creo-teal/20">
                    On-chain
                  </span>
                )}
              </div>

              {/* Step A: Approve USDC */}
              <div className={`rounded-xl border-2 p-4 transition-all ${
                allowanceSufficient || approveSuccess
                  ? "border-creo-teal/20 bg-creo-teal/[0.03]"
                  : "border-border"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {allowanceSufficient || approveSuccess ? (
                      <CheckCircle2 className="h-4 w-4 text-creo-teal" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-border flex items-center justify-center font-body text-[11px] font-bold text-muted-foreground">
                        1
                      </div>
                    )}
                    <span className="font-body text-sm font-bold text-foreground">Approve USDC</span>
                  </div>
                  {(allowanceSufficient || approveSuccess) && (
                    <span className="font-body text-xs text-creo-teal">Done</span>
                  )}
                </div>
                <p className="font-body text-xs text-muted-foreground mb-3 ml-7">
                  Grant the Kreo Vault a one-time unlimited USDC approval so future bond deposits never fail due to allowance limits.
                </p>
                {!allowanceSufficient && !approveSuccess && (
                  walletChainId !== BASE_SEPOLIA_CHAIN_ID ? (
                    <Button
                      size="sm"
                      onClick={() => switchChainAsync({ chainId: BASE_SEPOLIA_CHAIN_ID })}
                      className="ml-7 bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
                    >
                      Switch to Base Sepolia
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleApprove}
                      disabled={!isConnected || isApproving || approveConfirming}
                      className="ml-7 bg-creo-teal/10 text-creo-teal hover:bg-creo-teal/20 border border-creo-teal/20"
                    >
                      {isApproving || approveConfirming ? (
                        <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Approving…</>
                      ) : "Approve USDC"}
                    </Button>
                  )
                )}
                {approveWriteError && (
                  <p className="font-body text-xs text-destructive mt-2 ml-7">{extractError(approveWriteError)}</p>
                )}
              </div>

              <TxLine
                label="USDC Approval"
                txHash={approveTxHash}
                isConfirming={approveConfirming}
                isConfirmed={approveSuccess}
              />

              {/* Step B: Deposit Bond */}
              <div className={`rounded-xl border-2 p-4 transition-all ${
                depositSuccess
                  ? "border-creo-teal/20 bg-creo-teal/[0.03]"
                  : (allowanceSufficient || approveSuccess)
                  ? "border-creo-yellow/20"
                  : "border-border opacity-50"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {depositSuccess ? (
                      <CheckCircle2 className="h-4 w-4 text-creo-teal" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-border flex items-center justify-center font-body text-[11px] font-bold text-muted-foreground">
                        2
                      </div>
                    )}
                    <span className="font-body text-sm font-bold text-foreground">Deposit Bond</span>
                  </div>
                  {depositSuccess && (
                    <span className="font-body text-xs text-creo-teal">Done</span>
                  )}
                </div>
                <p className="font-body text-xs text-muted-foreground mb-3 ml-7">
                  Lock {fmtUSD(bondDisplayAmt)} USDC as your commitment bond in the Kreo Vault.
                </p>
                {!depositSuccess && (
                  <Button
                    size="sm"
                    onClick={handleDeposit}
                    disabled={
                      !isConnected ||
                      isDepositing ||
                      depositConfirming ||
                      !allowanceSufficient ||
                      awaitingAllowanceConfirm ||
                      allowanceFetching
                    }
                    className="ml-7 bg-creo-yellow/10 text-creo-yellow hover:bg-creo-yellow/20 border border-creo-yellow/20"
                  >
                    {isDepositing || depositConfirming ? (
                      <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Depositing…</>
                    ) : awaitingAllowanceConfirm || allowanceFetching ? (
                      <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Confirming allowance…</>
                    ) : "Deposit Bond"}
                  </Button>
                )}
                {depositWriteError && (
                  <p className="font-body text-xs text-destructive mt-2 ml-7">{extractError(depositWriteError)}</p>
                )}
              </div>

              <TxLine
                label="Bond Deposit"
                txHash={depositTxHash}
                isConfirming={depositConfirming}
                isConfirmed={depositSuccess}
              />

              {/* Create Offering button — only after bond confirmed on-chain */}
              <AnimatePresence>
                {(depositSuccess || bondSufficient) && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Button
                      onClick={() => setStep(2)}
                      className="w-full bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90"
                    >
                      Create Offering <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => setStep(0)}
                className="font-body text-xs text-muted-foreground hover:text-foreground text-center"
              >
                ← Back to configure
              </button>
            </motion.div>
          )}

          {/* ── STEP 2: Create Offering ───────────────────────────────────── */}
          {step === 2 && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
              className="p-6 flex flex-col gap-4 max-w-xl mx-auto w-full"
            >
              <div>
                <h3 className="font-display text-base font-bold text-foreground">Review & Launch</h3>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  Confirm the parameters and submit your offering to the RevenueShare contract. The fundraise window will open for 7 days.
                </p>
              </div>

              {/* Summary */}
              <div className="rounded-xl border-2 border-border bg-card p-4 grid grid-cols-2 gap-3">
                {[
                  { l: "Revenue Share", v: `${sharePercent}%` },
                  { l: "Duration", v: durationMonths !== undefined ? `${durationMonths} months` : "—" },
                  { l: "Raise Target", v: fmtUSD(raiseAmount) },
                  { l: "Net to You", v: fmtUSD(netCapital) },
                  { l: "Bond on File", v: fmtUSD(Number(currentBond) / 1_000_000) },
                  { l: "Deadline", v: deadlineDays !== undefined ? `${deadlineDays} days` : "—" },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <p className="font-body text-[10px] font-bold tracking-widest uppercase text-muted-foreground">{l}</p>
                    <p className="font-display text-sm font-bold text-foreground mt-0.5">{v}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-creo-teal/20 bg-creo-teal/[0.04] px-4 py-3 flex items-start gap-2">
                <Shield className="h-4 w-4 text-creo-teal shrink-0 mt-0.5" />
                <p className="font-body text-xs text-muted-foreground">
                  Capital is held for 3 days after the fundraise closes for fraud detection, then released to you minus the 3% protocol fee.
                </p>
              </div>

              {/* Tx line */}
              <TxLine
                label="Create Offering"
                txHash={createTxHash}
                isConfirming={createConfirming || isPosting}
                isConfirmed={createSuccess && !isPosting}
              />

              {/* Errors */}
              {(createWriteError || postError) && (
                <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <p className="font-body text-sm text-destructive">
                    {createWriteError ? extractError(createWriteError) : postError}
                  </p>
                </div>
              )}

              <Button
                onClick={handleCreate}
                disabled={isCreating || createConfirming || isPosting}
                className="w-full bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                {isCreating || createConfirming || isPosting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isPosting ? "Saving…" : createConfirming ? "Confirming…" : "Submitting…"}</>
                ) : (
                  <>Launch Offering <ArrowRight className="h-4 w-4 ml-2" /></>
                )}
              </Button>

              {!createTxHash && (
                <button
                  type="button"
                  onClick={() => setStep(bondSufficient ? 0 : 1)}
                  className="font-body text-xs text-muted-foreground hover:text-foreground text-center"
                >
                  ← Back
                </button>
              )}
            </motion.div>
          )}

          {/* ── STEP 3: Success ───────────────────────────────────────────── */}
          {step === 3 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="p-8 flex flex-col items-center gap-5 text-center max-w-md mx-auto w-full"
            >
              <div className="w-16 h-16 rounded-full bg-creo-teal/10 border-2 border-creo-teal/20 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-creo-teal" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">Offering Live!</h3>
                <p className="font-body text-sm text-muted-foreground mt-1.5">
                  Your revenue share offering is now open to investors for {deadlineDays ?? "—"} days.
                  {offeringId && <> Offering ID: <span className="font-semibold text-foreground">#{offeringId}</span></>}
                </p>
              </div>

              {createTxHash && (
                <a
                  href={BASESCAN(createTxHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-body text-sm text-creo-teal hover:underline"
                >
                  View on Basescan <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              <div className="grid grid-cols-3 gap-3 w-full">
                {[
                  { l: "Share", v: `${sharePercent}%` },
                  { l: "Duration", v: durationMonths !== undefined ? `${durationMonths}mo` : "—" },
                  { l: "Target", v: fmtUSD(raiseAmount) },
                ].map(({ l, v }) => (
                  <div key={l} className="rounded-xl border border-border bg-card p-3 text-left">
                    <p className="font-body text-[10px] font-bold tracking-widest uppercase text-muted-foreground">{l}</p>
                    <p className="font-display text-base font-bold text-foreground mt-0.5">{v}</p>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => {
                  onOpenChange(false);
                  window.location.href = "/creator/dashboard";
                }}
                className="w-full bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                View Dashboard
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
