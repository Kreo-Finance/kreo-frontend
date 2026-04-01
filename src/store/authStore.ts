import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BrowserProvider } from 'ethers';
import { authApi } from '@/lib/api/auth';
import { toast } from 'sonner';
import type {
  KycStatus,
  AccreditationStatus,
  UserRole,
  ActiveRole,
} from '@/types';
import { addressesMatch } from '@/types';

interface AuthState {
  // Session
  accessToken: string | null;
  refreshToken: string | null;
  walletAddress: string | null;
  isAuthenticated: boolean;
  authenticating: boolean;
  error: string | null;

  // Roles
  selectedRole: UserRole | null;
  activeRole: ActiveRole | null;
  creatorKycStatus: KycStatus;
  creatorIncomeConnected: boolean;
  investorKycStatus: KycStatus;
  accreditationStatus: AccreditationStatus;

  // Derived (stored for easy access)
  creatorUnlocked: boolean;
  investorUnlocked: boolean;
  verificationPending: boolean;

  // Actions
  setTokens: (access: string, refresh: string) => void;
  setWalletAddress: (address: string) => void;
  setSelectedRole: (role: UserRole) => void;
  setActiveRole: (role: ActiveRole) => void;
  setCreatorKycStatus: (status: KycStatus) => void;
  setCreatorIncomeConnected: (connected: boolean) => void;
  setInvestorKycStatus: (status: KycStatus) => void;
  setAccreditationStatus: (status: AccreditationStatus) => void;
  authenticate: (address: string, provider: BrowserProvider) => Promise<void>;
  logout: () => void;
}

function derive(
  creatorKycStatus: KycStatus,
  creatorIncomeConnected: boolean,
  investorKycStatus: KycStatus,
  accreditationStatus: AccreditationStatus,
  selectedRole: UserRole | null,
) {
  const creatorUnlocked =
    creatorKycStatus === 'approved' && creatorIncomeConnected;
  const investorUnlocked =
    investorKycStatus === 'approved' && accreditationStatus === 'approved';
  const verificationPending = !!selectedRole && !creatorUnlocked && !investorUnlocked;
  return { creatorUnlocked, investorUnlocked, verificationPending };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      walletAddress: null,
      isAuthenticated: false,
      authenticating: false,
      error: null,
      selectedRole: null,
      activeRole: null,
      creatorKycStatus: 'none',
      creatorIncomeConnected: false,
      investorKycStatus: 'none',
      accreditationStatus: 'none',
      creatorUnlocked: false,
      investorUnlocked: false,
      verificationPending: false,

      setTokens: (access, refresh) => {
        localStorage.setItem('kreo_access_token', access);
        localStorage.setItem('kreo_refresh_token', refresh);
        set({ accessToken: access, refreshToken: refresh, isAuthenticated: true });
      },

      setWalletAddress: (address) => {
        localStorage.setItem('kreo_wallet_address', address);
        set({ walletAddress: address });
      },

      setSelectedRole: (role) => {
        const s = get();
        const activeRole: ActiveRole = role === 'investor' ? 'investor' : 'creator';
        const derived = derive(
          s.creatorKycStatus,
          s.creatorIncomeConnected,
          s.investorKycStatus,
          s.accreditationStatus,
          role,
        );
        set({ selectedRole: role, activeRole, ...derived });
      },

      setActiveRole: (role) => set({ activeRole: role }),

      setCreatorKycStatus: (status) => {
        const s = get();
        const derived = derive(
          status,
          s.creatorIncomeConnected,
          s.investorKycStatus,
          s.accreditationStatus,
          s.selectedRole,
        );
        set({ creatorKycStatus: status, ...derived });
      },

      setCreatorIncomeConnected: (connected) => {
        const s = get();
        const derived = derive(
          s.creatorKycStatus,
          connected,
          s.investorKycStatus,
          s.accreditationStatus,
          s.selectedRole,
        );
        set({ creatorIncomeConnected: connected, ...derived });
      },

      setInvestorKycStatus: (status) => {
        const s = get();
        const derived = derive(
          s.creatorKycStatus,
          s.creatorIncomeConnected,
          status,
          s.accreditationStatus,
          s.selectedRole,
        );
        set({ investorKycStatus: status, ...derived });
      },

      setAccreditationStatus: (status) => {
        const s = get();
        const derived = derive(
          s.creatorKycStatus,
          s.creatorIncomeConnected,
          s.investorKycStatus,
          status,
          s.selectedRole,
        );
        set({ accreditationStatus: status, ...derived });
      },

      authenticate: async (address, provider) => {
        set({ authenticating: true, error: null });
        try {
          const { nonce } = await authApi.getNonce(address);
          const signature = await authApi.signMessage(nonce, provider);
          const result = await authApi.verifySignature(address, signature);

          // If wallet changed (new user), clear persisted role so role modal appears
          if (!addressesMatch(get().walletAddress, result.wallet)) {
            set({ selectedRole: null, activeRole: null });
          }

          get().setTokens(result.access_token, result.refresh_token);
          get().setWalletAddress(result.wallet);

          // Sync role states returned by backend
          if (result.roles?.creator?.status) {
            get().setCreatorKycStatus(result.roles.creator.status as KycStatus);
          }
          if (result.roles?.investor?.status) {
            get().setInvestorKycStatus(result.roles.investor.status as KycStatus);
          }
          if (result.roles?.investor?.accreditation_status) {
            get().setAccreditationStatus(
              result.roles.investor.accreditation_status as AccreditationStatus,
            );
          }

          toast.success('Wallet authenticated');
        } catch (err: unknown) {
          const msg =
            (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
            'Authentication failed';
          set({ error: msg });
          toast.error(msg);
          throw err;
        } finally {
          set({ authenticating: false });
        }
      },

      logout: () => {
        authApi.logout();
        set({
          accessToken: null,
          refreshToken: null,
          walletAddress: null,
          isAuthenticated: false,
          authenticating: false,
          error: null,
          selectedRole: null,
          activeRole: null,
          creatorKycStatus: 'none',
          creatorIncomeConnected: false,
          investorKycStatus: 'none',
          accreditationStatus: 'none',
          creatorUnlocked: false,
          investorUnlocked: false,
          verificationPending: false,
        });
        toast.success('Disconnected');
      },
    }),
    {
      name: 'kreo-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        walletAddress: state.walletAddress,
        isAuthenticated: state.isAuthenticated,
        selectedRole: state.selectedRole,
        activeRole: state.activeRole,
        creatorKycStatus: state.creatorKycStatus,
        creatorIncomeConnected: state.creatorIncomeConnected,
        investorKycStatus: state.investorKycStatus,
        accreditationStatus: state.accreditationStatus,
        creatorUnlocked: state.creatorUnlocked,
        investorUnlocked: state.investorUnlocked,
        verificationPending: state.verificationPending,
      }),
    },
  ),
);
