import { apiClient } from './auth';

export interface OfferingDisplay {
  offeringId: number | string;
  revenueShare?: string;
  revenueSharePct?: number;
  duration?: string;
  durationMonths?: number;
  raised?: string;
  totalRaised?: string;
  status: string;
}

export interface CreatorProfileData {
  address: string;
  kreoScore: number;
  scoreTier: number;
  scoreTierLabel: string;
  offeringsCompleted: number;
  totalRaised: string;
  settlementRate: number;
  avgInvestorROI: number;
  conservativeFloor: string;
  varianceTier: "LOW" | "MEDIUM" | "HIGH";
  monthsRecorded: number;
  socialProofScore: number;
  isPaused: boolean;
  earningsChart: number[];
  averageMonthlyEarnings: number;
  creatorTokenId: string;
  creatorTokenRegistered: boolean;
  activeOfferings: OfferingDisplay[];
  completedOfferings: OfferingDisplay[];
}

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

export interface CreateOfferingPayload {
  offeringId: string;
  status: number;
  sharePercentage: string;
  floorPrice: number;
  raiseTarget: number;
  duration: number;
  expiryTime: number;
  maxRaise: number;
  bondDeposited: number;
}

export interface CreateOfferingResponse {
  success: boolean;
  offeringId?: string;
  [key: string]: unknown;
}

export interface OfferingRecord {
  _id: string;
  offeringId: string;
  status: string;
  sharePercentage: string;
  floorPrice: number;
  raiseTarget: number;
  duration: number;
  expiryTime: number;
  maxRaise: number;
  bondDeposited: number;
  createdAt: string;
  [key: string]: unknown;
}

interface GetOfferingsResponse {
  success: boolean;
  data: OfferingRecord[];
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

  createOffering: async (payload: CreateOfferingPayload): Promise<CreateOfferingResponse> => {
    const response = await apiClient.post('users/creator/create-offering', payload, { timeout: 60000 });
    return response.data;
  },

  getOfferings: async (): Promise<OfferingRecord[]> => {
    const response = await apiClient.get<GetOfferingsResponse>('users/creator/offerings', { timeout: 30000 });
    return response.data.data;
  },

  getCreatorProfile: async (address: string): Promise<CreatorProfileData> => {
    const response = await apiClient.get(`users/creator/${address}/profile`, { timeout: 30000 });
    return response.data;
  },
};
