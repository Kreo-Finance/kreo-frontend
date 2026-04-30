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

  // Creator registration
  connectedIncomeSource: string | null;
  creatorRegistrationRequested: boolean;

  // Actions
  setTokens: (access: string, refresh: string) => void;
  setWalletAddress: (address: string) => void;
  setSelectedRole: (role: UserRole) => void;
  setActiveRole: (role: ActiveRole) => void;
  setCreatorKycStatus: (status: KycStatus) => void;
  setCreatorIncomeConnected: (connected: boolean) => void;
  setConnectedIncomeSource: (source: string) => void;
  setCreatorRegistrationRequested: (requested: boolean) => void;
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
  creatorRegistrationRequested: boolean,
) {
  const creatorUnlocked =
    creatorKycStatus === 'approved' && creatorIncomeConnected && creatorRegistrationRequested;
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
      connectedIncomeSource: null,
      creatorRegistrationRequested: false,

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
          s.creatorRegistrationRequested,
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
          s.creatorRegistrationRequested,
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
          s.creatorRegistrationRequested,
        );
        set({ creatorIncomeConnected: connected, ...derived });
      },

      setConnectedIncomeSource: (source) => set({ connectedIncomeSource: source }),

      setCreatorRegistrationRequested: (requested) => {
        const s = get();
        const derived = derive(
          s.creatorKycStatus,
          s.creatorIncomeConnected,
          s.investorKycStatus,
          s.accreditationStatus,
          s.selectedRole,
          requested,
        );
        set({ creatorRegistrationRequested: requested, ...derived });
      },

      setInvestorKycStatus: (status) => {
        const s = get();
        const derived = derive(
          s.creatorKycStatus,
          s.creatorIncomeConnected,
          status,
          s.accreditationStatus,
          s.selectedRole,
          s.creatorRegistrationRequested,
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
          s.creatorRegistrationRequested,
        );
        set({ accreditationStatus: status, ...derived });
      },

      authenticate: async (address, provider) => {
        set({ authenticating: true, error: null });
        try {
          const { nonce } = await authApi.getNonce(address);
          const signature = await authApi.signMessage(nonce, provider);
          const { data: result } = await authApi.verifySignature(address, signature);
          

          // If wallet changed, wipe all wallet-specific state so the new user starts fresh
          if (!addressesMatch(get().walletAddress, result.wallet)) {
            set({
              selectedRole: null,
              activeRole: null,
              creatorKycStatus: 'none',
              creatorIncomeConnected: false,
              connectedIncomeSource: null,
              creatorRegistrationRequested: false,
              investorKycStatus: 'none',
              accreditationStatus: 'none',
              creatorUnlocked: false,
              investorUnlocked: false,
              verificationPending: false,
            });
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
        // walletAddress is intentionally kept so authenticate() can detect a same-wallet
        // re-login and preserve the creator onboarding state below.
        // Creator state (creatorKycStatus, creatorIncomeConnected, connectedIncomeSource,
        // creatorRegistrationRequested, creatorUnlocked) is also kept — it will be
        // re-validated from the backend on the next login. A different wallet logging in
        // will clear it via the wallet-change branch in authenticate().
        set({
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          authenticating: false,
          error: null,
          selectedRole: null,
          activeRole: null,
          investorKycStatus: 'none',
          accreditationStatus: 'none',
          investorUnlocked: false,
          verificationPending: false,
        });
        toast.success('Disconnected');
      },
    }),
    {
      name: 'kreo-auth',
      version: 1,
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        walletAddress: state.walletAddress,
        selectedRole: state.selectedRole,
        activeRole: state.activeRole,
        creatorKycStatus: state.creatorKycStatus,
        creatorIncomeConnected: state.creatorIncomeConnected,
        investorKycStatus: state.investorKycStatus,
        accreditationStatus: state.accreditationStatus,
        creatorUnlocked: state.creatorUnlocked,
        investorUnlocked: state.investorUnlocked,
        verificationPending: state.verificationPending,
        connectedIncomeSource: state.connectedIncomeSource,
        creatorRegistrationRequested: state.creatorRegistrationRequested,
      }),
    },
  ),
);
