export enum EthereumNetworks {
  homestead = "1",
  ropsten = "3",
  rinkeby = "4",
  goerli = "5",
  sepolia = "11155111",
  polygon = "137",
  polygonAmoy = "80002",
  local = "1337",
}

export interface OpenAttestationDNSTextRecord {
  type: "openatts";
  net: "ethereum";
  netId: string;
  addr: string;
  dnssec?: boolean;
}

export const validateEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const formatDNSTxtRecord = (address: string): string => {
  if (!validateEthereumAddress(address)) {
    throw new Error(`Invalid ethereum address: ${address}`);
  }

  const record: OpenAttestationDNSTextRecord = {
    type: "openatts",
    net: "ethereum",
    netId: EthereumNetworks.sepolia,
    addr: address,
  };

  return `type=${record.type} net=${record.net} netId=${record.netId} addr=${record.addr}`;
};