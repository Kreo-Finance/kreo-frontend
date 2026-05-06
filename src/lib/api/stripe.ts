import { apiClient } from "./auth";

export interface StripeAccount {
  id: string;
  display_name?: string;
  email?: string;
  country?: string;
  charges_enabled?: boolean;
  payouts_enabled?: boolean;
  [key: string]: unknown;
}

export interface StripeEarnings {
  account: StripeAccount;
  earnings?: {
    month: string;
    amount: number;
    currency: string;
  }[];
  [key: string]: unknown;
}

export const stripeApi = {
  connect: async (): Promise<{ url?: string; [key: string]: unknown }> => {
    const response = await apiClient.get("stripe/connect");
    return response.data;
  },

  syncAccount: async (): Promise<StripeEarnings> => {
    const response = await apiClient.get("stripe/account-sync");
    return response.data;
  },
};

export default stripeApi;
