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

  static async verifyDocument(document: any, network?: string): Promise<DocumentVerifier | null> {
    console.log("Starting document verification process with document:", document);
    console.log("Using network for verification:", network);
    
    try {
      // For now, we'll use the invoice verifier for all documents
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