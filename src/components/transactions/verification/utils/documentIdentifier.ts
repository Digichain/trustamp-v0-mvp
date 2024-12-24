import { ExtendedVerificationFragment } from "../types/verificationTypes";

export const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const removeSalt = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  // Match pattern like "uuid:string:actualValue" or "uuid:did:actualValue"
  const match = value.match(/^[^:]+:[^:]+:(.+)$/);
  return match ? match[1] : value;
};

export const getDocumentIdentifier = (document: any): { type: 'documentStore' | 'did', value: string } | null => {
  const issuer = document?.issuers?.[0];
  if (!issuer) {
    console.log("No issuer found in document");
    return null;
  }

  // Check for document store
  const documentStore = removeSalt(issuer.documentStore);
  if (documentStore && isValidEthereumAddress(documentStore)) {
    console.log("Found document store address:", documentStore);
    return { type: 'documentStore', value: documentStore };
  }

  // Check for DID
  const did = removeSalt(issuer.id);
  if (did?.startsWith('did:')) {
    console.log("Found DID identifier:", did);
    return { type: 'did', value: did };
  }

  console.log("No valid identifier found in document");
  return null;
};

export const getIdentityProofDetails = (document: any) => {
  const identityProof = document?.issuers?.[0]?.identityProof;
  if (!identityProof) return null;

  return {
    type: removeSalt(identityProof.type),
    location: removeSalt(identityProof.location),
    key: removeSalt(identityProof.key)
  };
};