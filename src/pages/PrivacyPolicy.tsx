import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Card } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="container mx-auto px-4 py-12 md:py-16">
        <article className="max-w-3xl mx-auto prose-invert prose">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-8">
            <strong>Effective Date:</strong> July 2, 2026
            <br />
            <strong>Last Updated:</strong> April 4, 2026
          </p>

          <p className="mb-6">
            This Privacy Policy describes how Kreo Finance Pte. Ltd. ("Kreo
            Finance", "we", "us", or "our") collects, uses, and shares
            information when you visit kreofi.xyz (the "Site") or use our
            protocol and services.
          </p>

          <Card className="mb-8 p-6 bg-muted border-creo-pink/20">
            <h2 className="text-2xl font-bold mb-4">Our Core Commitments</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>We DO NOT sell your personal data.</li>
              <li>
                We DO NOT share your personal data beyond vendors that assist us
                in storing or processing data for the purposes of running our
                platform, verifying creator identities, and servicing creator
                and investor accounts.
              </li>
            </ul>
          </Card>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              1. Information We Collect
            </h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              1a. Device Information
            </h3>
            <p className="mb-4">
              When you visit the Site, we automatically collect certain
              information about your device, including your web browser type, IP
              address, time zone, and cookies installed on your device. As you
              browse the Site, we collect information about the pages you view,
              what referred you to the Site, and how you interact with the Site.
              We refer to this as "Device Information."
            </p>
            <p className="mb-4 font-semibold">
              We collect Device Information using the following technologies:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                <strong>Cookies</strong> — data files placed on your device that
                often include an anonymous unique identifier. To learn more or
                disable cookies, visit allaboutcookies.org
              </li>
              <li>
                <strong>Log files</strong> — track actions on the Site and
                collect your IP address, browser type, internet service
                provider, referring and exit pages, and timestamps
              </li>
              <li>
                <strong>Web beacons, tags, and pixels</strong> — electronic
                files used to record how you browse the Site
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              1b. Account and Identity Information
            </h3>
            <p className="mb-4">
              When you connect your wallet and create an account on Kreo
              Finance, we collect:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                Your blockchain wallet address (your primary identity on our
                platform)
              </li>
              <li>Your ENS name, if resolvable</li>
              <li>
                Your KYC data collected via our identity verification provider,
                Sumsub, including government-issued identification, liveness
                verification, and address proof
              </li>
              <li>
                For investors: accreditation verification documents (income
                statements or net worth documentation, depending on your
                jurisdiction)
              </li>
              <li>
                Your email address, if you voluntarily provide it for
                notifications
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              1c. Creator Income Source Data
            </h3>
            <p className="mb-4">
              If you are a creator and connect your income sources, we collect:
            </p>

            <h4 className="font-semibold mb-2">Stripe:</h4>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-4">
              <li>Monthly payout history and verified earnings amounts</li>
              <li>Payout bank confirmation status</li>
              <li>Stripe account ID (for re-verification)</li>
            </ul>

            <h4 className="font-semibold mb-2">Gumroad:</h4>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-4">
              <li>Monthly sales history and gross revenue figures</li>
              <li>Payout records confirming actual bank receipt</li>
              <li>Gumroad user ID and email address</li>
            </ul>

            <h4 className="font-semibold mb-2">Google AdSense / YouTube:</h4>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-4">
              <li>Your YouTube channel ID and channel display name</li>
              <li>Your channel thumbnail image</li>
              <li>
                Monthly estimated AdSense revenue figures (via YouTube Analytics
                API)
              </li>
            </ul>

            <p className="mb-4">
              We collect this data exclusively to verify your income history,
              calculate your eligible raise amount, populate your 6-month
              earnings ring buffer for our variance underwriting model, and
              verify monthly settlements to investors.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              1d. Offering and Transaction Data
            </h3>
            <p className="mb-4">
              When you create or invest in an offering on Kreo Finance, we
              record:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                Offering parameters (revenue share percentage, duration, raise
                target)
              </li>
              <li>Transaction hashes for all on-chain actions</li>
              <li>Monthly settlement amounts and timestamps</li>
              <li>CreoScore tier and history</li>
              <li>Bond deposit and release records</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              2. How We Use Your Information
            </h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Verify creator identity and income — KYC verification via Sumsub
                and income source OAuth connections are required to create
                offerings and protect investors
              </li>
              <li>
                Calculate raise capacity — your verified income history feeds
                directly into our on-chain variance model to determine your
                eligible raise amount
              </li>
              <li>
                Process monthly settlements — verified earnings figures are
                passed to our Chainlink oracle to trigger on-chain distributions
                to investors
              </li>
              <li>
                Prevent fraud — we use your social proof score, KYC data, IP
                address, and behavioral signals during the 3-day capital release
                window to detect fraudulent activity
              </li>
              <li>
                Communicate with you — notify you of settlement completions,
                offering milestones, CreoScore changes, and platform updates
              </li>
              <li>
                Comply with applicable law — including anti-money laundering
                requirements, accredited investor verification obligations, and
                Singapore MAS regulations
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              3. Google API Access and YouTube Data
            </h2>
            <p className="mb-4">
              Kreo Finance requires YouTube creators to grant read-only access
              to their YouTube channel and AdSense revenue data via Google's
              OAuth 2.0 to enable income verification for our protocol. This
              access is limited to the specific data outlined below and adheres
              strictly to Google's API Services User Data Policy.
            </p>

            <h3 className="text-xl font-semibold mb-3">Data We Access</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                <strong>YouTube channel ID and display name</strong> — retrieved
                once at connection time to identify your channel for ongoing
                revenue queries
              </li>
              <li>
                <strong>Channel thumbnail</strong> — used to display your
                channel identity within the Kreo Finance platform
              </li>
              <li>
                <strong>Monthly estimated AdSense revenue</strong> — retrieved
                monthly via the YouTube Analytics API (estimatedRevenue metric
                only) for the purpose of settlement verification
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">
              What We Do Not Access
            </h3>
            <p className="mb-4">
              We do not access your Gmail, Google Drive, Google Search history,
              Google Contacts, YouTube comments, subscriber lists, video
              metadata, ad performance breakdowns, or any other Google services
              beyond those listed above.
            </p>

            <h3 className="text-xl font-semibold mb-3">How We Use This Data</h3>
            <p className="mb-4">
              Your YouTube and AdSense data is used exclusively for:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                Income verification — confirming your monthly AdSense earnings
                to populate the on-chain ring buffer used by our variance
                underwriting model
              </li>
              <li>
                Settlement verification — passing verified monthly revenue to
                our Chainlink Functions to trigger proportional USDC
                distributions to your RST investors
              </li>
              <li>
                Investor transparency — displaying verified earnings history to
                investors who have purchased your Revenue Share Tokens
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Data Storage</h3>
            <p className="mb-4">
              Access tokens and refresh tokens obtained via Google OAuth are
              encrypted at rest using AES-256 encryption. Revenue figures are
              stored in our PostgreSQL database accessible only through Kreo
              Finance's internal systems.
            </p>

            <h3 className="text-xl font-semibold mb-3">Revoking Access</h3>
            <p className="mb-4">
              You may revoke Kreo Finance's access to your Google account at any
              time by visiting myaccount.google.com/permissions and removing
              Kreo Finance. You may also disconnect your YouTube account
              directly from your Creator Dashboard at any time.
            </p>

            <h3 className="text-xl font-semibold mb-3">
              Google's Limited Use Policy
            </h3>
            <p className="mb-4">
              Kreo Finance's use of data received from Google APIs complies with
              the Google API Services User Data Policy, including the Limited
              Use requirements. We do not use your Google data to serve you
              advertisements, and we do not transfer your Google data to any
              third party except as necessary to provide our service with your
              consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              4. Sharing Your Information
            </h2>
            <p className="mb-4">
              We share your information only in the following limited
              circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                <strong>Sumsub</strong> — our KYC and accreditation verification
                provider. Sumsub processes your identity documents on our behalf
                under a data processing agreement
              </li>
              <li>
                <strong>Chainlink</strong> — monthly verified earnings figures
                (not personal identity data) are passed to Chainlink Functions
                for on-chain oracle verification
              </li>
              <li>
                <strong>Infrastructure providers</strong> — cloud hosting,
                database, and security services that store or process data on
                our behalf under confidentiality agreements
              </li>
              <li>
                <strong>Legal compliance</strong> — we may share your
                information to comply with applicable laws, respond to lawful
                requests from regulatory authorities, or protect our legal
                rights
              </li>
            </ul>
            <p className="mb-4">
              We will never sell, rent, or share your personal data or Google
              user data with third parties for advertising, marketing, or any
              purpose beyond those described in this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Blockchain Data</h2>
            <p className="mb-4">
              Please be aware that transactions you execute on Kreo Finance's
              smart contracts on the Base blockchain are recorded permanently
              and publicly on-chain. This includes your wallet address, offering
              parameters, RST purchase amounts, and settlement claims. This data
              is inherently public by the nature of blockchain technology and is
              outside our ability to modify or delete. We encourage you to
              transact only with wallet addresses you are comfortable
              associating with your activity on Kreo Finance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              6. KYC and Accreditation Data
            </h2>
            <p className="mb-4">
              Identity verification and accreditation documents collected via
              Sumsub are retained for the duration required by applicable
              anti-money laundering regulations and Singapore MAS guidelines.
              This is typically a minimum of 5 years from the date of your last
              transaction on the platform. You may request access to or deletion
              of your KYC data by contacting us at the address below, subject to
              our legal retention obligations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Creator income data</strong> — retained for the duration
                of your active offerings plus 12 months after your final
                offering completes, for audit and dispute purposes, after which
                it is securely deleted
              </li>
              <li>
                <strong>Investor transaction data</strong> — retained for the
                duration of your RST holdings plus 12 months after your final
                claim
              </li>
              <li>
                <strong>KYC data</strong> — retained as required by applicable
                law (minimum 5 years)
              </li>
              <li>
                <strong>Google OAuth tokens</strong> — deleted immediately upon
                disconnection of your YouTube account or upon platform account
                deletion request
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Your Rights</h2>
            <p className="mb-4">
              Depending on your jurisdiction, you may have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate personal information</li>
              <li>
                Delete your personal information (subject to legal retention
                obligations)
              </li>
              <li>
                Withdraw consent for data processing where consent is the legal
                basis
              </li>
              <li>
                Portability — receive a copy of your data in a structured,
                machine-readable format
              </li>
            </ul>
            <p className="mb-4">
              To exercise any of these rights, please contact us at
              hello@kreofinance.xyz.
            </p>

            <h3 className="text-lg font-semibold mb-3">
              European residents (GDPR)
            </h3>
            <p className="mb-4">
              We process your information to fulfil our contractual obligations
              to you and to pursue our legitimate business interests as
              described above. Your information may be transferred outside the
              EEA, including to Singapore.
            </p>

            <h3 className="text-lg font-semibold mb-3">
              California residents (CCPA)
            </h3>
            <p className="mb-4">
              You have the right to know what personal information we collect,
              request deletion, and opt out of sale (we do not sell personal
              data).
            </p>

            <h3 className="text-lg font-semibold mb-3">Indian residents</h3>
            <p className="mb-4">
              You have rights under India's Digital Personal Data Protection Act
              2023 (DPDPA), including the right to access, correct, and erase
              your personal data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Data Security</h2>
            <p className="mb-4">
              Kreo Finance implements the following security measures:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                AES-256 encryption for all OAuth tokens and sensitive
                credentials at rest
              </li>
              <li>HTTPS enforced across all platform endpoints</li>
              <li>
                Access controls limiting data access to authorized personnel
                only
              </li>
              <li>Regular security reviews of our data handling practices</li>
              <li>
                Smart contract security through OpenZeppelin v5 audited
                libraries and a reentrancy guard on all fund-moving functions
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Minors</h2>
            <p className="mb-4">
              The Site and our services are not intended for individuals under
              the age of 18. We do not knowingly collect personal information
              from anyone under 18. If you believe a minor has provided us with
              personal information, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Cookies</h2>
            <p className="mb-4">
              We use cookies to understand site usage, remember your
              preferences, and improve our platform. You may configure your
              browser to reject cookies, though some features of the Site may
              not function correctly if you do.
            </p>
            <p className="mb-4 font-semibold">Types of cookies we use:</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                <strong>Essential cookies</strong> — required for wallet
                connection and authentication
              </li>
              <li>
                <strong>Analytics cookies</strong> — help us understand how
                users interact with the Site
              </li>
              <li>
                <strong>Preference cookies</strong> — remember your theme and
                display preferences
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              12. Changes to This Policy
            </h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices, legal requirements, or platform
              features. When we make material changes, we will update the "Last
              Updated" date at the top of this page and notify active creators
              and investors via the platform or email where required by law.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">13. Contact Us</h2>
            <p className="mb-4">
              For questions about this Privacy Policy, to exercise your data
              rights, or to make a complaint:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-semibold">Kreo Finance Pte. Ltd.</p>
              <p>Singapore</p>
              <p className="mt-2">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:hello@kreofinance.xyz"
                  className="text-creo-pink hover:underline"
                >
                  hello@kreofinance.xyz
                </a>
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href="https://kreofi.xyz"
                  className="text-creo-pink hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  kreofi.xyz
                </a>
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                For Google API data concerns specifically, you may also contact
                us at the above email with the subject line "Google Data
                Request."
              </p>
            </div>
          </section>
        </article>
      </main>

      <FooterSection />
    </div>
  );
};

export default PrivacyPolicy;
