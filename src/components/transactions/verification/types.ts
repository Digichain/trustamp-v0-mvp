export interface VerificationResult {
  isValid: boolean;
  errors?: string[];
  details?: Record<string, any>;
}

export interface DocumentVerifier {
  verify: (document: any) => Promise<VerificationResult>;
  getTemplate: () => string;
}

// Document template names
export const DOCUMENT_TEMPLATES = {
  INVOICE: 'INVOICE',
  BILL_OF_LADING: 'BILL_OF_LADING',
  // Add more templates as needed
} as const;

export type DocumentTemplate = typeof DOCUMENT_TEMPLATES[keyof typeof DOCUMENT_TEMPLATES];