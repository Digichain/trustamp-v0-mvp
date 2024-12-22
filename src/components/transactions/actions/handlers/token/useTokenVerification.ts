import { TitleEscrow } from "@govtechsg/token-registry/dist/contracts";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";

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
      // Use the correct methods from TitleEscrow contract with explicit function signatures
      const balance = await tokenRegistry["balanceOf(address)"](expectedOwner);
      const approved = await tokenRegistry["getApproved(uint256)"](tokenId);
      
      if (balance.isZero() || approved.toLowerCase() !== expectedOwner.toLowerCase()) {
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