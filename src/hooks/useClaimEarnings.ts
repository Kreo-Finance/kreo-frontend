import { useState } from 'react';
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useSwitchChain,
} from 'wagmi';
import { parseEventLogs, BaseError, ContractFunctionRevertedError } from 'viem';
import { baseSepolia } from 'viem/chains';
import { SETTLEMENT_ABI } from '@/abi/Settlement';
import { getContractAddresses, BASE_SEPOLIA_CHAIN_ID } from '@/config/contracts';

function extractClaimError(err: unknown): string {
  if (err instanceof BaseError) {
    const revert = err.walk((e) => e instanceof ContractFunctionRevertedError);
    if (revert instanceof ContractFunctionRevertedError) {
      const name = revert.data?.errorName ?? '';
      if (name === 'Settlement__NothingToClaim') {
        return 'Nothing to claim yet — wait for next monthly settlement';
      }
      return name || err.shortMessage;
    }
    return err.shortMessage;
  }
  if (err instanceof Error) return err.message;
  return 'Unknown error. Please try again.';
}

export type ClaimMode = 'single' | 'all' | null;

export function useClaimEarnings() {
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const contracts = getContractAddresses(BASE_SEPOLIA_CHAIN_ID);

  const [activeOfferingId, setActiveOfferingId] = useState<string | null>(null);
  const [claimMode, setClaimMode] = useState<ClaimMode>(null);

  const { writeContract, data: txHash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, data: receipt } =
    useWaitForTransactionReceipt({ hash: txHash });

  const claimedAmount: bigint = (() => {
    if (!isSuccess || !receipt) return 0n;
    try {
      const logs = parseEventLogs({
        abi: SETTLEMENT_ABI,
        eventName: 'EarningsClaimed',
        logs: receipt.logs,
      });
      return logs.reduce(
        (acc, log) => acc + (log.args as { amount: bigint }).amount,
        0n,
      );
    } catch {
      return 0n;
    }
  })();

  async function claimSingle(offeringId: string) {
    if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
      try {
        await switchChainAsync({ chainId: BASE_SEPOLIA_CHAIN_ID });
      } catch {
        return;
      }
    }
    setActiveOfferingId(offeringId);
    setClaimMode('single');
    writeContract({
      chainId: BASE_SEPOLIA_CHAIN_ID,
      address: contracts!.SETTLEMENT,
      abi: SETTLEMENT_ABI,
      functionName: 'claimEarnings',
      args: [BigInt(offeringId)],
      account: address,
      chain: baseSepolia,
      gas: BigInt(200_000),
      maxFeePerGas: BigInt(10_000_000_000),
      maxPriorityFeePerGas: BigInt(1_000_000_000),
    });
  }

  async function claimAll(offeringIds: string[]) {
    if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
      try {
        await switchChainAsync({ chainId: BASE_SEPOLIA_CHAIN_ID });
      } catch {
        return;
      }
    }
    setActiveOfferingId(null);
    setClaimMode('all');
    writeContract({
      chainId: BASE_SEPOLIA_CHAIN_ID,
      address: contracts!.SETTLEMENT,
      abi: SETTLEMENT_ABI,
      functionName: 'claimAllEarnings',
      args: [offeringIds.map((id) => BigInt(id))],
      account: address,
      chain: baseSepolia,
      gas: BigInt(Math.min(200_000 * offeringIds.length, 3_000_000)),
      maxFeePerGas: BigInt(10_000_000_000),
      maxPriorityFeePerGas: BigInt(1_000_000_000),
    });
  }

  function resetAll() {
    reset();
    setActiveOfferingId(null);
    setClaimMode(null);
  }

  return {
    claimSingle,
    claimAll,
    txHash,
    isPending,
    isConfirming,
    isSuccess,
    isBusy: isPending || isConfirming,
    claimedAmount,
    activeOfferingId,
    claimMode,
    errorMsg: error ? extractClaimError(error) : null,
    resetAll,
  };
}
