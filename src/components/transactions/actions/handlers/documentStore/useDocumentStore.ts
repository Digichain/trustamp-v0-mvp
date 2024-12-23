import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";

// Updated ABI to include both Access Control and Document Store functions
const DOCUMENT_STORE_ABI = [
  // Access Control Functions
  "function hasRole(bytes32 role, address account) public view returns (bool)",
  "function getRoleAdmin(bytes32 role) public view returns (bytes32)",
  "function grantRole(bytes32 role, address account)",
  "function revokeRole(bytes32 role, address account)",
  // Document Store Functions
  "function issue(bytes32 document)",
  "function isIssued(bytes32 document) public view returns (bool)",
  "function getIssuedBlock(bytes32 document) public view returns (uint256)",
  "function isIssuedBefore(bytes32 document, uint256 blockNumber) public view returns (bool)",
  "function revoke(bytes32 document)",
  "function isRevoked(bytes32 document) public view returns (bool)",
  "function isRevokedBefore(bytes32 document, uint256 blockNumber) public view returns (bool)",
  "function name() public view returns (string)",
  "function version() public view returns (string)",
  // Events
  "event DocumentIssued(bytes32 indexed document)",
  "event DocumentRevoked(bytes32 indexed document)"
];

// Role constants from the contract
const ISSUER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ISSUER_ROLE"));
const REVOKER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("REVOKER_ROLE"));

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

  const verifyDocumentStoreInterface = async (contract: ethers.Contract, signerAddress: string) => {
    console.log("Starting Document Store interface verification");
    try {
      // Check if the signer has the ISSUER_ROLE
      console.log("Checking ISSUER_ROLE for address:", signerAddress);
      const hasIssuerRole = await contract.hasRole(ISSUER_ROLE, signerAddress);
      console.log("Has ISSUER_ROLE:", hasIssuerRole);

      if (!hasIssuerRole) {
        throw new Error("Connected wallet does not have ISSUER_ROLE. Please ensure you have the correct permissions.");
      }

      // Verify basic functionality
      console.log("Checking contract metadata...");
      const name = await contract.name();
      const version = await contract.version();
      console.log("Contract name:", name);
      console.log("Contract version:", version);

      // Verify document management functions
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
        throw new Error("Contract exists but does not implement the Document Store interface correctly. Please verify the contract address and network.");
      }
      
      throw error;
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

      // Get signer address for role verification
      const signerAddress = await signer.getAddress();
      
      // Verify it's a Document Store contract and check roles
      await verifyDocumentStoreInterface(contract, signerAddress);
      
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
      
      // Check if document is already issued
      const isAlreadyIssued = await contract.isIssued(prefixedMerkleRoot);
      if (isAlreadyIssued) {
        throw new Error("Document has already been issued");
      }
      
      // Call issue function
      console.log("Calling issue function...");
      const tx = await contract.issue(prefixedMerkleRoot);
      console.log("Issue transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("Transaction confirmed in block:", receipt.blockNumber);
      
      // Verify document was issued
      const isIssued = await contract.isIssued(prefixedMerkleRoot);
      if (!isIssued) {
        throw new Error("Document issuance verification failed");
      }
      
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
      
      if (isIssued) {
        const issuedBlock = await contract.getIssuedBlock(prefixedMerkleRoot);
        console.log("Document was issued in block:", issuedBlock.toString());
      }
      
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