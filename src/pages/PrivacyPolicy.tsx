import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { useState } from "react";

const sections = [
  { id: "collect", label: "Information We Collect" },
  { id: "use", label: "How We Use It" },
  { id: "google", label: "Google API & YouTube" },
  { id: "sharing", label: "Sharing" },
  { id: "blockchain", label: "Blockchain Data" },
  { id: "kyc", label: "KYC & Accreditation" },
  { id: "retention", label: "Data Retention" },
  { id: "rights", label: "Your Rights" },
  { id: "security", label: "Data Security" },
  { id: "minors", label: "Minors" },
  { id: "cookies", label: "Cookies" },
  { id: "changes", label: "Changes" },
  { id: "contact", label: "Contact" },
];

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("collect");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* grid mesh */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--creo-pink)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--creo-pink)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* glow orbs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[hsl(var(--creo-pink))] opacity-10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-[hsl(var(--creo-teal))] opacity-10 blur-[120px] pointer-events-none" />

        <div className="relative container mx-auto px-4 pt-20 pb-20 md:pt-28 md:pb-28 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[hsl(var(--creo-pink))/30] bg-[hsl(var(--creo-pink))/8] text-[hsl(var(--creo-pink))] text-xs font-semibold tracking-widest uppercase mb-6">
            Kreo Finance · Legal
          </div>
          <h1
            className="font-display font-bold leading-none tracking-tight mb-6"
            style={{
              fontSize: "clamp(3rem, 10vw, 7rem)",
              background:
                "linear-gradient(135deg, hsl(var(--creo-pink)), hsl(var(--creo-teal)))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Privacy
            <br />
            Policy
          </h1>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span>
              <span className="text-foreground font-semibold">
                Effective Date:
              </span>{" "}
              July 2, 2026
            </span>
            <span className="text-border">|</span>
            <span>
              <span className="text-foreground font-semibold">
                Last Updated:
              </span>{" "}
              April 4, 2026
            </span>
            <span className="text-border">|</span>
            <span>
              <span className="text-foreground font-semibold">Entity:</span>{" "}
              Kreo Finance Pte. Ltd., Singapore
            </span>
          </div>
        </div>
      </section>

      {/* ── Core commitments banner ──────────────────────────────────────── */}
      <div className="border-b border-border bg-[hsl(var(--creo-pink))/6]">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">
            <Pill color="pink">We DO NOT sell your personal data</Pill>
            <Pill color="teal">
              We DO NOT share data beyond verified vendors
            </Pill>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-16">
          {/* sticky sidebar */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3">
                Sections
              </p>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setActiveSection(s.id)}
                  className={`block text-sm py-1.5 px-3 rounded-md transition-colors ${
                    activeSection === s.id
                      ? "bg-[hsl(var(--creo-pink))/12] text-[hsl(var(--creo-pink))] font-semibold"
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
            <PolicySection id="collect" num="01" title="Information We Collect">
              <SubHeading>1a. Device Information</SubHeading>
              <Body>
                When you visit the Site, we automatically collect certain
                information about your device, including your web browser type,
                IP address, time zone, and cookies. As you browse, we collect
                information about the pages you view, what referred you, and how
                you interact with the Site ("Device Information").
              </Body>
              <Body className="font-semibold">
                We collect Device Information using:
              </Body>
              <BulletList
                items={[
                  <>
                    <Accent>Cookies</Accent> — data files placed on your device
                    that often include an anonymous unique identifier
                  </>,
                  <>
                    <Accent>Log files</Accent> — track actions on the Site and
                    collect your IP address, browser type, ISP, referring/exit
                    pages, and timestamps
                  </>,
                  <>
                    <Accent>Web beacons, tags, and pixels</Accent> — electronic
                    files used to record how you browse the Site
                  </>,
                ]}
              />

              <SubHeading>1b. Account and Identity Information</SubHeading>
              <Body>
                When you connect your wallet and create an account on Kreo
                Finance, we collect:
              </Body>
              <BulletList
                items={[
                  "Your blockchain wallet address (your primary identity on our platform)",
                  "Your ENS name, if resolvable",
                  "KYC data via Sumsub — government-issued ID, liveness verification, and address proof",
                  "For investors: accreditation verification documents based on your jurisdiction",
                  "Your email address, if voluntarily provided for notifications",
                ]}
              />

              <SubHeading>1c. Creator Income Source Data</SubHeading>
              <Body>
                If you are a creator and connect your income sources, we
                collect:
              </Body>

              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                {[
                  {
                    name: "Stripe",
                    items: [
                      "Monthly payout history & verified earnings",
                      "Payout bank confirmation status",
                      "Stripe account ID",
                    ],
                  },
                  {
                    name: "Gumroad",
                    items: [
                      "Monthly sales history & gross revenue",
                      "Payout records confirming bank receipt",
                      "Gumroad user ID and email",
                    ],
                  },
                  {
                    name: "Google / YouTube",
                    items: [
                      "YouTube channel ID & display name",
                      "Channel thumbnail image",
                      "Monthly estimated AdSense revenue",
                    ],
                  },
                ].map((src) => (
                  <div
                    key={src.name}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <p className="text-xs font-bold tracking-widest uppercase text-[hsl(var(--creo-pink))] mb-3">
                      {src.name}
                    </p>
                    <ul className="space-y-1.5">
                      {src.items.map((item) => (
                        <li
                          key={item}
                          className="text-sm text-muted-foreground flex gap-2"
                        >
                          <span className="text-[hsl(var(--creo-teal))] mt-0.5 shrink-0">
                            ›
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <SubHeading>1d. Offering and Transaction Data</SubHeading>
              <BulletList
                items={[
                  "Offering parameters (revenue share %, duration, raise target)",
                  "Transaction hashes for all on-chain actions",
                  "Monthly settlement amounts and timestamps",
                  "KreoScore tier and history",
                  "Bond deposit and release records",
                ]}
              />
            </PolicySection>

            <PolicySection
              id="use"
              num="02"
              title="How We Use Your Information"
            >
              <Body>We use the information we collect to:</Body>
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {[
                  {
                    label: "Identity Verification",
                    desc: "KYC via Sumsub and OAuth income connections to protect investors",
                  },
                  {
                    label: "Raise Capacity Calculation",
                    desc: "Verified income history feeds our on-chain variance model",
                  },
                  {
                    label: "Monthly Settlements",
                    desc: "Earnings figures passed to Chainlink oracle for on-chain distributions",
                  },
                  {
                    label: "Fraud Prevention",
                    desc: "Social proof score, KYC data, IP and behavioral signals during capital release",
                  },
                  {
                    label: "Communication",
                    desc: "Settlement completions, offering milestones, KreoScore changes, platform updates",
                  },
                  {
                    label: "Legal Compliance",
                    desc: "AML requirements, accredited investor verification, Singapore MAS regulations",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-border bg-card p-4 flex gap-3"
                  >
                    <div className="w-1.5 rounded-full bg-gradient-to-b from-[hsl(var(--creo-pink))] to-[hsl(var(--creo-teal))] shrink-0" />
                    <div>
                      <p className="text-sm font-semibold mb-1">{item.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </PolicySection>

            <PolicySection
              id="google"
              num="03"
              title="Google API Access & YouTube Data"
            >
              <Body>
                Kreo Finance requires YouTube creators to grant read-only access
                to their YouTube channel and AdSense revenue data via Google
                OAuth 2.0 for income verification. This access adheres strictly
                to Google's API Services User Data Policy.
              </Body>

              <InfoBox title="Data We Access">
                <BulletList
                  items={[
                    <>
                      <Accent>YouTube channel ID and display name</Accent> —
                      retrieved once at connection to identify your channel
                    </>,
                    <>
                      <Accent>Channel thumbnail</Accent> — displays your channel
                      identity within the platform
                    </>,
                    <>
                      <Accent>Monthly estimated AdSense revenue</Accent> —
                      retrieved monthly via YouTube Analytics API for settlement
                      verification
                    </>,
                  ]}
                />
              </InfoBox>

              <SubHeading>What We Do NOT Access</SubHeading>
              <Body>
                We do not access your Gmail, Google Drive, Google Search
                history, Google Contacts, YouTube comments, subscriber lists,
                video metadata, ad performance breakdowns, or any other Google
                services beyond those listed above.
              </Body>

              <SubHeading>Revoking Access</SubHeading>
              <Body>
                You may revoke Kreo Finance's access at any time via{" "}
                <span className="text-[hsl(var(--creo-pink))]">
                  myaccount.google.com/permissions
                </span>
                . You may also disconnect your YouTube account directly from
                your Creator Dashboard.
              </Body>

              <SubHeading>Google's Limited Use Policy</SubHeading>
              <Body>
                Our use of Google API data complies with the Google API Services
                User Data Policy, including Limited Use requirements. We do not
                use your Google data to serve advertisements, and we do not
                transfer it to any third party except as necessary to provide
                our service.
              </Body>
            </PolicySection>

            <PolicySection
              id="sharing"
              num="04"
              title="Sharing Your Information"
            >
              <Body>
                We share your information only in the following limited
                circumstances:
              </Body>
              <div className="space-y-3 mt-4">
                {[
                  {
                    name: "Sumsub",
                    desc: "Our KYC and accreditation verification provider. Processes your identity documents under a data processing agreement.",
                  },
                  {
                    name: "Chainlink",
                    desc: "Monthly verified earnings figures (not personal identity data) are passed to Chainlink Functions for on-chain oracle verification.",
                  },
                  {
                    name: "Infra Providers",
                    desc: "Cloud hosting, database, and security services that store or process data under confidentiality agreements.",
                  },
                  {
                    name: "Legal Compliance",
                    desc: "We may share information to comply with applicable laws, respond to lawful regulatory requests, or protect our legal rights.",
                  },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex gap-4 p-4 rounded-xl border border-border bg-card"
                  >
                    <span className="font-bold text-sm text-[hsl(var(--creo-pink))] whitespace-nowrap pt-0.5 min-w-[130px]">
                      {item.name}
                    </span>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
              <Body className="mt-6 text-sm border-l-2 border-[hsl(var(--creo-teal))] pl-4 text-muted-foreground">
                We will never sell, rent, or share your personal data or Google
                user data with third parties for advertising, marketing, or any
                purpose beyond those described in this policy.
              </Body>
            </PolicySection>

            <PolicySection id="blockchain" num="05" title="Blockchain Data">
              <Body>
                Transactions you execute on Kreo Finance's smart contracts on
                the Base blockchain are recorded permanently and publicly
                on-chain. This includes your wallet address, offering
                parameters, RST purchase amounts, and settlement claims. This
                data is inherently public by the nature of blockchain technology
                and is outside our ability to modify or delete.
              </Body>
              <Body>
                We encourage you to transact only with wallet addresses you are
                comfortable associating with your activity on Kreo Finance.
              </Body>
            </PolicySection>

            <PolicySection id="kyc" num="06" title="KYC & Accreditation Data">
              <Body>
                Identity verification and accreditation documents collected via
                Sumsub are retained for the duration required by applicable
                anti-money laundering regulations and Singapore MAS guidelines —
                typically a minimum of{" "}
                <strong className="text-foreground">5 years</strong> from the
                date of your last transaction on the platform.
              </Body>
              <Body>
                You may request access to or deletion of your KYC data by
                contacting us at{" "}
                <a
                  href="mailto:hello@kreofi.xyz"
                  className="text-[hsl(var(--creo-pink))] hover:underline"
                >
                  hello@kreofi.xyz
                </a>
                , subject to our legal retention obligations.
              </Body>
            </PolicySection>

            <PolicySection id="retention" num="07" title="Data Retention">
              <div className="space-y-3">
                {[
                  {
                    label: "Creator income data",
                    desc: "Duration of active offerings + 12 months after final offering, then securely deleted",
                  },
                  {
                    label: "Investor transaction data",
                    desc: "Duration of RST holdings + 12 months after final claim",
                  },
                  {
                    label: "KYC data",
                    desc: "Minimum 5 years as required by applicable law",
                  },
                  {
                    label: "Google OAuth tokens",
                    desc: "Deleted immediately upon YouTube account disconnection or account deletion request",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex gap-4 p-4 rounded-xl border border-border bg-card items-start"
                  >
                    <div className="w-2 h-2 rounded-full bg-[hsl(var(--creo-pink))] mt-1.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">{item.label}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </PolicySection>

            <PolicySection id="rights" num="08" title="Your Rights">
              <Body>
                Depending on your jurisdiction, you may have the right to:
              </Body>
              <BulletList
                items={[
                  "Access the personal information we hold about you",
                  "Correct inaccurate personal information",
                  "Delete your personal information (subject to legal retention obligations)",
                  "Withdraw consent for data processing where consent is the legal basis",
                  "Portability — receive a copy of your data in a structured, machine-readable format",
                ]}
              />
              <Body>
                To exercise any of these rights, contact us at{" "}
                <a
                  href="mailto:hello@kreofinance.xyz"
                  className="text-[hsl(var(--creo-pink))] hover:underline"
                >
                  hello@kreofinance.xyz
                </a>
              </Body>

              <div className="grid sm:grid-cols-3 gap-4 mt-6">
                {[
                  {
                    region: "European (GDPR)",
                    desc: "We process your information to fulfil contractual obligations and legitimate business interests. Data may be transferred outside the EEA, including to Singapore.",
                  },
                  {
                    region: "California (CCPA)",
                    desc: "You have the right to know what we collect, request deletion, and opt out of sale (we do not sell personal data).",
                  },
                  {
                    region: "India (DPDPA)",
                    desc: "You have rights under India's Digital Personal Data Protection Act 2023, including access, correction, and erasure.",
                  },
                ].map((r) => (
                  <div
                    key={r.region}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--creo-teal))] mb-2">
                      {r.region}
                    </p>
                    <p className="text-sm text-muted-foreground">{r.desc}</p>
                  </div>
                ))}
              </div>
            </PolicySection>

            <PolicySection id="security" num="09" title="Data Security">
              <Body>
                Kreo Finance implements the following security measures:
              </Body>
              <BulletList
                items={[
                  "AES-256 encryption for all OAuth tokens and sensitive credentials at rest",
                  "HTTPS enforced across all platform endpoints",
                  "Access controls limiting data access to authorized personnel only",
                  "Regular security reviews of our data handling practices",
                  "Smart contract security through OpenZeppelin v5 audited libraries and reentrancy guard on all fund-moving functions",
                ]}
              />
            </PolicySection>

            <PolicySection id="minors" num="10" title="Minors">
              <Body>
                The Site and our services are not intended for individuals under
                the age of 18. We do not knowingly collect personal information
                from anyone under 18. If you believe a minor has provided us
                with personal information, please contact us immediately.
              </Body>
            </PolicySection>

            <PolicySection id="cookies" num="11" title="Cookies">
              <Body>
                We use cookies to understand site usage, remember your
                preferences, and improve our platform. You may configure your
                browser to reject cookies, though some features may not function
                correctly if you do.
              </Body>
              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                {[
                  {
                    type: "Essential",
                    desc: "Required for wallet connection and authentication",
                  },
                  {
                    type: "Analytics",
                    desc: "Help us understand how users interact with the Site",
                  },
                  {
                    type: "Preference",
                    desc: "Remember your theme and display preferences",
                  },
                ].map((c) => (
                  <div
                    key={c.type}
                    className="rounded-xl border border-border bg-card p-4 text-center"
                  >
                    <p className="font-bold text-sm mb-2">{c.type}</p>
                    <p className="text-xs text-muted-foreground">{c.desc}</p>
                  </div>
                ))}
              </div>
            </PolicySection>

            <PolicySection id="changes" num="12" title="Changes to This Policy">
              <Body>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices, legal requirements, or platform
                features. When we make material changes, we will update the
                "Last Updated" date and notify active creators and investors via
                the platform or email where required by law.
              </Body>
            </PolicySection>

            <PolicySection id="contact" num="13" title="Contact Us">
              <Body>
                For questions about this Privacy Policy, to exercise your data
                rights, or to make a complaint:
              </Body>
              <ContactCard />
              <p className="text-sm text-muted-foreground mt-4 border-l-2 border-[hsl(var(--creo-pink))] pl-4">
                For Google API data concerns specifically, contact us with the
                subject line{" "}
                <strong className="text-foreground">
                  "Google Data Request."
                </strong>
              </p>
            </PolicySection>
          </article>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

/* ── Shared sub-components ───────────────────────────────────────────────── */

function Pill({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "pink" | "teal";
}) {
  const cls =
    color === "pink"
      ? "border-[hsl(var(--creo-pink))/30] bg-[hsl(var(--creo-pink))/10] text-[hsl(var(--creo-pink))]"
      : "border-[hsl(var(--creo-teal))/30] bg-[hsl(var(--creo-teal))/10] text-[hsl(var(--creo-teal))]";
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${cls}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {children}
    </div>
  );
}

function PolicySection({
  id,
  num,
  title,
  children,
}: {
  id: string;
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-baseline gap-4 mb-6">
        <span
          className="font-display font-bold text-5xl leading-none select-none"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--creo-pink)), hsl(var(--creo-teal)))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {num}
        </span>
        <h2 className="text-2xl font-display font-bold">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-semibold text-foreground mt-6 mb-2">
      {children}
    </h3>
  );
}

function Body({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-sm text-muted-foreground leading-relaxed ${className ?? ""}`}
    >
      {children}
    </p>
  );
}

