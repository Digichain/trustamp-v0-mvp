import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";

// Minimal ABI for role checking and basic operations
const TOKEN_REGISTRY_ABI = [
  "function mint(address beneficiary, uint256 tokenId) external",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function hasRole(bytes32 role, address account) external view returns (bool)",
  "function MINTER_ROLE() external view returns (bytes32)",
  "function DEFAULT_ADMIN_ROLE() external view returns (bytes32)",
  "function supportsInterface(bytes4 interfaceId) external view returns (bool)"
];

export const useTokenRegistryContract = () => {
  const { toast } = useToast();

  const initializeContract = async (address: string, signer: ethers.Signer) => {
    try {
      console.log("Initializing token registry contract at address:", address);
      
      const signerAddress = await signer.getAddress();
      console.log("Signer address:", signerAddress);

      // Create contract instance
      const tokenRegistry = new ethers.Contract(address, TOKEN_REGISTRY_ABI, signer);
      console.log("Contract instance created");

      // Check if contract supports ERC721 interface
      const ERC721_INTERFACE_ID = "0x80ac58cd";
      const supportsERC721 = await tokenRegistry.supportsInterface(ERC721_INTERFACE_ID);
      console.log("Supports ERC721:", supportsERC721);

      if (!supportsERC721) {
        throw new Error("Contract does not support ERC721 interface");
      }

      // Check roles
      const minterRole = await tokenRegistry.MINTER_ROLE();
      const hasMinterRole = await tokenRegistry.hasRole(minterRole, signerAddress);
      console.log("Has minter role:", hasMinterRole);

      if (!hasMinterRole) {
        const adminRole = await tokenRegistry.DEFAULT_ADMIN_ROLE();
        const hasAdminRole = await tokenRegistry.hasRole(adminRole, signerAddress);
        console.log("Has admin role:", hasAdminRole);

        if (!hasAdminRole) {
          throw new Error("Account does not have required permissions");
        }
      }

      return tokenRegistry;
    } catch (error: any) {
      console.error("Error initializing token registry:", error);
      let errorMessage = "Failed to initialize token registry";
      
      if (error.message.includes("does not support ERC721")) {
        errorMessage = "Invalid token registry contract";
      } else if (error.message.includes("required permissions")) {
        errorMessage = "Account does not have permission to mint tokens";
      }

      toast({
        title: "Contract Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    initializeContract,
  };
};