import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";

// TitleEscrow ABI - only including the methods we need
const TitleEscrowABI = [
  "function transferTo(address newBeneficiary, address newHolder)",
  "function mint(address beneficiary, uint256 tokenId)",
  "function exists(uint256 tokenId) view returns (bool)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function connect(address account) returns (Contract)",
  "function approve(address to, uint256 tokenId)",
  "function transferFrom(address from, address to, uint256 tokenId)"
];

export const useTokenRegistry = () => {
  const { toast } = useToast();

  const initializeContract = async (address: string, signer: ethers.Signer) => {
    console.log("Initializing token registry contract at address:", address);
    
    try {
      // Create contract instance with the TitleEscrow ABI
      const contract = new ethers.Contract(address, TitleEscrowABI, signer);
      console.log("Successfully connected to token registry");
      return contract;
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