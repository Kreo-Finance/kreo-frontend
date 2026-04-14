import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Wallet, Loader2, ChevronDown } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { RoleSelectionModal } from "@/components/RoleSelectionModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavDropdownItem = { label: string; href: string };
type NavLink =
  | { label: string; href: string; dropdown?: undefined }
  | { label: string; href?: undefined; dropdown: NavDropdownItem[] };

const navLinks: NavLink[] = [
  { label: "MARKETPLACE", href: "/marketplace" },
  { label: "ROADMAP", href: "/#roadmap" },
  { label: "TEAM", href: "/team" },
  {
    label: "FOR CREATORS",
    dropdown: [
      { label: "Dashboard", href: "/creator/dashboard" },
      { label: "Portfolio", href: "/investor/portfolio" },
    ],
  },
  {
    label: "RESOURCES",
    dropdown: [
      { label: "Blog", href: "/blog" },
      { label: "Docs", href: "/documentation" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
];

// ─── Logo mark ───────────────────────────────────────────────────────────────

const KreoMark = () => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="km-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="hsl(168, 72%, 48%)" />
        <stop offset="100%" stopColor="hsl(340, 82%, 65%)" />
      </linearGradient>
      <linearGradient id="km-inner" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
      </linearGradient>
    </defs>
    {/* Outer diamond */}
    <path d="M14 1.5 L26.5 14 L14 26.5 L1.5 14 Z" fill="url(#km-grad)" />
    {/* Inner diamond facet */}
    <path d="M14 6.5 L21.5 14 L14 21.5 L6.5 14 Z" fill="url(#km-inner)" />
    {/* Top-left facet highlight */}
    <path d="M14 1.5 L6.5 14 L14 14 Z" fill="rgba(255,255,255,0.12)" />
    {/* K letterform */}
    <g fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="11.5" y1="9.5" x2="11.5" y2="18.5" />
      <line x1="11.5" y1="14" x2="16.5" y2="9.5" />
      <line x1="13" y1="12.4" x2="16.5" y2="18.5" />
    </g>
  </svg>
);

// ─── Logo scramble ───────────────────────────────────────────────────────────
import { useEffect } from "react";

const WORD = "KREO";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@&!?%";

function useScramble() {
  const [chars, setChars] = useState<string[]>(WORD.split(""));
  const [landed, setLanded] = useState<boolean[]>(WORD.split("").map(() => true));

  useEffect(() => {
    const ids: ReturnType<typeof setTimeout>[] = [];

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
          setTimeout(() => {
            setChars((prev) => {
              const n = [...prev];
              n[li] = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
              return n;
            });
          }, stagger + f * 45),
        );
      }

      ids.push(
        setTimeout(() => {
          setChars((prev) => {
            const n = [...prev];
            n[li] = target;
            return n;
          });
          setLanded((prev) => prev.map((v, i) => (i === li ? true : v)));
        }, stagger + frames * 45),
      );
    });

    return () => ids.forEach(clearTimeout);
  }, []);

  return { chars, landed };
}

// ─── Computed CTA ─────────────────────────────────────────────────────────────

function useNavbarCTA() {
  const navigate = useNavigate();
  const { open } = useAppKit();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const {
    isAuthenticated,
    authenticating,
    authenticate,
    selectedRole,
    activeRole,
    creatorUnlocked,
    investorUnlocked,
    verificationPending,
    logout,
  } = useAuth();

  const walletAddress = useAuthStore((s) => s.walletAddress);
  const setActiveRole = useAuthStore((s) => s.setActiveRole);

  const truncated = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "";

  const handleDisconnect = () => {
    disconnect();
    logout();
  };

  // Determine what to render for the primary CTA
  type CTAVariant =
    | "connect"
    | "signing"
    | "get-started"
    | "complete-setup"
    | "dashboard-single"
    | "dashboard-switcher";

  let variant: CTAVariant = "connect";

  if (!isConnected) {
    variant = "connect";
  } else if (isConnected && !isAuthenticated) {
    variant = authenticating ? "signing" : "connect";
  } else if (isAuthenticated && !selectedRole) {
    variant = "get-started";
  } else if (isAuthenticated && verificationPending) {
    variant = "complete-setup";
  } else if (isAuthenticated && creatorUnlocked && investorUnlocked) {
    variant = "dashboard-switcher";
  } else if (isAuthenticated && (creatorUnlocked || investorUnlocked)) {
    variant = "dashboard-single";
  }

  const resumeOnboarding = () => {
    if (selectedRole === "creator") navigate("/onboarding/creator");
    else navigate("/onboarding/investor");
  };

  const gotoDashboard = () => {
    if (activeRole === "creator") navigate("/creator/dashboard");
    else navigate("/investor/portfolio");
  };

  return {
    variant,
    truncated,
    isConnected,
    isAuthenticated,
    authenticating,
    roleModalOpen,
    setRoleModalOpen,
    activeRole,
    creatorUnlocked,
    investorUnlocked,
    open,
    authenticate,
    handleDisconnect,
    resumeOnboarding,
    gotoDashboard,
    setActiveRole,
  };
}

