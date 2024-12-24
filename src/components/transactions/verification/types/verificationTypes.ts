import { Verifier, VerificationFragment } from "@govtechsg/oa-verify";

export interface VerificationOptions {
  network: string;
  provider?: {
    network: string;
  };
  resolver?: {
    network: string;
  };
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

export interface ExtendedVerificationFragment extends VerificationFragment {
  data?: {
    identifier?: string;
    location?: string;
    status?: string;
    value?: any;
  };
  reason?: {
    code: number;
    codeString: string;
    message: string;
  };
}