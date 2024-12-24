import { ethers } from "ethers";
import { DOCUMENT_STORE_ABI } from "../../../actions/handlers/documentStore/contracts/DocumentStoreConstants";
import { VerificationStatus } from "../../types/verificationTypes";

export class DocumentStoreVerifier {
  static async verify(documentStoreAddress: string, merkleRoot: string): Promise<{
    status: VerificationStatus;
    message?: string;
    data?: any;
  }> {
    try {
      console.log("Verifying document store:", { documentStoreAddress, merkleRoot });
      
      if (!window.ethereum) {
        console.error("MetaMask not installed");
        return {
          status: VerificationStatus.ERROR,
          message: "MetaMask not installed"
        };
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Verify the contract exists
      const code = await provider.getCode(documentStoreAddress);
      if (code === "0x") {
        console.error("No contract found at address:", documentStoreAddress);
        return {
          status: VerificationStatus.INVALID,
          message: "Contract not found at the provided address"
        };
      }

      const contract = new ethers.Contract(documentStoreAddress, DOCUMENT_STORE_ABI, provider);

      // Ensure merkle root has 0x prefix
      const prefixedMerkleRoot = merkleRoot.startsWith('0x') ? merkleRoot : `0x${merkleRoot}`;
      console.log("Using prefixed merkle root for verification:", prefixedMerkleRoot);

      try {
        // Check if the document is issued
        const isIssued = await contract.isIssued(prefixedMerkleRoot);
        console.log("Document issuance status:", isIssued);
        
        // Check if the document is revoked
        const isRevoked = await contract.isRevoked(prefixedMerkleRoot);
        console.log("Document revocation status:", isRevoked);
        
        if (!isIssued) {
          return {
            status: VerificationStatus.INVALID,
            message: "Document not found in contract"
          };
        }

        if (isRevoked) {
          return {
            status: VerificationStatus.INVALID,
            message: "Document has been revoked"
          };
        }

        return {
          status: VerificationStatus.VALID,
          data: {
            issuedOnAll: true,
            revokedOnAny: false,
            details: {
              issuance: [{ issued: true, address: documentStoreAddress }],
              revocation: [{ revoked: false, address: documentStoreAddress }]
            }
          }
        };
      } catch (error) {
        console.error("Error checking document status:", error);
        return {
          status: VerificationStatus.ERROR,
          message: "Error checking document status in contract"
        };
      }
    } catch (error) {
      console.error("Document store verification error:", error);
      return {
        status: VerificationStatus.ERROR,
        message: "Document store verification failed"
      };
    }
  }
}