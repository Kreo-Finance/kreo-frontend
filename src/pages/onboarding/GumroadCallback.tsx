import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ShoppingBag, CheckCircle2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useGumroad } from "@/hooks/useGumroad";
import { useAuth } from "@/hooks/useAuth";

const ERROR_MESSAGES: Record<string, string> = {
  authorization_code_missing: "Authorization failed. Please try again.",
  user_id_missing: "Session error. Please log in again.",
  user_not_found: "User not found. Please log in again.",
  oauth_callback_failed: "Gumroad connection failed. Please try again.",
  access_denied: "Authorization was denied. Please try again.",
};

function formatError(code: string): string {
  return ERROR_MESSAGES[code] ?? "Something went wrong. Please try again.";
}

type SaleEntry = {
  created_at?: string;
  price?: number;
  product_name?: string;
  [key: string]: unknown;
};

type MonthlySales = Record<string, SaleEntry[]>;

function groupByMonth(sales: SaleEntry[]): MonthlySales {
  return sales.reduce<MonthlySales>((acc, sale) => {
    const date = sale.created_at ? new Date(sale.created_at) : null;
    const key = date
      ? date.toLocaleString("default", { month: "long", year: "numeric" })
      : "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(sale);
    return acc;
  }, {});
}

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function GumroadCallback() {
  const navigate = useNavigate();
  const { setCreatorIncomeConnected, setConnectedIncomeSource } = useAuth({ autoAuthenticate: false });
  const { fetchSalesData } = useGumroad();

  const [error, setError] = useState<string | null>(null);
  const [salesData, setSalesData] = useState<SaleEntry[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const err = params.get("error");
    if (err) {
      setError(formatError(err));
      setLoading(false);
      return;
    }

    (async () => {
      try {
        await fetchSalesData();
        // fetchSalesData stores in hook state; re-expose via a direct call
        const { gumroadApi } = await import("@/lib/api/gumroad");
        const data = await gumroadApi.getSalesData();
        const sales = Array.isArray(data)
          ? (data as SaleEntry[])
          : Array.isArray((data as { sales?: unknown })?.sales)
          ? ((data as { sales: SaleEntry[] }).sales)
          : [];
        setSalesData(sales);
        setCreatorIncomeConnected(true);
        setConnectedIncomeSource("gumroad");
      } catch {
        setError("Failed to fetch your sales data. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const monthlySales = salesData ? groupByMonth(salesData) : {};
  const months = Object.keys(monthlySales);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <ShoppingBag className="h-6 w-6 text-pink-500" />
            <h1 className="font-display text-2xl font-bold">Gumroad Connected</h1>
          </div>
          <p className="font-body text-sm text-muted-foreground">
            Your Gumroad account has been linked to Kreo Finance.
          </p>
        </div>

        {loading && (
          <Card className="border-white/10 bg-card/40 backdrop-blur-md">
            <CardContent className="pt-8 pb-8 flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="font-body text-sm text-muted-foreground">
                Fetching your sales data…
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && error && (
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="pt-6 space-y-4">
              <p className="font-body text-sm text-red-400">{error}</p>
              <Button
                onClick={() => navigate("/onboarding/creator")}
                variant="outline"
                className="w-full font-body font-semibold"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && (
          <>
            <Card className="border-creo-teal/30 bg-creo-teal/5">
              <CardContent className="pt-6 pb-6 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-creo-teal mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-display font-semibold text-sm">
                    Thank you for authorizing Gumroad to Kreo Finance
                  </p>
                  <p className="font-body text-sm text-muted-foreground mt-0.5">
                    We have successfully retrieved your sales data.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-display font-semibold text-sm">
                  Sales by Month
                </h2>
              </div>

              {months.length === 0 ? (
                <Card className="border-white/10 bg-card/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="font-display text-lg">No Sales Yet</CardTitle>
                    <CardDescription className="font-body text-sm">
                      No sales data was found on your Gumroad account.
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                months.map((month) => {
                  const entries = monthlySales[month];
                  const total = entries.reduce(
                    (sum, s) => sum + (typeof s.price === "number" ? s.price : 0),
                    0
                  );
                  return (
                    <Card
                      key={month}
                      className="border-white/10 bg-card/40 backdrop-blur-md"
                    >
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-display font-semibold text-sm">
                              {month}
                            </p>
                            <p className="font-body text-xs text-muted-foreground mt-0.5">
                              {entries.length}{" "}
                              {entries.length === 1 ? "sale" : "sales"}
                            </p>
                          </div>
                          <p className="font-display font-bold text-creo-teal text-sm">
                            {formatCurrency(total)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            <Button
              onClick={() => navigate("/onboarding/creator")}
              className="w-full bg-gradient-hero font-body font-semibold text-primary-foreground hover:opacity-90"
            >
              Continue
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
