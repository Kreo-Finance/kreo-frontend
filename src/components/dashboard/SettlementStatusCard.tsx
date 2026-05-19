import { motion } from "framer-motion";
import { useReadContracts, useChainId } from "wagmi";
import { CalendarClock, Loader2, TrendingUp } from "lucide-react";
import { SETTLEMENT_ABI } from "@/abi/Settlement";
import { REVENUE_SHARE_ABI } from "@/abi/RevenueShare";
import { CREO_VAULT_ABI } from "@/abi/CreoVault";
import { getContractAddresses } from "@/config/contracts";
import type { OfferingStruct } from "@/hooks/useRevenueShareData";

const SETTLEMENT_INTERVAL_SECS = 30 * 24 * 60 * 60; // 30 days

function fmtDate(ts: bigint): string {
  return new Date(Number(ts) * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtUsdc(raw: bigint): string {
  const dollars = Number(raw) / 1_000_000;
  return `$${dollars.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function SkeletonText({ w = "w-24" }: { w?: string }) {
  return (
    <span
      className={`inline-block h-4 ${w} rounded bg-muted animate-pulse`}
    />
  );
}

function InfoRow({
  label,
  value,
  loading,
  valueClass = "text-foreground",
}: {
  label: string;
  value?: string;
  loading: boolean;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="font-body text-sm text-muted-foreground">{label}</span>
      <span className={`font-display text-sm font-semibold ${valueClass}`}>
        {loading ? <SkeletonText /> : value}
      </span>
    </div>
  );
}

interface SettlementStatusCardProps {
  creatorAddress?: `0x${string}`;
  motionDelay?: number;
}

export default function SettlementStatusCard({
  creatorAddress,
  motionDelay = 0.5,
}: SettlementStatusCardProps) {
  const chainId = useChainId();
  const contracts = getContractAddresses(chainId);

  const batchAEnabled = !!creatorAddress && !!contracts;

  // Batch A: resolve activeOfferingId from CreoVault
  const { data: batchA, isLoading: loadingA } = useReadContracts({
    contracts: batchAEnabled
      ? [
          {
            address: contracts!.KREO_VAULT,
            abi: CREO_VAULT_ABI,
            functionName: "activeOffering",
            args: [creatorAddress!],
          },
        ]
      : [],
    query: { enabled: batchAEnabled, staleTime: 30_000 },
  });

  const offeringId = (batchA?.[0]?.result as bigint | undefined) ?? 0n;
  const hasOffering = offeringId > 0n;
  const batchBEnabled = batchAEnabled && hasOffering;

  // Batch B: offering struct + 3 Settlement reads (dependent on offeringId)
  const { data: batchB, isLoading: loadingB } = useReadContracts({
    contracts: batchBEnabled
      ? [
          // 0 — RevenueShare.getOffering → settledMonths, durationMonths
          {
            address: contracts!.REVENUE_SHARE,
            abi: REVENUE_SHARE_ABI,
            functionName: "getOffering",
            args: [offeringId],
          },
          // 1 — Settlement.s_lastSettlementTimestamp
          {
            address: contracts!.SETTLEMENT,
            abi: SETTLEMENT_ABI,
            functionName: "s_lastSettlementTimestamp",
            args: [offeringId],
          },
          // 2 — Settlement.s_totalSettled
          {
            address: contracts!.SETTLEMENT,
            abi: SETTLEMENT_ABI,
            functionName: "s_totalSettled",
            args: [offeringId],
          },
          // 3 — Settlement.manualSettleUnlockTime
          {
            address: contracts!.SETTLEMENT,
            abi: SETTLEMENT_ABI,
            functionName: "manualSettleUnlockTime",
            args: [offeringId],
          },
        ]
      : [],
    query: { enabled: batchBEnabled, staleTime: 30_000 },
  });

  const isLoading = loadingA || loadingB;

  const offering = batchB?.[0]?.result as OfferingStruct | undefined;
  const lastSettledTs = (batchB?.[1]?.result as bigint | undefined) ?? 0n;
  const totalSettled = (batchB?.[2]?.result as bigint | undefined) ?? 0n;
  const manualUnlockTs = (batchB?.[3]?.result as bigint | undefined) ?? 0n;

  const settledMonths = offering?.settledMonths ?? 0;
  const durationMonths = offering ? Number(offering.durationMonths) : 0;
  const progressPct =
    durationMonths > 0
      ? Math.min(100, Math.round((settledMonths / durationMonths) * 100))
      : 0;

  const lastSettledLabel =
    lastSettledTs > 0n ? fmtDate(lastSettledTs) : "No settlements yet";

  const nextSettledLabel =
    lastSettledTs > 0n
      ? `~${fmtDate(lastSettledTs + BigInt(SETTLEMENT_INTERVAL_SECS))}`
      : "—";

  const totalSettledLabel = fmtUsdc(totalSettled);

  const manualUnlockLabel =
    lastSettledTs > 0n && manualUnlockTs > 0n
      ? fmtDate(manualUnlockTs)
      : null;

  // No wallet / no offering state
  if (!batchAEnabled) return null;

  if (!isLoading && !hasOffering) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: motionDelay }}
        className="rounded-xl border border-border bg-card p-6 mb-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <CalendarClock className="h-4 w-4 text-creo-teal" />
          <h2 className="font-display text-lg font-semibold text-foreground">
            Settlement Status
          </h2>
        </div>
        <p className="font-body text-sm text-muted-foreground">
          No active offering — create one to see settlement data.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: motionDelay }}
      className="rounded-xl border border-border bg-card p-6 mb-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-creo-teal" />
          <h2 className="font-display text-lg font-semibold text-foreground">
            Settlement Status
          </h2>
        </div>
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {!isLoading && offeringId > 0n && (
          <span className="font-body text-xs text-muted-foreground">
            Offering #{offeringId.toString()}
          </span>
        )}
      </div>

      {/* Month progress bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between font-body text-xs text-muted-foreground mb-2">
          <span>Month progress</span>
          {isLoading ? (
            <SkeletonText w="w-16" />
          ) : (
            <span className="font-semibold text-foreground">
              {settledMonths} / {durationMonths} months
            </span>
          )}
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          {isLoading ? (
            <div className="h-full w-1/3 bg-muted-foreground/20 animate-pulse rounded-full" />
          ) : (
            <motion.div
              className="h-full bg-gradient-to-r from-creo-teal to-creo-teal/70 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}
        </div>
      </div>

      {/* Info rows */}
      <div className="divide-y divide-border/50">
        <InfoRow
          label="Last settlement"
          value={lastSettledLabel}
          loading={isLoading}
          valueClass={
            lastSettledTs > 0n ? "text-creo-teal" : "text-muted-foreground"
          }
        />
        <InfoRow
          label="Total paid to investors"
          value={totalSettledLabel}
          loading={isLoading}
          valueClass={totalSettled > 0n ? "text-creo-yellow" : "text-foreground"}
        />
        <InfoRow
          label="Next settlement"
          value={nextSettledLabel}
          loading={isLoading}
          valueClass="text-muted-foreground"
        />
        {!isLoading && manualUnlockLabel && (
          <div className="flex items-start justify-between pt-2 gap-4">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-muted-foreground/60 shrink-0" />
              <span className="font-body text-xs text-muted-foreground/70">
                Oracle fallback available after
              </span>
            </div>
            <span className="font-body text-xs text-muted-foreground/70 text-right shrink-0">
              {manualUnlockLabel}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