// ─── CTA Button (desktop) ─────────────────────────────────────────────────────

function NavbarCTA() {
  const cta = useNavbarCTA();

  if (cta.variant === "connect" || cta.variant === "signing") {
    return (
      <>
        <Button
          onClick={() => cta.open()}
          disabled={cta.authenticating}
          className="bg-gradient-hero font-body text-sm font-semibold text-primary-foreground hover:opacity-90 flex items-center gap-2 h-10 px-5 whitespace-nowrap"
        >
          {cta.authenticating ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Signing…
            </>
          ) : (
            <>
              <Wallet size={16} />
              Connect Wallet
            </>
          )}
        </Button>

        <RoleSelectionModal
          open={cta.roleModalOpen}
          onClose={() => cta.setRoleModalOpen(false)}
        />
      </>
    );
  }

  if (cta.variant === "get-started") {
    return (
      <>
        <Button
          onClick={() => cta.setRoleModalOpen(true)}
          className="bg-gradient-hero font-body text-sm font-semibold text-primary-foreground hover:opacity-90 h-10 px-5 whitespace-nowrap"
        >
          Get Started
        </Button>

        <RoleSelectionModal
          open={cta.roleModalOpen}
          onClose={() => cta.setRoleModalOpen(false)}
        />
      </>
    );
  }

  if (cta.variant === "complete-setup") {
    return (
      <Button
        onClick={cta.resumeOnboarding}
        className="bg-amber-400 hover:bg-amber-500 font-body text-sm font-semibold text-black h-10 px-5 whitespace-nowrap"
      >
        Complete Setup
      </Button>
    );
  }

  if (cta.variant === "dashboard-switcher") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-gradient-hero font-body text-sm font-semibold text-primary-foreground hover:opacity-90 h-10 px-5 whitespace-nowrap flex items-center gap-1.5">
            Dashboard
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onClick={() => {
              cta.setActiveRole("creator");
              cta.gotoDashboard();
            }}
            className={`font-body text-sm cursor-pointer ${cta.activeRole === "creator" ? "text-foreground font-semibold" : "text-muted-foreground"}`}
          >
            Creator Mode
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              cta.setActiveRole("investor");
              cta.gotoDashboard();
            }}
            className={`font-body text-sm cursor-pointer ${cta.activeRole === "investor" ? "text-foreground font-semibold" : "text-muted-foreground"}`}
          >
            Investor Mode
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={cta.handleDisconnect}
            className="font-body text-sm text-destructive cursor-pointer"
          >
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // dashboard-single
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-gradient-hero font-body text-sm font-semibold text-primary-foreground hover:opacity-90 h-10 px-5 whitespace-nowrap flex items-center gap-1.5">
          Dashboard
          <ChevronDown size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onClick={cta.gotoDashboard} className="font-body text-sm cursor-pointer">
          Go to Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={cta.handleDisconnect}
          className="font-body text-sm text-destructive cursor-pointer"
        >
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { chars, landed } = useScramble();

  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isHashLink = (href: string) => href.startsWith("/#");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-white/5">
      <div className="container mx-auto relative flex h-16 items-center justify-between px-4 lg:px-8 gap-4">

        {/* Logo */}
        <Link
          to="/"
          className="font-display text-3xl font-bold tracking-tight select-none flex-shrink-0"
        >
          <span className="inline-flex items-center gap-1">
            <KreoMark />
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
                whileHover={{ y: -3, scale: 1.2, transition: { duration: 0.12 } }}
              >
                {char}
              </motion.span>
            ))}
            </span>
            <span className="ml-1 self-start mt-1 rounded px-1.5 py-px text-[10px] font-bold tracking-widest uppercase bg-gradient-hero text-white leading-tight shadow-sm">
              BETA
            </span>
          </span>
        </Link>

        {/* Nav links — desktop */}
        <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) =>
            link.dropdown ? (
              <DropdownMenu key={link.label}>
                <DropdownMenuTrigger className="flex items-center gap-1 font-body text-base font-medium text-muted-foreground transition-all hover:text-foreground hover:translate-y-[-1px] whitespace-nowrap outline-none">
                  {link.label}
                  <ChevronDown size={13} className="mt-px" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  {link.dropdown.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        to={item.href}
                        className={`font-body text-sm cursor-pointer ${
                          location.pathname === item.href
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : isHashLink(link.href) ? (
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

        {/* Actions — desktop */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-9 w-9 rounded-full border border-creo-pink/30 bg-creo-pink/5 flex items-center justify-center text-creo-pink hover:bg-creo-pink/15 transition-colors flex-shrink-0"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <NavbarCTA />
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
          <MobileMenu onClose={() => setMobileOpen(false)} location={location} />
        )}
      </AnimatePresence>
    </nav>
  );
};

// ─── Mobile menu ──────────────────────────────────────────────────────────────

function MobileMenu({
  onClose,
  location,
}: {
  onClose: () => void;
  location: ReturnType<typeof useLocation>;
}) {
  const { theme, toggleTheme } = useTheme();
  const cta = useNavbarCTA();
  const isHashLink = (href: string) => href.startsWith("/#");
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="border-b border-border bg-background lg:hidden overflow-hidden"
    >
      <div className="flex flex-col gap-1 px-4 py-4">
        {navLinks.map((link) =>
          link.dropdown ? (
            <div key={link.label}>
              <button
                onClick={() => setOpenGroup(openGroup === link.label ? null : link.label)}
                className="w-full flex items-center justify-between font-body text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg px-3 py-2.5 transition-colors"
              >
                {link.label}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${openGroup === link.label ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openGroup === link.label && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden pl-3"
                  >
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={onClose}
                        className={`block font-body text-sm rounded-lg px-3 py-2 transition-colors hover:bg-muted ${
                          location.pathname === item.href
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : isHashLink(link.href) ? (
            <a
              key={link.label}
              href={link.href}
              className="font-body text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg px-3 py-2.5 transition-colors"
              onClick={onClose}
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
              onClick={onClose}
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

          {/* Mobile CTA — mirrors desktop variant */}
          {(cta.variant === "connect" || cta.variant === "signing") && (
            <Button
              onClick={() => { cta.open(); onClose(); }}
              disabled={cta.authenticating}
              className="w-full bg-gradient-hero font-body text-sm font-semibold text-primary-foreground flex items-center justify-center gap-2"
            >
              {cta.authenticating ? (
                <><Loader2 size={14} className="animate-spin" /> Signing…</>
              ) : (
                <><Wallet size={16} /> Connect Wallet</>
              )}
            </Button>
          )}

          {cta.variant === "get-started" && (
            <>
              <Button
                onClick={() => { cta.setRoleModalOpen(true); onClose(); }}
                className="w-full bg-gradient-hero font-body text-sm font-semibold text-primary-foreground"
              >
                Get Started
              </Button>
              <RoleSelectionModal
                open={cta.roleModalOpen}
                onClose={() => cta.setRoleModalOpen(false)}
              />
            </>
          )}

          {cta.variant === "complete-setup" && (
            <Button
              onClick={() => { cta.resumeOnboarding(); onClose(); }}
              className="w-full bg-amber-400 hover:bg-amber-500 font-body text-sm font-semibold text-black"
            >
              Complete Setup
            </Button>
          )}

          {(cta.variant === "dashboard-single" || cta.variant === "dashboard-switcher") && (
            <>
              <Button
                onClick={() => { cta.gotoDashboard(); onClose(); }}
                className="w-full bg-gradient-hero font-body text-sm font-semibold text-primary-foreground"
              >
                Dashboard
              </Button>
              {cta.variant === "dashboard-switcher" && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { cta.setActiveRole("creator"); cta.gotoDashboard(); onClose(); }}
                    className={`flex-1 font-body text-xs ${cta.activeRole === "creator" ? "border-primary text-foreground" : ""}`}
                  >
                    Creator
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { cta.setActiveRole("investor"); cta.gotoDashboard(); onClose(); }}
                    className={`flex-1 font-body text-xs ${cta.activeRole === "investor" ? "border-primary text-foreground" : ""}`}
                  >
                    Investor
                  </Button>
                </div>
              )}
              <Button
                variant="ghost"
                onClick={() => { cta.handleDisconnect(); onClose(); }}
                className="w-full font-body text-sm text-destructive hover:text-destructive"
              >
                Disconnect
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Navbar;
