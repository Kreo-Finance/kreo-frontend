import { useState, useEffect, useCallback } from 'react';
import { investorApi } from '@/lib/api/investor';
import type { PortfolioSummary, PortfolioPosition } from '@/lib/api/investor';

const EMPTY_SUMMARY: PortfolioSummary = {
  totalInvested: '$0.00',
  totalEarned: '$0.00',
  avgYield: '0%',
};

export function useInvestorPortfolio() {
  const [summary, setSummary] = useState<PortfolioSummary>(EMPTY_SUMMARY);
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await investorApi.getPortfolio();
      setSummary(data.summary ?? EMPTY_SUMMARY);
      setPositions(data.positions ?? []);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { summary, positions, isLoading, isError, refetch: fetch };
}
