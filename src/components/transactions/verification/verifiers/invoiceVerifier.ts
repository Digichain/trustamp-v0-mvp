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

      // Verify invoice details structure
      const invoiceDetails = document.invoiceDetails;
      const requiredInvoiceFields = ['invoiceNumber', 'date', 'billFrom', 'billTo', 'billableItems'];
      const missingInvoiceFields = requiredInvoiceFields.filter(field => !invoiceDetails[field]);

      if (missingInvoiceFields.length > 0) {
        return {
          isValid: false,
          errors: [`Missing invoice details: ${missingInvoiceFields.join(', ')}`]
        };
      }

      // Verify billable items
      if (!Array.isArray(invoiceDetails.billableItems) || invoiceDetails.billableItems.length === 0) {
        return {
          isValid: false,
          errors: ['Invoice must contain at least one billable item']
        };
      }

      // Verify issuer information
      if (!document.issuers[0]?.name) {
        return {
          isValid: false,
          errors: ['Invalid issuer information']
        };
      }
      
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