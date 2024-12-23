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
      // First verify basic metadata functions
      console.log("Checking contract metadata...");
      
      // Try to get the contract name
      try {
        const name = await contract.name();
        console.log("Contract name successfully retrieved:", name);
      } catch (error: any) {
        console.error("Failed to call name() function:", error);
        if (error.code === 'CALL_EXCEPTION') {
          throw new Error(
            "The contract at this address does not implement the name() function. This suggests it's not a valid DocumentStore contract."
          );
        }
        throw error;
      }

      // Try to get the contract version
      try {
        const version = await contract.version();
        console.log("Contract version successfully retrieved:", version);
      } catch (error: any) {
        console.error("Failed to call version() function:", error);
        if (error.code === 'CALL_EXCEPTION') {
          throw new Error(
            "The contract at this address does not implement the version() function. This suggests it's not a valid DocumentStore contract."
          );
        }
        throw error;
      }

      // Then check if the signer has the ISSUER_ROLE
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
        if (error.code === 'CALL_EXCEPTION') {
          throw new Error(
            "The contract at this address does not implement the hasRole() function. This suggests it's not a valid DocumentStore contract."
          );
        }
        throw error;
      }

      // Verify document management functions exist by calling view functions
      console.log("Checking isIssued function...");
      try {
        const dummyDoc = ethers.utils.hexZeroPad("0x00", 32);
        await contract.isIssued(dummyDoc);
        console.log("isIssued function verified successfully");
      } catch (error: any) {
        console.error("Failed to call isIssued() function:", error);
        if (error.code === 'CALL_EXCEPTION') {
          throw new Error(
            "The contract at this address does not implement the isIssued() function. This suggests it's not a valid DocumentStore contract."
          );
        }
        throw error;
      }

      console.log("Document Store interface verification successful");
      return true;
    } catch (error: any) {
      console.error("Interface verification error details:", {
        message: error.message,
        code: error.code,
        method: error.method,
      });

      // Check for specific error types
      if (error.code === "CALL_EXCEPTION") {
        throw new Error(
          "Contract exists but does not implement the Document Store interface correctly. " +
          "Specific error: " + error.message
        );
      }

      throw error;
    }
  };

  return {
    verifyContractCode,
    verifyDocumentStoreInterface,
  };
};