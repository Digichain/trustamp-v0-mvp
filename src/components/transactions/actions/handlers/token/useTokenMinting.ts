import { Contract } from "ethers";
import { useToast } from "@/components/ui/use-toast";

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
      // Verify ERC721 support before proceeding
      const ERC721_INTERFACE_ID = "0x80ac58cd";
      const supportsERC721 = await tokenRegistry.supportsInterface(ERC721_INTERFACE_ID);
      
      if (!supportsERC721) {
        throw new Error("Contract does not support ERC721 interface");
      }

      // Check minter role
      const minterRole = await tokenRegistry.MINTER_ROLE();
      const signer = tokenRegistry.signer;
      const signerAddress = await signer.getAddress();
      const hasMinterRole = await tokenRegistry.hasRole(minterRole, signerAddress);

      if (!hasMinterRole) {
        throw new Error("MINTER_ROLE_REQUIRED");
      }

      // Estimate gas with a try/catch to get more specific error messages
      let gasEstimate;
      try {
        gasEstimate = await tokenRegistry.estimateGas.mint(beneficiary, tokenId);
        console.log("Estimated gas for minting:", gasEstimate.toString());
      } catch (error: any) {
        console.error("Gas estimation failed:", error);
        if (error.message.includes("execution reverted")) {
          throw new Error("MINT_FAILED");
        }
        throw error;
      }

      // Add 20% buffer to gas estimate
      const gasLimit = gasEstimate.mul(120).div(100);
      
      // Send transaction with explicit gas limit
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
      
      let errorMessage = "Failed to mint token";
      if (error.message === "MINTER_ROLE_REQUIRED") {
        errorMessage = "Account does not have permission to mint tokens";
      } else if (error.message === "MINT_FAILED") {
        errorMessage = "Token minting failed - the token may already exist";
      } else if (error.message.includes("gas required exceeds allowance")) {
        errorMessage = "Transaction requires more gas than available";
      } else if (error.message.includes("does not support ERC721")) {
        errorMessage = "Invalid token registry contract - ERC721 interface not supported";
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