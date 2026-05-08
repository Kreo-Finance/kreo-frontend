// Base Sepolia chainId
export const BASE_SEPOLIA_CHAIN_ID = 84532;

export type SupportedChainId = typeof BASE_SEPOLIA_CHAIN_ID;

interface ChainContracts {
  KREO_VAULT: `0x${string}`;
  USDC: `0x${string}`;
  REVENUE_SHARE: `0x${string}`;
}

// Add new chains here as a new key.
export const CONTRACT_ADDRESSES: Record<number, ChainContracts> = {
  [BASE_SEPOLIA_CHAIN_ID]: {
    KREO_VAULT: '0xb61ad80d492764a0746431D451C739f5119ea5bB',
    USDC: '0xe39910131226c1997b2e8697f043b8b3c280478c',
    REVENUE_SHARE: '0x81E0c75578C89e2f4a8a867d6a2FD56192742F1D',
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
