export interface DIDDocument {
  id: string;
  type: string;
  controller: string;
  ethereumAddress: string;
  dnsLocation: string;
}

export interface TokenRegistryDocument {
  contractAddress: string;
  name: string;
  symbol: string;
  dnsLocation: string;
}
