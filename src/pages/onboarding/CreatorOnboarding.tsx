import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Loader2,
  ExternalLink,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import SumsubWidget from "@/components/SumsubWidget";
import { authApi } from "@/lib/api/auth";
import { useGumroad } from "@/hooks/useGumroad";
import { useYoutube } from "@/hooks/useYoutube";

type Step = "kyc" | "income" | "done";

const STEPS: { id: Step; label: string; description: string }[] = [
  {
    id: "kyc",
    label: "Identity Verification",
    description: "Verify your identity with Sumsub",
  },
  {
    id: "income",
    label: "Income Connection",
    description: "Connect Stripe or AdSense",
  },
  {
    id: "done",
    label: "All Set",
    description: "Your creator account is ready",
  },
];

export default function CreatorOnboarding() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme, toggleTheme } = useTheme();
  const {
    walletAddress,
    creatorKycStatus,
    creatorIncomeConnected,
    creatorUnlocked,
    setCreatorKycStatus,
    setCreatorIncomeConnected,
  } = useAuth({ autoAuthenticate: false });

  const { connect: connectGumroad, connecting: gumroadConnecting, fetchSalesData } = useGumroad();
  const { connect: connectYoutube, connecting: youtubeConnecting } = useYoutube();

  const [sumsubToken, setSumsubToken] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [incomeLoading, setIncomeLoading] = useState(false);

  const activeStep: Step =
    creatorKycStatus !== "approved"
      ? "kyc"
      : !creatorIncomeConnected
        ? "income"
        : "done";

  const fetchSumsubToken = useCallback(async () => {
    setTokenLoading(true);
    setTokenError(null);
    setSumsubToken(null);
    try {
      const { data } = await authApi.getSumsubToken("creator");
      setSumsubToken(data.accessToken);
    } catch {
      setTokenError("Failed to start verification. Please try again.");
    } finally {
      setTokenLoading(false);
    }
  }, []);

  // Auto-fetch token when KYC step is active and not yet pending
  useEffect(() => {
    if (activeStep === "kyc" && creatorKycStatus !== "pending") {
      fetchSumsubToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  // Handle return from Gumroad OAuth — backend redirects back with ?gumroad=success
  useEffect(() => {
    if (searchParams.get("gumroad") === "success") {
      fetchSalesData().then(() => {
        setCreatorIncomeConnected(true);
      });
      setSearchParams({}, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle return from YouTube OAuth — backend currently redirects to /onboarding/creator?channels=...
  // Forward to the channel selection page until backend is updated to redirect there directly.
  useEffect(() => {
    const channelsParam = searchParams.get("channels");
    if (channelsParam) {
      navigate(`/onboarding/creator/youtube/channels?channels=${channelsParam}`, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKycSubmitted = () => {
    // Keep widget mounted — waiting for idCheck.onApplicantStatusChanged (GREEN)
    // which fires right after onApplicantSubmitted in sandbox mode.
  };

  const handleConnectStripe = async () => {
    setIncomeLoading(true);
    try {
      // TODO: redirect to Stripe OAuth
      // window.location.href = `https://connect.stripe.com/oauth/authorize?...`;
      await new Promise((res) => setTimeout(res, 1500));
      setCreatorIncomeConnected(true);
    } finally {
      setIncomeLoading(false);
    }
  };

  const handleConnectAdSense = async () => {
    setIncomeLoading(true);
    try {
      // TODO: redirect to Google AdSense OAuth
      await new Promise((res) => setTimeout(res, 1500));
      setCreatorIncomeConnected(true);
    } finally {
      setIncomeLoading(false);
    }
  };

  const handleConnectGumroad = async () => {
    const connected = await connectGumroad();
    if (connected) {
      setCreatorIncomeConnected(true);
    }
  };

  const truncated = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 glass-morphism">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <Link
            to="/"
            className="font-display text-2xl font-bold text-gradient-hero"
          >
            KREO
          </Link>
          <div className="flex items-center gap-3">
            {truncated && (
              <span className="font-mono text-xs text-muted-foreground">
                {truncated}
              </span>
            )}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="h-8 w-8 rounded-full border border-creo-pink/30 bg-creo-pink/5 flex items-center justify-center text-creo-pink hover:bg-creo-pink/15 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="h-3.5 w-3.5" />
              ) : (
                <Moon className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4">
        <div className="w-full max-w-lg space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="font-display text-3xl font-bold">Creator Setup</h1>
            <p className="font-body text-muted-foreground text-sm">
              Complete the steps below to unlock your creator account.
            </p>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-2">
            {STEPS.map((step, idx) => {
              const done =
                (step.id === "kyc" && creatorKycStatus === "approved") ||
                (step.id === "income" && creatorIncomeConnected) ||
                (step.id === "done" && creatorUnlocked);
              const active = step.id === activeStep;
              return (
                <div key={step.id} className="flex items-center gap-2 flex-1">
                  <div
                    className={`flex items-center gap-1.5 ${active ? "text-foreground" : done ? "text-creo-teal" : "text-muted-foreground"}`}
                  >
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="text-xs font-body font-medium whitespace-nowrap">
                      {step.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-px ${done ? "bg-creo-teal/50" : "bg-border"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            {activeStep === "kyc" && (
              <motion.div
                key="kyc"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
              >
                <Card className="border-white/10 bg-card/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="font-display text-lg">
                      Identity Verification
                    </CardTitle>
                    <CardDescription className="font-body text-sm">
                      We use Sumsub to verify your identity. This takes 2–5
                      minutes and requires a government-issued ID.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {creatorKycStatus === "pending" ? (
                      <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 text-sm font-body text-amber-400">
                        Your verification is under review. We'll notify you once
                        it's approved — usually within 24 hours.
                      </div>
                    ) : creatorKycStatus === "rejected" ? (
                      <>
                        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm font-body text-red-400">
                          Verification was rejected. Please try again with a
                          valid government ID.
                        </div>
                        {renderKycWidget()}
                      </>
                    ) : (
                      renderKycWidget()
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeStep === "income" && (
              <motion.div
                key="income"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
              >
                <Card className="border-white/10 bg-card/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="font-display text-lg">
                      Connect Income Source
                    </CardTitle>
                    <CardDescription className="font-body text-sm">
                      Connect your revenue stream so investors can evaluate your
                      earning potential. Only one connection is required.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={handleConnectStripe}
                      disabled={incomeLoading}
                      variant="outline"
                      className="w-full font-body font-semibold border-border hover:bg-accent justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-violet-400 font-bold">
                          stripe
                        </span>
                        Connect Stripe
                      </span>
                      {incomeLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>

                    <Button
                      onClick={handleConnectAdSense}
                      disabled={incomeLoading}
                      variant="outline"
                      className="w-full font-body font-semibold border-border hover:bg-accent justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-blue-400 font-bold">G</span>
                        Connect AdSense
                      </span>
                      {incomeLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>

                    <Button
                      onClick={handleConnectGumroad}
                      disabled={gumroadConnecting}
                      variant="outline"
                      className="w-full font-body font-semibold border-border hover:bg-accent justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-pink-400 font-bold">G</span>
                        Connect Gumroad
                      </span>
                      {gumroadConnecting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>

                    <Button
                      onClick={() => connectYoutube()}
                      disabled={youtubeConnecting}
                      variant="outline"
                      className="w-full font-body font-semibold border-border hover:bg-accent justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-red-500 font-bold">▶</span>
                        Connect YouTube
                      </span>
                      {youtubeConnecting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeStep === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="border-creo-teal/30 bg-creo-teal/5 backdrop-blur-md text-center">
                  <CardContent className="pt-8 pb-8 space-y-4">
                    <CheckCircle2 className="h-12 w-12 text-creo-teal mx-auto" />
                    <h2 className="font-display text-xl font-bold">
                      You're all set!
                    </h2>
                    <p className="font-body text-sm text-muted-foreground">
                      Your creator account is verified and ready. Start creating
                      your first offering.
                    </p>
                    <Button
                      onClick={() => navigate("/creator/dashboard")}
                      className="bg-gradient-hero font-body font-semibold text-primary-foreground hover:opacity-90 px-8"
                    >
                      Go to Dashboard
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );

  function renderKycWidget() {
    if (tokenLoading) {
      return (
        <div className="flex items-center justify-center min-h-[120px]">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }
    if (tokenError) {
      return (
        <div className="space-y-3">
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm font-body text-red-400">
            {tokenError}
          </div>
          <Button
            onClick={fetchSumsubToken}
            variant="outline"
            className="w-full font-body font-semibold"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </div>
      );
    }
    if (sumsubToken) {
      return (
        <SumsubWidget
          accessToken={sumsubToken}
          containerId="sumsub-creator-kyc"
          onApplicantSubmitted={handleKycSubmitted}
          onApplicantApproved={() => {
                setCreatorKycStatus("approved");
                setSumsubToken(null);
              }}
          onError={() => setTokenError("Verification error. Please try again.")}
        />
      );
    }
    return null;
  }
}
