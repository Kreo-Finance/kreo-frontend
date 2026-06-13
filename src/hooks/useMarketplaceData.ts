import { useMemo, useState, useEffect } from 'react';
import { useReadContracts, useChainId } from 'wagmi';
import { CREO_VAULT_ABI } from '@/abi/CreoVault';
import { REVENUE_SHARE_ABI } from '@/abi/RevenueShare';
import { KREO_SCORE_ABI } from '@/abi/KreoScore';
import { getContractAddresses } from '@/config/contracts';
import { OFFERING_STATUS } from './useRevenueShareData';
import type { OfferingStruct } from './useRevenueShareData';
import { creatorApi } from '@/lib/api/creator';

// Hard cap: never fetch more than this many offerings in one page load
const MAX_OFFERINGS = 50;

export type TierNumber = 0 | 1 | 2 | 3;

export interface MarketplaceListing {
  offeringId: bigint;
  creator: `0x${string}`;
  // Offering fields (all as returned by getOffering)
  revenueSharePct: bigint;
  durationMonths: bigint;
  fundraiseTarget: bigint;
  totalRaised: bigint;
  fundraiseDeadline: bigint;
  conservativeFloorUsed: bigint;
  trustCapPct: number;
  settledMonths: number;
  status: number;
  statusLabel: string;
  deadlineExtended: boolean;
  // Computed display values
  progress: number;       // 0-100 %
  yieldEstimate: number;  // % return over duration
  // Creator-level data
  kreoScore: number;
  scoreTier: TierNumber;
  hasKreoScore: boolean;
  bondDeposit: bigint;
}

/**
 * Fetches all marketplace data in four batched multicall steps:
 *
 *  Step 1 — nextOfferingId from RevenueShare (establishes iteration range)
 *  Step 2 — getOffering(id) for every id 1..nextId-1
 *  Step 3 — getScore / getScoreTier / hasScore from KreoScore per unique creator
 *  Step 4 — s_socialProofScore / s_bondDeposits from CreoVault per unique creator
 */
