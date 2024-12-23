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
      // Check if the signer has the ISSUER_ROLE
      console.log("Checking ISSUER_ROLE for address:", signerAddress);
      const hasIssuerRole = await contract.hasRole(ISSUER_ROLE, signerAddress);
      console.log("Has ISSUER_ROLE:", hasIssuerRole);

      if (!hasIssuerRole) {
        throw new Error(
          "Connected wallet does not have ISSUER_ROLE. Please ensure you have the correct permissions."
        );
      }

      // Verify basic functionality
      console.log("Checking contract metadata...");
      const name = await contract.name();
      const version = await contract.version();
      console.log("Contract name:", name);
      console.log("Contract version:", version);

      // Verify document management functions
      console.log("Checking isIssued function...");
      const dummyDoc = ethers.utils.hexZeroPad("0x00", 32);
      await contract.isIssued(dummyDoc);

      console.log("Document Store interface verification successful");
      return true;
    } catch (error: any) {
      console.error("Interface verification error details:", {
        message: error.message,
        code: error.code,
        method: error.method,
      });

      if (error.code === "CALL_EXCEPTION") {
        throw new Error(
          "Contract exists but does not implement the Document Store interface correctly. Please verify the contract address and network."
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