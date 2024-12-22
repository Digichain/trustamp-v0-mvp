import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ethers } from "ethers";
import { DNSRecordDisplay } from "./DNSRecordDisplay";

export interface DocumentStoreInfo {
  contractAddress: string;
  network: string;
  dnsLocation: string;
}

interface DocumentStoreCreatorProps {
  onStoreCreated: (info: DocumentStoreInfo) => void;
}

export const DocumentStoreCreator = ({ onStoreCreated }: DocumentStoreCreatorProps) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [documentStore, setDocumentStore] = useState<DocumentStoreInfo | null>(null);
  const { toast } = useToast();

  const deployDocumentStore = async () => {
    try {
      setIsDeploying(true);
      console.log("Starting document store deployment");

      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const network = await provider.getNetwork();

      // Document Store Contract Bytecode and ABI
      const documentStoreFactory = new ethers.ContractFactory(
        ["function issue(bytes32 document) public"], // Basic ABI for demonstration
        "0x608060405234801561001057600080fd5b50610..." // Contract bytecode would go here
        signer
      );

      const documentStore = await documentStoreFactory.deploy();
      console.log("Document store deployment transaction sent");

      await documentStore.deployed();
      console.log("Document store deployed at:", documentStore.address);

      const storeInfo = {
        contractAddress: documentStore.address,
        network: network.name,
        dnsLocation: "broad-tomato-ferret.sandbox.openattestation.com" // This would typically be configurable
      };

      setDocumentStore(storeInfo);
      onStoreCreated(storeInfo);

      toast({
        title: "Success",
        description: "Document Store deployed successfully",
      });
    } catch (error: any) {
      console.error("Error deploying document store:", error);
      toast({
        title: "Deployment Error",
        description: error.message || "Failed to deploy Document Store",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Store</CardTitle>
        <CardDescription>
          Deploy a new Document Store contract to issue and verify documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={deployDocumentStore}
          disabled={isDeploying}
        >
          {isDeploying ? "Deploying..." : "Deploy Document Store"}
        </Button>

        {documentStore && (
          <DNSRecordDisplay
            dnsLocation={documentStore.dnsLocation}
            contractAddress={documentStore.contractAddress}
          />
        )}
      </CardContent>
    </Card>
  );
};