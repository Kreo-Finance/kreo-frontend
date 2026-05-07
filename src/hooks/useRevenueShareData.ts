import { useReadContracts, useReadContract, useChainId } from 'wagmi';
import { CREO_VAULT_ABI } from '@/abi/CreoVault';
import { REVENUE_SHARE_ABI } from '@/abi/RevenueShare';
import { getContractAddresses } from '@/config/contracts';

// ── Offering status enum (mirrors RevenueShare.sol) ──────────────────────────
export const OFFERING_STATUS: Record<number, string> = {
  0: 'Fundraising',
  1: 'Pending Release',
  2: 'Active',
  3: 'Completed',
  4: 'Expired',
  5: 'Defaulted',
};

// ── Offering struct as decoded by wagmi/viem ──────────────────────────────────
export interface OfferingStruct {
  creator: `0x${string}`;
  revenueSharePct: bigint;
  durationMonths: bigint;
  fundraiseTarget: bigint;
  totalRaised: bigint;
  fundraiseDeadline: bigint;
  capitalReleaseTimestamp: bigint;
  conservativeFloorUsed: bigint;
  varianceTierAtCreation: number;
  trustCapPct: number;
  settledMonths: number;
  deadlineExtended: boolean;
  status: number;
}

/**
 * Batches all RevenueShare view reads for a given creator.
 *
 * Batch A — always fetched:
 *   - activeOffering(creator)   from CreoVault  → which offering is live
 *   - nextOfferingId()          from RevenueShare → total offerings ever created
 *
 * Batch B — fetched only when the creator has an active offering:
 *   - getOffering(activeOfferingId) from RevenueShare → full offering struct
 *
 * Mirrors the useCreatorVaultData pattern: single multicall per batch,
 * flat return interface, 30-second staleTime.
 */
export function useRevenueShareData(creatorAddress?: `0x${string}`) {
  const chainId = useChainId();
  const contracts = getContractAddresses(chainId);
  const rsAddress = contracts?.REVENUE_SHARE;
  const vaultAddress = contracts?.KREO_VAULT;

  const enabled = !!creatorAddress && !!rsAddress && !!vaultAddress;

  // ── Batch A: active offering ID + total count ────────────────────────────
  const {
    data: batchA,
    isLoading: batchALoading,
    isError,
    refetch: refetchA,
  } = useReadContracts({
    contracts: enabled
      ? [
          // 0 — creator's active offering ID in CreoVault (0 = no active offering)
          {
            address: vaultAddress!,
            abi: CREO_VAULT_ABI,
            functionName: 'activeOffering',
            args: [creatorAddress!],
          },
          // 1 — next offering ID counter (total ever created + 1)
          {
            address: rsAddress!,
            abi: REVENUE_SHARE_ABI,
            functionName: 'nextOfferingId',
            args: [],
          },
        ]
      : [],
    query: { enabled, staleTime: 30_000 },
  });

  const activeOfferingId = (batchA?.[0]?.result as bigint | undefined) ?? 0n;
  const nextOfferingId   = batchA?.[1]?.result as bigint | undefined;
  const hasActiveOffering = activeOfferingId > 0n;

  // ── Batch B: offering details (only when an active offering exists) ───────
  const {
    data: batchB,
    isLoading: batchBLoading,
    refetch: refetchB,
  } = useReadContracts({
    contracts: enabled && hasActiveOffering
      ? [
          // 0 — full offering struct
          {
            address: rsAddress!,
            abi: REVENUE_SHARE_ABI,
            functionName: 'getOffering',
            args: [activeOfferingId],
          },
        ]
      : [],
    query: { enabled: enabled && hasActiveOffering, staleTime: 30_000 },
  });

  const offering = batchB?.[0]?.result as OfferingStruct | undefined;

  return {
    // ── Offering identity ──────────────────────────────────────────────────
    activeOfferingId,
    hasActiveOffering,
    nextOfferingId,

    // ── Full offering struct (undefined when no active offering) ──────────
    offering,

    // ── Flat fields (convenient aliases) ─────────────────────────────────
    offeringStatus:      offering?.status,
    offeringStatusLabel: offering?.status !== undefined
      ? (OFFERING_STATUS[offering.status] ?? '—')
      : undefined,
    revenueSharePct:          offering?.revenueSharePct,
    offeringDurationMonths:   offering?.durationMonths,
    fundraiseTarget:          offering?.fundraiseTarget,
    totalRaised:              offering?.totalRaised,
    fundraiseDeadline:        offering?.fundraiseDeadline,
    capitalReleaseTimestamp:  offering?.capitalReleaseTimestamp,
    conservativeFloorUsed:    offering?.conservativeFloorUsed,
    settledMonths:            offering?.settledMonths,
    trustCapPct:              offering?.trustCapPct,
    deadlineExtended:         offering?.deadlineExtended,
    varianceTierAtCreation:   offering?.varianceTierAtCreation,

    // ── Status ────────────────────────────────────────────────────────────
    isLoading: batchALoading || batchBLoading,
    isError,
    refetch: async () => { await refetchA(); await refetchB(); },

    // ── Raw addresses (for downstream hooks) ─────────────────────────────
    rsAddress,
    vaultAddress,
    chainId,
  };
}

/**
 * Reads getMaxFundraiseTarget from RevenueShare for a given creator and
 * offering parameters. Call this inside form components where shareBps and
 * durationMonths change reactively with slider input.
 *
 * Returns:
 *   maxRaise  — maximum raise in USDC6 (bigint)
 *   tier      — VarianceTier enum value (0=LOW, 1=MEDIUM, 2=HIGH)
 *   floor     — conservative floor in USDC6 (bigint)
 */
export function useMaxFundraiseTarget(
  creatorAddress?: `0x${string}`,
  shareBps?: bigint,
  durationMonths?: number,
) {
  const chainId = useChainId();
  const contracts = getContractAddresses(chainId);
  const rsAddress = contracts?.REVENUE_SHARE;

  const enabled =
    !!creatorAddress &&
    !!rsAddress &&
    shareBps !== undefined &&
    shareBps > 0n &&
    !!durationMonths;

  const { data, isLoading, isError, refetch } = useReadContract({
    address: rsAddress,
    abi: REVENUE_SHARE_ABI,
    functionName: 'getMaxFundraiseTarget',
    args: enabled
      ? [creatorAddress!, shareBps!, BigInt(durationMonths!)]
      : undefined,
    query: { enabled, staleTime: 15_000 },
  });

  const result = data as [bigint, number, bigint] | undefined;

  return {
    maxRaise:      result?.[0],            // USDC6 bigint
    maxRaiseTier:  result?.[1],            // 0=LOW, 1=MEDIUM, 2=HIGH
    maxRaiseFloor: result?.[2],            // USDC6 bigint (conservative floor)
    maxRaiseDollars: result?.[0] !== undefined
      ? Number(result[0]) / 1_000_000
      : 0,
    isLoading,
    isError,
    refetch,
  };
}
