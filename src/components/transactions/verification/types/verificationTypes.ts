import { Verifier, VerificationFragment } from "@govtechsg/oa-verify";

export interface VerificationOptions {
  network: string;
  provider?: {
    network: string;
  };
  resolver?: {
    network: string;
  };
  verifiers?: Verifier<any>[];
}

export interface VerificationDetails {
  issuanceStatus: {
    valid: boolean;
    message: string;
  };
  issuerIdentity: {
    valid: boolean;
    message: string;
    details?: {
      name?: string;
      domain?: string;
    };
  };
  documentIntegrity: {
    valid: boolean;
    message: string;
  };
}

export interface OpenAttestationDocument {
  version: string;
  data: {
    $template: {
      name: string;
      type: string;
      url: string;
    };
    issuers: Array<{
      id: string;
      name: string;
      identityProof: {
        type: string;
        key: string;
        location: string;
      };
    }>;
  };
}

// Add specific type for verification fragment data
export interface VerificationFragmentData {
  identifier?: string;
  location?: string;
  status?: string;
  value?: any;
}

export interface ExtendedVerificationFragment extends VerificationFragment {
  data?: VerificationFragmentData;
}