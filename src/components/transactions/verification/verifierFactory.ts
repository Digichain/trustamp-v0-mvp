import { DocumentVerifier, DOCUMENT_TEMPLATES } from './types';
import { InvoiceVerifier } from './verifiers/invoiceVerifier';

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
      // Check if document has the required OpenAttestation structure
      if (!document.data || !document.signature) {
        console.warn("Document missing required OpenAttestation structure");
        return null;
      }

      const templateName = document.data.$template?.name;
      console.log("Document template name:", templateName);
      
      if (!templateName) {
        console.warn("No template name found in document");
        return null;
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