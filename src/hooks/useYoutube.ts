import { useState, useCallback } from "react";
import { youtubeApi } from "@/lib/api/youtube";
import { toast } from "sonner";

export function useYoutube() {
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Backend returns 302 → Google OAuth directly, so we do browser navigation
  // instead of an XHR call (which would fail with CORS on the redirect).
  const connect = useCallback((): void => {
    setConnecting(true);
    youtubeApi.connect(); // triggers window.location.href — page will navigate away
  }, []);

  const syncChannel = useCallback(async (channelId: string): Promise<boolean> => {
    setSyncing(true);
    setError(null);
    try {
      await youtubeApi.syncChannel(channelId);
      toast.success("YouTube channel connected successfully");
      return true;
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      const msg =
        status === 403
          ? "This channel is not monetized. Only YouTube Partner Program (YPP) channels are supported."
          : (err as { response?: { data?: { error?: string; message?: string } } })
              ?.response?.data?.error ||
            (err as { response?: { data?: { error?: string; message?: string } } })
              ?.response?.data?.message ||
            "Failed to sync YouTube channel";
      setError(msg);
      toast.error(msg);
      return false;
    } finally {
      setSyncing(false);
    }
  }, []);

  return { connect, connecting, syncChannel, syncing, error };
}
