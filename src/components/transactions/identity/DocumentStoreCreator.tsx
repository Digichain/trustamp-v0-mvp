import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ethers } from "ethers";
import { DNSRecordDisplay } from "./DNSRecordDisplay";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { DOCUMENT_STORE_ABI, DOCUMENT_STORE_BYTECODE } from "../actions/handlers/documentStore/contracts/DocumentStoreConstants";

export interface DocumentStoreInfo {
  contractAddress: string;
  network: string;
  dnsLocation: string;
  name?: string;
}

interface DocumentStoreCreatorProps {
  onStoreCreated: (info: DocumentStoreInfo) => void;
}

export const DocumentStoreCreator = ({ onStoreCreated }: DocumentStoreCreatorProps) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [documentStore, setDocumentStore] = useState<DocumentStoreInfo | null>(null);
  const [manualAddress, setManualAddress] = useState("");
  const [storeName, setStoreName] = useState("");
  const { toast } = useToast();

  const deployDocumentStore = async () => {
    if (!storeName) {
      toast({
        title: "Name Required",
        description: "Please enter a name for the Document Store",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDeploying(true);
      console.log("Starting document store deployment with name:", storeName);

      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      const signerAddress = await signer.getAddress();

      console.log("Creating Document Store factory with name:", storeName);
      const documentStoreFactory = new ethers.ContractFactory(
        DOCUMENT_STORE_ABI,
        DOCUMENT_STORE_BYTECODE,
        signer
      );

      console.log("Deploying Document Store contract...");
      const documentStore = await documentStoreFactory.deploy(storeName, signerAddress, {
        gasLimit: 5000000
      });
      
      console.log("Waiting for deployment confirmation...");
      await documentStore.deployed();
      console.log("Document store deployed at:", documentStore.address);

      const storeInfo = {
        contractAddress: documentStore.address,
        network: network.name,
        dnsLocation: "tempdns.trustamp.in",
        name: storeName
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

  const handleManualAddress = async () => {
    try {
      setIsLoading(true);
      if (!manualAddress) {
        throw new Error("Please enter a Document Store address");
      }

      if (!ethers.utils.isAddress(manualAddress)) {
        throw new Error("Invalid Ethereum address format");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();

      // Initialize contract to get name
      const contract = new ethers.Contract(manualAddress, DOCUMENT_STORE_ABI, provider);
      const storeName = await contract.name();
      console.log("Retrieved document store name:", storeName);

      const storeInfo = {
        contractAddress: manualAddress,
        network: network.name,
        dnsLocation: "tempdns.trustamp.in",
        name: storeName
      };

      setDocumentStore(storeInfo);
      onStoreCreated(storeInfo);

      toast({
        title: "Success",
        description: "Document Store connected successfully",
      });
    } catch (error: any) {
      console.error("Error connecting to document store:", error);
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect to Document Store",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Store</CardTitle>
        <CardDescription>
          Deploy a new Document Store contract or use an existing one
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="deploy">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deploy">Deploy New</TabsTrigger>
            <TabsTrigger value="existing">Use Existing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deploy" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Document Store Name</Label>
              <Input
                id="storeName"
                placeholder="Enter Document Store name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
            </div>
            <Button
              onClick={deployDocumentStore}
              disabled={isDeploying || !storeName}
              className="w-full"
            >
              {isDeploying ? "Deploying..." : "Deploy Document Store"}
            </Button>
          </TabsContent>
          
          <TabsContent value="existing" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="existingAddress">Document Store Address</Label>
              <div className="flex gap-2">
                <Input
                  id="existingAddress"
                  placeholder="Enter Document Store address"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                />
                <Button onClick={handleManualAddress} disabled={isLoading}>
                  Connect
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {documentStore && (
          <div className="space-y-4 pt-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="font-medium mb-2">Document Store Details</h3>
              {documentStore.name && (
                <p className="text-sm text-gray-600 mb-2">
                  Name: {documentStore.name}
                </p>
              )}
              <p className="text-sm text-gray-600 mb-2">
                Address: {documentStore.contractAddress}
              </p>
              <p className="text-sm text-gray-600">
                Network: {documentStore.network}
              </p>
            </div>
            <DNSRecordDisplay
              dnsLocation={documentStore.dnsLocation}
              contractAddress={documentStore.contractAddress}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};