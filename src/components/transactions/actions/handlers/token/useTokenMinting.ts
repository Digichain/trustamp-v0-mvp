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
      // Call mint function directly on the contract instance
      const tx = await tokenRegistry.mint(beneficiary, tokenId);
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
      if (error.transaction) {
        console.error("Transaction details:", {
          from: error.transaction.from,
          to: error.transaction.to,
          data: error.transaction.data,
        });
      }
      throw error;
    }
  };

  return {
    mintToken,
  };
};