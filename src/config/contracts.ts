// Base Sepolia chainId
export const BASE_SEPOLIA_CHAIN_ID = 84532;

export type SupportedChainId = typeof BASE_SEPOLIA_CHAIN_ID;

interface ChainContracts {
  KREO_VAULT: `0x${string}`;
  USDC: `0x${string}`;
  REVENUE_SHARE: `0x${string}`;
  KREO_SCORE: `0x${string}`;
  CREATOR_TOKEN: `0x${string}`;
  SETTLEMENT: `0x${string}`;
  ORACLE_INTEGRATION?: `0x${string}`;
  PROTOCOL_TREASURY: `0x${string}`;
}

export const CONTRACT_ADDRESSES: Record<number, ChainContracts> = {
  [BASE_SEPOLIA_CHAIN_ID]: {
    KREO_VAULT: "0xb61ad80d492764a0746431D451C739f5119ea5bB",
    USDC: "0xe39910131226c1997b2e8697f043b8b3c280478c",
    REVENUE_SHARE: "0xcc32cbBB5603956087dFC8e35C34e9b71bE95f1f",
    KREO_SCORE: "0x92097b43D9C861E8C0891B89bE2039FfBD7720Ed",
    CREATOR_TOKEN: "0x847038a125e62baa5f937d83916A30d8ff2d49f8",
    SETTLEMENT: "0xd363791e9cD4dF5A1F2b44bbA9Cf7322d279A67b",
    ORACLE_INTEGRATION: "0xc688D6E8EfFF781F5dFE4a26140728C84F46f7DF",
    PROTOCOL_TREASURY: "0xa6028354DC529b6764A68d6Fe51C671fe31D8bfa",
  },
};

export function getContractAddresses(
  chainId: number,
): ChainContracts | undefined {
  return CONTRACT_ADDRESSES[chainId];
}

// VarianceTier enum values from the contract
export const VARIANCE_TIER_LABELS: Record<number, string> = {
  0: "LOW",
  1: "MEDIUM",
  2: "HIGH",
};

// Format a USDC6 bigint (6 decimals) to a human-readable "$X.XX" string
export function formatUsdc(raw: bigint | undefined): string {
  if (raw === undefined) return "—";
  const dollars = Number(raw) / 1_000_000;
  return `$${dollars.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Format bps (basis points) to "X.XX%"
export function formatBps(bps: bigint | undefined): string {
  if (bps === undefined) return "—";
  return `${(Number(bps) / 100).toFixed(2)}%`;
}
