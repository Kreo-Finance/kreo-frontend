import { useState, useCallback } from "react";
import { gumroadApi } from "@/lib/api/gumroad";
import { toast } from "sonner";

export function useGumroad() {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async (): Promise<boolean> => {
    setConnecting(true);
    setError(null);
    try {
      const data = await gumroadApi.connect();
      if (data?.url) {
        window.location.href = data.url;
        return false;
      }
      toast.success("Gumroad connected successfully");
      return true;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string; message?: string } } })
          ?.response?.data?.error ||
        (err as { response?: { data?: { error?: string; message?: string } } })
          ?.response?.data?.message ||
        "Failed to connect Gumroad";
      setError(msg);
      toast.error(msg);
      return false;
    } finally {
      setConnecting(false);
    }
  }, []);

  return { connect, connecting, error };
}
