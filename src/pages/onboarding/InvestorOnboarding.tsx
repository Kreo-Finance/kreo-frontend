import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Loader2, ArrowRight, Globe } from "lucide-react";
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

type Step = "jurisdiction" | "kyc" | "accreditation" | "done";

const STEPS: { id: Step; label: string }[] = [
  { id: "jurisdiction", label: "Jurisdiction" },
  { id: "kyc", label: "Identity KYC" },
  { id: "accreditation", label: "Accreditation" },
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

const ACCREDITATION_INFO: Record<string, { tier: string; description: string }> = {
  SG: {
    tier: "Section 275 (MAS)",
    description:
      "High net worth individual (≥ SGD 2M net financial assets) or institutional investor under the Securities and Futures Act.",
  },
  US: {
    tier: "Reg D Accredited Investor",
    description:
      "Income > $200K/yr (or $300K joint) for the past 2 years, or net worth > $1M excluding primary residence.",
  },
  IN: {
    tier: "HNI / Qualified Investor",
    description:
      "SEBI-qualified institutional buyer or high net worth individual with net worth ≥ ₹5 Cr.",
  },
  UAE: {
    tier: "Professional Investor (DIFC/ADGM)",
    description:
      "Net assets ≥ USD 1M or annual income ≥ USD 200K, verified by a DIFC/ADGM-licensed firm.",
  },
  EU: {
    tier: "MiFID II Professional Client",
    description:
      "Meets at least two of: 10+ transactions/quarter, EUR 500K+ portfolio, 1+ year professional finance experience.",
  },
  UK: {
    tier: "FCA High Net Worth / Sophisticated Investor",
    description:
      "Annual income ≥ £100K or net assets ≥ £250K (excl. primary residence and pension).",
  },
  OTHER: {
    tier: "Equivalent Accreditation",
    description:
      "Equivalent accreditation in your home jurisdiction will be reviewed case-by-case by our compliance team.",
  },
};

export default function InvestorOnboarding() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const {
    walletAddress,
    selectedRole,
    investorKycStatus,
    accreditationStatus,
    investorUnlocked,
    setInvestorKycStatus,
    setAccreditationStatus,
  } = useAuth({ autoAuthenticate: false });

  const [jurisdiction, setJurisdiction] = useState<string>("");
  const [kycLoading, setKycLoading] = useState(false);
  const [accreditationLoading, setAccreditationLoading] = useState(false);

  const activeStep: Step =
    !jurisdiction
      ? "jurisdiction"
      : investorKycStatus !== "approved"
        ? "kyc"
        : accreditationStatus !== "approved"
          ? "accreditation"
          : "done";

  const handleStartKyc = async () => {
    setKycLoading(true);
    try {
      // TODO: Initialise Sumsub WebSDK with investor-level KYC
      await new Promise((res) => setTimeout(res, 1500));
      setInvestorKycStatus("pending");
    } finally {
      setKycLoading(false);
    }
  };

  const handleStartAccreditation = async () => {
    setAccreditationLoading(true);
    try {
      // TODO: Initialise Sumsub accreditation module
      await new Promise((res) => setTimeout(res, 1500));
      setAccreditationStatus("pending");
    } finally {
      setAccreditationLoading(false);
    }
  };

  const truncated = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "";

  const accInfo = jurisdiction ? ACCREDITATION_INFO[jurisdiction] : null;

  const stepDone = (step: Step) => {
    if (step === "jurisdiction") return !!jurisdiction;
    if (step === "kyc") return investorKycStatus === "approved";
    if (step === "accreditation") return accreditationStatus === "approved";
    if (step === "done") return investorUnlocked;
    return false;
  };

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
              Accreditation is required to invest on Kreo. This protects both you and the platform.
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
                      Accreditation requirements vary by country. Select your primary jurisdiction.
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

                    {accInfo && (
                      <div className="rounded-lg bg-creo-teal/5 border border-creo-teal/20 p-3 space-y-1">
                        <p className="text-xs font-body font-semibold text-creo-teal">
                          {accInfo.tier}
                        </p>
                        <p className="text-xs font-body text-muted-foreground leading-relaxed">
                          {accInfo.description}
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={() => {}}
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
                    {investorKycStatus === "pending" && (
                      <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 text-sm font-body text-amber-400">
                        Verification under review. Usually approved within 24 hours.
                      </div>
                    )}
                    {investorKycStatus === "rejected" && (
                      <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm font-body text-red-400">
                        Verification rejected. Please retry with a valid government ID.
                      </div>
                    )}

                    <div id="sumsub-investor-kyc" className="min-h-[200px]" />

                    <Button
                      onClick={handleStartKyc}
                      disabled={kycLoading || investorKycStatus === "pending"}
                      className="w-full bg-gradient-hero font-body font-semibold text-primary-foreground hover:opacity-90"
                    >
                      {kycLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Launching...
                        </>
                      ) : investorKycStatus === "pending" ? (
                        "Verification pending"
                      ) : (
                        <>
                          Start Verification <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeStep === "accreditation" && (
              <motion.div
                key="accreditation"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
              >
                <Card className="border-white/10 bg-card/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="font-display text-lg">Accreditation</CardTitle>
                    <CardDescription className="font-body text-sm">
                      {accInfo ? (
                        <>
                          Required for <span className="text-creo-teal">{accInfo.tier}</span>.{" "}
                          {accInfo.description}
                        </>
                      ) : (
                        "Prove your accredited investor status to unlock full investment access."
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {accreditationStatus === "pending" && (
                      <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 text-sm font-body text-amber-400">
                        Accreditation under review. This typically takes 24–48 hours.
                      </div>
                    )}
                    {accreditationStatus === "rejected" && (
                      <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm font-body text-red-400">
                        Accreditation rejected. Please contact support or retry with valid documents.
                      </div>
                    )}

                    <div id="sumsub-accreditation" className="min-h-[200px]" />

                    <Button
                      onClick={handleStartAccreditation}
                      disabled={accreditationLoading || accreditationStatus === "pending"}
                      className="w-full bg-gradient-hero font-body font-semibold text-primary-foreground hover:opacity-90"
                    >
                      {accreditationLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Launching...
                        </>
                      ) : accreditationStatus === "pending" ? (
                        "Review in progress"
                      ) : (
                        <>
                          Submit Documents <ArrowRight className="ml-2 h-4 w-4" />
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
                    <h2 className="font-display text-xl font-bold">Accreditation Complete</h2>
                    <p className="font-body text-sm text-muted-foreground">
                      Your investor account is verified. You can now invest in creator tokens on Kreo.
                    </p>
                    {/* If user selected "both", route to creator onboarding next */}
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
