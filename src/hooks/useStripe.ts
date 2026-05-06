import { useState, useCallback } from "react";
import { stripeApi } from "@/lib/api/stripe";
import { toast } from "sonner";

export function useStripe() {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async (): Promise<boolean> => {
    setConnecting(true);
    setError(null);
    try {
      const res = await stripeApi.connect();
      const oauthUrl = (res as { data?: string })?.data ?? (res as { url?: string })?.url;
      if (oauthUrl) {
        window.location.href = oauthUrl;
        return false;
      }
      toast.success("Stripe connected successfully");
      return true;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string; message?: string } } })
          ?.response?.data?.error ||
        (err as { response?: { data?: { error?: string; message?: string } } })
          ?.response?.data?.message ||
        "Failed to connect Stripe";
      setError(msg);
      toast.error(msg);
      return false;
    } finally {
      setConnecting(false);
    }
  }, []);

  return { connect, connecting, error };
}
