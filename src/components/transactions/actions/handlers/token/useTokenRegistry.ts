import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";

// TitleEscrow ABI - only including the methods we need
const TitleEscrowABI = [
  "function safeMint(address to, uint256 tokenId) public",
  "function exists(uint256 tokenId) public view returns (bool)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function approve(address to, uint256 tokenId) public",
  "function transferFrom(address from, address to, uint256 tokenId) public",
  "function safeTransferFrom(address from, address to, uint256 tokenId) public",
  "function owner() public view returns (address)",
  "function hasRole(bytes32 role, address account) public view returns (bool)"
];

export const useTokenRegistry = () => {
  const { toast } = useToast();

  const initializeContract = async (address: string, signer: ethers.Signer) => {
    console.log("Initializing token registry contract at address:", address);
    
    try {
      // First verify we have a valid signer
      const signerAddress = await signer.getAddress();
      console.log("Initializing contract with signer address:", signerAddress);

      // Create contract instance with the TitleEscrow ABI
      const contract = new ethers.Contract(address, TitleEscrowABI, signer);
      console.log("Successfully connected to token registry at:", address);

      // Verify the contract connection
      const code = await signer.provider?.getCode(address);
      if (!code || code === '0x') {
        throw new Error("No contract found at the specified address");
      }

      // Verify contract ownership/permissions
      const contractOwner = await contract.owner();
      console.log("Contract owner:", contractOwner);
      
      // Check if signer has minting role
      const MINTER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));
      const hasMintRole = await contract.hasRole(MINTER_ROLE, signerAddress);
      console.log("Signer has minting role:", hasMintRole);

      if (!hasMintRole && contractOwner.toLowerCase() !== signerAddress.toLowerCase()) {
        throw new Error("Signer does not have permission to mint tokens");
      }

      return contract;
    } catch (error) {
      console.error("Error initializing token registry:", error);
      throw error;
    }
  };

  const checkTokenExists = async (tokenRegistry: ethers.Contract, tokenId: ethers.BigNumber) => {
    console.log("Checking if token exists:", tokenId.toString());
    try {
      const exists = await tokenRegistry.exists(tokenId);
      console.log("Token exists:", exists);
      return exists;
    } catch (error) {
      console.error("Error checking token existence:", error);
      throw error;
    }
  };

  const mintToken = async (
    tokenRegistry: ethers.Contract,
    beneficiary: string,
    tokenId: ethers.BigNumber
  ) => {
    console.log("Starting mint process...");
    console.log("Beneficiary:", beneficiary);
    console.log("Token ID:", tokenId.toString());
    
    try {
      // Verify contract connection
      const signer = tokenRegistry.signer;
      const signerAddress = await signer.getAddress();
      console.log("Minting with signer address:", signerAddress);

      // Verify the signer has permission to mint
      const code = await signer.provider?.getCode(tokenRegistry.address);
      if (!code || code === '0x') {
        throw new Error("Invalid contract address");
      }

      // Verify minting permissions again before proceeding
      const MINTER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));
      const hasMintRole = await tokenRegistry.hasRole(MINTER_ROLE, signerAddress);
      const isOwner = (await tokenRegistry.owner()).toLowerCase() === signerAddress.toLowerCase();
      
      if (!hasMintRole && !isOwner) {
        throw new Error("Signer does not have permission to mint tokens");
      }

      // First check if token already exists
      const exists = await checkTokenExists(tokenRegistry, tokenId);
      if (exists) {
        throw new Error("Token already exists");
      }

      // Mint the token using safeMint
      console.log("Calling safeMint with parameters:", {
        to: beneficiary,
        tokenId: tokenId.toString(),
        gasLimit: 500000
      });

      const tx = await tokenRegistry.safeMint(beneficiary, tokenId, {
        gasLimit: 500000 // Add explicit gas limit
      });
      console.log("Mint transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("Mint transaction confirmed:", receipt);
      
      toast({
        title: "Success",
        description: "Token minted successfully",
      });
    } catch (error: any) {
      console.error("Error minting token:", error);
      // Log detailed error information
      if (error.transaction) {
        console.error("Transaction details:", {
          from: error.transaction.from,
          to: error.transaction.to,
          data: error.transaction.data,
        });
      }
      throw new Error(error.message || "Failed to mint token");
    }
  };

  const verifyTokenOwnership = async (
    tokenRegistry: ethers.Contract,
    tokenId: ethers.BigNumber,
    owner: string
  ) => {
    console.log("Verifying token ownership...");
    console.log("Token ID:", tokenId.toString());
    console.log("Expected owner:", owner);
    
    try {
      const currentOwner = await tokenRegistry.ownerOf(tokenId);
      console.log("Current owner:", currentOwner);
      
      if (currentOwner.toLowerCase() !== owner.toLowerCase()) {
        throw new Error("Token ownership verification failed");
      }
      
      console.log("Token ownership verified successfully");
    } catch (error) {
      console.error("Error verifying token ownership:", error);
      throw error;
    }
  };

  return {
    initializeContract,
    checkTokenExists,
    mintToken,
    verifyTokenOwnership,
  };
};