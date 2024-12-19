import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ethers } from "ethers";
import TokenRegistryArtifact from "@/contracts/TokenRegistry";
import { TokenRegistryDocument } from "./types";
import { useWallet } from "@/contexts/WalletContext";

interface TokenRegistryCreatorProps {
  onRegistryCreated: (document: TokenRegistryDocument) => void;
}

export const TokenRegistryCreator = ({ onRegistryCreated }: TokenRegistryCreatorProps) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const { toast } = useToast();
  const { walletAddress } = useWallet();

  const handleDeploy = async () => {
    try {
      setIsDeploying(true);
      console.log("Starting token registry deployment");
      
      const { ethereum } = window as any;
      if (!ethereum) {
        throw new Error('MetaMask not found');
      }
      
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      console.log("Got signer from provider");

      // Create contract factory with the compiled contract
      const factory = new ethers.ContractFactory(
        TokenRegistryArtifact.abi,
        TokenRegistryArtifact.bytecode,
        signer
      );
      console.log("Created contract factory");

      // Deploy contract
      console.log("Deploying TokenRegistry...");
      const tokenRegistry = await factory.deploy(
        walletAddress,
        "TrustampRegistry",
        "TRUST"
      );
      console.log("Contract deployment transaction sent, waiting for confirmation...");
      
      // Wait for deployment confirmation
      const deployedContract = await tokenRegistry.deployed();
      console.log("TokenRegistry deployed at:", deployedContract.address);

      const registryDocument: TokenRegistryDocument = {
        contractAddress: deployedContract.address,
        network: "sepolia",
        tokenName: "TrustampRegistry",
        tokenSymbol: "TRUST",
        ethereumAddress: walletAddress || ""
      };

      onRegistryCreated(registryDocument);
      
      toast({
        title: "Success",
        description: "Token Registry deployed successfully",
      });
    } catch (error: any) {
      console.error("Error in token registry deployment:", error);
      toast({
        title: "Error",
        description: "Failed to deploy token registry",
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
            Deploy a token registry contract for transferable documents
          </p>
        </div>
        <Button 
          onClick={handleDeploy}
          disabled={isDeploying}
        >
          {isDeploying ? "Deploying..." : "Deploy Token Registry"}
        </Button>
      </div>
    </div>
  );
};