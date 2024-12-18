import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createTemporaryRegistryDocument } from "@/utils/temporary-registry-mock";
import { useToast } from "@/components/ui/use-toast";

export interface TokenRegistryDocument {
  contractAddress: string;
  network: string;
  tokenName: string;
  tokenSymbol: string;
  ethereumAddress: string;
}

interface TokenRegistryCreatorProps {
  onRegistryCreated: (document: TokenRegistryDocument) => void;
}

export const TokenRegistryCreator = ({ onRegistryCreated }: TokenRegistryCreatorProps) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const { toast } = useToast();

  const handleDeploy = async () => {
    try {
      setIsDeploying(true);
      console.log("Creating temporary token registry simulation");
      
      // Create temporary mock registry
      const mockRegistry = createTemporaryRegistryDocument();
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onRegistryCreated(mockRegistry);
      
      toast({
        title: "Success",
        description: "Temporary token registry created for testing",
      });
    } catch (error) {
      console.error("Error in temporary token registry creation:", error);
      toast({
        title: "Error",
        description: "Failed to create temporary token registry",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Token Registry</h3>
          <p className="text-sm text-gray-500">
            Deploy a token registry contract (Temporary Simulation)
          </p>
        </div>
        <Button 
          onClick={handleDeploy}
          disabled={isDeploying}
        >
          {isDeploying ? "Creating..." : "Create Token Registry"}
        </Button>
      </div>
    </div>
  );
};