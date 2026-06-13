import { apiClient } from "./auth";

export const gumroadApi = {
  connect: async (): Promise<{ url?: string; success?: boolean; [key: string]: unknown }> => {
    const response = await apiClient.get("gumroad/connect");
    return response.data;
  },

  getSalesData: async (): Promise<unknown> => {
    const response = await apiClient.get("gumroad/sales-data");
    return response.data;
  },
};

export default gumroadApi;
