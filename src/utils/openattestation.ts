import {
  OpenAttestationEthereumDocumentStoreStatusFragment,
  OpenAttestationHashValidFragment,
} from "@govtechsg/oa-verify";

export const getDocumentStoreAddress = (fragments: any[]): string => {
  const documentStoreFragment = fragments.find(
    (fragment) =>
      fragment.name === "OpenAttestationEthereumDocumentStoreStatus"
  );
  return documentStoreFragment?.values?.[0]?.location || "";
};

export const getDocumentHash = (fragments: any[]): string => {
  const hashFragment = fragments.find(
    (fragment) => fragment.name === "OpenAttestationHash"
  );
  return hashFragment?.values?.[0]?.location || "";
};

export const isValidDocument = (fragments: any[]): boolean => {
  const hashValidFragment = fragments.find(
    (fragment) => fragment.name === "OpenAttestationHashValid"
  );
  return hashValidFragment?.values?.[0]?.valid || false;
};

export const getDocumentStatus = (fragments: any[]): string => {
  const statusFragment = fragments.find(
    (fragment) => fragment.name === "OpenAttestationEthereumDocumentStoreStatus"
  );
  return statusFragment?.values?.[0]?.status || "";
};
