import axios from "axios";
import { BrowserProvider } from "ethers";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://kreo-backend-hfdh.onrender.com/api/v1/";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("kreo_access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // const refreshToken = localStorage.getItem("kreo_refresh_token");
        // if (refreshToken) {
        //   const res = await authApi.refreshToken(refreshToken);
        //   localStorage.setItem("kreo_access_token", res.access_token);
        //   localStorage.setItem("kreo_refresh_token", res.refresh_token);
        //   originalRequest.headers.Authorization = `Bearer ${res.access_token}`;
        //   return apiClient(originalRequest);
        // }
      } catch {
        authApi.logout();
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  getNonce: async (walletAddress: string): Promise<{ nonce: string }> => {
    const response = await apiClient.post("auth/nonce", {
      wallet_address: walletAddress.toLowerCase(),
    });
    return response.data;
  },

  signMessage: async (
    nonce: string,
    provider: BrowserProvider,
  ): Promise<string> => {
    const signer = await provider.getSigner();
    return signer.signMessage(nonce);
  },

  verifySignature: async (
    walletAddress: string,
    signature: string,
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
      wallet: string;
      roles?: {
        creator?: { status: string };
        investor?: { status: string; accreditation_status: string };
      };
    };
  }> => {
    const response = await apiClient.post("auth/verify", {
      wallet_address: walletAddress.toLowerCase(),
      signature,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("kreo_access_token");
    localStorage.removeItem("kreo_refresh_token");
    localStorage.removeItem("kreo_wallet_address");
  },

  getSumsubToken: async (
    role: "creator" | "investor",
  ): Promise<{ token: string }> => {
    const response = await apiClient.post("users/kyc/token", { role });
    return response.data;
  },

  isAuthenticated: (): boolean => !!localStorage.getItem("kreo_access_token"),
  getAccessToken: (): string | null =>
    localStorage.getItem("kreo_access_token"),
  getWalletAddress: (): string | null =>
    localStorage.getItem("kreo_wallet_address"),
};

export { apiClient };
export default authApi;
