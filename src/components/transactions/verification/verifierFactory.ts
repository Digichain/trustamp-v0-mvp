import { DocumentType } from "@/types/documents";
import { InvoiceVerifier } from "./invoiceVerifier";

interface VerificationFragment {
  name: string;
  status: "VALID" | "INVALID" | "ERROR";
  type: string;
  data?: any;
}

interface VerificationResult {
  isValid: boolean;
  fragments: VerificationFragment[];
  error?: string;
}

interface DocumentVerifier {
  verify(documentData: any): Promise<VerificationResult>;
}

export class VerifierFactory {
  static async verifyDocument(document: any): Promise<DocumentVerifier> {
    return new InvoiceVerifier();
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
  fragment: VerificationFragment[],
  documentData: any
): Promise<VerificationResult> => {
  try {
    const verifier = createVerifier(documentData.type);
    const result = await verifier.verify(documentData);
    return {
      isValid: result.fragments.every((f) => f.status === "VALID"),
      fragments: result.fragments,
    };
  } catch (error) {
    return {
      isValid: false,
      fragments: [],
      error: error instanceof Error ? error.message : "Unknown verification error",
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
      fragments: [],
      error: error instanceof Error ? error.message : "Document validation failed",
    };
  }
};