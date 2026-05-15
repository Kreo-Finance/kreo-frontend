import { apiClient } from './auth';

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
    return response.data.data;
  },
};
