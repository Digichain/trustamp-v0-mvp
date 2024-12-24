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

      // Verify the contract exists and has the correct interface
      const code = await provider.getCode(documentStoreAddress);
      if (code === "0x") {
        throw new Error("No contract found at the provided address");
      }

      // Check if the document is issued
      const isIssued = await contract.isIssued(merkleRoot);
      console.log("Document issuance status:", isIssued);
      
      return isIssued;
    } catch (error) {
      console.error("Document store verification error:", error);
      return false;
    }
  }
}