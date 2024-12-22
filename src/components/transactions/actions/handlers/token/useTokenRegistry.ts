import { ethers } from "ethers";
import { useTokenRegistryContract } from "./useTokenRegistryContract";
import { useTokenMinting } from "./useTokenMinting";
import { useTokenVerification } from "./useTokenVerification";
import { useToast } from "@/components/ui/use-toast";

export const useTokenRegistry = () => {
  const { toast } = useToast();
  const { initializeContract } = useTokenRegistryContract();
  const { mintToken } = useTokenMinting();
  const { verifyTokenOwnership } = useTokenVerification();

  const checkTokenExists = async (tokenRegistry: ethers.Contract, tokenId: ethers.BigNumber) => {
    console.log("Checking if token exists:", tokenId.toString());
    try {
      try {
        const owner = await tokenRegistry.ownerOf(tokenId);
        console.log("Token exists with owner:", owner);
        return true;
      } catch (error: any) {
        if (error.message.includes("nonexistent token")) {
          console.log("Token does not exist");
          return false;
        }
        throw error;
      }
    } catch (error) {
      console.error("Error checking token existence:", error);
      toast({
        title: "Error",
        description: "Failed to check token existence",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    initializeContract,
    checkTokenExists,
    mintToken,
    verifyTokenOwnership,
  };
};