import { ethers } from "ethers";
import { DocumentStoreContract } from "./types";

export const useContractVerification = () => {
  const verifyContractCode = async (provider: ethers.providers.Provider, address: string) => {
    console.log("Verifying contract code at address:", address);
    const code = await provider.getCode(address);
    console.log("Contract code length:", code.length);
    
    if (code === "0x") {
      throw new Error("No contract code found at the provided address");
    }
    
    console.log("Contract code found at address");
    return true;
  };

  const verifyDocumentStoreInterface = async (
    contract: DocumentStoreContract,
    signerAddress: string
  ) => {
    console.log("Starting Document Store interface verification");
    
    try {
      // Check if the signer is the owner of the contract
      console.log("Checking ownership for address:", signerAddress);
      try {
        const owner = await contract.owner();
        console.log("Contract owner:", owner);
        console.log("Signer address:", signerAddress);

        if (owner.toLowerCase() !== signerAddress.toLowerCase()) {
          throw new Error(
            "Connected wallet is not the owner of the contract. Please ensure you have the correct permissions."
          );
        }
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