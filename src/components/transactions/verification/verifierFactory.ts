import { DocumentVerifier } from './types';
import { InvoiceVerifier } from './verifiers/invoiceVerifier';

export class VerifierFactory {
  private static verifier: DocumentVerifier = new InvoiceVerifier();

  static async verifyDocument(document: any): Promise<DocumentVerifier | null> {
    console.log("Starting document verification process with document:", document);
    
    try {
      return this.verifier;
    } catch (error) {
      console.error("Error in verifier factory:", error);
      return null;
    }
  }
}