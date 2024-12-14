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

    // Issuance Status Check - now checking for DidSignedDocumentStatus as well
    const statusFragment = fragments.find(f => 
      f.name === "OpenAttestationEthereumTokenRegistryStatus" || 
      f.name === "OpenAttestationEthereumDocumentStoreStatus" ||
      f.name === "OpenAttestationDidSignedDocumentStatus"
    );
    console.log("Status fragment found:", statusFragment);
    
    const issuanceStatus = {
      valid: statusFragment?.status === "VALID",
      message: this.getFragmentMessage(statusFragment,
        "Document has been issued",
        "Document has not been issued or has been revoked"
      )
    };

    // Issuer Identity Check
    const identityFragment = fragments.find(f => 
      f.name === "OpenAttestationDnsTxtIdentityProof" || 
      f.name === "OpenAttestationDnsDidIdentityProof"
    );
    const issuerIdentity = {
      valid: identityFragment?.status === "VALID",
      message: this.getFragmentMessage(identityFragment,
        "Document issuer has been identified",
        "Unable to verify document issuer"
      ),
      details: identityFragment?.data ? {
        name: identityFragment.data.identifier,
        domain: identityFragment.data.location
      } : undefined
    };

    return {
      issuanceStatus,
      issuerIdentity,
      documentIntegrity
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
