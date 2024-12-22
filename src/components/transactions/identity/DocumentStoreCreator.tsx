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
const DOCUMENT_STORE_BYTECODE = "0x608060405234801561001057600080fd5b50600080546001600160a01b031916331790556107308061003256600080fd5b50604051610730380380610730833981810160405281019061005191906100d9565b600080546001600160a01b031916331790558060405180608001604052806043815260200161068d60439139805190602001206000806101000a81548160ff021916908315150217905550506100ff565b6000602082840312156100eb57600080fd5b81516001600160a01b03811681146100ff57600080fd5b50919050565b61057f8061010e6000396000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c80638da5cb5b116100665780638da5cb5b1461012d578063b759f95414610148578063d79e3d3014610168578063e8a3d48514610188578063f2fde38b146101a857600080fd5b806313af4035146100a357806320c5429b146100b85780632f54bf6e146100cd5780637d3c01f4146100ed5780638129fc1c14610125575b600080fd5b6100b66100b1366004610447565b6101bb565b005b6100b66100c6366004610447565b610236565b6100dd6100db366004610447565b61029c565b60405190151581526020015b60405180910390f35b61011761010b366004610447565b60026020526000908152604090205481565b6040519081526020016100e4565b6100b66102c7565b60005460405173ffffffffffffffffffffffffffffffffffffffff90911681526020016100e4565b6100b6610156366004610447565b610347565b6100dd610176366004610447565b60006020819052908152604090205460ff1681565b6100dd610196366004610447565b60016020526000908152604090205460ff1681565b6100b66101b6366004610447565b6103ad565b60005473ffffffffffffffffffffffffffffffffffffffff1633146101e057600080fd5b600080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff83169081179091556040519081527f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0906020015b60405180910390a150565b60005473ffffffffffffffffffffffffffffffffffffffff16331461025b57600080fd5b6000908152602081905260409020805460ff19169055565b60005473ffffffffffffffffffffffffffffffffffffffff821603906102c157506001919050565b506000919050565b60005473ffffffffffffffffffffffffffffffffffffffff1633146102ec57600080fd5b60008054610309907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0610447565b60405180910390a2600080547fffffffffffffffffffffffff0000000000000000000000000000000000000000169055565b60005473ffffffffffffffffffffffffffffffffffffffff16331461036c57600080fd5b6000908152602081905260409020805460ff19166001179055565b60005473ffffffffffffffffffffffffffffffffffffffff1633146103d257600080fd5b73ffffffffffffffffffffffffffffffffffffffff8116610432576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4f776e61626c653a206e6f207a65726f206164647265737300000000000000006044820152606401610229565b61043b816101bb565b50565b60006020828403121561045957600080fd5b813573ffffffffffffffffffffffffffffffffffffffff8116811461047d57600080fd5b939250505056fea2646970667358221220d53ef3e86995499b3e44b7f0776a1b3b4dba7ae435b4024a6d31687e09d4075764736f6c63430008090033";

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