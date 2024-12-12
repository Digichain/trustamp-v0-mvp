import { DocumentVerifier, VerificationResult, DOCUMENT_TEMPLATES } from '../types';
import { verify, utils, Verifier, VerificationFragment, VerificationOptions } from "@govtechsg/oa-verify";
import { getData } from "@govtechsg/open-attestation";

// Define the template object type
interface TemplateObject {
  name: string;
  type: string;
  url: string;
}

// Define the expected document structure
interface OpenAttestationDocument {
  version: string;
  data: {
    $template: TemplateObject;
    issuers: Array<{
      id: string;
      name: string;
      identityProof: {
        type: string;
        key: string;
        location: string;
      };
    }>;
  };
}

const invoiceCustomVerifier: Verifier<any> = {
  skip: () => {
    return Promise.resolve({
      status: "SKIPPED",
      type: "DOCUMENT_INTEGRITY",
      name: "InvoiceVerifier",
      reason: {
        code: 0,
        codeString: "SKIPPED",
        message: "Document format verification skipped",
      },
    });
  },
  test: (document: any) => {
    try {
      const data = getData(document);
      const template = data.$template as TemplateObject;
      return document.version === "https://schema.openattestation.com/2.0/schema.json" &&
             template?.name === DOCUMENT_TEMPLATES.INVOICE;
    } catch (error) {
      console.error("Error in test function:", error);
      return false;
    }
  },
  verify: async (document: any) => {
    try {
      const documentData = getData(document);
      const template = documentData.$template as TemplateObject;
      const templateName = template?.name;
      
      if (templateName !== DOCUMENT_TEMPLATES.INVOICE) {
        return {
          type: "DOCUMENT_INTEGRITY",
          name: "InvoiceVerifier",
          data: templateName,
          reason: {
            code: 1,
            codeString: "INVALID_TEMPLATE",
            message: `Document template is not an invoice: ${templateName}`,
          },
          status: "INVALID",
        };
      }

      return {
        type: "DOCUMENT_INTEGRITY",
        name: "InvoiceVerifier",
        data: templateName,
        status: "VALID",
      };
    } catch (error) {
      console.error("Error in verify function:", error);
      return {
        type: "DOCUMENT_INTEGRITY",
        name: "InvoiceVerifier",
        data: null,
        reason: {
          code: 2,
          codeString: "VERIFICATION_ERROR",
          message: "Error during verification",
        },
        status: "ERROR",
      };
    }
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
          errors: ['Invalid document format'],
          details: {
            issuanceStatus: {
              valid: false,
              message: "Invalid document format"
            },
            issuerIdentity: {
              valid: false,
              message: "Invalid document format"
            },
            documentIntegrity: {
              valid: false,
              message: "Invalid document format"
            }
          }
        };
      }

      // Configure verification options with correct typing
      const verificationOptions: VerificationOptions = {
        network: "sepolia",
        provider: { network: "sepolia" },
        resolver: { network: "sepolia" },
        verifiers: [invoiceCustomVerifier]
      };

      // Perform OpenAttestation verification with options
      const fragments = await verify(document, verificationOptions);
      
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
        errors: ['Verification process failed'],
        details: {
          issuanceStatus: {
            valid: false,
            message: "Verification process failed"
          },
          issuerIdentity: {
            valid: false,
            message: "Verification process failed"
          },
          documentIntegrity: {
            valid: false,
            message: "Verification process failed"
          }
        }
      };
    }
  }
}