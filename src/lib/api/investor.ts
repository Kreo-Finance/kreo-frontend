import { apiClient } from './auth';

// Merge duplicate positions that share the same offeringId.
// The backend may emit one row per buyTokens() tx for the same offering;
// RST balance / claimable come from contract reads and are already correct on
// any row, so we only need to sum investedUsdc and creatorTokenAmount.
function mergePositions(raw: PortfolioPosition[]): PortfolioPosition[] {
  const map = new Map<string, PortfolioPosition>();
  for (const p of raw) {
    const existing = map.get(p.offeringId);
    if (!existing) {
      map.set(p.offeringId, { ...p });
    } else {
      const sumUsdc = BigInt(existing.investedUsdc) + BigInt(p.investedUsdc);
      const sumCt =
        Number(existing.creatorTokenAmount) + Number(p.creatorTokenAmount);
      const dollars = Number(sumUsdc) / 1_000_000;
      map.set(p.offeringId, {
        ...existing,
        investedUsdc: sumUsdc.toString(),
        investedFormatted: `$${dollars.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        creatorTokenAmount: sumCt.toLocaleString('en-US'),
      });
    }
  }
  return Array.from(map.values());
}

export interface PortfolioSummary {
  totalInvested: string;
  totalEarned: string;
  avgYield: string;
}

export interface PortfolioPosition {
  offeringId: string;
  creatorAddress: string;
  investedUsdc: string;
  investedFormatted: string;
  rstBalance: string;
  rstFormatted: string;
  creatorTokenAmount: string;
  claimableUsdc: string;
  claimableFormatted: string;
  status: string;
  durationMonths: number;
  revenueSharePct: number;
  fundraiseTarget: string;
}

export interface PortfolioResponse {
  summary: PortfolioSummary;
  positions: PortfolioPosition[];
}

export interface BuyTokensPayload {
  offeringId: string;
  usdcAmount: string;  // 6-dec, e.g. "100000000" = $100
  rstAmount: string;   // 18-dec
  ctAmount: string;
  creatorAddress: string;
}

export interface BuyTokensResponse {
  success: boolean;
  [key: string]: unknown;
}

export const investorApi = {
  buyTokens: async (payload: BuyTokensPayload): Promise<BuyTokensResponse> => {
    const response = await apiClient.post('users/investor/buy-tokens', payload, { timeout: 60000 });
    return response.data;
  },

  getPortfolio: async (): Promise<PortfolioResponse> => {
    const response = await apiClient.get<{ data: PortfolioResponse }>('users/investor/portfolio', { timeout: 30000 });
    const data = response.data.data;
    return { ...data, positions: mergePositions(data.positions ?? []) };
  },
};
