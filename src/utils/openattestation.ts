import { 
  VerificationFragment as OAVerificationFragment,
  OpenAttestationDNSTextRecord,
  OpenAttestationDNSProof
} from "@govtechsg/oa-verify";

export type VerificationFragment = OAVerificationFragment;

export const isValidFragment = (fragment: VerificationFragment): boolean => {
  return fragment.status === "VALID";
};

export const isDnsFragment = (fragment: VerificationFragment): boolean => {
  return fragment.type === "ISSUER_IDENTITY";
};

export const isDocumentStoreFragment = (fragment: VerificationFragment): boolean => {
  return fragment.type === "DOCUMENT_STATUS";
};

export const isHashFragment = (fragment: VerificationFragment): boolean => {
  return fragment.type === "DOCUMENT_INTEGRITY";
};

export const getDnsData = (fragment: VerificationFragment): { name?: string; domain?: string } => {
  if (isDnsFragment(fragment) && fragment.data) {
    const dnsData = fragment.data as OpenAttestationDNSProof;
    return {
      name: dnsData.location,
      domain: dnsData.location
    };
  }
  return {};
};