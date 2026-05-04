import { useEffect, useCallback } from 'react';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { BrowserProvider } from 'ethers';
import { useAuthStore } from '@/store/authStore';
import { addressesMatch } from '@/types';

interface UseAuthOptions {
  autoAuthenticate?: boolean;
}

export function useAuth({ autoAuthenticate = true }: UseAuthOptions = {}) {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');

  const store = useAuthStore();

  const authenticate = useCallback(async () => {
    if (!address || !walletProvider) {
      throw new Error('Wallet not connected');
    }
    const provider = new BrowserProvider(walletProvider as Parameters<typeof BrowserProvider>[0]);
    await store.authenticate(address, provider);
  }, [address, walletProvider, store]);

  useEffect(() => {
    if (!isConnected || !address || !walletProvider) return;

    // Already in-flight — do not trigger another request
    if (store.authenticating) return;

    // Same wallet already authenticated — no-op
    if (store.isAuthenticated && addressesMatch(store.walletAddress, address)) return;

    // Wallet switched — re-authenticate
    if (store.isAuthenticated && store.walletAddress && !addressesMatch(store.walletAddress, address)) {
      const provider = new BrowserProvider(walletProvider as Parameters<typeof BrowserProvider>[0]);
      store.authenticate(address, provider);
      return;
    }

    // Not authenticated — auto-sign if enabled
    if (!store.isAuthenticated && autoAuthenticate) {
      const timer = setTimeout(async () => {
        try {
          const provider = new BrowserProvider(walletProvider as Parameters<typeof BrowserProvider>[0]);
          await store.authenticate(address, provider);
        } catch {
          // Error handled inside store
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [
    isConnected,
    address,
    walletProvider,
    store.isAuthenticated,
    store.walletAddress,
    store.authenticating,
    autoAuthenticate,
  ]);

  return {
    // Wallet
    address,
    isConnected,

    // Auth
    isAuthenticated: store.isAuthenticated,
    authenticating: store.authenticating,
    error: store.error,
    walletAddress: store.walletAddress,
    accessToken: store.accessToken,

    // Roles
    selectedRole: store.selectedRole,
    activeRole: store.activeRole,
    creatorKycStatus: store.creatorKycStatus,
    creatorIncomeConnected: store.creatorIncomeConnected,
    investorKycStatus: store.investorKycStatus,
    accreditationStatus: store.accreditationStatus,
    creatorUnlocked: store.creatorUnlocked,
    investorUnlocked: store.investorUnlocked,
    verificationPending: store.verificationPending,

    // Creator registration
    connectedIncomeSource: store.connectedIncomeSource,
    creatorRegistrationRequested: store.creatorRegistrationRequested,
    creatorEarningsVerified: store.creatorEarningsVerified,

    // Actions
    authenticate,
    logout: store.logout,
    setSelectedRole: store.setSelectedRole,
    setActiveRole: store.setActiveRole,
    setCreatorKycStatus: store.setCreatorKycStatus,
    setCreatorIncomeConnected: store.setCreatorIncomeConnected,
    setConnectedIncomeSource: store.setConnectedIncomeSource,
    setCreatorRegistrationRequested: store.setCreatorRegistrationRequested,
    setCreatorEarningsVerified: store.setCreatorEarningsVerified,
    setInvestorKycStatus: store.setInvestorKycStatus,
    setAccreditationStatus: store.setAccreditationStatus,
  };
}
