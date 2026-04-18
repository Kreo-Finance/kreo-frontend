import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Loader2, ArrowRight, Globe, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SumsubWidget from "@/components/SumsubWidget";
import { authApi } from "@/lib/api/auth";

// Accreditation is bypassed for now — step flow is jurisdiction → kyc → done
type Step = "jurisdiction" | "kyc" | "done";

const STEPS: { id: Step; label: string }[] = [
  { id: "jurisdiction", label: "Jurisdiction" },
  { id: "kyc", label: "Identity KYC" },
  { id: "done", label: "All Set" },
];

const JURISDICTIONS = [
  { value: "SG", label: "Singapore" },
  { value: "US", label: "United States" },
  { value: "IN", label: "India" },
  { value: "UAE", label: "UAE / DIFC" },
  { value: "EU", label: "European Union" },
  { value: "UK", label: "United Kingdom" },
  { value: "OTHER", label: "Other" },
];

export default function InvestorOnboarding() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const {
    walletAddress,
    selectedRole,
    investorKycStatus,
    investorUnlocked,
    setInvestorKycStatus,
    setAccreditationStatus,
  } = useAuth({ autoAuthenticate: false });

  const [jurisdiction, setJurisdiction] = useState<string>("");
  const [sumsubToken, setSumsubToken] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const activeStep: Step =
    !jurisdiction
      ? "jurisdiction"
      : investorKycStatus !== "approved"
        ? "kyc"
        : "done";

  const fetchSumsubToken = useCallback(async () => {
    setTokenLoading(true);
    setTokenError(null);
    setSumsubToken(null);
    try {
      const { data } = await authApi.getSumsubToken("investor");
      setSumsubToken(data.accessToken);
    } catch {
      setTokenError("Failed to start verification. Please try again.");
    } finally {
      setTokenLoading(false);
    }
  }, []);

  // Auto-fetch token when KYC step becomes active and not yet pending
  useEffect(() => {
    if (activeStep === "kyc" && investorKycStatus !== "pending") {
      fetchSumsubToken();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  const handleKycSubmitted = () => {
    setInvestorKycStatus("pending");
    // Bypass accreditation — mark as approved immediately
    setAccreditationStatus("approved");
    setSumsubToken(null);
  };

  const truncated = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "";

  const stepDone = (step: Step) => {
    if (step === "jurisdiction") return !!jurisdiction;
    if (step === "kyc") return investorKycStatus === "approved";
    if (step === "done") return investorUnlocked;
    return false;
  };

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
          containerId="sumsub-investor-kyc"
          onApplicantSubmitted={handleKycSubmitted}
          onError={() => setTokenError("Verification error. Please try again.")}
        />
      );
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 glass-morphism">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <Link to="/" className="font-display text-2xl font-bold text-gradient-hero">
            KREO
          </Link>
          <div className="flex items-center gap-3">
            {truncated && (
              <span className="font-mono text-xs text-muted-foreground">{truncated}</span>
            )}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="h-8 w-8 rounded-full border border-creo-pink/30 bg-creo-pink/5 flex items-center justify-center text-creo-pink hover:bg-creo-pink/15 transition-colors"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4">
        <div className="w-full max-w-lg space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="font-display text-3xl font-bold">Investor Setup</h1>
            <p className="font-body text-muted-foreground text-sm">
              Verify your identity to start investing on Kreo.
            </p>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-1">
            {STEPS.map((step, idx) => {
              const done = stepDone(step.id);
              const active = step.id === activeStep;
              return (
                <div key={step.id} className="flex items-center gap-1 flex-1">
                  <div
                    className={`flex items-center gap-1 ${
                      active ? "text-foreground" : done ? "text-creo-teal" : "text-muted-foreground"
                    }`}
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
                    <div className={`flex-1 h-px ${done ? "bg-creo-teal/50" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            {activeStep === "jurisdiction" && (
              <motion.div
                key="jurisdiction"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
              >
                <Card className="border-white/10 bg-card/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="font-display text-lg flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Select Jurisdiction
                    </CardTitle>
                    <CardDescription className="font-body text-sm">
                      Select your primary jurisdiction for compliance purposes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select onValueChange={setJurisdiction} value={jurisdiction}>
                      <SelectTrigger className="w-full font-body">
                        <SelectValue placeholder="Select your country / region" />
                      </SelectTrigger>
                      <SelectContent>
                        {JURISDICTIONS.map((j) => (
                          <SelectItem key={j.value} value={j.value} className="font-body">
                            {j.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      disabled={!jurisdiction}
                      className="w-full bg-gradient-hero font-body font-semibold text-primary-foreground hover:opacity-90"
                    >
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeStep === "kyc" && (
              <motion.div
                key="kyc"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
              >
                <Card className="border-white/10 bg-card/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="font-display text-lg">Identity Verification</CardTitle>
                    <CardDescription className="font-body text-sm">
                      Verify your government-issued ID and liveness via Sumsub. Takes 2–5 minutes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {investorKycStatus === "pending" ? (
                      <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 text-sm font-body text-amber-400">
                        Verification under review. Usually approved within 24 hours.
                      </div>
                    ) : investorKycStatus === "rejected" ? (
                      <>
                        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm font-body text-red-400">
                          Verification rejected. Please retry with a valid government ID.
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

            {activeStep === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="border-creo-teal/30 bg-creo-teal/5 backdrop-blur-md text-center">
                  <CardContent className="pt-8 pb-8 space-y-4">
                    <CheckCircle2 className="h-12 w-12 text-creo-teal mx-auto" />
                    <h2 className="font-display text-xl font-bold">Verification Complete</h2>
                    <p className="font-body text-sm text-muted-foreground">
                      Your investor account is verified. You can now invest in creator tokens on Kreo.
                    </p>
                    {selectedRole === "both" ? (
                      <div className="space-y-3">
                        <p className="text-xs text-muted-foreground font-body">
                          You selected Creator + Investor. Complete your creator verification next.
                        </p>
                        <Button
                          onClick={() => navigate("/onboarding/creator")}
                          className="bg-gradient-hero font-body font-semibold text-primary-foreground hover:opacity-90 px-8"
                        >
                          Set Up Creator Account
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => navigate("/investor/portfolio")}
                        className="bg-gradient-hero font-body font-semibold text-primary-foreground hover:opacity-90 px-8"
                      >
                        Go to Portfolio
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
