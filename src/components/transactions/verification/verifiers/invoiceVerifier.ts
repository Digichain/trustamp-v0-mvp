import { DocumentVerifier, VerificationResult, DOCUMENT_TEMPLATES } from '../types';
import { verify } from "@govtechsg/oa-verify";
import { VerificationDetails } from '../types/verificationTypes';

export class InvoiceVerifier implements DocumentVerifier {
  getTemplate(): string {
    return DOCUMENT_TEMPLATES.INVOICE;
  }

  async verify(document: any): Promise<VerificationResult> {
    console.log("Starting invoice verification for document:", document);
    
    try {
      // Basic structure validation
      if (!document || typeof document !== 'object') {
        return this.createErrorResponse('Invalid document format');
      }

      // Perform OpenAttestation verification
      const fragments = await verify(document);
      console.log("Raw verification fragments:", fragments);

      const verificationDetails = this.processVerificationFragments(fragments);
      console.log("Processed verification details:", verificationDetails);
      
      const isValid = this.isVerificationValid(verificationDetails);
      console.log("Final verification result:", isValid);

      return {
        isValid,
        details: verificationDetails,
        errors: isValid ? undefined : ['Document verification failed']
      };
    } catch (error) {
      console.error("Error during invoice verification:", error);
      return this.createErrorResponse('Verification process failed');
    }
  }

  private processVerificationFragments(fragments: any[]): VerificationDetails {
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

    // Issuance Status Check
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
    return fragment.status === "VALID" ? successMessage : (fragment.reason || failureMessage);
  }

  private isVerificationValid(details: VerificationDetails): boolean {
    // For DNS-DID verification, we primarily care about document integrity
    // since the document might not be issued on-chain
    return details.documentIntegrity.valid;
  }

  private createErrorResponse(message: string): VerificationResult {
    const errorDetails: VerificationDetails = {
      issuanceStatus: {
        valid: false,
        message
      },
      issuerIdentity: {
        valid: false,
        message
      },
      documentIntegrity: {
        valid: false,
        message
      }
    };

    return {
      isValid: false,
      errors: [message],
      details: errorDetails
    };
  }
}