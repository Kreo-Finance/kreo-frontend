import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Card } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="container mx-auto px-4 py-12 md:py-16">
        <article className="max-w-3xl mx-auto prose-invert prose">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
            Terms of Service
          </h1>
          <p className="text-muted-foreground mb-8">
            <strong>Kreo Finance Pte. Ltd.</strong>
            <br />
            <strong>Last Updated:</strong> April 4, 2026
          </p>

          <p className="mb-6">
            Welcome to Kreo Finance, a decentralized finance protocol accessible
            at kreofi.xyz (the "Site") and associated interfaces (together, the
            "Platform"), operated by Kreo Finance Pte. Ltd., a company
            incorporated in Singapore ("Kreo Finance", "we", "us", "our").
          </p>
          <p className="mb-6">
            Kreo Finance is a DeFi protocol on the Base blockchain that enables
            creators to tokenize future verified earnings and receive upfront
            USDC capital, while accredited and high-net-worth investors purchase
            Revenue Share Tokens (RSTs) and earn monthly yield backed by
            verifiable creator revenue.
          </p>
          <p className="mb-8">
            Please read these Terms of Service carefully before using the
            Platform.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">I. Acceptance of Terms</h2>
            <Card className="mb-4 p-6 bg-muted border-creo-pink/20">
              <p className="font-semibold">
                BY CONNECTING YOUR WALLET OR USING THE PLATFORM IN ANY WAY, YOU
                AGREE TO BE LEGALLY BOUND BY THESE TERMS. IF YOU DO NOT AGREE,
                DO NOT USE THE PLATFORM.
              </p>
            </Card>
            <p className="mb-4">
              We may update these Terms at any time by posting a revised version
              on the Site. Your continued use of the Platform after any update
              constitutes your acceptance of the revised Terms. We will notify
              active users of material changes via the Platform or email where
              required.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">II. Eligibility</h2>
            <p className="mb-4">To use the Platform, you must:</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Be at least 18 years of age</li>
              <li>
                Have the legal capacity to enter binding contracts in your
                jurisdiction
              </li>
              <li>
                Not be located in, incorporated in, or a resident of any
                jurisdiction where use of the Platform is prohibited by law
              </li>
              <li>
                Not be subject to any sanctions, watchlists, or
                government-imposed restrictions on financial activity
              </li>
              <li>
                If participating as an Investor: meet the accredited investor or
                high-net-worth individual threshold applicable in your
                jurisdiction, as verified through our KYC and accreditation
                process
              </li>
            </ul>
            <p className="mb-4">
              <strong>Restricted jurisdictions in Phase 1:</strong> US retail
              investors and Indian retail investors are not eligible to invest in
              Phase 1 offerings. US accredited investors (as defined under Reg D
              Rule 506(b)) and Indian HNI investors (net worth ≥ ₹5 crore) are
              eligible subject to completed accreditation verification. Creators
              may onboard from any jurisdiction globally.
            </p>
            <p className="mb-4">
              We reserve the right to restrict access to the Platform in any
              jurisdiction at our sole discretion without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              III. No Investment Advice
            </h2>
            <p className="mb-4">
              Kreo Finance is not a broker-dealer, investment adviser, financial
              institution, or securities exchange. We do not provide investment
              advice, make investment recommendations, or endorse any creator
              offering on the Platform.
            </p>
            <p className="mb-4">
              Revenue Share Tokens (RSTs) may constitute securities in certain
              jurisdictions. By participating as an investor, you represent that
              you have independently assessed the legal status of RSTs in your
              jurisdiction and that your participation is lawful. We strongly
              encourage you to consult independent legal and financial advisors
              before investing.
            </p>
            <p className="mb-4">
              Past performance of any creator or offering does not guarantee
              future results. Creator earnings are not guaranteed. All
              investments carry risk, including the risk of total loss of your
              invested capital.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              IV. Wallet-Based Authentication
            </h2>
            <p className="mb-4">
              Kreo Finance uses wallet signatures as the sole method of
              authentication. There are no email passwords or traditional login
              credentials. Your blockchain wallet address is your identity on the
              Platform.
            </p>
            <p className="mb-4">You are solely responsible for:</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>The security of your private keys and seed phrases</li>
              <li>
                All actions taken from your wallet address on the Platform
              </li>
              <li>
                Any losses resulting from unauthorized access to your wallet
              </li>
            </ul>
            <p className="mb-4">
              We will never ask you to share your private key or seed phrase.
              Kreo Finance cannot recover your account, reverse transactions, or
              restore access if you lose control of your wallet. All on-chain
              transactions are final and irreversible.
            </p>
            <p className="mb-4">
              By signing a Sign-In With Ethereum (SIWE) message, you authorize
              Kreo Finance to issue you a session token and associate your wallet
              address with your Platform account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">V. Creator Terms</h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              5.1 Eligibility to Create Offerings
            </h3>
            <p className="mb-4">
              To create an offering on Kreo Finance, you must:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                Complete identity verification (KYC) via Sumsub
              </li>
              <li>
                Connect at least one verified income source (Stripe, Gumroad,
                or Google AdSense/YouTube)
              </li>
              <li>
                Achieve a minimum Social Proof Score of 40 out of 100
              </li>
              <li>
                Deposit the required commitment bond as determined by your
                CreoScore tier
              </li>
              <li>
                Pass all seven on-chain checks enforced by the smart contracts
                at offering creation
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              5.2 Your Representations as a Creator
            </h3>
            <p className="mb-4">
              By creating an offering, you represent and warrant that:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                All income data you connect and all information you provide is
                truthful, accurate, and complete
              </li>
              <li>
                You are the legitimate owner of the income sources connected to
                your account
              </li>
              <li>
                You have not artificially inflated your earnings or manipulated
                your income history
              </li>
              <li>
                You understand that your offering is a fixed-duration revenue
                share agreement, not a loan, and that there is no fixed
                repayment amount — investors receive a percentage of your actual
                verified earnings for the full offering duration
              </li>
              <li>
                You will not take deliberate action to reduce your verifiable
                income during an active offering for the purpose of harming
                investors
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              5.3 Creator Obligations During an Active Offering
            </h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                Maintain your income source OAuth connections for the duration
                of the offering
              </li>
              <li>
                Cooperate with monthly oracle verification by Chainlink
                Functions
              </li>
              <li>
                Not withdraw, revoke, or interfere with income source access
                tokens while an offering is active
              </li>
              <li>
                Notify Kreo Finance immediately if your income source accounts
                are suspended, terminated, or substantially changed
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              5.4 Commitment Bond
            </h3>
            <p className="mb-4">
              All creators must deposit a commitment bond before their offering
              opens. The bond rate is determined by your CreoScore tier. Upon
              successful completion of all settlement obligations, your bond is
              returned with a 2% bonus. If you abandon an offering (Protocol
              Default), your bond is slashed and distributed pro-rata to RST
              holders, and your wallet address is permanently flagged with the
              Protocol Default Lock, preventing future offerings until investors
              are made whole.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              5.5 Capital Release
            </h3>
            <p className="mb-4">
              Capital is released to creators 72 hours after an offering closes
              (PENDING_RELEASE period). During this window, Kreo Finance
              conducts fraud detection re-checks. We reserve the right to freeze
              capital release if fraud indicators are detected. A 3% platform
              fee is deducted from the raise at the time of capital release.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">VI. Investor Terms</h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              6.1 Eligibility to Invest
            </h3>
            <p className="mb-4">To invest on Kreo Finance, you must:</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Complete identity verification (KYC) via Sumsub</li>
              <li>
                Complete accreditation verification applicable to your
                jurisdiction
              </li>
              <li>Not be a resident of a restricted jurisdiction</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              6.2 Nature of RSTs
            </h3>
            <p className="mb-4">
              Revenue Share Tokens (RSTs) are ERC-20 tokens on the Base
              blockchain. Each RST represents a proportional right to receive
              monthly USDC distributions from a creator's verified earnings for
              the duration of the offering. RSTs are:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Not equity in the creator or any company</li>
              <li>Not a debt obligation with a fixed repayment amount</li>
              <li>
                Not guaranteed to generate any return — distributions are
                proportional to actual verified creator earnings
              </li>
              <li>
                Illiquid in Phase 1 — there is no protocol-level secondary
                market or AMM in Phase 1; RSTs may only be transferred
                peer-to-peer
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              6.3 Risk Acknowledgement
            </h3>
            <p className="mb-4">
              By purchasing RSTs, you acknowledge and accept that:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                Creator income may decline, resulting in lower distributions
                than projected
              </li>
              <li>
                A creator may default, resulting in bond slashing but
                potentially incomplete recovery of your investment
              </li>
              <li>
                Smart contracts have not been independently audited at Phase 1
                launch
              </li>
              <li>
                There is no guaranteed exit liquidity for RSTs in Phase 1
              </li>
              <li>
                Past verified earnings of a creator do not guarantee future
                earnings
              </li>
              <li>
                RSTs may constitute securities in your jurisdiction and you are
                responsible for your own legal compliance
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              6.4 Investor Protection Mechanisms
            </h3>
            <p className="mb-4">
              The following protocol mechanisms exist to protect investors, but
              do not guarantee any specific return:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                Variance-discounted floor model with minimum 122% coverage ratio
              </li>
              <li>Commitment bond slashed to RST holders on creator default</li>
              <li>Protocol Default Lock preventing serial abandonment</li>
              <li>3-day capital release window with fraud detection</li>
            </ul>
            <p className="mb-4">
              These mechanisms reduce but do not eliminate investment risk.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              6.5 Settlement and Claims
            </h3>
            <p className="mb-4">
              Monthly distributions are settled by our backend oracle via
              Chainlink Functions and accumulated in the Settlement contract.
              Investors may claim their distributions at any time using{" "}
              <code>claimEarnings()</code> or{" "}
              <code>claimAllEarnings()</code>, or enable auto-claim. A 3%
              platform fee is deducted from each monthly settlement before
              distribution to investors.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">VII. Platform Fees</h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">Fee</th>
                    <th className="text-left py-2 pr-4 font-semibold">
                      Amount
                    </th>
                    <th className="text-left py-2 pr-4 font-semibold">
                      Who Pays
                    </th>
                    <th className="text-left py-2 font-semibold">When</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">Capital release fee</td>
                    <td className="py-2 pr-4">3% of raise</td>
                    <td className="py-2 pr-4">Creator</td>
                    <td className="py-2">At capital release</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Monthly settlement fee</td>
                    <td className="py-2 pr-4">3% of verified earnings</td>
                    <td className="py-2 pr-4">
                      Deducted from investor pool
                    </td>
                    <td className="py-2">Each monthly settlement</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mb-4">
              No other fees are charged in Phase 1. We reserve the right to
              introduce or modify fees in Phase 2 with notice to active users.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              VIII. KYC, AML, and Compliance
            </h2>
            <p className="mb-4">
              Kreo Finance is required to comply with anti-money laundering
              (AML) and know-your-customer (KYC) regulations applicable in
              Singapore and other relevant jurisdictions. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                Provide truthful, accurate, and complete identity and
                accreditation documentation
              </li>
              <li>
                Notify us immediately of any material change in your
                accreditation status or jurisdiction
              </li>
              <li>
                Not use the Platform to launder money, finance terrorism, evade
                sanctions, or engage in any unlawful financial activity
              </li>
            </ul>
            <p className="mb-4">
              We reserve the right to suspend or terminate your account and
              freeze any funds associated with it if we reasonably suspect
              illegal activity, without notice and without liability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              IX. Smart Contract Risk and Blockchain Disclaimers
            </h2>
            <p className="mb-4">
              The Kreo Finance protocol operates on the Base blockchain through
              open-source smart contracts. By using the Platform, you
              acknowledge:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                Smart contracts may contain bugs or vulnerabilities despite
                reasonable security practices
              </li>
              <li>
                Transactions on the blockchain are irreversible — we cannot
                reverse, cancel, or recover any on-chain transaction
              </li>
              <li>
                Base blockchain network congestion or downtime may affect
                settlement timing
              </li>
              <li>
                Private key loss results in permanent loss of access to your
                wallet and any RSTs or USDC held therein
              </li>
              <li>
                Phase 1 smart contracts have not been independently audited —
                an audit is planned for Phase 2
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">X. Prohibited Conduct</h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                Provide false, misleading, or fraudulent income data or identity
                documentation
              </li>
              <li>
                Artificially inflate or manipulate income source data connected
                to your account
              </li>
              <li>
                Use the Platform for any purpose that violates applicable law,
                including securities laws, AML regulations, or sanctions regimes
              </li>
              <li>
                Attempt to circumvent our fraud detection systems, KYC
                verification, or accreditation checks
              </li>
              <li>
                Reverse engineer, decompile, or attempt to extract the source
                code of our smart contracts or backend systems beyond what is
                publicly open-source
              </li>
              <li>Impersonate any person or entity on the Platform</li>
              <li>
                Use automated bots, scrapers, or scripts to access the Platform
                without our written consent
              </li>
              <li>
                Interfere with, disrupt, or attack the Platform, our smart
                contracts, or our backend infrastructure
              </li>
              <li>
                Contact other users off-platform to solicit investment in
                offerings outside of Kreo Finance
              </li>
              <li>
                Use the Platform to stalk, harass, defame, or harm any other
                user
              </li>
            </ul>
            <p className="mb-4">
              We reserve the right to terminate your account immediately and
              without notice for any violation of this section.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              XI. Third-Party Services
            </h2>
            <p className="mb-4">
              Kreo Finance integrates with third-party services including Sumsub
              (KYC), Chainlink (oracle), Stripe, Gumroad, and Google (income
              verification). These services have their own terms of service and
              privacy policies. Kreo Finance is not responsible for the actions,
              data practices, or availability of any third-party service. Your
              use of any third-party service is governed by that service's own
              terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              XII. Intellectual Property
            </h2>
            <p className="mb-4">
              The Kreo Finance name, logo, brand assets, website design, and
              non-open-source software are the intellectual property of Kreo
              Finance Pte. Ltd. You may not reproduce, distribute, or create
              derivative works from our intellectual property without prior
              written consent.
            </p>
            <p className="mb-4">
              The smart contracts of the Kreo Finance protocol are open-source
              under the MIT License. You are free to read, fork, and build upon
              the contracts in accordance with that license.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              XIII. Disclaimers and Limitation of Liability
            </h2>
            <Card className="mb-4 p-6 bg-muted border-creo-pink/20">
              <p className="mb-4 font-semibold">
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. KREO FINANCE MAKES NO
                WARRANTIES REGARDING UPTIME, ACCURACY, FITNESS FOR A PARTICULAR
                PURPOSE, OR THE CONTINUED AVAILABILITY OF THE PROTOCOL.
              </p>
              <p className="mb-4 font-semibold">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, KREO FINANCE
                AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AFFILIATES SHALL
                NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 font-semibold">
                <li>ANY LOST PROFITS, LOST DATA, OR LOSS OF INVESTMENT</li>
                <li>
                  ANY INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL
                  DAMAGES
                </li>
                <li>
                  ANY LOSS ARISING FROM SMART CONTRACT BUGS, BLOCKCHAIN NETWORK
                  FAILURES, OR ORACLE MALFUNCTIONS
                </li>
                <li>
                  ANY LOSS ARISING FROM YOUR FAILURE TO SECURE YOUR WALLET
                  PRIVATE KEYS
                </li>
                <li>
                  ANY REGULATORY ACTION TAKEN AGAINST YOU AS A RESULT OF YOUR
                  USE OF THE PLATFORM
                </li>
              </ul>
              <p className="font-semibold">
                IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU EXCEED THE
                PLATFORM FEES YOU PAID TO KREO FINANCE IN THE THREE MONTHS
                PRECEDING THE CLAIM.
              </p>
            </Card>
            <p className="mb-4">
              NOTHING IN THESE TERMS LIMITS LIABILITY THAT CANNOT BE EXCLUDED
              UNDER APPLICABLE LAW, INCLUDING LIABILITY FOR FRAUD OR GROSS
              NEGLIGENCE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">XIV. Indemnification</h2>
            <p className="mb-4">
              You agree to indemnify, defend, and hold harmless Kreo Finance
              Pte. Ltd. and its officers, directors, employees, and affiliates
              from any claims, losses, liabilities, damages, costs, and expenses
              (including reasonable legal fees) arising from:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Your use or misuse of the Platform</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any applicable law or regulation</li>
              <li>
                Any false or misleading information you provided to the Platform
              </li>
              <li>
                Any claim by a third party arising from your offering or
                investment activity on the Platform
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              XV. Governing Law and Dispute Resolution
            </h2>
            <p className="mb-4">
              These Terms are governed by the laws of Singapore, without regard
              to conflict of law provisions.
            </p>
            <p className="mb-4">
              <strong>Dispute Resolution:</strong> In the event of any dispute
              arising from these Terms or your use of the Platform, both parties
              agree to attempt good-faith resolution for at least 30 days before
              initiating formal proceedings. Disputes that cannot be resolved
              informally shall be submitted to arbitration in Singapore under
              the rules of the Singapore International Arbitration Centre
              (SIAC), before a single arbitrator. The arbitration shall be
              conducted in English. The arbitral award shall be final and
              binding.
            </p>
            <p className="mb-4">
              <strong>Class Action Waiver:</strong> To the fullest extent
              permitted by applicable law, you agree that all disputes will be
              resolved individually and not as part of any class or collective
              action.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              XVI. Severability and Entire Agreement
            </h2>
            <p className="mb-4">
              If any provision of these Terms is found invalid or unenforceable
              by a court or arbitrator, that provision will be enforced to the
              maximum extent permissible and the remaining provisions will
              continue in full force.
            </p>
            <p className="mb-4">
              These Terms, together with our Privacy Policy, constitute the
              entire agreement between you and Kreo Finance regarding use of the
              Platform.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">XVII. Contact</h2>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-semibold">Kreo Finance Pte. Ltd.</p>
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
              <p>
                <strong>For legal notices:</strong>{" "}
                <a
                  href="mailto:legal@kreofinance.xyz"
                  className="text-creo-pink hover:underline"
                >
                  legal@kreofinance.xyz
                </a>
              </p>
            </div>
          </section>
        </article>
      </main>

      <FooterSection />
    </div>
  );
};

export default TermsOfService;
