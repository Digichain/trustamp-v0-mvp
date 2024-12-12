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
    console.log("Starting document verification process with original document:", document);
    
    try {
      // First, check if it's a valid OpenAttestation document
      const diagnosticResults = utils.diagnose({ 
        version: "2.0", 
        kind: "signed", 
        document: document, 
        mode: "strict" 
      });

      console.log("Diagnostic results:", diagnosticResults);

      // Get the document data without making assumptions about structure
      const documentData = document.data || document;
      console.log("Document data being checked:", documentData);

      // For now, we'll use the invoice verifier for all documents
      // This allows us to verify the document without making assumptions about templates
      const verifier = this.getVerifier(DOCUMENT_TEMPLATES.INVOICE);
      if (!verifier) {
        console.error("No verifier available");
        return null;
      }

      return verifier;
    } catch (error) {
      console.error("Error in verifier factory:", error);
      return null;
    }
  }
}
