import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { joinWaitlist } from "@/services/waitlist";
import { Link } from "react-router-dom";
const footerLinks = {
  Protocol: [
    { text: "Marketplace", href: "/marketplace" },
    { text: "Creator Dashboard", href: "/creator/dashboard" },
    { text: "Pricing", href: "/pricing" },
    { text: "Portfolio", href: "/investor/portfolio" },
  ],
  Resources: [
    { text: "Blog", href: "/blog" },
    { text: "Documentation", href: "/documentation" },
    { text: "Help Center", href: "/help-center" },
    { text: "About", href: "#" },
  ],
  Legal: [
    { text: "Terms of Service", href: "/terms-of-service" },
    { text: "Privacy Policy", href: "/privacy-policy" },
    // { text: "Security", href: "#" },
  ],
};

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current" aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const FarcasterIcon = () => (
  <svg
    viewBox="0 0 1000 1000"
    className="h-8 w-8 fill-current"
    aria-hidden="true"
  >
    <path d="M257.778 155.556h484.444v688.889H671.111V528.889h-.697C662.554 441.677 589.258 373.333 500 373.333c-89.258 0-162.554 68.344-170.414 155.556h-.697v315.556H257.778V155.556zM128.889 253.333l28.889 97.778h24.444v395.556c-12.273 0-22.222 9.949-22.222 22.222v26.667h-4.444c-12.273 0-22.222 9.949-22.222 22.222v26.667h248.889v-26.667c0-12.273-9.949-22.222-22.222-22.222H355.556v-26.667c0-12.273-9.949-22.222-22.222-22.222h-4.445V253.333H128.889zM617.778 253.333V746.667h-4.445c-12.273 0-22.222 9.949-22.222 22.222v26.667H586.667c-12.273 0-22.222 9.949-22.222 22.222v26.667h248.889v-26.667c0-12.273-9.949-22.222-22.222-22.222H786.667v-26.667c0-12.273-9.949-22.222-22.222-22.222V351.111h24.444l28.889-97.778H617.778z" />
  </svg>
);

const socials = [
  {
    label: "X",
    Icon: XIcon,
    href: "https://x.com/kreofinance",
    color: "text-black dark:text-white",
  },
  {
    label: "Discord",
    Icon: DiscordIcon,
    href: "https://discord.gg/kreofinance",
    color: "text-[#738ADB]",
  },
  // {
  //   label: "GitHub",
  //   Icon: GitHubIcon,
  //   href: "https://github.com/Kreo-Finance",
  //   color: "text-black dark:text-white",
  // },
  {
    label: "YouTube",
    Icon: YouTubeIcon,
    href: "https://youtube.com/@KreoFinance",
    color: "text-red-600",
  },
  {
    label: "Farcaster",
    Icon: FarcasterIcon,
    href: "https://farcaster.xyz/0xnerd",
    color: "text-purple-600",
  },
];

const FooterSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await joinWaitlist(email);
      setSubmitted(true);
      setEmail("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!submitted && !error) return;

    const timeout = setTimeout(() => {
      setSubmitted(false);
      setError("");
      setEmail("");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [submitted, error]);
  return (
    <footer className="border-t border-border bg-background">
      {/* CTA strip */}
      <div className="h-2 bg-gradient-teal-pink" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-2xl font-bold leading-snug">
              Join to get the early beta access and other privileges.
            </h3>
            <div className="mt-6 flex flex-col gap-2">
              <form
                onSubmit={handleWaitlistSubmit}
                className="flex items-center gap-2"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 rounded-lg border border-border bg-muted px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-creo-pink"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-creo-pink text-primary-foreground hover:opacity-90 h-11 w-11"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              </form>
              {submitted && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Successfully joined the waitlist!
                </p>
              )}
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display text-sm font-semibold text-foreground mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => {
                  const linkText = typeof link === "string" ? link : link.text;
                  const linkHref = typeof link === "string" ? "#" : link.href;
                  const isInternalLink = linkHref.startsWith("/");

                  return (
                    <li key={linkText}>
                      {isInternalLink ? (
                        <Link
                          to={linkHref}
                          className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {linkText}
                        </Link>
                      ) : (
                        <a
                          href={linkHref}
                          className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {linkText}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-gradient-hero">
              KREO
            </span>
            <span className="font-body text-sm text-muted-foreground">
              © {new Date().getFullYear()} Kreo Finance. All rights reserved
            </span>
          </div>
          <div className="flex items-center gap-5">
            {socials.map(({ label, Icon, href, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`${color} hover:opacity-75 transition-opacity`}
              >
                <Icon />
              </a>
            ))}
          </div>
          <span className="font-body text-sm text-muted-foreground">
            Built with ❤️ by Team Kreo
          </span>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
