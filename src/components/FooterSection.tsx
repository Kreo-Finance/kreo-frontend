import { useState } from "react";
import { Button } from "@/components/ui/button";
import WaitlistDialog from "@/components/WaitlistDialog";

const footerLinks = {
  Protocol: ["Discover", "Features", "Pricing", "Roadmap"],
  Resources: ["Blog", "Documentation", "Help Center", "About"],
  Legal: ["Terms of Service", "Privacy Policy", "Security"],
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
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <footer className="border-t border-border bg-background">
      {/* CTA strip */}
      <div className="h-2 bg-gradient-teal-pink" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Newsletter / CTA */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-2xl font-bold leading-snug">
              Join to get the early beta access and other privileges.
            </h3>
            <p className="mt-3 font-body text-sm text-muted-foreground">
              Be among the first to experience KREO. Connect your wallet and
              secure your spot on the waitlist.
            </p>
            <Button
              onClick={() => setWaitlistOpen(true)}
              className="mt-6 bg-creo-pink font-body text-sm font-semibold text-primary-foreground hover:opacity-90 h-11 px-6"
            >
              Join Waitlist
            </Button>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display text-sm font-semibold text-foreground mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
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

      <WaitlistDialog open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </footer>
  );
};

export default FooterSection;