export function useMarketplaceData() {
  const chainId = useChainId();
  const contracts = getContractAddresses(chainId);

  // ── Backend API: fetch curated offering ID list ───────────────────────
  const [backendIds, setBackendIds] = useState<bigint[] | null>(null);
  const [backendLoading, setBackendLoading] = useState(true);

  useEffect(() => {
    creatorApi.getOfferings()
      .then(records => {
        const seen = new Set<string>();
        const ids = records
          .map(r => { try { return BigInt(r.offeringId); } catch { return null; } })
          .filter((id): id is bigint => {
            if (id === null) return false;
            const key = id.toString();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })
          .slice(0, MAX_OFFERINGS);
        setBackendIds(ids);
      })
      .catch(() => setBackendIds(null))
      .finally(() => setBackendLoading(false));
  }, []);

  // ── Step 1: total offering count (stats + chain-scan fallback) ────────
  const { data: s1, isLoading: s1Loading, isError } = useReadContracts({
    contracts: contracts
      ? [{
          address: contracts.REVENUE_SHARE,
          abi: REVENUE_SHARE_ABI,
          functionName: 'nextOfferingId' as const,
          args: [],
        }]
      : [],
    query: { enabled: !!contracts, staleTime: 30_000 },
  });

  const nextOfferingId = s1?.[0]?.result as bigint | undefined;
  const totalCreated =
    nextOfferingId !== undefined && nextOfferingId > 1n
      ? Number(nextOfferingId) - 1
      : 0;

  const offeringIds = useMemo((): bigint[] => {
    // Prefer backend-curated list; fall back to full chain scan when API fails
    if (backendIds !== null) return backendIds;
    if (!nextOfferingId || nextOfferingId <= 1n) return [];
    const count = Math.min(totalCreated, MAX_OFFERINGS);
    return Array.from({ length: count }, (_, i) => BigInt(i + 1));
  }, [backendIds, nextOfferingId, totalCreated]);

  // ── Step 2: fetch every offering struct ───────────────────────────────
  const { data: s2, isLoading: s2Loading } = useReadContracts({
    contracts:
      contracts && offeringIds.length > 0
        ? offeringIds.map(id => ({
            address: contracts.REVENUE_SHARE,
            abi: REVENUE_SHARE_ABI,
            functionName: 'getOffering' as const,
            args: [id] as [bigint],
          }))
        : [],
    query: { enabled: !!contracts && offeringIds.length > 0, staleTime: 30_000, refetchInterval: 60_000 },
  });

  // Filter out zero-address / missing offerings and deduplicate creators
  const offerings = useMemo(() => {
    if (!s2) return [];
    return offeringIds
      .map((id, i) => {
        const o = s2[i]?.result as OfferingStruct | undefined;
        if (!o || o.creator === '0x0000000000000000000000000000000000000000') return null;
        return { id, data: o };
      })
      .filter(Boolean) as { id: bigint; data: OfferingStruct }[];
  }, [s2, offeringIds]);

  const uniqueCreators = useMemo(() => {
    const seen = new Set<string>();
    return offerings.reduce<`0x${string}`[]>((acc, { data }) => {
      const lc = data.creator.toLowerCase();
      if (!seen.has(lc)) { seen.add(lc); acc.push(data.creator); }
      return acc;
    }, []);
  }, [offerings]);

  // ── Step 3: KreoScore — 3 reads per creator ───────────────────────────
  // If the creator has no NFT minted yet, getScore / getScoreTier will revert
  // and wagmi returns undefined for those slots — we fall back to socialProofScore.
  const { data: s3, isLoading: s3Loading } = useReadContracts({
    contracts:
      contracts && uniqueCreators.length > 0
        ? uniqueCreators.flatMap(creator => [
            {
              address: contracts.KREO_SCORE,
              abi: KREO_SCORE_ABI,
              functionName: 'getScore' as const,
              args: [creator] as [`0x${string}`],
            },
            {
              address: contracts.KREO_SCORE,
              abi: KREO_SCORE_ABI,
              functionName: 'getScoreTier' as const,
              args: [creator] as [`0x${string}`],
            },
            {
              address: contracts.KREO_SCORE,
              abi: KREO_SCORE_ABI,
              functionName: 'hasScore' as const,
              args: [creator] as [`0x${string}`],
            },
          ])
        : [],
    query: { enabled: !!contracts && uniqueCreators.length > 0, staleTime: 30_000 },
  });

  // ── Step 4: CreoVault — 2 reads per creator ───────────────────────────
  const { data: s4, isLoading: s4Loading } = useReadContracts({
    contracts:
      contracts && uniqueCreators.length > 0
        ? uniqueCreators.flatMap(creator => [
            {
              address: contracts.KREO_VAULT,
              abi: CREO_VAULT_ABI,
              functionName: 's_socialProofScore' as const,
              args: [creator] as [`0x${string}`],
            },
            {
              address: contracts.KREO_VAULT,
              abi: CREO_VAULT_ABI,
              functionName: 's_bondDeposits' as const,
              args: [creator] as [`0x${string}`],
            },
          ])
        : [],
    query: { enabled: !!contracts && uniqueCreators.length > 0, staleTime: 30_000 },
  });

  // ── Assemble listings ──────────────────────────────────────────────────
  const listings = useMemo((): MarketplaceListing[] => {
    if (!s3 || !s4 || offerings.length === 0) return [];

    return offerings
      .map(({ id, data }) => {
        const cIdx = uniqueCreators.findIndex(
          c => c.toLowerCase() === data.creator.toLowerCase()
        );
        if (cIdx === -1) return null;

        // KreoScore slots (3 per creator)
        const sBase = cIdx * 3;
        const rawScore  = s3[sBase]?.result     as bigint  | undefined;
        const tierRaw   = s3[sBase + 1]?.result as number  | undefined;
        const hasSc     = s3[sBase + 2]?.result as boolean | undefined;

        // Vault slots (2 per creator)
        const vBase = cIdx * 2;
        const socialProof = s4[vBase]?.result     as bigint | undefined;
        const bond        = s4[vBase + 1]?.result as bigint | undefined;

        // If KreoScore NFT is minted, use on-chain score+tier.
        // Otherwise fall back to s_socialProofScore (set during onboarding, e.g. 50 for Gumroad).
        const hasKreoScore = hasSc === true && rawScore !== undefined;
        const kreoScore = hasKreoScore
          ? Number(rawScore!)
          : Number(socialProof ?? 0n);
        const scoreTier = (hasKreoScore && tierRaw !== undefined ? tierRaw : 0) as TierNumber;

        // Yield estimate: (conservative payout / raise - 1) * 100 %
        const floor  = Number(data.conservativeFloorUsed);
        const share  = Number(data.revenueSharePct);  // bps
        const dur    = Number(data.durationMonths);
        const raise  = Number(data.fundraiseTarget);
        const payout = raise > 0 ? (floor * share * dur) / 10_000 : 0;
        const yieldEstimate = raise > 0 ? Math.max(0, (payout / raise - 1) * 100) : 0;

        const progress =
          data.fundraiseTarget > 0n
            ? Math.min(100, Number((data.totalRaised * 100n) / data.fundraiseTarget))
            : 0;

        return {
          offeringId: id,
          creator: data.creator,
          revenueSharePct: data.revenueSharePct,
          durationMonths: data.durationMonths,
          fundraiseTarget: data.fundraiseTarget,
          totalRaised: data.totalRaised,
          fundraiseDeadline: data.fundraiseDeadline,
          conservativeFloorUsed: data.conservativeFloorUsed,
          trustCapPct: data.trustCapPct,
          settledMonths: data.settledMonths,
          status: data.status,
          statusLabel: OFFERING_STATUS[data.status] ?? '—',
          deadlineExtended: data.deadlineExtended ?? false,
          progress,
          yieldEstimate,
          kreoScore,
          scoreTier,
          hasKreoScore,
          bondDeposit: bond ?? 0n,
        };
      })
      .filter(Boolean) as MarketplaceListing[];
  }, [offerings, uniqueCreators, s3, s4]);

  // ── Aggregate stats ────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalRaisedSum = listings.reduce((acc, l) => acc + l.totalRaised, 0n);
    return {
      totalOfferings: totalCreated,
      uniqueCreators: uniqueCreators.length,
      openOfferings:  listings.filter(l => l.status === 0).length,
      totalRaisedUSDC6: totalRaisedSum,
    };
  }, [listings, totalCreated, uniqueCreators]);

  return {
    listings,
    stats,
    uniqueCreators,
    isLoading: backendLoading || s1Loading || s2Loading || s3Loading || s4Loading,
    isError,
  };
}
