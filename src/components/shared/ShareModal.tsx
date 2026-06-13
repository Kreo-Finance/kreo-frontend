import { useEffect } from "react";
import { X, Twitter, Copy, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreoScoreBadge from "@/components/ui/CreoScoreBadge";

type TierNumber = 0 | 1 | 2 | 3;

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  score: number;
  tier: TierNumber;
  tierName: string;
  creatorAddress: string;
  offeringsCount?: number;
  settlementRate?: number;
  totalRaised?: string;
}

const ShareModal = ({
  open,
  onClose,
  score,
  tier,
  tierName,
  creatorAddress,
  offeringsCount = 1,
  settlementRate = 100,
  totalRaised = "$12,000",
}: ShareModalProps) => {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const shortAddr = creatorAddress
    ? `${creatorAddress.slice(0, 6)}...${creatorAddress.slice(-4)}`
    : "0x...";

  const profileUrl = creatorAddress
    ? `${window.location.origin}/creator/${creatorAddress}`
    : `${window.location.origin}/marketplace`;

  const tweetText = encodeURIComponent(
    `Just hit ${tierName} tier on @KreoFinance 🎯\nKreoScore: ${score} | ${offeringsCount} offering${offeringsCount !== 1 ? "s" : ""} completed\n${settlementRate}% settlement rate | ${totalRaised} raised\nTokenizing creator earnings on Base 🔵\nkreofi.xyz #CreatorEconomy #DeFi #Base`,
  );
  const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  const farcasterUrl = `https://warpcast.com/~/compose?text=${tweetText}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl).catch(() => {});
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Share KreoScore"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close share modal"
          className="absolute top-4 right-4 rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-1">
            Share your KreoScore
          </h2>
          <p className="font-body text-sm text-muted-foreground mb-5">
            Show investors your verified on-chain reputation.
          </p>

          {/* Preview card */}
          <div
            className="rounded-xl border border-border overflow-hidden mb-5"
            style={{
              background: "linear-gradient(135deg, #0f172a 60%, #001a4d)",
            }}
          >
            <div className="p-5">
              {/* Top row */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-display text-sm font-bold text-white/80">
                  Kreo Finance
                </span>
                <span className="font-body text-xs text-white/50">
                  kreofi.xyz
                </span>
              </div>

              {/* Score + badge */}
              <div className="flex items-end gap-3 mb-3">
                <span className="font-display text-6xl font-bold text-white leading-none">
                  {score}
                </span>
                <div className="mb-1">
                  <CreoScoreBadge tier={tier} size="md" />
                </div>
              </div>
              <p className="font-body text-sm text-white/50 mb-4">KreoScore</p>

              <div className="h-px bg-white/10 mb-4" />

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="font-display text-lg font-bold text-white">
                    {offeringsCount}
                  </p>
                  <p className="font-body text-xs text-white/50">Offerings</p>
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-white">
                    {settlementRate}%
                  </p>
                  <p className="font-body text-xs text-white/50">Settlement</p>
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-white">
                    {totalRaised}
                  </p>
                  <p className="font-body text-xs text-white/50">Raised</p>
                </div>
              </div>

              {/* Bottom strip */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <p className="font-body text-xs text-white/40">
                  Verified Creator on Kreo Finance · Built on Base
                </p>
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600">
                  <span
                    className="text-white font-bold"
                    style={{ fontSize: 8 }}
                  >
                    B
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Share buttons */}
          <div className="space-y-2">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Twitter / X"
            >
              <Button
                variant="outline"
                className="w-full border-border hover:border-creo-pink/40 gap-2"
              >
                <Twitter className="h-4 w-4" />
                <span className="font-body text-sm">Share on X / Twitter</span>
              </Button>
            </a>

            <a
              href={farcasterUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Farcaster"
            >
              <Button
                variant="outline"
                className="w-full border-border hover:border-creo-teal/40 gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="font-body text-sm">Share on Farcaster</span>
              </Button>
            </a>

            <Button
              variant="outline"
              className="w-full border-border hover:border-border gap-2"
              onClick={handleCopyLink}
              aria-label="Copy profile link to clipboard"
            >
              <Copy className="h-4 w-4" />
              <span className="font-body text-sm">Copy Profile Link</span>
            </Button>
          </div>

          <p className="mt-4 font-body text-xs text-muted-foreground text-center">
            Not financial advice. Past performance does not guarantee future
            results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
