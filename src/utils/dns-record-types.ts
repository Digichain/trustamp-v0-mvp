import { Type, Static } from '@sinclair/typebox';

export enum EthereumNetworks {
  mainnet = "1",
  sepolia = "11155111"
}

export const OpenAttestationDNSTextRecordT = Type.Object({
  type: Type.String(),
  net: Type.String(),
  netId: Type.String(),
  addr: Type.String(),
});

export type OpenAttestationDNSTextRecord = Static<typeof OpenAttestationDNSTextRecordT>;

export const RecordTypesT = Type.Union([
  Type.Object({
    type: Type.Literal('DOCUMENT_STORE'),
    addr: Type.String(),
  }),
  Type.Object({
    type: Type.Literal('TOKEN_REGISTRY'),
    addr: Type.String(),
  }),
  Type.Object({
    type: Type.Literal('DNS-TXT'),
    value: Type.String(),
  }),
  Type.Object({
    type: Type.Literal('DID'),
    addr: Type.String(),
  }),
]);

export type RecordTypes = Static<typeof RecordTypesT>;

export const formatDNSTxtRecord = (address: string): string => {
  // Format the record as a string following DNS TXT record format
  // The format should be: openatts net=ethereum netId=11155111 addr=0x1234...
  // Ensure address is lowercase for consistency
  return `openatts net=ethereum netId=${EthereumNetworks.sepolia} addr=${address.toLowerCase()}`;
};