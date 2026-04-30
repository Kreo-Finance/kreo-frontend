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

export const creatorApi = {
  registerCreator: async (payload: RegisterCreatorPayload): Promise<RegisterCreatorResponse> => {
    const response = await apiClient.post('users/register/creator', payload, { timeout: 40000 });
    return response.data;
  },
};
