import { apiClient } from "./auth";

export interface YoutubeChannel {
  channelId: string;
  channelName: string;
  channelHandle: string;
  channelThumbnail: string;
  subscriberCount: string | number;
  likelyMonetized: boolean;
}

export interface YoutubeChannelSyncResult {
  success: boolean;
  message?: string;
  data?: {
    channel?: YoutubeChannel;
    isMonetized?: boolean;
    revenue?: number | null;
  };
}

export const youtubeApi = {
  // Backend returns { success: true, data: { url: "https://accounts.google.com/..." } }
  // We get the URL via XHR (so the Authorization header is sent), then navigate the browser.
  connect: async (): Promise<void> => {
    const response = await apiClient.get("youtube/connect");
    const url: string | undefined =
      response.data?.data?.url ?? response.data?.url;
    if (url) window.location.href = url;
  },

  syncChannel: async (channelId: string): Promise<YoutubeChannelSyncResult> => {
    const response = await apiClient.post("youtube/channel/sync", { channelId });
    return response.data;
  },
};

export default youtubeApi;
