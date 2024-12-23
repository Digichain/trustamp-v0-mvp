import { ethers } from "ethers";
import { DocumentStoreContract } from "./types";
import { ISSUER_ROLE } from "./constants";

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
      // Check if the signer has ISSUER_ROLE
      console.log("Checking ISSUER_ROLE for address:", signerAddress);
      try {
        const hasIssuerRole = await contract.hasRole(ISSUER_ROLE, signerAddress);
        console.log("Has ISSUER_ROLE:", hasIssuerRole);

        if (!hasIssuerRole) {
          throw new Error(
            "Connected wallet does not have ISSUER_ROLE. Please ensure you have the correct permissions."
          );
        }
      } catch (error: any) {
        console.error("Failed to check ISSUER_ROLE:", error);
        throw new Error(
          "Failed to verify issuer role. Please ensure the contract address is correct and you have the right permissions."
        );
      }

      // Verify isIssued function
      console.log("Checking isIssued function...");
      try {
        const dummyDoc = ethers.utils.hexZeroPad("0x00", 32);
        await contract.isIssued(dummyDoc);
        console.log("isIssued function verified successfully");
      } catch (error: any) {
        console.error("Failed to call isIssued() function:", error);
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