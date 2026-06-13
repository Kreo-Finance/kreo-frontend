import { useState, useCallback } from "react";
import { gumroadApi } from "@/lib/api/gumroad";
import { toast } from "sonner";

export function useGumroad() {
  const [connecting, setConnecting] = useState(false);
  const [salesData, setSalesData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async (): Promise<boolean> => {
    setConnecting(true);
    setError(null);
    try {
      const res = await gumroadApi.connect();
      const oauthUrl = (res as { data?: string })?.data;
      if (oauthUrl) {
        window.location.href = oauthUrl;
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

  const fetchSalesData = useCallback(async (): Promise<void> => {
    try {
      const sales = await gumroadApi.getSalesData();
      setSalesData(sales);
    } catch {
      // sales fetch is best-effort
    }
  }, []);

  return { connect, connecting, fetchSalesData, salesData, error };
}
