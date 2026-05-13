import { apiClient } from './auth';

export interface BuyTokensPayload {
  offeringId: string;
  usdcAmount: string;  // 6-dec, e.g. "100000000" = $100
  rstAmount: string;   // 18-dec
  ctAmount: string;
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
};
