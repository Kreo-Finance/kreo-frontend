import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Loader2,
  ExternalLink,
  RefreshCw,
  SendHorizontal,
  AlertCircle,
  Youtube,
  Home,
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
import { useRegisterCreator } from "@/hooks/useRegisterCreator";

type Step = "kyc" | "income" | "register" | "done";

const STEPS: { id: Step; label: string; description: string }[] = [
  {
    id: "kyc",
    label: "Identity Verification",
    description: "Verify your identity with Sumsub",
  },
  {
    id: "income",
    label: "Income Connection",
    description: "Connect your revenue stream",
  },
  {
    id: "register",
    label: "Registration",
    description: "Request creator registration",
  },
  {
    id: "done",
    label: "All Set",
    description: "Your creator account is ready",
  },
];

export default function CreatorOnboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const channelNotMonetized =
    (location.state as { channelNotMonetized?: boolean } | null)
      ?.channelNotMonetized ?? false;
  const { theme, toggleTheme } = useTheme();
  const {
    walletAddress,
    creatorKycStatus,
    creatorIncomeConnected,
    creatorUnlocked,
    connectedIncomeSource,
    creatorRegistrationRequested,
    setCreatorKycStatus,
    setCreatorIncomeConnected,
    setConnectedIncomeSource,
    setCreatorRegistrationRequested,
  } = useAuth({ autoAuthenticate: false });

  const {
    connect: connectGumroad,
    connecting: gumroadConnecting,
    fetchSalesData,
  } = useGumroad();
  const { connect: connectYoutube, connecting: youtubeConnecting } = useYoutube();
  const { register, registering, error: registerError } = useRegisterCreator();

  const [sumsubToken, setSumsubToken] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [incomeLoading, setIncomeLoading] = useState(false);

  const activeStep: Step =
    creatorKycStatus !== "approved"
      ? "kyc"
      : !creatorIncomeConnected
        ? "income"
        : !creatorRegistrationRequested
          ? "register"
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

  useEffect(() => {
    if (activeStep === "kyc" && creatorKycStatus !== "pending") {
      fetchSumsubToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  useEffect(() => {
    if (searchParams.get("gumroad") === "success") {
      fetchSalesData().then(() => {
        setCreatorIncomeConnected(true);
        setConnectedIncomeSource("gumroad");
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
      navigate(
        `/onboarding/creator/youtube/channels?channels=${channelsParam}`,
        { replace: true },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKycSubmitted = () => {
    // Keep widget mounted — waiting for idCheck.onApplicantStatusChanged (GREEN)
  };

  const handleConnectStripe = async () => {
    setIncomeLoading(true);
    try {
      // TODO: redirect to Stripe OAuth
      await new Promise((res) => setTimeout(res, 1500));
      setCreatorIncomeConnected(true);
      setConnectedIncomeSource("stripe");
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
      setConnectedIncomeSource("gumroad");
    }
    // If OAuth redirect happens, source is set in the useEffect above
  };

  const handleRequestRegistration = async () => {
    if (!walletAddress || !connectedIncomeSource) return;
    const ok = await register(
      connectedIncomeSource,
      walletAddress,
      creatorKycStatus === "approved",
    );
    if (ok) {
      setCreatorRegistrationRequested(true);
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
                (step.id === "register" && creatorRegistrationRequested) ||
                (step.id === "done" &&
                  creatorUnlocked &&
                  creatorRegistrationRequested);
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
                    {channelNotMonetized ? (
                      <div className="space-y-4">
                        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 flex gap-3">
                          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="font-body text-sm font-semibold text-red-400">
                              Channel Not Monetized
                            </p>
                            <p className="font-body text-sm text-red-400/80">
                              Sorry, we cannot proceed forward as your channel
                              is not monetized! Only YouTube Partner Program
                              (YPP) channels are supported.
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => connectYoutube()}
                          disabled={youtubeConnecting}
                          variant="outline"
                          className="w-full font-body font-semibold border-border hover:bg-accent justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <Youtube className="h-4 w-4 text-red-500" />
                            Connect Another Channel
                          </span>
                          {youtubeConnecting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          onClick={() => navigate("/")}
                          variant="ghost"
                          className="w-full font-body font-semibold text-muted-foreground hover:text-foreground justify-center gap-2"
                        >
                          <Home className="h-4 w-4" />
                          Back to Homepage
                        </Button>
                      </div>
                    ) : (
                      <>
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
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeStep === "register" && (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
              >
                <Card className="border-white/10 bg-card/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="font-display text-lg">
                      Request Creator Registration
                    </CardTitle>
                    <CardDescription className="font-body text-sm">
                      Your KYC is approved and income source is connected.
                      Submit your registration for admin review — they'll
                      register you on-chain and activate your creator account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {connectedIncomeSource && (
                      <div className="rounded-lg bg-creo-teal/5 border border-creo-teal/20 px-4 py-3 text-sm font-body text-creo-teal flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                        <span>
                          Income source:{" "}
                          <span className="font-semibold capitalize">
                            {connectedIncomeSource}
                          </span>
                        </span>
                      </div>
                    )}

                    {registerError && (
                      <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm font-body text-red-400">
                        {registerError}
                      </div>
                    )}

                    <Button
                      onClick={handleRequestRegistration}
                      disabled={
                        registering || !connectedIncomeSource || !walletAddress
                      }
                      className="w-full bg-gradient-hero font-body font-semibold text-primary-foreground hover:opacity-90"
                    >
                      {registering ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          <SendHorizontal className="mr-2 h-4 w-4" />
                          Request Register Now
                        </>
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
                      Registration Submitted!
                    </h2>
                    <p className="font-body text-sm text-muted-foreground">
                      Your registration request has been sent to our team. An
                      admin will review and activate your creator account
                      on-chain. You'll be notified once it's complete.
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
