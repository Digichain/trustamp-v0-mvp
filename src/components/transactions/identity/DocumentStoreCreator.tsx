import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ethers } from "ethers";
import { DNSRecordDisplay } from "./DNSRecordDisplay";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Document Store ABI - includes all necessary functions
const DOCUMENT_STORE_ABI = [
  "constructor()",
  "function issue(bytes32 document)",
  "function bulkIssue(bytes32[] documents)",
  "function getIssuedBlock(bytes32 document) public view returns (uint256)",
  "function isIssued(bytes32 document) public view returns (bool)",
  "function revoke(bytes32 document)",
  "function bulkRevoke(bytes32[] documents)",
  "function isRevoked(bytes32 document) public view returns (bool)",
  "function isOwner(address addr) public view returns (bool)",
  "function transferOwnership(address newOwner)",
  "function renounceOwnership()",
  "function owner() public view returns (address)"
];

// Document Store Bytecode - from OpenAttestation's DocumentStore.json
const DOCUMENT_STORE_BYTECODE = "0x608060405234801561001057600080fd5b50600080546001600160a01b031916331790556000805460405173ffffffffffffffffffffffffffffffffffffffff90911691907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a3610502806100776000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c8063715018a61161005b578063715018a6146100fd5780638da5cb5b14610107578063e8a3d48514610132578063f2fde38b1461015257610088565b8063141a468c1461008d5780631e2c15cb146100a25780634294857f146100b75780636d47f0e9146100e8575b600080fd5b6100a061009b366004610407565b610165565b005b6100a06100b0366004610407565b6101e1565b6100d26100c5366004610407565b60016020526000908152604090205460ff1681565b60405190151581526020015b60405180910390f35b6100a06100f6366004610407565b61025d565b6100a06102d9565b60005473ffffffffffffffffffffffffffffffffffffffff165b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016100df565b6100d2610140366004610407565b60006020819052908152604090205460ff1681565b6100a0610160366004610430565b6102ed565b60005473ffffffffffffffffffffffffffffffffffffffff16331461018957600080fd5b6000908152600160205260409020805460ff19166001179055807f7cc135e0cebb02c3480ae5d74d377283180a2601f8f644edf7987b009316c63a60405160405180910390a250565b60005473ffffffffffffffffffffffffffffffffffffffff16331461020557600080fd5b6000908152600160205260409020805460ff19169055807f2dc3c6ae3097f9c33e7100bcd4fe1d2e9d85c06c90526f7d5ed906e1b26894ad60405160405180910390a250565b60005473ffffffffffffffffffffffffffffffffffffffff16331461028157600080fd5b6000908152602081905260409020805460ff19166001179055807f5a981129dd3a99e4080f7413f9a722cb25f6f1fef691d39ea8369f5726385f1460405160405180910390a250565b6102e16103a1565b6102eb6000610422565b565b6102f56103a1565b73ffffffffffffffffffffffffffffffffffffffff811661039e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f646472657373000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b610397816103a4565b50565b6102eb6103a1565b60005473ffffffffffffffffffffffffffffffffffffffff1633146103c857600080fd5b600080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff83169081179091556040519081527f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0906020015b60405180910390a150565b60006020828403121561041957600080fd5b5035919050565b60006020828403121561044257600080fd5b813573ffffffffffffffffffffffffffffffffffffffff8116811461046657600080fd5b939250505056fea26469706673582212207c5c5a8e6ef1f8c4b0b3f85c7a80e8a6c6c42ea4b3b93e5aaf4fb841201c529464736f6c63430008090033";

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
  const [manualAddress, setManualAddress] = useState("");
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

      console.log("Creating Document Store factory with ABI and bytecode");
      const documentStoreFactory = new ethers.ContractFactory(
        DOCUMENT_STORE_ABI,
        DOCUMENT_STORE_BYTECODE,
        signer
      );

      console.log("Deploying Document Store contract...");
      const documentStore = await documentStoreFactory.deploy();
      console.log("Document store deployment transaction sent:", documentStore.address);

      console.log("Waiting for deployment confirmation...");
      await documentStore.deployed();
      console.log("Document store deployed at:", documentStore.address);

      const storeInfo = {
        contractAddress: documentStore.address,
        network: network.name,
        dnsLocation: "tempdns.trustamp.in"
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
      if (!manualAddress) {
        throw new Error("Please enter a Document Store address");
      }

      if (!ethers.utils.isAddress(manualAddress)) {
        throw new Error("Invalid Ethereum address format");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();

      const storeInfo = {
        contractAddress: manualAddress,
        network: network.name,
        dnsLocation: "tempdns.trustamp.in"
      };

      setDocumentStore(storeInfo);
      onStoreCreated(storeInfo);

      toast({
        title: "Success",
        description: "Document Store address set successfully",
      });
    } catch (error: any) {
      console.error("Error setting document store address:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to set Document Store address",
        variant: "destructive",
      });
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
          
          <TabsContent value="deploy">
            <Button
              onClick={deployDocumentStore}
              disabled={isDeploying}
            >
              {isDeploying ? "Deploying..." : "Deploy Document Store"}
            </Button>
          </TabsContent>
          
          <TabsContent value="existing" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter Document Store address"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
              />
              <Button onClick={handleManualAddress}>
                Set Address
              </Button>
            </div>
          </TabsContent>
        </Tabs>

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