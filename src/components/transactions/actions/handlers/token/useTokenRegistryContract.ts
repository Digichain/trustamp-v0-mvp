import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";

// Import TradeTrust's token registry ABI
const TOKEN_REGISTRY_ABI = [
  "function mint(address beneficiary, uint256 tokenId) external",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function transferFrom(address from, address to, uint256 tokenId) external"
];

export const useTokenRegistryContract = () => {
  const { toast } = useToast();

  const initializeContract = async (address: string, signer: ethers.Signer) => {
    console.log("Initializing token registry contract at address:", address);
    
    try {
      // Verify we have a valid signer
      const signerAddress = await signer.getAddress();
      console.log("Initializing contract with signer address:", signerAddress);

      // Create contract instance with minimal ABI
      const tokenRegistry = new ethers.Contract(address, TOKEN_REGISTRY_ABI, signer);
      console.log("Successfully connected to token registry at:", address);

      return tokenRegistry;
    } catch (error) {
      console.error("Error initializing token registry:", error);
      toast({
        title: "Error",
        description: "Failed to initialize token registry contract",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    initializeContract,
  };
};