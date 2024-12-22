import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";

// TradeTrust Token Registry ABI with required functions
const TOKEN_REGISTRY_ABI = [
  // ERC165 interface detection
  "function supportsInterface(bytes4 interfaceId) external view returns (bool)",
  // ERC721 interface functions
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function balanceOf(address owner) external view returns (uint256)",
  // Token Registry specific functions
  "function mint(address beneficiary, uint256 tokenId) external",
  "function hasRole(bytes32 role, address account) external view returns (bool)",
  "function MINTER_ROLE() external view returns (bytes32)",
  "function DEFAULT_ADMIN_ROLE() external view returns (bytes32)",
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

      // Check ERC165 interface support first
      const ERC165_INTERFACE_ID = "0x01ffc9a7";
      console.log("Checking ERC165 interface support...");
      
      try {
        const supportsERC165 = await tokenRegistry.supportsInterface(ERC165_INTERFACE_ID);
        console.log("ERC165 interface support check result:", supportsERC165);
        
        if (!supportsERC165) {
          throw new Error("Contract does not support ERC165 interface");
        }
      } catch (error: any) {
        console.error("Error checking ERC165 interface:", error);
        throw new Error("Failed to verify ERC165 interface support");
      }

      // Check ERC721 interface support
      const ERC721_INTERFACE_ID = "0x80ac58cd";
      console.log("Checking ERC721 interface support...");
      
      try {
        const supportsERC721 = await tokenRegistry.supportsInterface(ERC721_INTERFACE_ID);
        console.log("ERC721 interface support check result:", supportsERC721);
        
        if (!supportsERC721) {
          throw new Error("Contract does not support ERC721 interface");
        }
      } catch (error: any) {
        console.error("Error checking ERC721 interface:", error);
        throw new Error("Failed to verify ERC721 interface support");
      }

      // Check roles
      try {
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
      } catch (error: any) {
        console.error("Error checking roles:", error);
        throw new Error("Failed to verify contract permissions");
      }

      return tokenRegistry;
    } catch (error: any) {
      console.error("Error initializing token registry:", error);
      let errorMessage = "Failed to initialize token registry";
      
      if (error.message.includes("does not support ERC165")) {
        errorMessage = "Invalid token registry contract - ERC165 interface not supported";
      } else if (error.message.includes("does not support ERC721")) {
        errorMessage = "Invalid token registry contract - ERC721 interface not supported";
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