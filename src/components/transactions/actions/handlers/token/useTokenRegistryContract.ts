import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";

// Extended ABI to include role checks and minting
const TOKEN_REGISTRY_ABI = [
  "function mint(address beneficiary, uint256 tokenId) external",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function transferFrom(address from, address to, uint256 tokenId) external",
  "function hasRole(bytes32 role, address account) external view returns (bool)",
  "function MINTER_ROLE() external view returns (bytes32)"
];

export const useTokenRegistryContract = () => {
  const { toast } = useToast();

  const initializeContract = async (address: string, signer: ethers.Signer) => {
    console.log("Initializing token registry contract at address:", address);
    
    try {
      const signerAddress = await signer.getAddress();
      console.log("Initializing contract with signer address:", signerAddress);

      const tokenRegistry = new ethers.Contract(address, TOKEN_REGISTRY_ABI, signer);
      console.log("Successfully connected to token registry at:", address);

      // Check if signer has minter role
      const minterRole = await tokenRegistry.MINTER_ROLE();
      const hasMinterRole = await tokenRegistry.hasRole(minterRole, signerAddress);
      
      if (!hasMinterRole) {
        console.error("Signer does not have minter role");
        throw new Error("Account does not have permission to mint tokens");
      }

      return tokenRegistry;
    } catch (error) {
      console.error("Error initializing token registry:", error);
      toast({
        title: "Error",
        description: "Failed to initialize token registry contract. Check permissions.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    initializeContract,
  };
};