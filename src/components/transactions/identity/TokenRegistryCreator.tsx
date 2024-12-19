import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useWallet } from "@/contexts/WalletContext";
import { useTokenRegistryCreation } from "./useTokenRegistryCreation";
import { TokenRegistryDocument } from "./types";

interface TokenRegistryCreatorProps {
  onRegistryCreated: (document: TokenRegistryDocument) => void;
}

export const TokenRegistryCreator = ({ onRegistryCreated }: TokenRegistryCreatorProps) => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const { toast } = useToast();
  const { walletAddress } = useWallet();
  const { registryDocument, createTokenRegistry } = useTokenRegistryCreation(onRegistryCreated);

  const handleDeploy = async () => {
    if (!name || !symbol) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and symbol for the token registry",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDeploying(true);
      await createTokenRegistry(walletAddress || "", name, symbol);
      toast({
        title: "Success",
        description: "Token Registry deployed successfully",
      });
    } catch (error: any) {
      console.error("Error in token registry deployment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to deploy token registry",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-medium">Token Registry</h3>
        <p className="text-sm text-gray-500">
          Deploy a token registry contract for transferable documents
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="registryName" className="text-sm font-medium">
              Registry Name
            </label>
            <Input
              id="registryName"
              placeholder="Enter registry name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isDeploying}
            />
          </div>
          <div>
            <label htmlFor="registrySymbol" className="text-sm font-medium">
              Registry Symbol
            </label>
            <Input
              id="registrySymbol"
              placeholder="Enter registry symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              disabled={isDeploying}
            />
          </div>
        </div>

        {registryDocument && (
          <div className="p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-2">Registry Details</h4>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">Address:</span> {registryDocument.contractAddress}</p>
              <p><span className="font-medium">Name:</span> {registryDocument.name}</p>
              <p><span className="font-medium">Symbol:</span> {registryDocument.symbol}</p>
            </div>
          </div>
        )}

        <Button 
          onClick={handleDeploy}
          disabled={isDeploying || !name || !symbol}
          className="w-full"
        >
          {isDeploying ? "Deploying..." : "Deploy Token Registry"}
        </Button>
      </div>
    </div>
  );
};

export type { TokenRegistryDocument };