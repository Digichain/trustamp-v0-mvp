import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/contexts/WalletContext";
import { useTokenRegistryCreation } from "./useTokenRegistryCreation";
import { TokenRegistryDocument } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegistryDetails } from "./RegistryDetails";
import { DNSRecordDisplay } from "./DNSRecordDisplay";

interface TokenRegistryCreatorProps {
  onRegistryCreated: (document: TokenRegistryDocument) => void;
}

export const TokenRegistryCreator = ({ onRegistryCreated }: TokenRegistryCreatorProps) => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [existingAddress, setExistingAddress] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { walletAddress } = useWallet();
  const { registryDocument, createTokenRegistry, loadExistingRegistry } = useTokenRegistryCreation(onRegistryCreated);

  const handleDeploy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  const handleLoadExisting = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!existingAddress) {
      toast({
        title: "Missing Information",
        description: "Please provide the token registry address",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await loadExistingRegistry(existingAddress);
      toast({
        title: "Success",
        description: "Token Registry loaded successfully",
      });
    } catch (error: any) {
      console.error("Error loading existing registry:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load token registry",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    e.stopPropagation();
    setter(e.target.value);
  };

  return (
    <div className="space-y-4 mb-8" onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-medium">Token Registry</h3>
        <p className="text-sm text-gray-500">
          Deploy a new token registry or use an existing one for transferable documents
        </p>
        
        <Tabs defaultValue="deploy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deploy">Deploy New</TabsTrigger>
            <TabsTrigger value="existing">Use Existing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deploy">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="registryName" className="text-sm font-medium">
                  Registry Name
                </label>
                <Input
                  id="registryName"
                  placeholder="Enter registry name"
                  value={name}
                  onChange={(e) => handleInputChange(e, setName)}
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
                  onChange={(e) => handleInputChange(e, setSymbol)}
                  disabled={isDeploying}
                />
              </div>
            </div>
            <Button 
              onClick={handleDeploy}
              disabled={isDeploying || !name || !symbol}
              className="w-full mt-4"
            >
              {isDeploying ? "Deploying..." : "Deploy Token Registry"}
            </Button>
          </TabsContent>
          
          <TabsContent value="existing">
            <div className="space-y-4">
              <div>
                <label htmlFor="existingAddress" className="text-sm font-medium">
                  Registry Address
                </label>
                <Input
                  id="existingAddress"
                  placeholder="Enter existing registry address"
                  value={existingAddress}
                  onChange={(e) => handleInputChange(e, setExistingAddress)}
                  disabled={isLoading}
                />
              </div>
              <Button 
                onClick={handleLoadExisting}
                disabled={isLoading || !existingAddress}
                className="w-full"
              >
                {isLoading ? "Loading..." : "Load Existing Registry"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {registryDocument && (
          <>
            <RegistryDetails registry={registryDocument} />
            <DNSRecordDisplay 
              dnsLocation={registryDocument.dnsLocation}
              contractAddress={registryDocument.contractAddress}
            />
          </>
        )}
      </div>
    </div>
  );
};

export type { TokenRegistryDocument };