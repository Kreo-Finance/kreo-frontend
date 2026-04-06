import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Shield,
  Coins,
  Zap,
  Users,
  ArrowRight,
  ChevronDown,
  Search,
  MessageCircle,
  FileText,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";

// ─── Scroll-triggered fade-in ─────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Help categories ──────────────────────────────────────────────────────────
const categories = [
  {
    icon: BookOpen,
    title: "Getting Started",
    desc: "New to Kreo? Learn the basics — wallets, onboarding, and how the protocol works.",
    color: "creo-teal",
    articles: 8,
  },
  {
    icon: Coins,
    title: "For Creators",
    desc: "How to launch an offering, deposit a bond, and manage your monthly settlements.",
    color: "creo-pink",
    articles: 12,
  },
  {
    icon: TrendingUp,
    title: "For Investors",
    desc: "Browsing offerings, backing creators, and understanding your USDC distributions.",
    color: "creo-yellow",
    articles: 10,
  },
  {
    icon: Shield,
    title: "Commitment Bond",
    desc: "How bonds work, what happens on default, and how KreoScore affects your rate.",
    color: "creo-teal",
    articles: 6,
  },
  {
    icon: Zap,
    title: "Settlements & Payouts",
    desc: "How monthly settlements are calculated, when payouts arrive, and what the 3% fee covers.",
    color: "creo-pink",
    articles: 7,
  },
  {
    icon: FileText,
    title: "Platform & Legal",
    desc: "Terms of service, privacy policy, on-chain audit reports, and compliance FAQs.",
    color: "creo-yellow",
    articles: 5,
  },
];

const colorMap: Record<
  string,
  { bg: string; text: string; border: string; accent: string }
> = {
  "creo-pink": {
    bg: "bg-creo-pink/10",
    text: "text-creo-pink",
    border: "border-creo-pink/20",
    accent: "bg-creo-pink",
  },
  "creo-teal": {
    bg: "bg-creo-teal/10",
    text: "text-creo-teal",
    border: "border-creo-teal/20",
    accent: "bg-creo-teal",
  },
  "creo-yellow": {
    bg: "bg-creo-yellow/10",
    text: "text-creo-yellow",
    border: "border-creo-yellow/20",
    accent: "bg-creo-yellow",
  },
};

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "What is Kreo Finance?",
    a: "Kreo is an on-chain protocol that lets content creators tokenize their future revenue streams and raise capital from investors. Creators get capital upfront; investors receive monthly USDC distributions from the creator's earnings.",
  },
  {
    q: "How does the 3% protocol fee work?",
    a: "A single 3% fee is deducted from each monthly settlement — the amount the creator contributes to the pool. There are no subscription fees, no upfront charges, and no additional cut taken from investors. Both sides share the same transparent fee.",
  },
  {
    q: "What is a Commitment Bond?",
    a: "Before launching an offering, creators deposit a refundable bond (4%–10% of the raise, depending on KreoScore). It signals intent and protects investors. On successful completion the full bond is returned plus a 2% bonus. On default, it's distributed to investors.",
  },
  {
    q: "When do investors receive their distributions?",
    a: "Monthly USDC distributions are paid automatically on-chain after each settlement cycle. No manual claiming, no gas costs on your side, and no additional platform cut beyond the 3% already priced in.",
  },
  {
    q: "What happens if a creator misses a settlement?",
    a: "Oracle or API failures are excluded and never counted against a creator. A genuine missed settlement triggers a KreoScore penalty. Repeated defaults activate the bond distribution mechanism, sending the locked bond to investors.",
  },
  {
    q: "How is KreoScore calculated?",
    a: "KreoScore accumulates over successful offerings. It starts at 0 for newcomers and increases with each completed offering. A higher score unlocks lower bond rates, higher raise ceilings, and better protocol terms.",
  },
  {
    q: "Is my data and wallet secure?",
    a: "Kreo never takes custody of your funds. All settlements and distributions happen via audited smart contracts on-chain. You can verify every transaction independently through a block explorer.",
  },
  {
    q: "How do I connect my wallet?",
    a: 'Click "Connect Wallet" in the top navigation. Kreo supports any EVM-compatible wallet (MetaMask, Coinbase Wallet, WalletConnect, etc.). Make sure you\'re on the correct network before signing any transaction.',
  },
];

