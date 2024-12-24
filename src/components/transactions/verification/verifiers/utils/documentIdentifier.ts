import { utils } from "ethers";

export const removeSalt = (value: string): string | undefined => {
  if (!value) return undefined;
  const match = value.match(/^[^:]+:string:(.+)$/);
  return match ? match[1] : value;
};

export const isValidEthereumAddress = (address: string): boolean => {
  try {
    return utils.isAddress(address);
  } catch {
    return false;
  }
};

export const getDocumentIdentifier = (document: any) => {
  console.log("Getting document identifier for:", document);
  
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
    console.log("Found DID:", did);
    return { type: 'did', value: did };
  }

  console.log("No valid identifier found in document");
  return null;
};