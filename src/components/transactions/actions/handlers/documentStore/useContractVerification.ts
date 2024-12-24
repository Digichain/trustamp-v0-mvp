import { ethers } from "ethers";
import { DocumentStoreContract } from "./types";

export const useContractVerification = () => {
  const verifyContractCode = async (provider: ethers.providers.Provider, address: string) => {
    try {
      console.log("Attempting to connect to Sepolia network...");
      console.log("Provider network:", await provider.getNetwork());
      console.log("Verifying contract code at address:", address);
      
      const code = await provider.getCode(address);
      console.log("Contract code length:", code.length);
      console.log("First 64 chars of contract code:", code.substring(0, 64));
      
      if (code === "0x") {
        console.error("No contract code found at address:", address);
        throw new Error("No contract code found at the provided address");
      }
      
      console.log("Contract code successfully verified at address");
      return true;
    } catch (error) {
      console.error("Contract verification error:", error);
      throw error;
    }
  };

  const verifyDocumentStoreInterface = async (
    contract: DocumentStoreContract,
    signerAddress: string
  ) => {
    console.log("Starting Document Store interface verification");
    console.log("Contract address:", contract.address);
    console.log("Signer address:", signerAddress);
    
    try {
      // Check if the signer is the owner of the contract
      console.log("Checking ownership...");
      try {
        const owner = await contract.owner();
        console.log("Contract owner:", owner);
        console.log("Signer address:", signerAddress);

        if (owner.toLowerCase() !== signerAddress.toLowerCase()) {
          console.error("Ownership verification failed - addresses don't match");
          throw new Error(
            "Connected wallet is not the owner of the contract. Please ensure you have the correct permissions."
          );
        }
        console.log("Ownership verification successful");
      } catch (error: any) {
        console.error("Failed to check ownership:", error);
        throw new Error(
          "Failed to verify contract ownership. Please ensure the contract address is correct and you have the right permissions."
        );
      }

      // Verify isMerkleRootIssued function
      console.log("Checking isMerkleRootIssued function...");
      try {
        const dummyRoot = ethers.utils.hexZeroPad("0x00", 32);
        await contract.isMerkleRootIssued(dummyRoot);
        console.log("isMerkleRootIssued function verified successfully");
      } catch (error: any) {
        console.error("Failed to call isMerkleRootIssued() function:", error);
        throw new Error(
          "Failed to verify document store functions. Please ensure the contract address is correct."
        );
      }

      console.log("Document Store interface verification successful");
      return true;
    } catch (error: any) {
      console.error("Interface verification error details:", {
        message: error.message,
        code: error.code,
        method: error.method,
      });
      throw error;
    }
  };

  return {
    verifyContractCode,
    verifyDocumentStoreInterface,
  };
};