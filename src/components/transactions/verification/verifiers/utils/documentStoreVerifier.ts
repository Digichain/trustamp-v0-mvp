import { ethers } from "ethers";
import { DOCUMENT_STORE_ABI } from "../../../actions/handlers/documentStore/contracts/DocumentStoreConstants";

export class DocumentStoreVerifier {
  static async verify(documentStoreAddress: string, merkleRoot: string): Promise<boolean> {
    try {
      console.log("Verifying document store:", { documentStoreAddress, merkleRoot });
      
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(documentStoreAddress, DOCUMENT_STORE_ABI, provider);

      // Verify the contract exists
      const code = await provider.getCode(documentStoreAddress);
      if (code === "0x") {
        console.error("No contract found at address:", documentStoreAddress);
        return false;
      }

      // Ensure merkle root has 0x prefix and is properly formatted
      const prefixedMerkleRoot = merkleRoot.startsWith('0x') ? merkleRoot : `0x${merkleRoot}`;
      console.log("Using prefixed merkle root for verification:", prefixedMerkleRoot);

      try {
        // Check if the document is issued
        const isIssued = await contract.isIssued(prefixedMerkleRoot);
        console.log("Document issuance status from contract:", isIssued);
        return isIssued;
      } catch (error) {
        console.error("Error checking document issuance:", error);
        return false;
      }
    } catch (error) {
      console.error("Document store verification error:", error);
      return false;
    }
  }
}