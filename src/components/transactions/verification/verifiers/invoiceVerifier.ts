import { DocumentVerifier, VerificationResult, DOCUMENT_TEMPLATES } from '../types';

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

      // Verify required invoice fields
      const requiredFields = ['issuers', 'invoiceDetails'];
      const missingFields = requiredFields.filter(field => !document[field]);
      
      if (missingFields.length > 0) {
        return {
          isValid: false,
          errors: [`Missing required fields: ${missingFields.join(', ')}`]
        };
      }

      // Add more specific invoice validation logic here
      
      return {
        isValid: true,
        details: {
          template: DOCUMENT_TEMPLATES.INVOICE,
          issuer: document.issuers[0]?.name,
          invoiceNumber: document.invoiceDetails?.invoiceNumber
        }
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