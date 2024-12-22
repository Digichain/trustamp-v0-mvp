import { TitleEscrow } from "@govtechsg/token-registry/dist/contracts";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";

export const useTokenVerification = () => {
  const { toast } = useToast();

  const verifyTokenOwnership = async (
    tokenRegistry: TitleEscrow,
    tokenId: ethers.BigNumber,
    expectedOwner: string
  ) => {
    console.log("Verifying token ownership...");
    console.log("Token ID:", tokenId.toString());
    console.log("Expected owner:", expectedOwner);
    
    try {
      const currentOwner = await tokenRegistry.ownerOf(tokenId);
      console.log("Current owner:", currentOwner);
      
      if (currentOwner.toLowerCase() !== expectedOwner.toLowerCase()) {
        throw new Error("Token ownership verification failed");
      }
      
      console.log("Token ownership verified successfully");
      return true;
    } catch (error) {
      console.error("Error verifying token ownership:", error);
      throw error;
    }
  };

  return {
    verifyTokenOwnership,
  };
};