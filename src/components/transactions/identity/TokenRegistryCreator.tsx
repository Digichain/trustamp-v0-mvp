import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useTokenRegistryCreation } from "./useTokenRegistryCreation";
import type { TokenRegistryDocument } from "./types";

interface TokenRegistryCreatorProps {
  onRegistryCreated: (doc: TokenRegistryDocument) => void;
}

export const TokenRegistryCreator = ({ onRegistryCreated }: TokenRegistryCreatorProps) => {
  const { walletAddress, network } = useWallet();
  const [registryName, setRegistryName] = useState("");
  const [registrySymbol, setRegistrySymbol] = useState("");
  const { isCreating, registryDocument, createTokenRegistry } = useTokenRegistryCreation(onRegistryCreated);

  const handleCreateRegistry = () => {
    if (walletAddress && registryName && registrySymbol) {
      createTokenRegistry(walletAddress, registryName, registrySymbol);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Token Registry</CardTitle>
        <CardDescription>
          Deploy a token registry contract for document ownership
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="registry-name">Registry Name</Label>
          <Input
            id="registry-name"
            placeholder="My Token Registry"
            value={registryName}
            onChange={(e) => setRegistryName(e.target.value)}
            disabled={isCreating || registryDocument !== null}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="registry-symbol">Registry Symbol</Label>
          <Input
            id="registry-symbol"
            placeholder="MTR"
            value={registrySymbol}
            onChange={(e) => setRegistrySymbol(e.target.value)}
            disabled={isCreating || registryDocument !== null}
          />
        </div>

        <Button 
          onClick={handleCreateRegistry} 
          disabled={isCreating || !walletAddress || !registryName || !registrySymbol || network !== "Sepolia Testnet" || registryDocument !== null}
          className="w-full"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deploying Registry...
            </>
          ) : registryDocument ? (
            'Registry Deployed'
          ) : (
            'Deploy Token Registry'
          )}
        </Button>

        {registryDocument && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">Registry Deployed</p>
            <p className="text-sm text-gray-500 break-all">{registryDocument.contractAddress}</p>
            <p className="text-sm font-medium text-gray-900 mt-2">DNS Location</p>
            <p className="text-sm text-gray-500 break-all">{registryDocument.dnsLocation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export type { TokenRegistryDocument };