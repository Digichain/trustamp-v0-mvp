import { TitleEscrow } from "@govtechsg/token-registry/dist/contracts";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";

export const useTokenMinting = () => {
  const { toast } = useToast();

  const mintToken = async (
    tokenRegistry: TitleEscrow,
    beneficiary: string,
    tokenId: ethers.BigNumber
  ) => {
    console.log("Starting mint process...");
    console.log("Beneficiary:", beneficiary);
    console.log("Token ID:", tokenId.toString());
    
    try {
      // Use mint instead of safeMint as per OpenAttestation's TitleEscrow contract
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