import { ethers } from "ethers";
import { DOCUMENT_STORE_ABI } from "../../../actions/handlers/documentStore/contracts/DocumentStoreConstants";

export class DocumentStoreVerifier {
  static async verify(documentStoreAddress: string, merkleRoot: string): Promise<boolean> {
    try {
      console.log("Verifying document store:", { documentStoreAddress, merkleRoot });
      
      if (!window.ethereum) {
        console.error("MetaMask not installed");
        throw new Error("MetaMask not installed");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Verify the contract exists
      const code = await provider.getCode(documentStoreAddress);
      if (code === "0x") {
        console.error("No contract found at address:", documentStoreAddress);
        return false;
      }

      const contract = new ethers.Contract(documentStoreAddress, DOCUMENT_STORE_ABI, provider);

      // Ensure merkle root has 0x prefix
      const prefixedMerkleRoot = merkleRoot.startsWith('0x') ? merkleRoot : `0x${merkleRoot}`;
      console.log("Using prefixed merkle root for verification:", prefixedMerkleRoot);

      try {
        // Check if the document is issued
        const isIssued = await contract.isIssued(prefixedMerkleRoot);
        console.log("Document issuance status:", isIssued);
        
        if (!isIssued) {
          console.log("Document not found in contract");
          return false;
        }

        // Check if the document is revoked
        const isRevoked = await contract.isRevoked(prefixedMerkleRoot);
        console.log("Document revocation status:", isRevoked);
        
        // Document is valid if it's issued and not revoked
        return isIssued && !isRevoked;
      } catch (error) {
        console.error("Error checking document status:", error);
        return false;
      }
    } catch (error) {
      console.error("Document store verification error:", error);
      return false;
    }
  }
}