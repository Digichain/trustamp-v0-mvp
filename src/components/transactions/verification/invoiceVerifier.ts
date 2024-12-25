import { verify } from "@govtechsg/oa-verify";
import { DocumentVerifier, VerificationResult } from "./types";
import { processVerificationFragments } from "./types/verificationTypes";

export class InvoiceVerifier implements DocumentVerifier {
  async verify(document: any): Promise<VerificationResult> {
    try {
      console.log("Starting invoice verification for document:", document);
      
      const fragments = await verify(document);
      console.log("Verification fragments:", fragments);
      
      if (!Array.isArray(fragments)) {
        throw new Error("Invalid verification response");
      }

      const verificationDetails = processVerificationFragments(fragments);
      console.log("Processed verification details:", verificationDetails);

      return {
        isValid: verificationDetails.documentIntegrity.valid && 
                verificationDetails.issuanceStatus.valid &&
                verificationDetails.issuerIdentity.valid,
        details: verificationDetails
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