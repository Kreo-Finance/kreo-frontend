// Base Sepolia chainId
export const BASE_SEPOLIA_CHAIN_ID = 84532;

export type SupportedChainId = typeof BASE_SEPOLIA_CHAIN_ID;

interface ChainContracts {
  KREO_VAULT: `0x${string}`;
  USDC: `0x${string}`;
}

// Add new chains here as a new key.
export const CONTRACT_ADDRESSES: Record<number, ChainContracts> = {
  [BASE_SEPOLIA_CHAIN_ID]: {
    // Sourced from KREO_VAULT_CONTRACT_ADDRESS in .env (no VITE_ prefix needed at build time)
    KREO_VAULT: '0xb61ad80d492764a0746431D451C739f5119ea5bB',
    // Circle's official USDC on Base Sepolia
    USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  },
};

export function getContractAddresses(chainId: number): ChainContracts | undefined {
  return CONTRACT_ADDRESSES[chainId];
}

// VarianceTier enum values from the contract
export const VARIANCE_TIER_LABELS: Record<number, string> = {
  0: 'LOW',
  1: 'MEDIUM',
  2: 'HIGH',
};

// Format a USDC6 bigint (6 decimals) to a human-readable "$X.XX" string
export function formatUsdc(raw: bigint | undefined): string {
  if (raw === undefined) return '—';
  const dollars = Number(raw) / 1_000_000;
  return `$${dollars.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Format bps (basis points) to "X.XX%"
export function formatBps(bps: bigint | undefined): string {
  if (bps === undefined) return '—';
  return `${(Number(bps) / 100).toFixed(2)}%`;
}
