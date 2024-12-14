import { verify, isValid, VerificationFragment } from "@govtechsg/oa-verify";
import { DocumentVerifier, VerificationResult } from "../types";
import { DOCUMENT_TEMPLATES } from "../types";
import { ExtendedVerificationFragment } from "../types/verificationTypes";

export class InvoiceVerifier implements DocumentVerifier {
  async verify(document: any): Promise<VerificationResult> {
    try {
      console.log("Starting verification with document:", document);

      // Use the original document structure for verification
      const fragments = await verify(document) as ExtendedVerificationFragment[];
      console.log("Raw verification fragments received:", fragments);
      
      // Log each fragment type and status
      fragments.forEach((fragment, index) => {
        console.log(`Fragment ${index + 1}:`, {
          name: fragment.name,
          type: fragment.type,
          status: fragment.status,
          data: fragment.data,
          reason: fragment.reason
        });
      });

      // Check if the document is valid using the built-in isValid helper
      const documentIsValid = isValid(fragments);
      console.log("Document validity check:", documentIsValid);

      // Process fragments for detailed status
      const verificationDetails = this.processVerificationFragments(fragments);
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
    return DOCUMENT_TEMPLATES.INVOICE;
  }

  private processVerificationFragments(fragments: ExtendedVerificationFragment[]): any {
    console.log("Processing verification fragments:", fragments);

    // Document Integrity Check
    const integrityFragment = fragments.find(f => f.name === "OpenAttestationHash");
    const documentIntegrity = {
      valid: integrityFragment?.status === "VALID",
      message: this.getFragmentMessage(integrityFragment, 
        "Document has not been tampered with",
        "Document integrity check failed"
      )
    };

    // Issuance Status Check - check if any of the fragments is valid
    const issuanceStatus = this.processIssuanceStatus(fragments);

    // Issuer Identity Check - check if any of the fragments is valid
    const issuerIdentity = this.processIssuerIdentity(fragments);

    return {
      issuanceStatus,
      issuerIdentity,
      documentIntegrity
    };
  }

  private processIssuanceStatus(fragments: ExtendedVerificationFragment[]): any {
    // Find relevant fragments for issuance status
    const statusFragments = fragments.filter(f => 
      f.name === "OpenAttestationEthereumTokenRegistryStatus" || 
      f.name === "OpenAttestationEthereumDocumentStoreStatus" ||
      f.name === "OpenAttestationDidSignedDocumentStatus"
    );

    // Check if any of the status fragments is valid
    const validFragment = statusFragments.find(f => f.status === "VALID");
    
    if (validFragment) {
      return {
        valid: true,
        message: "Document has been issued"
      };
    }

    // If all are skipped, we aggregate their messages
    const skippedMessages = statusFragments.filter(f => f.status === "SKIPPED")
                                           .map(f => f.reason?.message || "Status skipped without a reason")
                                           .join("; ");
    
    return {
      valid: false,
      message: skippedMessages || "Issuance status verification failed"
    };
  }

  private processIssuerIdentity(fragments: ExtendedVerificationFragment[]): any {
    // Find relevant fragments for issuer identity
    const identityFragments = fragments.filter(f => 
      f.name === "OpenAttestationDnsTxtIdentityProof" || 
      f.name === "OpenAttestationDnsDidIdentityProof"
    );

    // Check if any of the identity fragments is valid
    const validFragment = identityFragments.find(f => f.status === "VALID");
    
    if (validFragment) {
      return {
        valid: true,
        message: "Document issuer has been identified",
        details: validFragment.data ? {
          name: validFragment.data.identifier,
          domain: validFragment.data.location
        } : undefined
      };
    }

    // If all are skipped, we aggregate their messages
    const skippedMessages = identityFragments.filter(f => f.status === "SKIPPED")
                                             .map(f => f.reason?.message || "Identity check skipped without a reason")
                                             .join("; ");
    
    return {
      valid: false,
      message: skippedMessages || "Issuer identity verification failed"
    };
  }

  private getFragmentMessage(fragment: ExtendedVerificationFragment | undefined, successMessage: string, failureMessage: string): string {
    if (!fragment) return "Verification check not performed";
    if (fragment.status === "VALID") return successMessage;
    
    if (fragment.reason) {
      if (typeof fragment.reason === 'string') {
        return fragment.reason;
      }
      return fragment.reason.message || failureMessage;
    }
    return failureMessage;
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
