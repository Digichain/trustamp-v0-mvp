import { TradeTrustErc721Factory } from "@govtechsg/token-registry/dist/contracts";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";

export const useTokenVerification = () => {
  const { toast } = useToast();

  const verifyTokenOwnership = async (
    tokenRegistry: TradeTrustErc721Factory,
    tokenId: ethers.BigNumber,
    expectedOwner: string
  ) => {
    console.log("Verifying token ownership...");
    console.log("Token ID:", tokenId.toString());
    console.log("Expected owner:", expectedOwner);
    
    try {
      const owner = await tokenRegistry.ownerOf(tokenId);
      
      if (owner.toLowerCase() !== expectedOwner.toLowerCase()) {
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