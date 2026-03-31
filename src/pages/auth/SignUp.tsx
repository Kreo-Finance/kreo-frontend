import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAppKit } from "@reown/appkit/react";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const StripeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="#635BFF">
    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
  </svg>
);

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { open } = useAppKit();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: wire up real auth
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Left panel: form ── */}
      <div className="flex flex-1 flex-col px-6 py-10 sm:px-12 lg:px-20 xl:px-28 justify-center">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-12">
          <Link
            to="/"
            className="font-display text-2xl font-bold text-gradient-hero select-none"
          >
            KREO
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="h-9 w-9 rounded-full border border-creo-pink/30 bg-creo-pink/5 flex items-center justify-center text-creo-pink hover:bg-creo-pink/15 transition-colors"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <span className="font-body text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/auth/signin"
                className="font-semibold text-foreground underline underline-offset-4 hover:text-creo-pink transition-colors"
              >
                Log in
              </Link>
            </span>
          </div>
        </div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-sm mx-auto lg:mx-0"
        >
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold">Create account</h1>
            <p className="font-body text-sm text-muted-foreground mt-2">
              Join over 280K creators earning on KREO.
            </p>
          </div>

          {/* OAuth buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <Button
              variant="outline"
              className="h-12 border-border bg-card/40 hover:bg-muted font-body text-sm font-medium gap-3 justify-center"
              onClick={() => {/* TODO: Google OAuth */}}
            >
              <GoogleIcon />
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="h-12 border-border bg-card/40 hover:bg-muted font-body text-sm font-medium gap-3 justify-center"
              onClick={() => {/* TODO: Stripe OAuth */}}
            >
              <StripeIcon />
              Continue with Stripe
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <Separator className="bg-border" />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 font-body text-xs text-muted-foreground">
              or
            </span>
          </div>

          {/* Email / Password form */}
          <form onSubmit={handleEmailSignUp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="font-body text-sm text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-border bg-card/40 font-body focus-visible:ring-creo-pink/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="font-body text-sm text-muted-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-border bg-card/40 font-body pr-11 focus-visible:ring-creo-pink/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-12 bg-gradient-hero font-body text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 mt-1"
            >
              {loading ? "Creating account…" : "Create account"}
            </Button>

            <p className="font-body text-xs text-muted-foreground text-center leading-relaxed">
              By creating an account you agree to our{" "}
              <Link
                to="/terms"
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </form>

          {/* Web3 wallet option */}
          {/* <div className="mt-6 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => open()}
              className="w-full h-11 border-border bg-card/40 hover:bg-muted font-body text-sm font-medium gap-2"
            >
              <Wallet className="h-4 w-4 text-creo-teal" />
              Sign up with Wallet instead
            </Button>
          </div> */}
        </motion.div>
      </div>

      {/* ── Right panel: branding ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-card border-l border-border items-center justify-center">
        <BrandPanel />
      </div>
    </div>
  );
}

function BrandPanel() {
  const highlights = [
    {
      icon: "💸",
      title: "Revenue Sharing",
      desc: "Investors earn a share of creator income as NFT bond yield.",
      color: "border-creo-pink/20 bg-creo-pink/5",
    },
    {
      icon: "🔗",
      title: "On-chain Bonds",
      desc: "Creator bonds are fully tokenized and tradeable on Base.",
      color: "border-creo-teal/20 bg-creo-teal/5",
    },
    {
      icon: "📈",
      title: "Transparent Analytics",
      desc: "Real-time earnings dashboard visible to all stakeholders.",
      color: "border-creo-yellow/20 bg-creo-yellow/5",
    },
    {
      icon: "🛡️",
      title: "Non-custodial",
      desc: "Your keys, your funds. KREO never holds your assets.",
      color: "border-violet-500/20 bg-violet-500/5",
    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-12 select-none">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-creo-teal/5 via-transparent to-creo-pink/5 pointer-events-none" />

      <motion.p
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-display text-2xl font-bold text-center mb-10"
      >
        Join over{" "}
        <span className="text-gradient-hero">280,196 creators</span>
        <br />
        who have earned over{" "}
        <span className="text-gradient-accent">$1.2 billion</span>.
      </motion.p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        {highlights.map((h, i) => (
          <motion.div
            key={h.title}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
            className={`rounded-xl border ${h.color} p-4 flex items-start gap-4`}
          >
            <span className="text-2xl leading-none mt-0.5">{h.icon}</span>
            <div>
              <p className="font-display text-sm font-semibold text-foreground">{h.title}</p>
              <p className="font-body text-xs text-muted-foreground mt-0.5">{h.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
