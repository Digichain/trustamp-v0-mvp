import { Contract } from "ethers";
import { useToast } from "@/hooks/use-toast";

export const useTokenMinting = () => {
  const { toast } = useToast();

  const mintToken = async (
    tokenRegistry: Contract,
    beneficiary: string,
    tokenId: any
  ) => {
    console.log("Starting mint process...");
    console.log("Beneficiary:", beneficiary);
    console.log("Token ID:", tokenId.toString());
    
    try {
      // Estimate gas first to check if transaction will fail
      const gasEstimate = await tokenRegistry.estimateGas.mint(beneficiary, tokenId);
      console.log("Estimated gas for minting:", gasEstimate.toString());

      // Add 20% buffer to gas estimate
      const gasLimit = gasEstimate.mul(120).div(100);
      
      // Call mint with explicit gas limit
      const tx = await tokenRegistry.mint(beneficiary, tokenId, {
        gasLimit: gasLimit
      });
      console.log("Mint transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("Mint transaction confirmed:", receipt);
      
      toast({
        title: "Success",
        description: "Token minted successfully",
      });

      return true;
    } catch (error: any) {
      console.error("Error minting token:", error);
      
      let errorMessage = "Failed to mint token. ";
      if (error.message.includes("execution reverted")) {
        errorMessage += "Transaction was reverted - check contract permissions.";
      } else if (error.message.includes("gas required exceeds allowance")) {
        errorMessage += "Insufficient gas provided.";
      } else {
        errorMessage += error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  return {
    mintToken,
  };
};