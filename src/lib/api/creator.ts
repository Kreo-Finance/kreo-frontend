import { apiClient } from './auth';

export interface RegisterCreatorPayload {
  stripeSourceHash: string;
  kycVerified: boolean;
  score: number;
  sourceHash: string;
}

export interface RegisterCreatorResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  stripeSourceHash: string;
  isKycVerified: boolean;
  score: number;
  sourceHash: string;
  rateBps: number;
  isCreator: boolean;
  creatorTxHash: string | null;
  bondRateTxHash: string | null;
  scoreResultTxHash: string | null;
  registrationCompletedOn: string | null;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

export interface VerifyEarningsResponse {
  success: boolean;
  message?: string;
  [key: string]: unknown;
}

export const creatorApi = {
  registerCreator: async (payload: RegisterCreatorPayload): Promise<RegisterCreatorResponse> => {
    const response = await apiClient.post('users/register/creator', payload, { timeout: 60000 });
    return response.data;
  },

  verifyEarnings: async (payload: Record<string, unknown> = {}): Promise<VerifyEarningsResponse> => {
    const response = await apiClient.post('users/creator/verify-earnings', payload, { timeout: 120000 });
    return response.data;
  },
};
