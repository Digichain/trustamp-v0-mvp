import { DocumentVerifier, VerificationResult, DOCUMENT_TEMPLATES } from '../types';
import { verify, utils } from "@govtechsg/oa-verify";

interface InvoiceVerificationDetails {
  issuanceStatus: {
    valid: boolean;
    message: string;
  };
  issuerIdentity: {
    valid: boolean;
    message: string;
    details?: {
      name?: string;
      domain?: string;
    };
  };
  documentIntegrity: {
    valid: boolean;
    message: string;
  };
}

export class InvoiceVerifier implements DocumentVerifier {
  getTemplate(): string {
    return DOCUMENT_TEMPLATES.INVOICE;
  }

  async verify(document: any): Promise<VerificationResult> {
    console.log("Starting invoice verification for document:", document);
    
    try {
      // Basic structure validation
      if (!document || typeof document !== 'object') {
        return {
          isValid: false,
          errors: ['Invalid document format']
        };
      }

      // Check if it's an invoice template
      if (!document.$template || document.$template.name !== DOCUMENT_TEMPLATES.INVOICE) {
        return {
          isValid: false,
          errors: ['Document is not an invoice']
        };
      }

      // Perform OpenAttestation verification
      const fragments = await verify(document, { network: "sepolia" });
      console.log("Verification fragments:", fragments);

      // Document Integrity Check
      const integrityFragment = utils.getOpenAttestationHashFragment(fragments);
      const documentIntegrity = {
        valid: utils.isValidFragment(integrityFragment),
        message: utils.isValidFragment(integrityFragment) 
          ? "Document has not been tampered with"
          : "Document has been tampered with"
      };

      // Issuance Status Check
      const statusFragment = utils.getOpenAttestationEthereumDocumentStoreStatusFragment(fragments);
      const issuanceStatus = {
        valid: utils.isValidFragment(statusFragment),
        message: utils.isValidFragment(statusFragment)
          ? "Document has been issued"
          : "Document has not been issued, or the document is revoked"
      };

      // Issuer Identity Check
      const identityFragment = utils.getOpenAttestationDnsDidIdentityProofFragment(fragments);
      const issuerIdentity = {
        valid: utils.isValidFragment(identityFragment),
        message: utils.isValidFragment(identityFragment)
          ? "Document issuer has been identified"
          : "Issuer not identified",
        details: utils.isValidFragment(identityFragment) ? {
          name: identityFragment.data.identifier,
          domain: identityFragment.data.location
        } : undefined
      };

      const verificationDetails: InvoiceVerificationDetails = {
        issuanceStatus,
        issuerIdentity,
        documentIntegrity
      };

      // Document is valid only if all verifications pass
      const isValid = verificationDetails.issuanceStatus.valid && 
                     verificationDetails.issuerIdentity.valid && 
                     verificationDetails.documentIntegrity.valid;

      return {
        isValid,
        details: verificationDetails,
        errors: isValid ? undefined : ['Document verification failed']
      };
    } catch (error) {
      console.error("Error during invoice verification:", error);
      return {
        isValid: false,
        errors: ['Verification process failed']
      };
    }
  }
}