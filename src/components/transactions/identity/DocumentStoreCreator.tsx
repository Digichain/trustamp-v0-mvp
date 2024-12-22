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
const DOCUMENT_STORE_BYTECODE = "0x608060405234801561001057600080fd5b50600080546001600160a01b031916331790556107308061003256600035601e6000547c01000000000000000000000000000000000000000000000000000000009004906004016101c061012c565b608060405260043610610074576000357c010000000000000000000000000000000000000000000000000000000090048063141a468c146100795780631e2c15cb146100ac5780634294857f146100df5780634294857f146100df5780634294857f146100df575b600080fd5b34801561008557600080fd5b506100aa6004803603602081101561009c57600080fd5b50356001600160e01b0319166100f2565b005b3480156100b857600080fd5b506100aa600480360360208110156100cf57600080fd5b50356001600160e01b03191661015a565b3480156100eb57600080fd5b506100aa6101c2565b6000546001600160a01b0316331461010957600080fd5b6001600160e01b03191660009081526001602052604090205460ff161561012e57600080fd5b6001600160e01b03191660009081526001602052604090205460ff1615610157576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526022815260200180610700602291396042019250505060405180910390fd5b50565b6000546001600160a01b0316331461017157600080fd5b6001600160e01b03191660009081526001602052604090205460ff161561019657600080fd5b6001600160e01b03191660009081526001602052604090205460ff16156101bf576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526022815260200180610700602291396042019250505060405180910390fd5b50565b6000546001600160a01b031633146101d957600080fd5b60005460405160009283928392839283926001600160a01b0316916108fc841502918591818181858888f1935050505015801561021a573d6000803e3d6000fd5b505056fe4f776e61626c653a206e6577206f776e657220697320746865207a65726f2061646472657373a165627a7a72305820a6a4f6f4d74e44252c96e454f6d9b99c1f2738f9729f8e9a306039c0e8f185f50029";

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