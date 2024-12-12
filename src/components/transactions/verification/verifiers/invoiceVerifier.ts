import { verify } from "@govtechsg/oa-verify";
import { utils } from "@govtechsg/open-attestation";
import { DocumentVerifier, VerificationResult } from "../types";
import { DOCUMENT_TEMPLATES } from "../types";

export class InvoiceVerifier implements DocumentVerifier {
  async verify(document: any): Promise<VerificationResult> {
    try {
      console.log("Starting document verification for v2.0 document:", document);
      
      // First, run diagnostics to ensure it's a valid v2.0 document
      const diagnosticResults = utils.diagnose({ 
        version: "2.0", 
        kind: "signed", 
        document: document, 
        mode: "strict" 
      });
      console.log("Document diagnostics results:", diagnosticResults);

      // Handle diagnostic results based on the returned array
      if (diagnosticResults.length > 0) {
        console.error("Document diagnostics failed:", diagnosticResults);
        return this.createErrorResponse(
          diagnosticResults.map(error => error.message).join(", ")
        );
      }

      // Configure verification options for v2.0 document on Sepolia
      const verificationOptions = {
        provider: { network: "sepolia" },
        resolver: { network: "sepolia" }
      };

      console.log("Starting verification with options:", verificationOptions);
      const fragments = await verify(document, verificationOptions);
      console.log("Verification fragments received:", fragments);

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

  private processVerificationFragments(fragments: any[]): any {
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
    const statusFragment = fragments.find(f => f.name === "OpenAttestationEthereumTokenRegistryStatus") 
      || fragments.find(f => f.name === "OpenAttestationEthereumDocumentStoreStatus");
    console.log("Status fragment:", statusFragment);

    const issuanceStatus = {
      valid: statusFragment?.status === "VALID",
      message: this.getFragmentMessage(statusFragment,
        "Document has been issued",
        "Document has not been issued or has been revoked"
      )
    };

    // Issuer Identity Check (DNS-DID)
    const identityFragment = fragments.find(f => f.name === "OpenAttestationDnsTxt");
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

  private getFragmentMessage(fragment: any, successMessage: string, failureMessage: string): string {
    if (!fragment) return "Verification check not performed";
    if (fragment.status === "VALID") return successMessage;
    
    // Ensure we return a string message
    if (fragment.reason) {
      return typeof fragment.reason === 'string' ? fragment.reason : 'Verification failed';
    }
    return failureMessage;
  }

  private isVerificationValid(details: any): boolean {
    // For v2.0 documents, we primarily check document integrity
    return details.documentIntegrity.valid;
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