import { apiClient } from "./auth";

export interface YoutubeChannel {
  channelId: string;
  channelName: string;
  channelHandle: string;
  channelThumbnail: string;
  subscriberCount: string | number;
  likelyMonetized: boolean;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://kreo-backend-hfdh.onrender.com/api/v1/";

export const youtubeApi = {
  // Backend returns a 302 redirect directly to Google OAuth — XHR cannot
  // follow cross-origin redirects, so we navigate the browser window instead.
  connect: (): void => {
    const token = localStorage.getItem("kreo_access_token");
    const base = API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`;
    const url = new URL(`${base}youtube/connect`);
    if (token) url.searchParams.set("token", token);
    window.location.href = url.toString();
  },

  syncChannel: async (channelId: string): Promise<{ success: boolean; [key: string]: unknown }> => {
    const response = await apiClient.post("youtube/channel/sync", { channelId });
    return response.data;
  },
};

export default youtubeApi;
