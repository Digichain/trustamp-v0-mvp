import { DocumentVerifier, DOCUMENT_TEMPLATES } from './types';
import { InvoiceVerifier } from './verifiers/invoiceVerifier';
import { utils } from "@govtechsg/open-attestation";

export class VerifierFactory {
  private static verifiers: Map<string, DocumentVerifier> = new Map([
    [DOCUMENT_TEMPLATES.INVOICE, new InvoiceVerifier()],
    // Add more verifiers here as we implement them
  ]);

  static getVerifier(templateName: string): DocumentVerifier | null {
    console.log("Getting verifier for template:", templateName);
    const verifier = this.verifiers.get(templateName);
    
    if (!verifier) {
      console.warn(`No verifier found for template: ${templateName}`);
      return null;
    }
    
    return verifier;
  }

  static async verifyDocument(document: any): Promise<DocumentVerifier | null> {
    console.log("Starting document verification process", document);
    
    try {
      // First, check if it's a valid OpenAttestation document
      const diagnosticResults = utils.diagnose({ 
        version: "2.0", 
        kind: "signed", 
        document: document, 
        mode: "strict" 
      });

      if (diagnosticResults.length > 0) {
        console.warn("Document diagnostics failed:", diagnosticResults);
        return null;
      }

      // For OpenAttestation v2.0 documents, template is in data.$template
      const templateName = document.data?.$template?.name;
      console.log("Document template name:", templateName);
      
      if (!templateName) {
        console.warn("No template name found in document");
        return null;
      }

      // Check if it's an OpenCerts document
      const isOpenCerts = document.data?.["$template"]?.name?.startsWith("opencerts/");
      if (isOpenCerts) {
        console.log("Detected OpenCerts document format");
        // TODO: Add specific handling for OpenCerts if needed
      }

      // Check if it's a TradeTrust document
      const isTradeTrust = document.data?.["$template"]?.name?.startsWith("tt/");
      if (isTradeTrust) {
        console.log("Detected TradeTrust document format");
        // TODO: Add specific handling for TradeTrust if needed
      }

      const verifier = this.getVerifier(templateName);
      if (!verifier) {
        console.error("No verifier available for template:", templateName);
        return null;
      }

      return verifier;
    } catch (error) {
      console.error("Error in verifier factory:", error);
      return null;
    }
  }
}