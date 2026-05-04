import { useReadContracts, useBalance, useChainId } from 'wagmi';
import { CREO_VAULT_ABI } from '@/abi/CreoVault';
import { getContractAddresses } from '@/config/contracts';

/**
 * Batches all CreoVault view reads for a given creator address via multicall.
 * Also fetches ETH and USDC balances. Returns undefined for each field while loading.
 */
export function useCreatorVaultData(creatorAddress?: `0x${string}`) {
  const chainId = useChainId();
  const contracts = getContractAddresses(chainId);
  const vaultAddress = contracts?.KREO_VAULT;
  const usdcAddress = contracts?.USDC;

  const enabled = !!creatorAddress && !!vaultAddress;

  const { data, isLoading, isError, refetch } = useReadContracts({
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

  // ETH balance for gas awareness
  const { data: ethBalance, isLoading: ethBalanceLoading } = useBalance({
    address: creatorAddress,
    query: { enabled: !!creatorAddress },
  });

  // USDC balance
  const { data: usdcBalance, isLoading: usdcBalanceLoading } = useBalance({
    address: creatorAddress,
    token: usdcAddress,
    query: { enabled: !!creatorAddress && !!usdcAddress },
  });

  return {
    // Contract reads
    conservativeFloor:   data?.[0]?.result  as bigint  | undefined,
    varianceTier:        data?.[1]?.result  as number  | undefined,
    bondRateBps:         data?.[2]?.result  as bigint  | undefined,
    avgMonthlyEarnings:  data?.[3]?.result  as bigint  | undefined,
    monthsRecorded:      data?.[4]?.result  as number  | undefined,
    lastVerifiedEarnings:data?.[5]?.result  as bigint  | undefined,
    bondDeposit:         data?.[6]?.result  as bigint  | undefined,
    isRegistered:        data?.[7]?.result  as boolean | undefined,
    conservativeMonthly: data?.[8]?.result  as bigint  | undefined,
    socialProofScore:    data?.[9]?.result  as bigint  | undefined,
    offeringCompletions: data?.[10]?.result as number  | undefined,

    // Balances
    ethBalance,
    usdcBalance,

    // Status
    isLoading: isLoading || ethBalanceLoading || usdcBalanceLoading,
    isError,
    refetch,

    // Helpers
    vaultAddress,
    usdcAddress,
    chainId,
  };
}
