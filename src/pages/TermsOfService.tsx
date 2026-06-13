import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { useState } from "react";

const sections = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "eligibility", label: "Eligibility" },
  { id: "no-advice", label: "No Investment Advice" },
  { id: "wallet", label: "Wallet Authentication" },
  { id: "creator", label: "Creator Terms" },
  { id: "investor", label: "Investor Terms" },
  { id: "fees", label: "Platform Fees" },
  { id: "kyc", label: "KYC, AML & Compliance" },
  { id: "smart-contract", label: "Smart Contract Risk" },
  { id: "prohibited", label: "Prohibited Conduct" },
  { id: "third-party", label: "Third-Party Services" },
  { id: "ip", label: "Intellectual Property" },
  { id: "disclaimers", label: "Disclaimers" },
  { id: "indemnification", label: "Indemnification" },
  { id: "governing", label: "Governing Law" },
  { id: "severability", label: "Severability" },
  { id: "contact", label: "Contact" },
];

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState("acceptance");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--creo-teal)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--creo-teal)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[hsl(var(--creo-teal))] opacity-10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[hsl(var(--creo-pink))] opacity-10 blur-[120px] pointer-events-none" />

        <div className="relative container mx-auto px-4 pt-20 pb-20 md:pt-28 md:pb-28 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[hsl(var(--creo-teal))/30] bg-[hsl(var(--creo-teal))/8] text-[hsl(var(--creo-teal))] text-xs font-semibold tracking-widest uppercase mb-6">
            Kreo Finance · Legal
          </div>
          <h1
            className="font-display font-bold leading-none tracking-tight mb-6"
            style={{
              fontSize: "clamp(2.6rem, 9vw, 6.5rem)",
              background: "linear-gradient(135deg, hsl(var(--creo-teal)), hsl(var(--creo-pink)))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Terms of
            <br />
            Service
          </h1>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span>
              <span className="text-foreground font-semibold">Entity:</span> Kreo Finance Pte. Ltd.
            </span>
            <span className="text-border">|</span>
            <span>
              <span className="text-foreground font-semibold">Last Updated:</span> April 4, 2026
            </span>
            <span className="text-border">|</span>
            <span>
              <span className="text-foreground font-semibold">Jurisdiction:</span> Singapore
            </span>
          </div>
        </div>
      </section>

      {/* ── Warning banner ───────────────────────────────────────────────── */}
      <div className="border-b border-border bg-[hsl(var(--creo-teal))/6]">
        <div className="container mx-auto px-4 py-5 max-w-5xl">
          <p className="text-sm font-semibold text-[hsl(var(--creo-teal))]">
            BY CONNECTING YOUR WALLET OR USING THE PLATFORM IN ANY WAY, YOU AGREE TO BE LEGALLY BOUND BY THESE TERMS. IF YOU DO NOT AGREE, DO NOT USE THE PLATFORM.
          </p>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-16">

          {/* sticky sidebar */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3">Sections</p>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setActiveSection(s.id)}
                  className={`block text-sm py-1.5 px-3 rounded-md transition-colors ${
                    activeSection === s.id
                      ? "bg-[hsl(var(--creo-teal))/12] text-[hsl(var(--creo-teal))] font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* main content */}
          <article className="space-y-20 min-w-0">

            <TermSection id="acceptance" roman="I" title="Acceptance of Terms">
              <Body>
                Welcome to Kreo Finance, a decentralized finance protocol accessible at kreofi.xyz (the "Site") and associated interfaces (together, the "Platform"), operated by Kreo Finance Pte. Ltd., a company incorporated in Singapore.
              </Body>
              <Body>
                Kreo Finance enables creators to tokenize future verified earnings and receive upfront USDC capital, while accredited and high-net-worth investors purchase Revenue Share Tokens (RSTs) and earn monthly yield backed by verifiable creator revenue.
              </Body>
              <Body>
                We may update these Terms at any time. Your continued use of the Platform after any update constitutes acceptance. We will notify active users of material changes via the Platform or email where required.
              </Body>
            </TermSection>

            <TermSection id="eligibility" roman="II" title="Eligibility">
              <Body>To use the Platform, you must:</Body>
              <BulletList items={[
                "Be at least 18 years of age",
                "Have the legal capacity to enter binding contracts in your jurisdiction",
                "Not be located in or a resident of any jurisdiction where use is prohibited by law",
                "Not be subject to any sanctions, watchlists, or government-imposed financial restrictions",
                "If an Investor: meet the accredited investor or HNI threshold applicable in your jurisdiction",
              ]} />
              <InfoBox title="Phase 1 Restricted Jurisdictions">
                <p className="text-sm text-muted-foreground">
                  US retail and Indian retail investors are not eligible to invest in Phase 1. US accredited investors (Reg D Rule 506(b)) and Indian HNI investors (net worth ≥ ₹5 crore) are eligible subject to accreditation verification. Creators may onboard from any jurisdiction globally.
                </p>
              </InfoBox>
            </TermSection>

            <TermSection id="no-advice" roman="III" title="No Investment Advice">
              <Body>
                Kreo Finance is not a broker-dealer, investment adviser, financial institution, or securities exchange. We do not provide investment advice, make investment recommendations, or endorse any creator offering on the Platform.
              </Body>
              <Body>
                Revenue Share Tokens (RSTs) may constitute securities in certain jurisdictions. By participating as an investor, you represent that you have independently assessed the legal status of RSTs in your jurisdiction and that your participation is lawful.
              </Body>
              <Body>
                Past performance of any creator or offering does not guarantee future results. Creator earnings are not guaranteed. All investments carry risk, including the risk of total loss of invested capital.
              </Body>
            </TermSection>

            <TermSection id="wallet" roman="IV" title="Wallet-Based Authentication">
              <Body>
                Kreo Finance uses wallet signatures as the sole method of authentication — no email passwords or traditional login credentials. Your blockchain wallet address is your identity on the Platform.
              </Body>
              <Body>You are solely responsible for:</Body>
              <BulletList items={[
                "The security of your private keys and seed phrases",
                "All actions taken from your wallet address on the Platform",
                "Any losses resulting from unauthorized access to your wallet",
              ]} />
              <Body>
                We will never ask you to share your private key or seed phrase. Kreo Finance cannot recover your account, reverse transactions, or restore access if you lose control of your wallet. All on-chain transactions are final and irreversible.
              </Body>
            </TermSection>

            <TermSection id="creator" roman="V" title="Creator Terms">
              <SubHeading>5.1 Eligibility to Create Offerings</SubHeading>
              <BulletList items={[
                "Complete identity verification (KYC) via Sumsub",
                "Connect at least one verified income source (Stripe, Gumroad, or Google AdSense/YouTube)",
                "Achieve a minimum Social Proof Score of 40 out of 100",
                "Deposit the required commitment bond as determined by your KreoScore tier",
                "Pass all seven on-chain checks enforced by the smart contracts at offering creation",
              ]} />

              <SubHeading>5.2 Your Representations as a Creator</SubHeading>
              <BulletList items={[
                "All income data you connect and all information you provide is truthful, accurate, and complete",
                "You are the legitimate owner of the income sources connected to your account",
                "You have not artificially inflated your earnings or manipulated your income history",
                "You understand this is a fixed-duration revenue share agreement — not a loan — and investors receive a % of your actual verified earnings for the full duration",
                "You will not take deliberate action to reduce your verifiable income during an active offering to harm investors",
              ]} />

              <SubHeading>5.3 Creator Obligations During Active Offering</SubHeading>
              <BulletList items={[
                "Maintain your income source OAuth connections for the duration of the offering",
                "Cooperate with monthly oracle verification by Chainlink Functions",
                "Not withdraw, revoke, or interfere with income source access tokens while an offering is active",
                "Notify Kreo Finance immediately if your income source accounts are suspended, terminated, or substantially changed",
              ]} />

              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--creo-teal))] mb-3">5.4 Commitment Bond</p>
                  <p className="text-sm text-muted-foreground">
                    All creators must deposit a commitment bond before their offering opens. The bond rate is determined by your KreoScore tier. Upon successful completion, your bond is returned with a <strong className="text-foreground">2% bonus</strong>. If you abandon an offering (Protocol Default), your bond is slashed and distributed pro-rata to RST holders, and your wallet is permanently flagged until investors are made whole.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--creo-pink))] mb-3">5.5 Capital Release</p>
                  <p className="text-sm text-muted-foreground">
                    Capital is released to creators <strong className="text-foreground">72 hours</strong> after an offering closes (PENDING_RELEASE period). During this window, Kreo Finance conducts fraud detection re-checks and may freeze capital release if fraud indicators are detected. A <strong className="text-foreground">3% platform fee</strong> is deducted from the raise at the time of capital release.
                  </p>
                </div>
              </div>
            </TermSection>

            <TermSection id="investor" roman="VI" title="Investor Terms">
              <SubHeading>6.1 Eligibility to Invest</SubHeading>
              <BulletList items={[
                "Complete identity verification (KYC) via Sumsub",
                "Complete accreditation verification applicable to your jurisdiction",
                "Not be a resident of a restricted jurisdiction",
              ]} />

              <SubHeading>6.2 Nature of RSTs</SubHeading>
              <Body>Revenue Share Tokens (RSTs) are ERC-20 tokens on the Base blockchain representing a proportional right to receive monthly USDC distributions from a creator's verified earnings. RSTs are:</Body>
              <BulletList items={[
                "Not equity in the creator or any company",
                "Not a debt obligation with a fixed repayment amount",
                "Not guaranteed to generate any return — distributions are proportional to actual verified creator earnings",
                "Illiquid in Phase 1 — no protocol-level secondary market or AMM; RSTs may only be transferred peer-to-peer",
              ]} />

              <SubHeading>6.3 Risk Acknowledgement</SubHeading>
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 mt-2">
                <BulletList items={[
                  "Creator income may decline, resulting in lower distributions than projected",
                  "A creator may default, resulting in bond slashing but potentially incomplete recovery",
                  "Smart contracts have not been independently audited at Phase 1 launch",
                  "There is no guaranteed exit liquidity for RSTs in Phase 1",
                  "Past verified earnings do not guarantee future earnings",
                  "RSTs may constitute securities in your jurisdiction — you are responsible for your own legal compliance",
                ]} />
              </div>

              <SubHeading>6.4 Investor Protection Mechanisms</SubHeading>
              <div className="grid sm:grid-cols-2 gap-3 mt-2">
                {[
                  "Variance-discounted floor model with minimum 122% coverage ratio",
                  "Commitment bond slashed to RST holders on creator default",
                  "Protocol Default Lock preventing serial abandonment",
                  "3-day capital release window with fraud detection",
                ].map((item) => (
                  <div key={item} className="flex gap-3 p-3 rounded-lg border border-border bg-card text-sm">
                    <span className="text-[hsl(var(--creo-teal))] shrink-0">✓</span>
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <Body className="mt-3 text-xs">These mechanisms reduce but do not eliminate investment risk.</Body>

              <SubHeading>6.5 Settlement and Claims</SubHeading>
              <Body>
                Monthly distributions are settled by our backend oracle via Chainlink Functions and accumulated in the Settlement contract. Investors may claim distributions at any time using{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-[hsl(var(--creo-pink))]">claimEarnings()</code>{" "}
                or{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-[hsl(var(--creo-pink))]">claimAllEarnings()</code>, or enable auto-claim. A 3% platform fee is deducted from each monthly settlement before distribution.
              </Body>
            </TermSection>

            <TermSection id="fees" roman="VII" title="Platform Fees">
              <div className="overflow-x-auto rounded-xl border border-border mt-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Fee</th>
                      <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Who Pays</th>
                      <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium">Capital release fee</td>
                      <td className="py-3 px-4 text-[hsl(var(--creo-pink))] font-bold">3% of raise</td>
                      <td className="py-3 px-4 text-muted-foreground">Creator</td>
                      <td className="py-3 px-4 text-muted-foreground">At capital release</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Monthly settlement fee</td>
                      <td className="py-3 px-4 text-[hsl(var(--creo-pink))] font-bold">3% of verified earnings</td>
                      <td className="py-3 px-4 text-muted-foreground">Deducted from investor pool</td>
                      <td className="py-3 px-4 text-muted-foreground">Each monthly settlement</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Body className="mt-4">No other fees are charged in Phase 1. We reserve the right to introduce or modify fees in Phase 2 with notice to active users.</Body>
            </TermSection>

            <TermSection id="kyc" roman="VIII" title="KYC, AML & Compliance">
              <Body>
                Kreo Finance is required to comply with AML and KYC regulations applicable in Singapore and other relevant jurisdictions. You agree to:
              </Body>
              <BulletList items={[
                "Provide truthful, accurate, and complete identity and accreditation documentation",
                "Notify us immediately of any material change in your accreditation status or jurisdiction",
                "Not use the Platform to launder money, finance terrorism, evade sanctions, or engage in any unlawful financial activity",
              ]} />
              <Body>
                We reserve the right to suspend or terminate your account and freeze any associated funds if we reasonably suspect illegal activity, without notice and without liability.
              </Body>
            </TermSection>

            <TermSection id="smart-contract" roman="IX" title="Smart Contract Risk & Blockchain Disclaimers">
              <Body>The Kreo Finance protocol operates on the Base blockchain through open-source smart contracts. By using the Platform, you acknowledge:</Body>
              <BulletList items={[
                "Smart contracts may contain bugs or vulnerabilities despite reasonable security practices",
                "Transactions on the blockchain are irreversible — we cannot reverse, cancel, or recover any on-chain transaction",
                "Base blockchain network congestion or downtime may affect settlement timing",
                "Private key loss results in permanent loss of access to your wallet and any RSTs or USDC held therein",
                "Phase 1 smart contracts have not been independently audited — an audit is planned for Phase 2",
              ]} />
            </TermSection>

            <TermSection id="prohibited" roman="X" title="Prohibited Conduct">
              <Body>You agree not to:</Body>
              <BulletList items={[
                "Provide false, misleading, or fraudulent income data or identity documentation",
                "Artificially inflate or manipulate income source data connected to your account",
                "Use the Platform for any purpose that violates applicable law, including securities laws, AML regulations, or sanctions regimes",
                "Attempt to circumvent our fraud detection systems, KYC verification, or accreditation checks",
                "Reverse engineer or attempt to extract source code of our smart contracts or backend beyond what is publicly open-source",
                "Impersonate any person or entity on the Platform",
                "Use automated bots, scrapers, or scripts to access the Platform without our written consent",
                "Interfere with, disrupt, or attack the Platform, our smart contracts, or our backend infrastructure",
                "Contact other users off-platform to solicit investment outside of Kreo Finance",
                "Use the Platform to stalk, harass, defame, or harm any other user",
              ]} />
              <Body className="mt-4 border-l-2 border-destructive/50 pl-4 text-muted-foreground">
                We reserve the right to terminate your account immediately and without notice for any violation of this section.
              </Body>
            </TermSection>

            <TermSection id="third-party" roman="XI" title="Third-Party Services">
              <Body>
                Kreo Finance integrates with third-party services including Sumsub (KYC), Chainlink (oracle), Stripe, Gumroad, and Google (income verification). These services have their own terms of service and privacy policies. Kreo Finance is not responsible for the actions, data practices, or availability of any third-party service.
              </Body>
            </TermSection>

            <TermSection id="ip" roman="XII" title="Intellectual Property">
              <Body>
                The Kreo Finance name, logo, brand assets, website design, and non-open-source software are the intellectual property of Kreo Finance Pte. Ltd. You may not reproduce, distribute, or create derivative works from our intellectual property without prior written consent.
              </Body>
              <Body>
                The smart contracts of the Kreo Finance protocol are open-source under the MIT License. You are free to read, fork, and build upon the contracts in accordance with that license.
              </Body>
            </TermSection>

            <TermSection id="disclaimers" roman="XIII" title="Disclaimers & Limitation of Liability">
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div
                  className="h-1"
                  style={{ background: "linear-gradient(90deg, hsl(var(--creo-pink)), hsl(var(--creo-teal)))" }}
                />
                <div className="p-6 space-y-4">
                  <p className="text-sm font-bold uppercase tracking-wide">
                    THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. KREO FINANCE MAKES NO WARRANTIES REGARDING UPTIME, ACCURACY, FITNESS FOR A PARTICULAR PURPOSE, OR CONTINUED AVAILABILITY.
                  </p>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, KREO FINANCE SHALL NOT BE LIABLE FOR:
                  </p>
                  <BulletList items={[
                    "ANY LOST PROFITS, LOST DATA, OR LOSS OF INVESTMENT",
                    "ANY INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES",
                    "ANY LOSS ARISING FROM SMART CONTRACT BUGS, BLOCKCHAIN NETWORK FAILURES, OR ORACLE MALFUNCTIONS",
                    "ANY LOSS ARISING FROM YOUR FAILURE TO SECURE YOUR WALLET PRIVATE KEYS",
                    "ANY REGULATORY ACTION TAKEN AGAINST YOU AS A RESULT OF YOUR USE OF THE PLATFORM",
                  ]} />
                  <p className="text-sm font-bold border-t border-border pt-4">
                    IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE PLATFORM FEES YOU PAID TO KREO FINANCE IN THE THREE MONTHS PRECEDING THE CLAIM.
                  </p>
                </div>
              </div>
              <Body className="mt-4 text-xs">
                Nothing in these Terms limits liability that cannot be excluded under applicable law, including liability for fraud or gross negligence.
              </Body>
            </TermSection>

            <TermSection id="indemnification" roman="XIV" title="Indemnification">
              <Body>
                You agree to indemnify, defend, and hold harmless Kreo Finance Pte. Ltd. and its officers, directors, employees, and affiliates from any claims, losses, liabilities, damages, costs, and expenses (including reasonable legal fees) arising from:
              </Body>
              <BulletList items={[
                "Your use or misuse of the Platform",
                "Your violation of these Terms",
                "Your violation of any applicable law or regulation",
                "Any false or misleading information you provided to the Platform",
                "Any claim by a third party arising from your offering or investment activity",
              ]} />
            </TermSection>

            <TermSection id="governing" roman="XV" title="Governing Law & Dispute Resolution">
              <Body>
                These Terms are governed by the laws of Singapore, without regard to conflict of law provisions.
              </Body>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--creo-teal))] mb-2">Dispute Resolution</p>
                  <p className="text-sm text-muted-foreground">
                    Both parties agree to attempt good-faith resolution for at least 30 days before initiating formal proceedings. Disputes shall be submitted to arbitration in Singapore under SIAC rules before a single arbitrator. The arbitral award shall be final and binding.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--creo-pink))] mb-2">Class Action Waiver</p>
                  <p className="text-sm text-muted-foreground">
                    To the fullest extent permitted by applicable law, you agree that all disputes will be resolved individually and not as part of any class or collective action.
                  </p>
                </div>
              </div>
            </TermSection>

            <TermSection id="severability" roman="XVI" title="Severability & Entire Agreement">
              <Body>
                If any provision of these Terms is found invalid or unenforceable, that provision will be enforced to the maximum extent permissible and the remaining provisions will continue in full force.
              </Body>
              <Body>
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and Kreo Finance regarding use of the Platform.
              </Body>
            </TermSection>

            <TermSection id="contact" roman="XVII" title="Contact">
              <Body>For questions, legal notices, or to exercise your rights:</Body>
              <div className="mt-6 rounded-2xl border border-border bg-card overflow-hidden">
                <div
                  className="h-1.5"
                  style={{ background: "linear-gradient(90deg, hsl(var(--creo-teal)), hsl(var(--creo-pink)))" }}
                />
                <div className="p-6 space-y-2">
                  <p className="font-display font-bold text-lg">Kreo Finance Pte. Ltd.</p>
                  <div className="pt-2 space-y-1.5 text-sm">
                    <p>
                      <span className="text-muted-foreground">Email: </span>
                      <a href="mailto:hello@kreofi.xyz" className="text-[hsl(var(--creo-teal))] hover:underline">
                        hello@kreofi.xyz
                      </a>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Website: </span>
                      <a href="https://kreofi.xyz" className="text-[hsl(var(--creo-teal))] hover:underline" target="_blank" rel="noopener noreferrer">
                        kreofi.xyz
                      </a>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Legal notices: </span>
                      <a href="mailto:legal@kreofi.xyz" className="text-[hsl(var(--creo-teal))] hover:underline">
                        legal@kreofi.xyz
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </TermSection>

          </article>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

/* ── Shared sub-components ───────────────────────────────────────────────── */

function TermSection({
  id, roman, title, children,
}: {
  id: string; roman: string; title: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-baseline gap-4 mb-6">
        <span
          className="font-display font-bold text-4xl leading-none select-none"
          style={{
            background: "linear-gradient(135deg, hsl(var(--creo-teal)), hsl(var(--creo-pink)))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {roman}
        </span>
        <h2 className="text-2xl font-display font-bold">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-foreground mt-6 mb-2">{children}</h3>;
}

function Body({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm text-muted-foreground leading-relaxed ${className ?? ""}`}>{children}</p>;
}

function BulletList({ items }: { items: (React.ReactNode)[] }) {
  return (
    <ul className="space-y-2 mt-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm text-muted-foreground">
          <span className="text-[hsl(var(--creo-teal))] mt-0.5 shrink-0">›</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[hsl(var(--creo-teal))/20] bg-[hsl(var(--creo-teal))/5] p-5 mt-4">
      <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--creo-teal))] mb-3">{title}</p>
      {children}
    </div>
  );
}

export default TermsOfService;
