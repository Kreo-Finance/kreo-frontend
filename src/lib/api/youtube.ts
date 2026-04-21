import { apiClient } from "./auth";

export interface YoutubeChannel {
  channelId: string;
  channelName: string;
  channelHandle: string;
  channelThumbnail: string;
  subscriberCount: string | number;
  likelyMonetized: boolean;
}

export const youtubeApi = {
  connect: async (): Promise<{ url?: string; success?: boolean; [key: string]: unknown }> => {
    const response = await apiClient.get("youtube/connect");
    return response.data;
  },

  syncChannel: async (channelId: string): Promise<{ success: boolean; [key: string]: unknown }> => {
    const response = await apiClient.post("youtube/channel/sync", { channelId });
    return response.data;
  },
};

export default youtubeApi;
