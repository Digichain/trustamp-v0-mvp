import { connect } from "@govtechsg/token-registry";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";

export const useTokenRegistryContract = () => {
  const { toast } = useToast();

  const initializeContract = async (address: string, signer: ethers.Signer) => {
    console.log("Initializing token registry contract at address:", address);
    
    try {
      // Verify we have a valid signer
      const signerAddress = await signer.getAddress();
      console.log("Initializing contract with signer address:", signerAddress);

      // Use OpenAttestation's connect function to get the contract instance
      const tokenRegistry = await connect(address, signer);
      console.log("Successfully connected to token registry at:", address);

      return tokenRegistry;
    } catch (error) {
      console.error("Error initializing token registry:", error);
      toast({
        title: "Error",
        description: "Failed to initialize token registry contract",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    initializeContract,
  };
};