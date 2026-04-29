import { solidityPackedKeccak256 } from 'ethers';

export type IncomeSource = 'gumroad' | 'stripe' | 'youtube' | 'adsense';

// Scores per income source — quick approximation for MVP, will be refined
const CREATOR_SCORES: Record<string, number> = {
  gumroad: 50,
  youtube: 70,
  stripe: 60,
  adsense: 55,
};

/**
 * Returns a bytes32 keccak256 hash of the income source identifier and wallet address.
 * Mirrors the on-chain hash: keccak256(abi.encodePacked(incomeSource, walletAddress))
 */
export function computeSourceHash(incomeSource: string, walletAddress: string): string {
  return solidityPackedKeccak256(
    ['string', 'string'],
    [incomeSource.toLowerCase(), walletAddress.toLowerCase()],
  );
}

export function computeCreatorScore(incomeSource: string): number {
  return CREATOR_SCORES[incomeSource.toLowerCase()] ?? 50;
}
