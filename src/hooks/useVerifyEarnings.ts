import { useState, useCallback } from 'react';
import { creatorApi } from '@/lib/api/creator';
import type { VerifyEarningsResponse } from '@/lib/api/creator';
import { toast } from 'sonner';

export function useVerifyEarnings() {
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerifyEarningsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifyEarnings = useCallback(async (): Promise<boolean> => {
    setVerifying(true);
    setError(null);
    try {
      const data = await creatorApi.verifyEarnings({});
      setResult(data);
      toast.success('Earnings verified successfully!');
      return true;
    } catch (err: unknown) {
      console.error('[verifyEarnings] error:', err);
      const msg =
        (err as { response?: { data?: { error?: string; message?: string } } })
          ?.response?.data?.error ||
        (err as { response?: { data?: { error?: string; message?: string } } })
          ?.response?.data?.message ||
        'Earnings verification failed';
      setError(msg);
      toast.error(msg);
      return false;
    } finally {
      setVerifying(false);
    }
  }, []);

  return { verifyEarnings, verifying, result, error };
}
