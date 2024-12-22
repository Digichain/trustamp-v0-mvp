import { Static, Boolean, String, Literal, Record, Union, Partial } from "runtypes";

export const RecordTypesT = Literal("openatts");
export const BlockchainNetworkT = Literal("ethereum");

export const EthereumAddressT = String.withConstraint((maybeAddress: string) => {
  return /0x[a-fA-F0-9]{40}/.test(maybeAddress) || `${maybeAddress} is not a valid ethereum address`;
});

export enum EthereumNetworks {
  mainnet = "1",
  sepolia = "11155111"
}

export const EthereumNetworkIdT = Union(
  Literal(EthereumNetworks.mainnet),
  Literal(EthereumNetworks.sepolia)
);

export const OpenAttestationDNSTextRecordT = Record({
  type: RecordTypesT,
  net: BlockchainNetworkT,
  netId: EthereumNetworkIdT,
  addr: EthereumAddressT,
}).And(
  Partial({
    dnssec: Boolean,
  })
);

export type BlockchainNetwork = Static<typeof BlockchainNetworkT>;
export type EthereumAddress = Static<typeof EthereumAddressT>;
export type OpenAttestationDNSTextRecord = Static<typeof OpenAttestationDNSTextRecordT>;
export type RecordTypes = Static<typeof RecordTypesT>;

export const formatDNSTxtRecord = (documentStoreAddress: string): string => {
  // Format the record as a string following OpenAttestation DNS TXT record format for Document Store
  // The format should be: openatts net=ethereum netId=11155111 addr=0x1234... type=DNS-TXT
  return `openatts net=ethereum netId=${EthereumNetworks.sepolia} addr=${documentStoreAddress.toLowerCase()}`;
};

// Helper function to validate Document Store address format
export const isValidDocumentStoreAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};