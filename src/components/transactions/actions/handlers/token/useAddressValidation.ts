import { ethers } from 'ethers';

export const useAddressValidation = () => {
  const normalizeTokenRegistryAddress = (rawAddress: string): string => {
    console.log("Normalizing token registry address:", rawAddress);
    
    // Extract the actual address from the end of the string (after the last ':')
    const addressParts = rawAddress.toString().split(':');
    const actualAddress = addressParts[addressParts.length - 1].trim();
    console.log("Extracted actual address:", actualAddress);

    // Ensure the address has the 0x prefix
    const prefixedAddress = actualAddress.startsWith('0x') ? actualAddress : `0x${actualAddress}`;
    console.log("Prefixed address:", prefixedAddress);

    // Validate the address format
    if (!ethers.utils.isAddress(prefixedAddress)) {
      console.error("Invalid address format:", prefixedAddress);
      throw new Error(`Invalid token registry address format: ${prefixedAddress}`);
    }

    // Convert to checksum address
    const normalizedAddress = ethers.utils.getAddress(prefixedAddress);
    console.log("Final normalized address:", normalizedAddress);
    
    return normalizedAddress;
  };

  return {
    normalizeTokenRegistryAddress
  };
};