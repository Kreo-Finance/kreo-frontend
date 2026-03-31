import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Wallet, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";

const navLinks = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Creator Dashboard", href: "/creator/dashboard" },
  { label: "Portfolio", href: "/investor/portfolio" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const WORD = "KREO";
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
    return () => {
      ids.forEach(clearTimeout);
    };
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { theme, toggleTheme } = useTheme();

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const isHashLink = (href: string) => href.startsWith("/#");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-white/5">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8 gap-4">

        {/* Logo — left */}
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

        {/* Nav links — center (hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          {navLinks.map((link) =>
            isHashLink(link.href) ? (
              <a
                key={link.label}
                href={link.href}
                className="font-body text-base font-medium text-muted-foreground transition-all hover:text-foreground hover:translate-y-[-1px] whitespace-nowrap"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className={`font-body text-base font-medium transition-all hover:text-foreground hover:translate-y-[-1px] whitespace-nowrap ${
                  location.pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        {/* Actions — right (hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-9 w-9 rounded-full border border-creo-pink/30 bg-creo-pink/5 flex items-center justify-center text-creo-pink hover:bg-creo-pink/15 transition-colors flex-shrink-0"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <Button
            className="bg-amber-300 hover:bg-amber-400 font-body text-sm font-semibold text-black px-5 shadow-[0_0_16px_rgba(251,191,36,0.4)] hover:shadow-[0_0_24px_rgba(251,191,36,0.6)] transition-all whitespace-nowrap"
            onClick={() => navigate("/auth/signin")}
          >
            Sign In
          </Button>

          {isConnected ? (
            <>
              <Button
                onClick={() => open()}
                className="bg-card/40 border border-white/10 backdrop-blur-md font-body text-sm font-semibold text-foreground hover:bg-white/5 flex items-center gap-2 h-10 px-4 whitespace-nowrap"
              >
                <div className="h-2 w-2 rounded-full bg-creo-teal animate-pulse flex-shrink-0" />
                {truncatedAddress}
              </Button>
              <Link to="/creator/dashboard">
                <Button className="bg-gradient-hero font-body text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-glow-pink px-5 h-10 whitespace-nowrap">
                  Start Creating
                </Button>
              </Link>
            </>
          ) : (
            <Button
              onClick={() => open()}
              className="bg-gradient-hero font-body text-sm font-semibold text-primary-foreground hover:opacity-90 flex items-center gap-2 h-10 px-5 whitespace-nowrap"
            >
              <Wallet size={16} />
              Connect Wallet
            </Button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-foreground flex-shrink-0"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-border bg-background lg:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) =>
                isHashLink(link.href) ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className="font-body text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg px-3 py-2.5 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`font-body text-base font-medium rounded-lg px-3 py-2.5 transition-colors hover:bg-muted ${
                      location.pathname === link.href
                        ? "text-foreground bg-muted/50"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ),
              )}

              <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-border">
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 text-creo-pink" />
                  ) : (
                    <Moon className="h-4 w-4 text-creo-pink" />
                  )}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>

                <Button
                  className="w-full bg-amber-300 hover:bg-amber-400 font-body text-sm font-semibold text-black shadow-[0_0_16px_rgba(251,191,36,0.4)] transition-all"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/auth/signin");
                  }}
                >
                  Sign In
                </Button>

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

                {isConnected && (
                  <Link to="/creator/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button
                      className="w-full font-body text-sm font-semibold border-border hover:bg-accent text-foreground"
                      variant="outline"
                    >
                      Start Creating
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
