import { useReadContracts, useReadContract, useBalance, useChainId } from 'wagmi';
import { CREO_VAULT_ABI } from '@/abi/CreoVault';
import { getContractAddresses } from '@/config/contracts';
import { formatUnits } from 'viem';

// Minimal ERC20 ABI for balanceOf
const ERC20_BALANCE_ABI = [
  {
    name: 'balanceOf',
    type: 'function' as const,
    stateMutability: 'view' as const,
    inputs: [{ name: 'account', type: 'address' as const }],
    outputs: [{ name: '', type: 'uint256' as const }],
  },
] as const;

// wagmi v2+ removed the `token` param from useBalance — ERC20 balances
// must be read via useReadContract with the balanceOf ABI.
// USDC on Base Sepolia has 6 decimals.
const USDC_DECIMALS = 6;

/**
 * Batches all CreoVault view reads for a given creator address via multicall.
 * Fetches native ETH balance via useBalance and USDC via ERC20 balanceOf.
 */
export function useCreatorVaultData(creatorAddress?: `0x${string}`) {
  const chainId = useChainId();
  const contracts = getContractAddresses(chainId);
  const vaultAddress = contracts?.KREO_VAULT;
  const usdcAddress = contracts?.USDC;

  const enabled = !!creatorAddress && !!vaultAddress;

  // ── Vault multicall ──────────────────────────────────────────────────────
  const { data, isLoading: vaultLoading, isError, refetch } = useReadContracts({
    contracts: enabled
      ? [
          // 0 - conservative floor (USDC6)
          { address: vaultAddress!, abi: CREO_VAULT_ABI, functionName: 's_cachedConservativeFloor', args: [creatorAddress!] },
          // 1 - variance tier enum: 0=LOW, 1=MEDIUM, 2=HIGH
          { address: vaultAddress!, abi: CREO_VAULT_ABI, functionName: 's_cachedVarianceTier', args: [creatorAddress!] },
          // 2 - bond rate in basis points
          { address: vaultAddress!, abi: CREO_VAULT_ABI, functionName: 's_bondRates', args: [creatorAddress!] },
          // 3 - average monthly earnings (USDC6)
          { address: vaultAddress!, abi: CREO_VAULT_ABI, functionName: 'getAverageMonthlyEarnings', args: [creatorAddress!] },
          // 4 - number of verified months recorded
          { address: vaultAddress!, abi: CREO_VAULT_ABI, functionName: 's_earningsMonthsRecorded', args: [creatorAddress!] },
          // 5 - last month's verified earnings (USDC6)
          { address: vaultAddress!, abi: CREO_VAULT_ABI, functionName: 's_lastVerifiedEarnings', args: [creatorAddress!] },
          // 6 - bond deposit amount (USDC6)
          { address: vaultAddress!, abi: CREO_VAULT_ABI, functionName: 's_bondDeposits', args: [creatorAddress!] },
          // 7 - registration status
          { address: vaultAddress!, abi: CREO_VAULT_ABI, functionName: 'isCreatorRegistered', args: [creatorAddress!] },
          // 8 - conservative monthly earnings (USDC6)
          { address: vaultAddress!, abi: CREO_VAULT_ABI, functionName: 'getConservativeMonthlyEarnings', args: [creatorAddress!] },
          // 9 - social proof / KreoScore
          { address: vaultAddress!, abi: CREO_VAULT_ABI, functionName: 's_socialProofScore', args: [creatorAddress!] },
          // 10 - offering completion count
          { address: vaultAddress!, abi: CREO_VAULT_ABI, functionName: 's_offeringCompletionCount', args: [creatorAddress!] },
        ]
      : [],
    query: { enabled, staleTime: 30_000 },
  });

  // ── Native ETH balance (useBalance works correctly for native) ───────────
  const { data: ethBalanceData, isLoading: ethLoading } = useBalance({
    address: creatorAddress,
    query: { enabled: !!creatorAddress },
  });

  // ── USDC balance via ERC20 balanceOf ─────────────────────────────────────
  // wagmi v2+ removed `token` from useBalance; use useReadContract instead.
  const { data: usdcRaw, isLoading: usdcLoading } = useReadContract({
    address: usdcAddress,
    abi: ERC20_BALANCE_ABI,
    functionName: 'balanceOf',
    args: creatorAddress ? [creatorAddress] : undefined,
    query: { enabled: !!creatorAddress && !!usdcAddress, staleTime: 30_000 },
  });

  // Shape the USDC result to match the same interface as ethBalanceData
  const usdcBalance = usdcRaw !== undefined
    ? {
        value: usdcRaw as bigint,
        decimals: USDC_DECIMALS,
        symbol: 'USDC',
        formatted: formatUnits(usdcRaw as bigint, USDC_DECIMALS),
      }
    : undefined;

  return {
    // Vault contract reads
    conservativeFloor:    data?.[0]?.result  as bigint  | undefined,
    varianceTier:         data?.[1]?.result  as number  | undefined,
    bondRateBps:          data?.[2]?.result  as bigint  | undefined,
    avgMonthlyEarnings:   data?.[3]?.result  as bigint  | undefined,
    monthsRecorded:       data?.[4]?.result  as number  | undefined,
    lastVerifiedEarnings: data?.[5]?.result  as bigint  | undefined,
    bondDeposit:          data?.[6]?.result  as bigint  | undefined,
    isRegistered:         data?.[7]?.result  as boolean | undefined,
    conservativeMonthly:  data?.[8]?.result  as bigint  | undefined,
    socialProofScore:     data?.[9]?.result  as bigint  | undefined,
    offeringCompletions:  data?.[10]?.result as number  | undefined,

    // Balances
    ethBalance: ethBalanceData,  // { value, decimals, formatted, symbol }
    usdcBalance,                 // { value, decimals: 6, formatted, symbol: 'USDC' }

    // Status
    isLoading: vaultLoading || ethLoading || usdcLoading,
    isError,
    refetch,

    // Addresses
    vaultAddress,
    usdcAddress,
    chainId,
  };
}
