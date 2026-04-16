import { Wallet } from "lucide-react";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { Button } from "@/components/ui/button";

interface WalletGateProps {
  children: React.ReactNode;
  message?: string;
}

const WalletGate = ({ children, message = "Connect your wallet to view your data." }: WalletGateProps) => {
  const { isConnected } = useAccount();
  const { open } = useAppKit();

  if (isConnected) return <>{children}</>;

  return (
    <div className="flex flex-1 items-center justify-center min-h-[calc(100vh-4rem)] lg:min-h-screen">
      <div className="flex flex-col items-center gap-6 text-center max-w-sm px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-creo-pink/10">
          <Wallet className="h-8 w-8 text-creo-pink" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Wallet Not Connected</h2>
          <p className="font-body text-sm text-muted-foreground">{message}</p>
        </div>
        <Button
          onClick={() => open()}
          className="bg-gradient-hero font-display text-sm font-semibold text-primary-foreground hover:opacity-90 w-full"
        >
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </Button>
      </div>
    </div>
  );
};

export default WalletGate;
