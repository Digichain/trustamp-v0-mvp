import { verify, isValid } from "@govtechsg/oa-verify";
import { DocumentVerifier, VerificationResult } from "../types";
import { getDocumentIdentifier } from "./utils/documentIdentifier";
import { DNSTextVerifier } from "./utils/dnsTextVerifier";
import { DocumentStoreVerifier } from "./utils/documentStoreVerifier";
import { processVerificationFragments } from "./utils/verificationFragments";

export class InvoiceVerifier implements DocumentVerifier {
  async verify(document: any): Promise<VerificationResult> {
    try {
      // Extract the data from wrapped document if it exists
      const documentData = document.data || document;
      console.log("Document data for verification:", documentData);

      // Get document identifier (either document store or DID)
      const identifier = getDocumentIdentifier(documentData);
      if (!identifier) {
        throw new Error("No valid document identifier found");
      }

      // Log identity proof details
      const identityProof = documentData?.issuers?.[0]?.identityProof;
      if (identityProof) {
        console.log("Identity Proof details:", identityProof);
      }
      
      console.log("Starting OpenAttestation verification...");
      const fragments = await verify(document);
      console.log("Raw verification fragments received:", fragments);
      
      if (!Array.isArray(fragments)) {
        throw new Error("Invalid verification response");
      }

      // Process verification fragments
      const verificationDetails = processVerificationFragments(fragments);
      console.log("Processed verification details:", verificationDetails);

      // Additional verification based on identifier type
      if (identifier.type === 'documentStore') {
        console.log("Verifying document store:", {
          documentStoreAddress: identifier.value,
          merkleRoot: document.signature?.merkleRoot
        });

        const isValidStore = await DocumentStoreVerifier.verify(
          identifier.value,
          document.signature?.merkleRoot
        );
        
        if (!isValidStore) {
          console.error("Document store verification failed");
          return this.createErrorResponse("Document store verification failed");
        }
      }

      // Overall validity is determined by all verification aspects
      const documentIsValid = verificationDetails.documentIntegrity.valid && 
                            (verificationDetails.issuanceStatus.valid || isValid(fragments));
      
      console.log("Overall document validity:", documentIsValid);

      return {
        isValid: documentIsValid,
        details: verificationDetails
      };
    } catch (error) {
      console.error("Verification error:", error);
      return this.createErrorResponse(error instanceof Error ? error.message : "Unknown verification error");
    }
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

  getTemplate(): string {
    return "ANY";
  }
}