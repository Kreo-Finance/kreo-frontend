import { useState, useCallback } from 'react';
import { creatorApi } from '@/lib/api/creator';
import type { RegisterCreatorResponse } from '@/lib/api/creator';
import { computeSourceHash, computeCreatorScore } from '@/lib/utils/creatorUtils';
import { toast } from 'sonner';

export function useRegisterCreator() {
  const [registering, setRegistering] = useState(false);
  const [result, setResult] = useState<RegisterCreatorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(
    async (
      incomeSource: string,
      walletAddress: string,
      kycVerified: boolean,
    ): Promise<boolean> => {
      setRegistering(true);
      setError(null);
      try {
        const sourceHash = computeSourceHash(incomeSource, walletAddress);
        const score = computeCreatorScore(incomeSource);
        const data = await creatorApi.registerCreator({
          stripeSourceHash: sourceHash,
          kycVerified,
          score,
          sourceHash,
        });
        setResult(data);
        toast.success('Registration request submitted!');
        return true;
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { error?: string; message?: string } } })
            ?.response?.data?.error ||
          (err as { response?: { data?: { error?: string; message?: string } } })
            ?.response?.data?.message ||
          'Registration request failed';
        setError(msg);
        toast.error(msg);
        return false;
      } finally {
        setRegistering(false);
      }
    },
    [],
  );

  return { register, registering, result, error };
}
