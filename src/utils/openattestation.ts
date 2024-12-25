import { 
  VerificationFragment,
  OpenAttestationDnsTxtCode
} from "@govtechsg/oa-verify";

export type { VerificationFragment };

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
  if (isDnsFragment(fragment) && 'data' in fragment) {
    const dnsData = fragment.data as { location: string };
    return {
      name: dnsData.location,
      domain: dnsData.location
    };
  }
  return {};
};