function Accent({ children }: { children: React.ReactNode }) {
  return <strong className="text-foreground">{children}</strong>;
}

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2 mt-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm text-muted-foreground">
          <span className="text-[hsl(var(--creo-pink))] mt-0.5 shrink-0">
            ›
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[hsl(var(--creo-pink))/20] bg-[hsl(var(--creo-pink))/5] p-5 mt-4">
      <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--creo-pink))] mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

function ContactCard() {
  return (
    <div className="mt-6 rounded-2xl border border-border bg-card overflow-hidden">
      <div
        className="h-1.5"
        style={{
          background:
            "linear-gradient(90deg, hsl(var(--creo-pink)), hsl(var(--creo-teal)))",
        }}
      />
      <div className="p-6 space-y-2">
        <p className="font-display font-bold text-lg">Kreo Finance Pte. Ltd.</p>
        <p className="text-sm text-muted-foreground">Singapore</p>
        <div className="pt-2 space-y-1.5 text-sm">
          <p>
            <span className="text-muted-foreground">Email: </span>
            <a
              href="mailto:hello@kreofi.xyz"
              className="text-[hsl(var(--creo-pink))] hover:underline"
            >
              hello@kreofi.xyz
            </a>
          </p>
          <p>
            <span className="text-muted-foreground">Website: </span>
            <a
              href="https://kreofi.xyz"
              className="text-[hsl(var(--creo-pink))] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              kreofi.xyz
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
