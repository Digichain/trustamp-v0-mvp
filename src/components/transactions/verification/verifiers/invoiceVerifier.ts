import { verify, isValid, VerificationFragment } from "@govtechsg/oa-verify";
import { DocumentVerifier, VerificationResult } from "../types";
import { ExtendedVerificationFragment } from "../types/verificationTypes";
import { 
  getDocumentIdentifier, 
  getIdentityProofDetails 
} from "../utils/documentIdentifier";
import { 
  processVerificationFragments, 
  logVerificationDetails 
} from "../utils/verificationFragments";

export class InvoiceVerifier implements DocumentVerifier {
  async verify(document: any): Promise<VerificationResult> {
    try {
      console.log("Starting document verification process with document:", document);
      
      // Extract the data from wrapped document if it exists
      const documentData = document.data || document;
      console.log("Document data for verification:", documentData);

      // Get document identifier and identity proof details
      const identifier = getDocumentIdentifier(documentData);
      const identityProof = getIdentityProofDetails(documentData);
      
      console.log("Starting OpenAttestation verification...");
      const fragments = await verify(documentData) as VerificationFragment[];
      console.log("Raw verification fragments received:", fragments);
      
      if (!Array.isArray(fragments)) {
        throw new Error("Invalid verification response");
      }

      // Log verification details for each fragment
      fragments.forEach((fragment, index) => {
        console.log(`Fragment ${index + 1} (${fragment.name}):`, {
          name: fragment.name,
          type: fragment.type,
          status: fragment.status,
          data: (fragment as ExtendedVerificationFragment).data,
          reason: (fragment as ExtendedVerificationFragment).reason
        });

        logVerificationDetails(fragment, identifier);
      });

      const documentIsValid = isValid(fragments);
      console.log("Overall document validity:", documentIsValid);

      const verificationDetails = processVerificationFragments(fragments);
      console.log("Processed verification details:", verificationDetails);

      return {
        isValid: documentIsValid,
        details: verificationDetails
      };
    } catch (error) {
      console.error("Verification error:", error);
      return this.createErrorResponse(error instanceof Error ? error.message : "Unknown verification error");
    }
  }

  getTemplate(): string {
    return "ANY";
  }

  private createErrorResponse(message: string): VerificationResult {
    return {
      isValid: false,
      details: {
        issuanceStatus: {
          valid: false,
          message: message
        },
        issuerIdentity: {
          valid: false,
          message: "Verification failed"
        },
        documentIntegrity: {
          valid: false,
          message: "Unable to verify document integrity"
        }
      }
    };
  }
}