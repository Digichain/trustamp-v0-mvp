import { DocumentVerifier, VerificationResult, DOCUMENT_TEMPLATES } from '../types';
import { verify, isValid, utils } from "@govtechsg/oa-verify";
import { getData } from "@govtechsg/open-attestation";
import { VerificationDetails } from '../types/verificationTypes';
import { createInvoiceCustomVerifier } from '../utils/customVerifier';

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

      // Create custom verifier
      const invoiceCustomVerifier = createInvoiceCustomVerifier();

      // Perform OpenAttestation verification
      const fragments = await verify(document, {
        networks: ["sepolia"],
        verifiers: [invoiceCustomVerifier]
      });
      
      console.log("Verification fragments:", fragments);

      const verificationDetails = this.processVerificationFragments(fragments);
      const isValid = this.isVerificationValid(verificationDetails);

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
    const documentIntegrity = {
      valid: integrityFragment?.status === "VALID",
      message: integrityFragment?.status === "VALID"
        ? "Document has not been tampered with"
        : "Document has been tampered with"
    };

    // Issuance Status Check
    const statusFragment = fragments.find(f => f.name === "OpenAttestationEthereumDocumentStoreStatus");
    const issuanceStatus = {
      valid: statusFragment?.status === "VALID",
      message: statusFragment?.status === "VALID"
        ? "Document has been issued"
        : "Document has not been issued, or the document is revoked"
    };

    // Issuer Identity Check
    const identityFragment = fragments.find(f => f.name === "OpenAttestationDnsTxt");
    const identityData = identityFragment?.data;
    
    const issuerIdentity = {
      valid: identityFragment?.status === "VALID",
      message: identityFragment?.status === "VALID"
        ? "Document issuer has been identified"
        : "Issuer not identified",
      details: identityData ? {
        name: Array.isArray(identityData) ? identityData[0]?.key : identityData.key,
        domain: Array.isArray(identityData) ? identityData[0]?.location : identityData.location
      } : undefined
    };

    return {
      issuanceStatus,
      issuerIdentity,
      documentIntegrity
    };
  }

  private isVerificationValid(details: VerificationDetails): boolean {
    return details.issuanceStatus.valid && 
           details.issuerIdentity.valid && 
           details.documentIntegrity.valid;
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