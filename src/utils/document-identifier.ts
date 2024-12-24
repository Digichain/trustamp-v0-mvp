import { utils } from "ethers";

/**
 * Removes the salt from a string value (e.g., "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d:string" -> "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d")
 */
export const removeSalt = (value?: string): string | undefined => {
  if (!value) return undefined;
  const match = value.match(/^[^:]+:string:(.+)$/);
  return match ? match[1] : value;
};

/**
 * Checks if a string is a valid Ethereum address
 */
export const isValidEthereumAddress = (address: string): boolean => {
  try {
    return utils.isAddress(address);
  } catch {
    return false;
  }
};

/**
 * Gets the document store address from a document
 */
export const getDocumentStoreAddress = (document: any): string | undefined => {
  console.log("Getting document store address from document:", document);
  const documentStore = removeSalt(document?.issuers?.[0]?.documentStore);
  console.log("Found document store address:", documentStore);
  return documentStore && isValidEthereumAddress(documentStore) ? documentStore : undefined;
};

/**
 * Gets the DID from a document
 */
export const getDid = (document: any): string | undefined => {
  console.log("Getting DID from document:", document);
  const did = removeSalt(document?.issuers?.[0]?.id);
  console.log("Found DID:", did);
  return did?.startsWith("did:") ? did : undefined;
};

/**
 * Gets the token registry address from a document
 */
export const getTokenRegistryAddress = (document: any): string | undefined => {
  console.log("Getting token registry address from document:", document);
  const tokenRegistry = removeSalt(document?.issuers?.[0]?.tokenRegistry);
  console.log("Found token registry address:", tokenRegistry);
  return tokenRegistry && isValidEthereumAddress(tokenRegistry) ? tokenRegistry : undefined;
};

/**
 * Gets the main identifier (document store, DID, or token registry) from a document
 */
export const getIdentifier = (document: any) => {
  console.log("Getting identifier for document:", document);
  
  const documentStore = getDocumentStoreAddress(document);
  if (documentStore) {
    console.log("Found document store identifier:", documentStore);
    return { type: 'documentStore', value: documentStore };
  }

  const did = getDid(document);
  if (did) {
    console.log("Found DID identifier:", did);
    return { type: 'did', value: did };
  }

  const tokenRegistry = getTokenRegistryAddress(document);
  if (tokenRegistry) {
    console.log("Found token registry identifier:", tokenRegistry);
    return { type: 'tokenRegistry', value: tokenRegistry };
  }

  console.log("No valid identifier found in document");
  return null;
};