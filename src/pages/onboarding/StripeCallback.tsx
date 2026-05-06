import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CreditCard, CheckCircle2, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { stripeApi, StripeEarnings } from "@/lib/api/stripe";
import { useAuth } from "@/hooks/useAuth";

const ERROR_MESSAGES: Record<string, string> = {
  authorization_code_missing: "Authorization failed. Please try again.",
  user_id_missing: "Session error. Please log in again.",
  user_not_found: "User not found. Please log in again.",
  oauth_callback_failed: "Stripe connection failed. Please try again.",
  access_denied: "Authorization was denied. Please try again.",
};

function formatError(code: string): string {
  return ERROR_MESSAGES[code] ?? "Something went wrong. Please try again.";
}

function formatCurrency(amount: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export default function StripeCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setCreatorIncomeConnected, setConnectedIncomeSource } = useAuth({
    autoAuthenticate: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [earnings, setEarnings] = useState<StripeEarnings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) {
      setError(formatError(err));
      setLoading(false);
      return;
    }

    // Backend redirects with ?account=<JSON> after OAuth
    const accountParam = searchParams.get("account");
    if (!accountParam) {
      setError("No account data received. Please try again.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await stripeApi.syncAccount();
        setEarnings(data);
        setCreatorIncomeConnected(true);
        setConnectedIncomeSource("stripe");
      } catch {
        // Even if sync fails, the account was connected — mark as connected
        try {
          const account = JSON.parse(decodeURIComponent(accountParam));
          setEarnings({ account });
          setCreatorIncomeConnected(true);
          setConnectedIncomeSource("stripe");
        } catch {
          setError("Failed to load your Stripe account. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const account = earnings?.account;
  const monthlyEarnings = earnings?.earnings ?? [];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <CreditCard className="h-6 w-6 text-violet-400" />
            <h1 className="font-display text-2xl font-bold">Stripe Connected</h1>
          </div>
          <p className="font-body text-sm text-muted-foreground">
            Your Stripe account has been linked to Kreo Finance.
          </p>
        </div>

        {loading && (
          <Card className="border-white/10 bg-card/40 backdrop-blur-md">
            <CardContent className="pt-8 pb-8 flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="font-body text-sm text-muted-foreground">
                Syncing your Stripe account…
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && error && (
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="font-body text-sm text-red-400">{error}</p>
              </div>
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
                    Thank you for authorizing Stripe to Kreo Finance
                  </p>
                  <p className="font-body text-sm text-muted-foreground mt-0.5">
                    We have successfully synced your Stripe account.
                  </p>
                </div>
              </CardContent>
            </Card>

            {account && (
              <Card className="border-white/10 bg-card/40 backdrop-blur-md">
                <CardContent className="pt-4 pb-4 space-y-2">
                  <p className="font-display font-semibold text-sm">Account Details</p>
                  {account.display_name && (
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-muted-foreground">Name</span>
                      <span>{account.display_name as string}</span>
                    </div>
                  )}
                  {account.email && (
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-muted-foreground">Email</span>
                      <span>{account.email as string}</span>
                    </div>
                  )}
                  {account.country && (
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-muted-foreground">Country</span>
                      <span className="uppercase">{account.country as string}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Payouts</span>
                    <span className={account.payouts_enabled ? "text-creo-teal" : "text-amber-400"}>
                      {account.payouts_enabled ? "Enabled" : "Pending"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {monthlyEarnings.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-display font-semibold text-sm">
                    Earnings by Month
                  </h2>
                </div>
                {monthlyEarnings.map((entry) => (
                  <Card
                    key={entry.month}
                    className="border-white/10 bg-card/40 backdrop-blur-md"
                  >
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-display font-semibold text-sm">
                            {entry.month}
                          </p>
                        </div>
                        <p className="font-display font-bold text-creo-teal text-sm">
                          {formatCurrency(entry.amount, entry.currency)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {monthlyEarnings.length === 0 && account && (
              <Card className="border-white/10 bg-card/40 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="font-display text-lg">No Earnings Yet</CardTitle>
                  <CardDescription className="font-body text-sm">
                    No earnings data was found on your Stripe account for the last 6 months.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

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
