import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";

const TitleEscrowABI = [
  "function safeMint(address to, uint256 tokenId) public",
  "function exists(uint256 tokenId) public view returns (bool)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function approve(address to, uint256 tokenId) public",
  "function transferFrom(address from, address to, uint256 tokenId) public",
  "function safeTransferFrom(address from, address to, uint256 tokenId) public",
  "function hasRole(bytes32 role, address account) public view returns (bool)",
  "function MINTER_ROLE() public view returns (bytes32)",
  "function DEFAULT_ADMIN_ROLE() public view returns (bytes32)",
  "function grantRole(bytes32 role, address account) public",
  "function supportsInterface(bytes4 interfaceId) public view returns (bool)",
  "function getRoleAdmin(bytes32 role) public view returns (bytes32)"
];

export const useTokenRegistry = () => {
  const { toast } = useToast();

  const initializeContract = async (address: string, signer: ethers.Signer) => {
    console.log("Initializing token registry contract at address:", address);
    
    try {
      // First verify we have a valid signer
      const signerAddress = await signer.getAddress();
      console.log("Initializing contract with signer address:", signerAddress);

      // Create contract instance
      const contract = new ethers.Contract(address, TitleEscrowABI, signer);
      console.log("Successfully connected to token registry at:", address);

      // Verify the contract connection
      const code = await signer.provider?.getCode(address);
      if (!code || code === '0x') {
        throw new Error("No contract found at the specified address");
      }

      // Get roles directly from contract
      const MINTER_ROLE = await contract.MINTER_ROLE();
      const DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
      console.log("MINTER_ROLE hash:", MINTER_ROLE);
      console.log("DEFAULT_ADMIN_ROLE hash:", DEFAULT_ADMIN_ROLE);

      // Check roles
      const hasMintRole = await contract.hasRole(MINTER_ROLE, signerAddress);
      const hasAdminRole = await contract.hasRole(DEFAULT_ADMIN_ROLE, signerAddress);
      console.log("Signer has minting role:", hasMintRole);
      console.log("Signer has admin role:", hasAdminRole);

      if (!hasMintRole && !hasAdminRole) {
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
      const signer = tokenRegistry.signer;
      const signerAddress = await signer.getAddress();
      console.log("Minting with signer address:", signerAddress);

      // Verify contract connection
      const code = await signer.provider?.getCode(tokenRegistry.address);
      if (!code || code === '0x') {
        throw new Error("Invalid contract address");
      }

      // Get roles directly from contract
      const MINTER_ROLE = await tokenRegistry.MINTER_ROLE();
      const DEFAULT_ADMIN_ROLE = await tokenRegistry.DEFAULT_ADMIN_ROLE();
      console.log("MINTER_ROLE hash:", MINTER_ROLE);
      
      // Verify minting permissions
      const hasMintRole = await tokenRegistry.hasRole(MINTER_ROLE, signerAddress);
      const hasAdminRole = await tokenRegistry.hasRole(DEFAULT_ADMIN_ROLE, signerAddress);
      
      if (!hasMintRole && !hasAdminRole) {
        throw new Error("Signer does not have permission to mint tokens");
      }

      // Check if token already exists
      const exists = await checkTokenExists(tokenRegistry, tokenId);
      if (exists) {
        throw new Error("Token already exists");
      }

      // Mint the token
      console.log("Calling safeMint with parameters:", {
        to: beneficiary,
        tokenId: tokenId.toString(),
        gasLimit: 500000
      });

      const tx = await tokenRegistry.safeMint(beneficiary, tokenId, {
        gasLimit: 500000
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