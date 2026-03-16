import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Wallet, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Link, useLocation } from "react-router-dom";
import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";


const navLinks = [
  { label: "Discover", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Creator Dashboard", href: "/creator/dashboard" },
  { label: "Portfolio", href: "/investor/portfolio" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const WORD = "CREO";
  const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@&!?%";
  const [chars, setChars] = useState<string[]>(WORD.split(""));
  const [landed, setLanded] = useState<boolean[]>(
    WORD.split("").map(() => true),
  );

  useEffect(() => {
    const ids: ReturnType<typeof setTimeout>[] = [];

    const runScramble = () => {
      WORD.split("").forEach((target, li) => {
        const stagger = li * 90;
        const frames = 8 + li * 3;

        ids.push(
          setTimeout(() => {
            setLanded((prev) => prev.map((v, i) => (i === li ? false : v)));
          }, stagger),
        );

        for (let f = 0; f < frames; f++) {
          ids.push(
            setTimeout(
              () => {
                setChars((prev) => {
                  const n = [...prev];
                  n[li] =
                    SCRAMBLE_CHARS[
                    Math.floor(Math.random() * SCRAMBLE_CHARS.length)
                    ];
                  return n;
                });
              },
              stagger + f * 45,
            ),
          );
        }

        ids.push(
          setTimeout(
            () => {
              setChars((prev) => {
                const n = [...prev];
                n[li] = target;
                return n;
              });
              setLanded((prev) => prev.map((v, i) => (i === li ? true : v)));
            },
            stagger + frames * 45,
          ),
        );
      });
    };

    runScramble();
    const loopId = setInterval(runScramble, 3500);
    return () => {
      clearInterval(loopId);
      ids.forEach(clearTimeout);
    };
  }, []);

  const location = useLocation();
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const isHashLink = (href: string) => href.startsWith("/#");

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Something went wrong. Please try again.");
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleWaitlistClose = (open: boolean) => {
    setWaitlistOpen(open);
    if (!open) {
      setTimeout(() => {
        setEmail("");
        setSubmitted(false);
        setError("");
      }, 300);
    }
  };



  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-white/5">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <Link
            to="/"
            className="font-display text-3xl font-bold tracking-tight select-none flex-shrink-0"
          >
            <span className="inline-flex items-center gap-px">
              {chars.map((char, i) => (
                <motion.span
                  key={`${i}-${landed[i] ? "on" : "off"}`}
                  initial={
                    landed[i]
                      ? { y: -10, scale: 1.4, filter: "blur(4px)" }
                      : { opacity: 1 }
                  }
                  animate={
                    landed[i]
                      ? { y: 0, scale: 1, filter: "blur(0px)" }
                      : { opacity: 1 }
                  }
                  transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{ display: "inline-block", minWidth: "0.6em" }}
                  className={
                    landed[i]
                      ? "text-gradient-hero"
                      : "text-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.9)]"
                  }
                  whileHover={{
                    y: -3,
                    scale: 1.2,
                    transition: { duration: 0.12 },
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </Link>

          <div className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) =>
              isHashLink(link.href) ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-body text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:translate-y-[-1px]"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`font-body text-sm font-medium transition-all hover:text-foreground hover:translate-y-[-1px] ${location.pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                    }`}
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            {!isConnected && (
              <Button
                variant="ghost"
                className="font-body text-sm text-muted-foreground hover:text-foreground transition-all"
                onClick={() => setWaitlistOpen(true)}
              >
                Join Waitlist
              </Button>
            )}
            
            {isConnected ? (
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => open()}
                  className="bg-card/40 border border-white/10 backdrop-blur-md font-body text-sm font-semibold text-foreground hover:bg-white/5 flex items-center gap-2 h-10 px-4"
                >
                  <div className="h-2 w-2 rounded-full bg-creo-teal animate-pulse" />
                  {truncatedAddress}
                </Button>
                <Link to="/creator/dashboard">
                  <Button className="bg-gradient-hero font-body text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-glow-pink px-5 h-10">
                    Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <Button
                onClick={() => open()}
                className="bg-gradient-hero font-body text-sm font-semibold text-primary-foreground hover:opacity-90 flex items-center gap-2 h-10 px-5"
              >
                <Wallet size={16} />
                Connect Wallet
              </Button>
            )}
          </div>



          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-border bg-background md:hidden"
            >
              <div className="flex flex-col gap-4 px-4 py-6">
                {navLinks.map((link) =>
                  isHashLink(link.href) ? (
                    <a
                      key={link.label}
                      href={link.href}
                      className="font-body text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="font-body text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ),
                )}
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  <Button
                    onClick={() => {
                      setMobileOpen(false);
                      open();
                    }}
                    className="w-full bg-gradient-hero font-body text-sm font-semibold text-primary-foreground flex items-center justify-center gap-2"
                  >
                    <Wallet size={16} />
                    {isConnected ? truncatedAddress : "Connect Wallet"}
                  </Button>
                  {isConnected ? (
                    <Link to="/creator/dashboard">
                      <Button className="w-full font-body text-sm font-semibold border-border hover:bg-accent text-foreground" variant="outline">
                        Start Creating
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="ghost"
                      className="justify-start font-body text-sm text-muted-foreground"
                      onClick={() => {
                        setMobileOpen(false);
                        setWaitlistOpen(true);
                      }}
                    >
                      Join Waitlist
                    </Button>
                  )}
                </div>


              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <Dialog open={waitlistOpen} onOpenChange={handleWaitlistClose}>
        <DialogContent className="sm:max-w-md border-border bg-background">
          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-hero">
                <CheckCircle2 className="h-7 w-7 text-primary-foreground" />
              </div>
              <DialogHeader>
                <DialogTitle className="font-display text-xl font-bold">
                  You&apos;re on the list!
                </DialogTitle>
                <DialogDescription className="font-body text-muted-foreground">
                  Thanks for joining the CREO waitlist. We&apos;ll be in touch
                  soon.
                </DialogDescription>
              </DialogHeader>
            </div>
          ) : (
            <>
              <DialogHeader className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero">
                  <Mail className="h-6 w-6 text-primary-foreground" />
                </div>
                <DialogTitle className="font-display text-xl font-bold">
                  Join the Waitlist
                </DialogTitle>
                <DialogDescription className="font-body text-muted-foreground">
                  Be among the first to experience CREO — the creator
                  economy&apos;s investment platform.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleWaitlistSubmit}
                className="flex flex-col gap-4 pt-2"
              >
                <div className="flex flex-col gap-1.5">
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="font-body h-11 border-border bg-background focus-visible:ring-ring"
                  />
                  {error && (
                    <p className="font-body text-xs text-destructive">
                      {error}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 bg-gradient-hero font-body text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Joining…
                    </span>
                  ) : (
                    "Get Early Access"
                  )}
                </Button>
                <p className="text-center font-body text-xs text-muted-foreground">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>

  );
};

export default Navbar;

