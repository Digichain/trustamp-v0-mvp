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

  const checkTokenExists = async (tokenRegistry: any, tokenId: ethers.BigNumber) => {
    console.log("Checking if token exists:", tokenId.toString());
    try {
      // Use balanceOf to check if any address owns this token
      const zeroAddress = "0x0000000000000000000000000000000000000000";
      const balance = await tokenRegistry["balanceOf(address)"](zeroAddress);
      const exists = !balance.isZero();
      console.log("Token exists:", exists);
      return exists;
    } catch (error) {
      console.error("Error checking token existence:", error);
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