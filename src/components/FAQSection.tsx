import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
    {
        category: "Creators",
        color: "text-creo-pink",
        dot: "bg-creo-pink",
        questions: [
            {
                q: "What income sources can I connect to Kreo?",
                a: "Phase 1 supports Stripe, Gumroad, and Google AdSense — connect any combination. Your raise ceiling is sized to your total verified earnings across all connected sources. The more sources you connect, the more accurate your raise ceiling. Phase 2 will add Teachable, Substack, and Patreon.",
            },
            {
                q: "How is my maximum raise amount calculated?",
                a: "Kreo uses a variance-discounted floor model. We pull 6 months of verified earnings, compute your Coefficient of Variation (CV), and apply a discount: Low variance (CV < 15%) → 85% of your average. Medium (15–30%) → 75%. High (>30%) → 60%. Your max raise is then sized so investors are guaranteed at least 122% return even at your floor performance every single month. Consistent creators get larger raises — automatically.",
            },
            {
                q: "When do I actually receive the capital?",
                a: "72 hours after your fundraise closes. Once your offering fully closes, a 3-day fraud detection window opens — the same window banks use for ACH settlement. After 72 hours, the full capital (minus the 3% platform fee) is transferred to your wallet automatically. No milestones, no drip release — working capital when you need it.",
            },
            {
                q: "What happens if my earnings drop one month?",
                a: "Normal variance is expected and never penalised. Only 3 consecutive months of >40% drops below your baseline trigger a bond evaluation. A single bad month, a seasonal dip, or even an oracle/API failure never counts against you. Oracle failures are explicitly excluded from the drop counter — you are never punished for a technical issue outside your control.",
            },
            {
                q: "What is the Commitment Bond and do I get it back?",
                a: "The bond is a deposit (10% for first-time creators, lower for returning creators based on your KreoScore tier) that shows investors you are serious. On successful completion of your offering, you receive your bond back plus a 2% bonus. The bond is only slashed if you abandon an active offering — at which point the Protocol Default Lock also activates, blocking future raises until investors are made whole.",
            },
            {
                q: "Can I run more than one offering at a time?",
                a: "No — one active offering per creator at any time. This is a deliberate design choice: it aligns your incentives with your current investors and keeps your earnings focus on one commitment. Once your active offering completes, you can launch a new one immediately — with a higher trust cap (80% of your model max on offering #2, 100% from offering #3 onward).",
            },
        ],
    },
    {
        category: "Investors",
        color: "text-creo-teal",
        dot: "bg-creo-teal",
        questions: [
            {
                q: "What am I actually investing in?",
                a: "You are purchasing Revenue Share Tokens (RSTs) — ERC-20 tokens that represent a percentage of a creator's future verified earnings over a fixed period. Each month, the creator's earnings are verified by Chainlink oracles, and your proportional share is automatically settled on-chain. You claim USDC anytime, or enable auto-claim. This is not a loan, not equity, and not a speculative token — it is a direct share of real, oracle-verified creator revenue.",
            },
            {
                q: "What is the worst-case yield I can expect?",
                a: "Every offering on Kreo is required to pass a coverage ratio check before it can go live: the creator's variance-discounted floor earnings must cover at least 122% of the raise target over the offering period. This means even if the creator performs at their absolute worst-case floor every single month, investors still receive positive yield. The floor yield is shown on every offering card alongside the average-case yield.",
            },
            {
                q: "What protects me if a creator abandons their offering?",
                a: "Four layers: (1) The Commitment Bond is slashed pro-rata to all RST holders immediately on abandonment. (2) The Protocol Default Lock blocks the creator from ever raising again until investor shortfall is fully recovered — removing the rational incentive to abandon. (3) Graduated trust caps mean first-time creators can only raise 50% of their model maximum, limiting the maximum possible loss on any single first offering. (4) Phase 2 activates an Insurance Pool funded by 10% of all platform fees accumulating from day one.",
            },
            {
                q: "Can I exit my position before the offering ends?",
                a: "Yes. Revenue Share Tokens are standard transferable ERC-20 tokens — you can transfer or sell them peer-to-peer at any time. Phase 1 has no protocol-level AMM, so liquidity depends on finding a buyer directly. Phase 2 will introduce a Uniswap V3 RST/USDC pool seeded by the treasury for exit liquidity. Creator Tokens received at purchase persist in your wallet and retain their utility regardless of whether you hold the RSTs.",
            },
            {
                q: "What are Creator Tokens and why do I receive them?",
                a: "Creator Tokens (ERC-1155) are loyalty primitives auto-minted to your wallet in the same transaction as your RST purchase — zero extra cost. Phase 1 utilities: access to the creator's private community (Telegram/Discord), 48-hour early investor whitelist priority on the creator's next offering, and an on-chain early-backer credential visible on your portfolio. Phase 2 activates AMM price discovery, staking for exclusive content, and revenue multipliers for long-term holders.",
            },
            {
                q: "How does Kreo verify that creator earnings are real?",
                a: "Three layers of verification run before any capital is released. First, Stripe payout verification checks actual bank payouts — not just gross earnings — to eliminate circular fake invoice fraud. Second, a Social Proof Score (minimum 40/100) is anchored on-chain using your YouTube, Twitter, GitHub, and Stripe consistency data. Third, a 3-day capital release window after every fundraise close runs automated re-checks and gives admins a freeze gate if any anomaly is detected. Sumsub KYC with live video verification is mandatory for raises above $5,000.",
            },
        ],
    },
];