// ─── Accordion item ───────────────────────────────────────────────────────────
function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="font-display text-base font-semibold text-foreground pr-4">
          {q}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: "hidden" }}
      >
        <p className="font-body text-sm text-muted-foreground leading-relaxed px-6 pb-5">
          {a}
        </p>
      </motion.div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const HelpCenter = () => {
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Grid mesh */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--creo-teal)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--creo-teal)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow orb */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-gradient-to-r from-[hsl(var(--creo-teal))] to-[hsl(var(--creo-pink))] opacity-[0.12] blur-[100px] pointer-events-none" />

        <div className="relative container mx-auto px-4 pt-24 pb-20 md:pt-36 md:pb-28 text-center max-w-4xl">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[hsl(var(--creo-teal))/30] bg-[hsl(var(--creo-teal))/8] text-[hsl(var(--creo-teal))] text-xs font-semibold tracking-widest uppercase mb-6">
              Help Center
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>
            <h1
              className="font-display font-bold leading-[0.95] tracking-tight mb-6"
              style={{ fontSize: "clamp(3rem, 10vw, 7rem)" }}
            >
              How can we{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "var(--gradient-teal-pink)" }}
              >
                help you?
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers about how Kreo works, from launching your first
              offering to understanding your distributions.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── 2. CATEGORIES ────────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-card/30">
        <div className="container mx-auto px-4 py-20 md:py-28 max-w-6xl">
          <FadeIn className="text-center mb-14">
            <p className="font-body text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
              Browse topics
            </p>
            <h2
              className="font-display font-bold leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Everything you need to know
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, i) => {
              const colors = colorMap[cat.color];
              return (
                <FadeIn key={cat.title} delay={i * 0.07}>
                  <div
                    className={`group rounded-2xl border ${colors.border} bg-card hover:${colors.bg} transition-colors duration-300 p-7 flex flex-col gap-4 h-full cursor-pointer`}
                  >
                    {/* Top accent line */}
                    <div
                      className={`h-[2px] w-10 ${colors.accent} rounded-full opacity-70`}
                    />
                    <div
                      className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}
                    >
                      <cat.icon className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-bold text-foreground mb-2">
                        {cat.title}
                      </h3>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border/60">
                      <span className="font-body text-xs text-muted-foreground">
                        {cat.articles} articles
                      </span>
                      <span
                        className={`font-body text-xs font-semibold ${colors.text} flex items-center gap-1 group-hover:gap-2 transition-all`}
                      >
                        Browse <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. FAQ ────────────────────────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-20 md:py-28 max-w-3xl">
          <FadeIn className="text-center mb-10">
            <p className="font-body text-xs font-semibold tracking-widest uppercase text-creo-pink mb-3">
              Common questions
            </p>
            <h2
              className="font-display font-bold leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Frequently asked
            </h2>
          </FadeIn>

          {/* Search bar */}
          <FadeIn className="mb-8">
            <div className="flex items-center rounded-xl border border-border bg-card px-5 py-4 gap-3 focus-within:border-creo-pink/40 transition-colors shadow-sm">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search frequently asked questions…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </FadeIn>

          {filteredFaqs.length > 0 ? (
            <div className="space-y-3">
              {filteredFaqs.map((faq, i) => (
                <FadeIn key={i} delay={i * 0.04}>
                  <AccordionItem q={faq.q} a={faq.a} />
                </FadeIn>
              ))}
            </div>
          ) : (
            <FadeIn className="text-center py-16">
              <p className="font-body text-muted-foreground text-lg">
                No results for "{search}"
              </p>
              <p className="font-body text-xs text-muted-foreground mt-2">
                Try a different keyword or browse the categories above.
              </p>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ── 4. QUICK LINKS ────────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-card/30">
        <div className="container mx-auto px-4 py-20 md:py-24 max-w-5xl">
          <FadeIn className="text-center mb-12">
            <h2
              className="font-display font-bold leading-tight"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
            >
              Useful resources
            </h2>
          </FadeIn>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: FileText,
                title: "Terms of Service",
                desc: "Read the full protocol terms governing creators, investors, and settlements.",
                href: "/terms-of-service",
                color: "creo-teal",
              },
              {
                icon: Shield,
                title: "Privacy Policy",
                desc: "Understand what data we collect, how it's used, and your rights.",
                href: "/privacy-policy",
                color: "creo-pink",
              },
              {
                icon: BookOpen,
                title: "Documentation",
                desc: "Deep-dive into the smart contracts, oracle integrations, and KreoScore model.",
                href: "/documentation",
                color: "creo-yellow",
              },
            ].map((item, i) => {
              const colors = colorMap[item.color];
              return (
                <FadeIn key={item.title} delay={i * 0.08}>
                  <Link
                    to={item.href}
                    className={`group block rounded-2xl border ${colors.border} bg-card hover:${colors.bg} transition-colors duration-300 p-6 h-full`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center mb-4`}
                    >
                      <item.icon className={`h-4 w-4 ${colors.text}`} />
                    </div>
                    <h3 className="font-display text-base font-bold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                    <span
                      className={`font-body text-xs font-semibold ${colors.text} flex items-center gap-1 mt-4 group-hover:gap-2 transition-all`}
                    >
                      Read more <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. CTA ────────────────────────────────────────────────────────────── */}
      <section className="border-t border-border relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--creo-teal)/0.08) 0%, hsl(var(--creo-pink)/0.08) 100%)",
          }}
        />
        <div className="h-1 bg-gradient-teal-pink" />
        <div className="relative container mx-auto px-4 py-24 md:py-32 text-center max-w-3xl">
          <FadeIn>
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-creo-teal/10 border border-creo-teal/20 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-creo-teal" />
              </div>
            </div>
            <h2
              className="font-display font-bold leading-tight mb-4"
              style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
            >
              Still have questions?
            </h2>
          </FadeIn>
          <FadeIn delay={0.08}>
            <p className="font-body text-muted-foreground text-lg mb-10">
              Join our Discord community — the team and the community are there
              to help with anything not covered here.
            </p>
          </FadeIn>
          <FadeIn delay={0.14}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-creo-teal text-primary-foreground hover:opacity-90 font-semibold px-8 h-12"
              >
                <a
                  href="https://discord.gg/kreofinance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Join Discord
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-creo-pink/40 text-creo-pink hover:bg-creo-pink/10 hover:text-creo-pink font-semibold px-8 h-12"
              >
                <Link to="/pricing">
                  View Pricing <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default HelpCenter;
