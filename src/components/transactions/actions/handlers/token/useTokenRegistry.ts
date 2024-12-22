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
      // Use ownerOf to check if token exists - if it throws, token doesn't exist
      try {
        const owner = await tokenRegistry["ownerOf(uint256)"](tokenId);
        console.log("Token exists with owner:", owner);
        return true;
      } catch (error) {
        // If ownerOf throws, token doesn't exist
        console.log("Token does not exist");
        return false;
      }
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