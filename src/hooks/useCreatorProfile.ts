import { useState, useEffect } from 'react';
import { creatorApi } from '@/lib/api/creator';
import type { CreatorProfileData } from '@/lib/api/creator';

export function useCreatorProfile(address: string | undefined) {
  const [profile, setProfile] = useState<CreatorProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!address) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setIsError(false);
    setProfile(null);

    creatorApi
      .getCreatorProfile(address)
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch(() => {
        if (!cancelled) setIsError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [address]);

  return { profile, isLoading, isError };
}
