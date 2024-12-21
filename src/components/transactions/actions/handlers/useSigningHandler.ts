import { useToast } from "@/components/ui/use-toast";
import { useTransactions } from "@/hooks/useTransactions";
import { ethers } from "ethers";
import TokenRegistryArtifact from "@/contracts/TokenRegistry";
import { useWallet } from "@/contexts/WalletContext";
import { useDocumentStorage } from "./useDocumentStorage";
import { supabase } from "@/integrations/supabase/client";

// Declare global window.ethereum type for TypeScript awareness
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Define the types for transaction and wrapped document
type Transaction = {
  id: string;
  document_subtype: string;
  signature: {
    merkleRoot: string;
  };
};

type WrappedDoc = {
  data?: {
    issuers?: { tokenRegistry: string }[];
  };
  signature: {
    merkleRoot: string;
    proof?: any[];
  };
};

export const useSigningHandler = () => {
  const { toast } = useToast();
  const { invalidateTransactions } = useTransactions();
  const { walletAddress } = useWallet();
  const { storeSignedDocument } = useDocumentStorage();

  const handleSignDocument = async (transaction: Transaction) => {
    let finalDocument: any;
    let transactionHash: string | null = null;
    const isTransferable = transaction.document_subtype === "transferable";

    try {
      if (!walletAddress) {
        throw new Error("Please connect your wallet first");
      }

      console.log("Starting document signing/issuing process for transaction:", transaction.id);
      console.log("Document is transferable:", isTransferable);

      const wrappedFileName = `${transaction.id}_wrapped.json`;
      console.log("Attempting to fetch wrapped document:", wrappedFileName);

      let wrappedDoc: WrappedDoc | null = null;
      try {
        const { data: wrappedDocData, error: fetchError } = await supabase.storage
          .from("wrapped-documents")
          .download(wrappedFileName);

        if (fetchError || !wrappedDocData) {
          console.log("Wrapped document not found or error:", fetchError);
          throw new Error("Failed to get wrapped document");
        }

        const text = await wrappedDocData.text();
        console.log("Retrieved wrapped document text:", text);
        wrappedDoc = JSON.parse(text);
      } catch (error) {
        console.error("Error fetching wrapped document:", error);
        throw new Error("Failed to get wrapped document");
      }

      if (!wrappedDoc) {
        throw new Error("Wrapped document is invalid");
      }

      // Handle the signing/issuing process based on document type
      if (isTransferable && wrappedDoc.data?.issuers?.[0]?.tokenRegistry) {
        // Handling for transferable document
        const { ethereum } = window;
        if (!ethereum) throw new Error("MetaMask not found");

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        console.log("Issuers data:", wrappedDoc.data.issuers);
        const rawRegistryAddress = wrappedDoc.data.issuers[0].tokenRegistry;
        console.log("Raw registry address:", rawRegistryAddress);

        if (!rawRegistryAddress) {
          throw new Error("Token registry address is missing");
        }

        const registryAddress = rawRegistryAddress.split(":").pop();
        console.log("Extracted registry address:", registryAddress);

        if (!registryAddress || !ethers.utils.isAddress(registryAddress)) {
          throw new Error(`Invalid token registry address: ${registryAddress}`);
        }

        const tokenRegistry = new ethers.Contract(
          registryAddress,
          TokenRegistryArtifact.abi,
          signer
        );

        const merkleRoot = wrappedDoc.signature.merkleRoot;
        console.log("Using merkle root as token ID:", merkleRoot);

        console.log("Calling safeMint with params:", { to: walletAddress, tokenId: merkleRoot });
        const mintTx = await tokenRegistry.safeMint(walletAddress, merkleRoot);
        console.log("Mint transaction sent:", mintTx.hash);

        const receipt = await mintTx.wait();
        console.log("Mint transaction confirmed:", receipt);

        transactionHash = receipt.transactionHash.replace("0x", "");

        finalDocument = {
          ...wrappedDoc,
          signature: {
            ...wrappedDoc.signature,
            proof: [transactionHash]
          }
        };
      } else {
        // Handling for non-transferable document
        const signDocument = async (merkleRoot: string, walletAddress: string): Promise<string> => {
  try {
    if (!merkleRoot) {
      throw new Error("Merkle root is undefined or empty");
    }

    console.log("Preparing to sign merkle root:", merkleRoot);

    // Ensure merkleRoot has 0x prefix
    const prefixedMerkleRoot = merkleRoot.startsWith('0x') ? merkleRoot : `0x${merkleRoot}`;
    console.log("Prefixed merkle root:", prefixedMerkleRoot);

    // Convert to bytes using ethers v5 syntax
    const messageBytes = ethers.utils.arrayify(prefixedMerkleRoot);
    console.log("Message bytes:", messageBytes);

    // Request signature from wallet
    if (!window.ethereum) {
      throw new Error("Ethereum provider not found");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    // Sign the message bytes
    const signature = await signer.signMessage(messageBytes);
    console.log("Generated signature:", signature);

    return signature;
  } catch (error) {
    console.error("Error in signDocument:", error);
    throw error;
  }
};

export const signAndStoreDocument = async (
  wrappedDocument: any,
  walletAddress: string,
  transactionId: string
) => {
  try {
    console.log("Starting document signing process with wrapped document:", wrappedDocument);

    // Validate wrapped document structure
    if (!wrappedDocument.signature?.merkleRoot) {
      throw new Error("Invalid wrapped document: missing merkle root");
    }

    // Get signature for the merkle root
    const signature = await signDocument(wrappedDocument.signature.merkleRoot, walletAddress);

    // Create the proof object according to OpenAttestation format
    const proof = {
      type: "OpenAttestationSignature2018",
      created: new Date().toISOString(),
      proofPurpose: "assertionMethod",
      verificationMethod: `did:ethr:${walletAddress}#controller`,
      signature: signature
    };

    // Create the signed document by adding the proof array at the root level
    // without modifying the existing structure
    const signedDocument = {
      ...wrappedDocument,
      proof: [proof]
    };

    console.log("Final signed document structure:", signedDocument);

    // Store the signed document
    const fileName = `${transactionId}_signed.json`;
    const { error: uploadError } = await supabase.storage
      .from('signed-documents')
      .upload(fileName, JSON.stringify(signedDocument, null, 2), {
        contentType: 'application/json',
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } }  = supabase.storage
      .from('signed-documents')
      .getPublicUrl(fileName);

    return {
      signedDocument,
      publicUrl
    };
  } catch (error) {
    console.error("Error in signAndStoreDocument:", error);
    throw error;
  }
};

          }]
        };
      }

      await storeSignedDocument(transaction.id, finalDocument);

      const newStatus = isTransferable ? "document_issued" : "document_signed";
      console.log(`Updating transaction status to ${newStatus}`);

      const { error: updateError } = await supabase
        .from("transactions")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
          transaction_hash: transactionHash ? `0x${transactionHash}` : null
        })
        .eq("id", transaction.id)
        .select();

      if (updateError) {
        throw updateError;
      }

      await invalidateTransactions();

      toast({
        title: "Success",
        description: `Document ${isTransferable ? "issued" : "signed"} successfully`,
      });
    } catch (error: any) {
      console.error("Error signing/issuing document:", error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${isTransferable ? "issue" : "sign"} document`,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    handleSignDocument
  };
};
