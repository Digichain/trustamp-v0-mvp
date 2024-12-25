import { verify, isValid } from "@govtechsg/oa-verify";
import { DocumentVerifier, VerificationResult } from "./types";
import { processVerificationFragments } from "./types/verificationTypes";
import { getVerificationConfig } from "@/utils/verification-config";

export class InvoiceVerifier implements DocumentVerifier {
  async verify(document: any): Promise<VerificationResult> {
    try {
      console.log("Starting invoice verification for document:", document);
      
      // Ensure verification config is set before verification
      await getVerificationConfig();
      
      const fragments = await verify(document);
      console.log("Verification fragments:", fragments);
      
      if (!Array.isArray(fragments)) {
        throw new Error("Invalid verification response");
      }

      const verificationDetails = processVerificationFragments(fragments);
      console.log("Processed verification details:", verificationDetails);

      // Add raw fragments to the verification details
      const detailsWithFragments = {
        ...verificationDetails,
        fragments
      };

      return {
        isValid: isValid(fragments),
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