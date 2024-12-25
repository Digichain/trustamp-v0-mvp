import { verify, isValid } from "@govtechsg/oa-verify";
import { DocumentVerifier, VerificationResult } from "./types";
import { processVerificationFragments } from "./types/verificationTypes";
import { getVerificationConfig } from "@/utils/verification-config";

export class InvoiceVerifier implements DocumentVerifier {
  async verify(document: any): Promise<VerificationResult> {
    try {
      console.log("Starting invoice verification for document:", document);
      
      // Ensure verification config is set before verification
      console.log("Setting up verification configuration...");
      await getVerificationConfig();
      console.log("Verification configuration set successfully");
      
      console.log("Starting document verification process...");
      const fragments = await verify(document);
      console.log("Verification fragments:", fragments);
      
      if (!Array.isArray(fragments)) {
        console.error("Invalid verification response - not an array:", fragments);
        throw new Error("Invalid verification response");
      }

      const verificationDetails = processVerificationFragments(fragments);
      console.log("Processed verification details:", verificationDetails);

      // Add raw fragments to the verification details
      const detailsWithFragments = {
        ...verificationDetails,
        fragments
      };

      const isDocumentValid = isValid(fragments);
      console.log("Document validity:", isDocumentValid);

      return {
        isValid: isDocumentValid,
        details: detailsWithFragments
      };
    } catch (error) {
      console.error("Verification error:", error);
      return {
        isValid: false,
        error: error instanceof Error ? error.message : "Unknown verification error"
      };
    }
  }

  getTemplate(): string {
    return "INVOICE";
  }
}