import { DocumentVerifier, VerificationResult, DOCUMENT_TEMPLATES } from '../types';
import { verify, utils, VerificationFragment, Verifier } from "@govtechsg/oa-verify";
import { getData } from "@govtechsg/open-attestation";

const invoiceCustomVerifier: Verifier<any> = {
  skip: async () => {
    return {
      status: "SKIPPED",
      type: "DOCUMENT_INTEGRITY",
      name: "InvoiceVerifier",
      reason: {
        code: 0,
        codeString: "SKIPPED",
        message: "Document format verification skipped",
      },
    };
  },
  test: (document: any) => {
    return document.version === "https://schema.openattestation.com/2.0/schema.json" &&
           document.$template?.name === DOCUMENT_TEMPLATES.INVOICE;
  },
  verify: async (document: any) => {
    const documentData = getData(document);
    
    // Check if it's an invoice template
    if (documentData.$template?.name !== DOCUMENT_TEMPLATES.INVOICE) {
      return {
        type: "DOCUMENT_INTEGRITY",
        name: "InvoiceVerifier",
        data: documentData.$template?.name,
        reason: {
          code: 1,
          codeString: "INVALID_TEMPLATE",
          message: `Document template is not an invoice: ${documentData.$template?.name}`,
        },
        status: "INVALID",
      };
    }

    return {
      type: "DOCUMENT_INTEGRITY",
      name: "InvoiceVerifier",
      data: documentData.$template?.name,
      status: "VALID",
    };
  },
};

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

      // Perform OpenAttestation verification with custom verifier
      const fragments = await verify(document, {
        customVerifier: invoiceCustomVerifier
      });
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
      const identityData = utils.isValidFragment(identityFragment) ? identityFragment.data : null;
      
      // Handle both single object and array cases for identity data
      const issuerIdentity = {
        valid: utils.isValidFragment(identityFragment),
        message: utils.isValidFragment(identityFragment)
          ? "Document issuer has been identified"
          : "Issuer not identified",
        details: identityData ? {
          name: Array.isArray(identityData) ? identityData[0]?.key : identityData.key,
          domain: Array.isArray(identityData) ? identityData[0]?.location : identityData.location
        } : undefined
      };

      // Custom verification check
      const customFragment = fragments.find(f => f.name === "InvoiceVerifier");
      const customVerificationValid = customFragment && customFragment.status === "VALID";

      const verificationDetails = {
        issuanceStatus,
        issuerIdentity,
        documentIntegrity
      };

      // Document is valid only if all verifications pass
      const isValid = verificationDetails.issuanceStatus.valid && 
                     verificationDetails.issuerIdentity.valid && 
                     verificationDetails.documentIntegrity.valid &&
                     customVerificationValid;

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