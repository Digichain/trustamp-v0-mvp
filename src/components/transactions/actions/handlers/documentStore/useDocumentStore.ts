import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";

// Document Store ABI with required functions
const DOCUMENT_STORE_ABI = [
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

export const useDocumentStore = () => {
  const { toast } = useToast();

  const extractAddress = (rawAddress: string): string => {
    console.log("Extracting address from:", rawAddress);
    if (rawAddress.includes(':')) {
      const matches = rawAddress.match(/:string:(.+)$/);
      if (matches && matches[1]) {
        console.log("Extracted address:", matches[1]);
        return matches[1];
      }
      throw new Error("Invalid address format in document");
    }
    return rawAddress;
  };

  const verifyContractCode = async (provider: ethers.providers.Provider, address: string) => {
    console.log("Verifying contract code at address:", address);
    const code = await provider.getCode(address);
    console.log("Contract code length:", code.length);
    if (code === "0x") {
      throw new Error("No contract code found at the provided address");
    }
    console.log("Contract code found at address");
    return true;
  };

  const verifyDocumentStoreInterface = async (contract: ethers.Contract) => {
    console.log("Starting Document Store interface verification");
    try {
      // First check if we can get the owner - this is a basic check
      console.log("Checking owner function...");
      const owner = await contract.owner();
      console.log("Contract owner address:", owner);

      // Try to check if a dummy document is issued - this verifies the isIssued function
      console.log("Checking isIssued function...");
      const dummyDoc = ethers.utils.hexZeroPad("0x00", 32);
      await contract.isIssued(dummyDoc);
      
      console.log("Document Store interface verification successful");
      return true;
    } catch (error: any) {
      console.error("Interface verification error details:", {
        message: error.message,
        code: error.code,
        method: error.method,
      });
      
      if (error.code === 'CALL_EXCEPTION') {
        throw new Error("Contract exists but does not implement the Document Store interface. Please verify the contract address and network.");
      }
      
      throw new Error(`Contract verification failed: ${error.message}`);
    }
  };

  const initializeContract = async (address: string, signer: ethers.Signer) => {
    try {
      console.log("Initializing Document Store contract with address:", address);
      
      // Extract and normalize the Ethereum address
      const cleanAddress = extractAddress(address);
      console.log("Extracted clean address:", cleanAddress);
      
      const normalizedAddress = ethers.utils.getAddress(cleanAddress);
      console.log("Normalized address:", normalizedAddress);
      
      // Create provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Get the network for logging purposes
      const network = await provider.getNetwork();
      console.log("Connected to network:", network.name, "chainId:", network.chainId);
      
      // Verify contract exists at address
      await verifyContractCode(provider, normalizedAddress);
      
      // Create contract instance
      console.log("Creating contract instance with ABI:", DOCUMENT_STORE_ABI);
      const contract = new ethers.Contract(
        normalizedAddress,
        DOCUMENT_STORE_ABI,
        signer
      );
      
      // Verify it's a Document Store contract
      await verifyDocumentStoreInterface(contract);
      
      console.log("Document store contract initialized successfully");
      return contract;
    } catch (error: any) {
      console.error("Error initializing document store:", error);
      toast({
        title: "Contract Error",
        description: error.message || "Failed to initialize document store contract",
        variant: "destructive",
      });
      throw error;
    }
  };

  const issueDocument = async (contract: ethers.Contract, merkleRoot: string) => {
    try {
      console.log("Issuing document with merkle root:", merkleRoot);
      
      // Ensure merkleRoot has 0x prefix
      const prefixedMerkleRoot = merkleRoot.startsWith('0x') ? merkleRoot : `0x${merkleRoot}`;
      console.log("Prefixed merkle root:", prefixedMerkleRoot);
      
      // Call issue function
      console.log("Calling issue function...");
      const tx = await contract.issue(prefixedMerkleRoot);
      console.log("Issue transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("Transaction confirmed in block:", receipt.blockNumber);
      
      return tx.hash;
    } catch (error: any) {
      console.error("Error issuing document:", error);
      
      if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        throw new Error("Failed to estimate gas. The contract might not be callable or you might not have the right permissions.");
      }
      
      if (error.code === 'INSUFFICIENT_FUNDS') {
        throw new Error("Insufficient funds to execute the transaction. Please ensure you have enough ETH.");
      }
      
      toast({
        title: "Issue Error",
        description: error.message || "Failed to issue document",
        variant: "destructive",
      });
      throw error;
    }
  };

  const verifyIssuance = async (contract: ethers.Contract, merkleRoot: string) => {
    try {
      console.log("Verifying document issuance for merkle root:", merkleRoot);
      
      // Ensure merkleRoot has 0x prefix
      const prefixedMerkleRoot = merkleRoot.startsWith('0x') ? merkleRoot : `0x${merkleRoot}`;
      
      const isIssued = await contract.isIssued(prefixedMerkleRoot);
      console.log("Document issuance status:", isIssued);
      
      return isIssued;
    } catch (error: any) {
      console.error("Error verifying document issuance:", error);
      throw error;
    }
  };

  return {
    initializeContract,
    issueDocument,
    verifyIssuance
  };
};