// Temporary mock for token registry simulation
// TODO: Remove this file after implementing actual token registry
export const createTemporaryRegistryDocument = () => {
  const mockAddress = "0x1234567890123456789012345678901234567890";
  
  return {
    contractAddress: mockAddress,
    network: "sepolia",
    tokenName: "TempRegistry",
    tokenSymbol: "TEMP",
    ethereumAddress: mockAddress
  };
};