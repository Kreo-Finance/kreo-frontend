import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  Protocol: ["Discover", "Features", "Pricing", "Roadmap"],
  Resources: ["Blog", "Documentation", "Help Center", "About"],
  Legal: ["Terms of Service", "Privacy Policy", "Security"],
};

const socials = [
  { label: "X",  href: "https://x.com/creoprotocol.xyz" },
  { label: "Discord",  href: "https://discord.gg/creoprotocol" },
  { label: "GitHub",   href: "https://github.com/Creo-Protocol" },
  { label: "YouTube",  href: "https://youtube.com/@CreoProtocol" },
];

const FooterSection = () => {
  return (
    <footer className="border-t border-border bg-background">
      {/* CTA strip */}
      <div className="h-2 bg-gradient-teal-pink" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-2xl font-bold leading-snug">
              Subscribe to get tips to grow the way you want.
            </h3>
            <div className="mt-6 flex items-center gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 rounded-lg border border-border bg-muted px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-creo-pink"
              />
              <Button size="icon" className="bg-creo-pink text-primary-foreground hover:opacity-90 h-11 w-11">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display text-sm font-semibold text-foreground mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
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
            <span className="font-display text-lg font-bold text-gradient-hero">CREO</span>
            <span className="font-body text-xs text-muted-foreground">
              © {new Date().getFullYear()} Creo Protocol
            </span>
          </div>
          <div className="flex items-center gap-6">
            {socials.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
          <span className="font-body text-xs text-muted-foreground">
            Built with ❤️ by Team Creo
          </span>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;