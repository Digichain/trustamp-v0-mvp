import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";

export const WalletStatus = () => {
  const { isWalletConnected, connectWallet, disconnectWallet, walletAddress, network } = useWallet();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  console.log("WalletStatus - Rendering with connection state:", isWalletConnected);

  return (
    <div className="p-4">
      {isWalletConnected && walletAddress ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">Connected</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={disconnectWallet}
              className="h-6 w-6 transition-colors hover:bg-transparent group"
            >
              <XCircle className="h-4 w-4 text-muted-foreground group-hover:text-destructive" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {truncateAddress(walletAddress)}
          </div>
          <div className="text-xs text-muted-foreground">
            {network}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <XCircle className="h-4 w-4 text-destructive" />
            <span className="text-destructive font-medium">Disconnected</span>
          </div>
          <Button 
            onClick={connectWallet} 
            variant="outline" 
            size="sm" 
            className="w-full"
          >
            Connect Wallet
          </Button>
        </div>
      )}
    </div>
  );
};