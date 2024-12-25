import { VerificationFragment } from "@govtechsg/oa-verify";

export interface VerificationResult {
  isValid: boolean;
  error?: string;
  details?: {
    documentIntegrity?: {
      valid: boolean;
      message: string;
    };
    issuanceStatus?: {
      valid: boolean;
      message: string;
    };
    issuerIdentity?: {
      valid: boolean;
      message: string;
      details?: any;
    };
    fragments?: VerificationFragment[];
  };
}

export interface DocumentVerifier {
  verify: (document: any) => Promise<VerificationResult>;
  getTemplate: () => string;
}

export const DOCUMENT_TEMPLATES = {
  INVOICE: 'INVOICE',
  BILL_OF_LADING: 'BILL_OF_LADING',
} as const;

export type DocumentTemplate = typeof DOCUMENT_TEMPLATES[keyof typeof DOCUMENT_TEMPLATES];