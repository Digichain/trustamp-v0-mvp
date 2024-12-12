import { verify, VerificationFragment, Verifier } from "@govtechsg/oa-verify";
import { DocumentVerifier, VerificationResult } from "../types";
import { DOCUMENT_TEMPLATES } from "../types";
import { createInvoiceCustomVerifier } from "../utils/customVerifier";

export class InvoiceVerifier implements DocumentVerifier {
  async verify(document: any, network?: string): Promise<VerificationResult> {
    try {
      console.log("Starting verification with document:", document);
      console.log("Using network for verification:", network);

      // Configure verification options using the provided network
      const verificationNetwork = network || 'sepolia'; // Fallback to sepolia if no network provided
      const verificationOptions = {
        network: verificationNetwork,
        provider: { network: verificationNetwork },
        resolver: { network: verificationNetwork },
        verificationMethod: "did",
        verifiers: [createInvoiceCustomVerifier()]
      };

      console.log("Starting verification with options:", verificationOptions);
      const fragments = await verify(document, verificationOptions as any);
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

  private processVerificationFragments(fragments: VerificationFragment[]): any {
    console.log("Processing verification fragments:", fragments);

    // Document Integrity Check
    const integrityFragment = fragments.find(f => f.name === "OpenAttestationHash") as ExtendedVerificationFragment;
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
    ) as ExtendedVerificationFragment;
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
    ) as ExtendedVerificationFragment;
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
    // For v2.0 documents, we check all aspects
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
