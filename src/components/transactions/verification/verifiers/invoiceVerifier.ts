import { verify, VerificationFragment } from "@govtechsg/oa-verify";
import { DocumentVerifier, VerificationResult } from "../types";
import { DOCUMENT_TEMPLATES } from "../types";
import { createInvoiceCustomVerifier } from "../utils/customVerifier";
import { ExtendedVerificationFragment } from "../types/verificationTypes";

export class InvoiceVerifier implements DocumentVerifier {
  async verify(document: any): Promise<VerificationResult> {
    try {
      console.log("Starting verification with document:", document);

      // Create custom verifier
      const customVerifier = createInvoiceCustomVerifier();
      
      console.log("Starting document verification with custom verifier");
      const fragments = await verify(document, customVerifier) as ExtendedVerificationFragment[];
      console.log("Raw verification fragments received:", fragments);

      // Process fragments
      const verificationDetails = this.processVerificationFragments(fragments);
      console.log("Processed verification details:", verificationDetails);
      
      const isValid = this.isVerificationValid(verificationDetails);
      console.log("Final verification result:", isValid);

      return {
        isValid,
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
    console.log("Integrity fragment:", integrityFragment);
    
    const documentIntegrity = {
      valid: integrityFragment?.status === "VALID",
      message: this.getFragmentMessage(integrityFragment, 
        "Document has not been tampered with",
        "Document integrity check failed"
      )
    };

    // Issuance Status Check (v2.0 specific)
    const statusFragment = fragments.find(f => 
      f.name === "OpenAttestationEthereumTokenRegistryStatus" || 
      f.name === "OpenAttestationEthereumDocumentStoreStatus"
    );
    console.log("Status fragment:", statusFragment);

    const issuanceStatus = {
      valid: statusFragment?.status === "VALID",
      message: this.getFragmentMessage(statusFragment,
        "Document has been issued",
        "Document has not been issued or has been revoked"
      )
    };

    // Issuer Identity Check (DNS-DID)
    const identityFragment = fragments.find(f => 
      f.name === "OpenAttestationDnsTxt" || 
      f.name === "DnsDidVerifier"
    );
    console.log("Identity fragment:", identityFragment);
    
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

  private isVerificationValid(details: any): boolean {
    return details.documentIntegrity.valid && 
           details.issuanceStatus.valid && 
           details.issuerIdentity.valid;
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