import { ethers } from "ethers";
import { TradeTrustERC721Factory } from "@govtechsg/token-registry";
import { useToast } from "@/components/ui/use-toast";

export const useTokenRegistry = () => {
  const { toast } = useToast();

  const initializeContract = async (address: string, signer: ethers.Signer) => {
    console.log("Initializing token registry contract at address:", address);
    
    try {
      // Use TradeTrust's factory to connect to the registry
      const connectedRegistry = await TradeTrustERC721Factory.connect(address, signer);
      console.log("Successfully connected to token registry");
      return connectedRegistry;
    } catch (error) {
      console.error("Error initializing token registry:", error);
      throw error;
    }
  };

  const checkTokenExists = async (tokenRegistry: ethers.Contract, tokenId: ethers.BigNumber) => {
    console.log("Checking if token exists:", tokenId.toString());
    try {
      const exists = await tokenRegistry.exists(tokenId);
      console.log("Token exists:", exists);
      return exists;
    } catch (error) {
      console.error("Error checking token existence:", error);
      throw error;
    }
  };

  const mintToken = async (
    tokenRegistry: ethers.Contract,
    beneficiary: string,
    tokenId: ethers.BigNumber
  ) => {
    console.log("Minting token...");
    console.log("Beneficiary:", beneficiary);
    console.log("Token ID:", tokenId.toString());
    
    try {
      const tx = await tokenRegistry.mint(beneficiary, tokenId);
      console.log("Mint transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("Mint transaction confirmed:", receipt);
      
      toast({
        title: "Success",
        description: "Token minted successfully",
      });
    } catch (error: any) {
      console.error("Error minting token:", error);
      throw new Error(error.message || "Failed to mint token");
    }
  };

  const verifyTokenOwnership = async (
    tokenRegistry: ethers.Contract,
    tokenId: ethers.BigNumber,
    owner: string
  ) => {
    console.log("Verifying token ownership...");
    console.log("Token ID:", tokenId.toString());
    console.log("Expected owner:", owner);
    
    try {
      const currentOwner = await tokenRegistry.ownerOf(tokenId);
      console.log("Current owner:", currentOwner);
      
      if (currentOwner.toLowerCase() !== owner.toLowerCase()) {
        throw new Error("Token ownership verification failed");
      }
      
      console.log("Token ownership verified successfully");
    } catch (error) {
      console.error("Error verifying token ownership:", error);
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