// ─── Single FAQ row — open editorial divider style ──────────────────────────
const FAQItem = ({
    q,
    a,
    isOpen,
    onToggle,
    accentColor,
}: {
    q: string;
    a: string;
    isOpen: boolean;
    onToggle: () => void;
    accentColor: string;
}) => (
    <div className="border-b border-border">
        <button
            onClick={onToggle}
            className="w-full flex items-start justify-between gap-6 py-6 text-left group"
        >
            <span
                className={`font-display text-base font-semibold leading-snug transition-colors duration-200 ${
                    isOpen ? accentColor : "text-foreground"
                }`}
            >
                {q}
            </span>
            <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={`mt-0.5 flex-shrink-0 transition-colors duration-200 ${
                    isOpen ? accentColor : "text-muted-foreground"
                }`}
            >
                <Plus className="h-4 w-4" />
            </motion.span>
        </button>

        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                >
                    <p className="pb-6 font-body text-sm leading-relaxed text-muted-foreground">
                        {a}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

// ─── Main Section ────────────────────────────────────────────────────────────
const FAQSection = () => {
    const [activeTab, setActiveTab] = useState<"Creators" | "Investors">("Creators");
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const activeGroup = faqs.find((f) => f.category === activeTab)!;

    return (
        <section className="border-t border-border">

            {/* ── Section header ── */}
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="container mx-auto px-4 pt-20 md:pt-28 pb-16 md:pb-20 max-w-4xl text-center"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-creo-yellow/30 bg-creo-yellow/[0.08] text-creo-yellow text-xs font-semibold tracking-widest uppercase mb-6">
                    Got Questions?
                </div>
                <h2
                    className="font-display font-bold leading-[0.95] tracking-tight"
                    style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
                >
                    FAQ
                    <span
                        className="text-transparent bg-clip-text"
                        style={{ backgroundImage: "var(--gradient-teal-pink)" }}
                    >
                        s.
                    </span>
                </h2>
                <p className="font-body text-muted-foreground text-lg mt-6 max-w-xl mx-auto">
                    Everything you need to know before your first offering or investment.
                </p>
            </motion.div>

            {/* ── Tab switcher — underline indicator ── */}
            <div className="border-t border-b border-border py-6">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-3">
                        {faqs.map((group) => (
                            <button
                                key={group.category}
                                onClick={() => {
                                    setActiveTab(group.category as "Creators" | "Investors");
                                    setOpenIndex(0);
                                }}
                                className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-lg border font-display text-sm font-semibold transition-all duration-200 ${
                                    activeTab === group.category
                                        ? `${group.color} border-current bg-muted/60`
                                        : "text-muted-foreground border-border hover:text-foreground hover:bg-muted/60"
                                }`}
                            >
                                <span className={`h-2 w-2 rounded-full ${group.dot}`} />
                                For {group.category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── FAQ list ── */}
            <div className="container mx-auto px-4 pt-2 pb-20 md:pb-28">
                <div className="mx-auto max-w-3xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeGroup.questions.map((item, i) => (
                                <FAQItem
                                    key={i}
                                    q={item.q}
                                    a={item.a}
                                    isOpen={openIndex === i}
                                    onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                                    accentColor={activeGroup.color}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 text-center">
                    <p className="font-body text-sm text-muted-foreground">
                        Still have questions?{" "}
                        <a
                            href="mailto:hello@kreofi.xyz"
                            className="text-creo-pink hover:underline font-medium"
                        >
                            Talk to the team →
                        </a>
                    </p>
                </div>
            </div>

        </section>
    );
};

export default FAQSection;
