import { useState, useCallback } from "react";
import { youtubeApi } from "@/lib/api/youtube";
import { toast } from "sonner";

export function useYoutube() {
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async (): Promise<void> => {
    setConnecting(true);
    try {
      await youtubeApi.connect();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string; message?: string } } })
          ?.response?.data?.error ||
        (err as { response?: { data?: { error?: string; message?: string } } })
          ?.response?.data?.message ||
        "Failed to connect YouTube";
      setError(msg);
      toast.error(msg);
    } finally {
      setConnecting(false);
    }
  }, []);

  const syncChannel = useCallback(async (channelId: string): Promise<{ success: boolean; isMonetized?: boolean; revenue?: number | null }> => {
    setSyncing(true);
    setError(null);
    try {
      const result = await youtubeApi.syncChannel(channelId);
      const isMonetized = result.data?.isMonetized;
      const revenue = result.data?.revenue;
      return { success: true, isMonetized, revenue };
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string; message?: string } } })
            ?.response?.data?.error ||
          (err as { response?: { data?: { error?: string; message?: string } } })
            ?.response?.data?.message ||
          "Failed to sync YouTube channel";
      setError(msg);
      toast.error(msg);
      return { success: false };
    } finally {
      setSyncing(false);
    }
  }, []);

  return { connect, connecting, syncChannel, syncing, error };
}
