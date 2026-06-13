import { useState } from "react";
import { Mail, Loader2, CheckCircle2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAppKit, useAppKitState } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import { joinWaitlist } from "@/services/waitlist";

interface WaitlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WaitlistDialog = ({ open, onOpenChange }: WaitlistDialogProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const { open: openAppKit } = useAppKit();
  const { open: isAppKitOpen } = useAppKitState();
  const { address, isConnected } = useAccount();

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      setError("Please connect your wallet to continue.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await joinWaitlist(email, address);
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next && isAppKitOpen) return;
    onOpenChange(next);
    if (!next) {
      setTimeout(() => {
        setEmail("");
        setSubmitted(false);
        setError("");
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-background">
        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-hero">
              <CheckCircle2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <DialogHeader>
              <DialogTitle className="font-display text-xl font-bold">
                Welcome! You&apos;re on the waitlist!
              </DialogTitle>
              <DialogDescription className="font-body text-muted-foreground">
                Thanks for joining the KREO waitlist! We&apos;ll keep you
                updated on our launch and send you exclusive early access
                opportunities. In the meantime, feel free to explore our
                website and follow us on social media for the latest news.
              </DialogDescription>
            </DialogHeader>
          </div>
        ) : (
          <>
            <DialogHeader className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero">
                <Mail className="h-6 w-6 text-primary-foreground" />
              </div>
              <DialogTitle className="font-display text-xl font-bold">
                Join the Waitlist
              </DialogTitle>
              <DialogDescription className="font-body text-muted-foreground">
                Be among the first to experience KREO — the creator
                economy&apos;s investment platform.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. yourname@gmail.com"
                className="font-body h-11 border-border bg-background focus-visible:ring-ring"
              />
              {isConnected ? (
                <button
                  type="button"
                  onClick={() => openAppKit()}
                  className="h-11 w-full rounded-md border border-creo-teal/40 bg-creo-teal/10 px-4 font-body text-sm font-medium text-creo-teal flex items-center gap-2 hover:bg-creo-teal/15 transition-colors"
                >
                  <div className="h-2 w-2 rounded-full bg-creo-teal animate-pulse flex-shrink-0" />
                  <span className="truncate">{truncatedAddress}</span>
                  <span className="ml-auto text-xs text-muted-foreground flex-shrink-0">
                    Connected
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openAppKit()}
                  className="h-11 w-full rounded-md border border-border bg-background px-4 font-body text-sm font-medium text-foreground flex items-center gap-2 hover:bg-muted transition-colors"
                >
                  <Wallet size={16} className="text-muted-foreground flex-shrink-0" />
                  Connect Wallet
                  <span className="ml-auto text-xs text-destructive flex-shrink-0">
                    Required
                  </span>
                </button>
              )}
              {error && (
                <p className="font-body text-xs text-destructive -mt-2">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                disabled={loading || !isConnected}
                className="h-11 bg-gradient-hero font-body text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Joining…
                  </span>
                ) : (
                  "Get Early Access"
                )}
              </Button>
              <p className="text-center font-body text-xs text-muted-foreground">
                No spam, ever. Made for creators.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistDialog;
