import { DocumentType } from "@/types/documents";
import { InvoiceVerifier } from "./invoiceVerifier";
import { VerificationResult, DocumentVerifier } from "./types";

export class VerifierFactory {
  static createVerifier(documentType: DocumentType): DocumentVerifier {
    switch (documentType) {
      case DocumentType.VERIFIABLE_INVOICE:
        return new InvoiceVerifier();
      default:
        throw new Error(`Unsupported document type: ${documentType}`);
    }
  }

  static async verifyDocument(document: any): Promise<VerificationResult> {
    const verifier = new InvoiceVerifier();
    return verifier.verify(document);
  }
}

export const createVerifier = (documentType: DocumentType): DocumentVerifier => {
  switch (documentType) {
    case DocumentType.VERIFIABLE_INVOICE:
      return new InvoiceVerifier();
    default:
      throw new Error(`Unsupported document type: ${documentType}`);
  }
};

export const verifyFragment = async (
  documentData: any
): Promise<VerificationResult> => {
  try {
    const verifier = createVerifier(documentData.type);
    const result = await verifier.verify(documentData);
    return result;
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Unknown verification error"
    };
  }
};

export const validateDocumentIntegrity = async (
  documentData: any
): Promise<VerificationResult> => {
  try {
    const verifier = createVerifier(documentData.type);
    return await verifier.verify(documentData);
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Document validation failed"
    };
  }
};