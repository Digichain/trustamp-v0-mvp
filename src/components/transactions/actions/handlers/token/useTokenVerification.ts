import { Contract } from "ethers";
import { useToast } from "@/hooks/use-toast";

export const useTokenVerification = () => {
  const { toast } = useToast();

  const verifyTokenOwnership = async (
    tokenRegistry: Contract,
    tokenId: any,
    expectedOwner: string
  ) => {
    console.log("Verifying token ownership...");
    console.log("Token ID:", tokenId.toString());
    console.log("Expected owner:", expectedOwner);
    
    try {
      // First check if contract supports ERC721
      const ERC721_INTERFACE_ID = "0x80ac58cd";
      const supportsERC721 = await tokenRegistry.supportsInterface(ERC721_INTERFACE_ID);
      
      if (!supportsERC721) {
        throw new Error("Contract does not support ERC721 interface");
      }

      // Check token ownership
      try {
        const owner = await tokenRegistry.ownerOf(tokenId);
        console.log("Current owner:", owner);
        
        if (owner.toLowerCase() !== expectedOwner.toLowerCase()) {
          throw new Error("Token ownership verification failed");
        }
        
        console.log("Token ownership verified successfully");
        return true;
      } catch (error: any) {
        if (error.message.includes("nonexistent token")) {
          throw new Error("Token does not exist");
        }
        throw error;
      }
    } catch (error: any) {
      console.error("Error verifying token ownership:", error);
      
      let errorMessage = "Failed to verify token ownership";
      if (error.message.includes("nonexistent token")) {
        errorMessage = "Token does not exist";
      } else if (error.message.includes("does not support ERC721")) {
        errorMessage = "Invalid token registry contract";
      }

      toast({
        title: "Verification Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      throw error;
    }
  };

  return {
    verifyTokenOwnership,
  };
};