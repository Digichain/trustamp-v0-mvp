import CryptoJS from 'crypto-js';

interface WrappedDocument {
  version: string;
  data: {
    id: string;
    $template: {
      name: string;
      type: string;
      url: string;
    };
    issuers: Array<{
      id: string;
      name: string;
      revocation: {
        type: string;
      };
      identityProof: {
        type: string;
        location: string;
        key: string;
      };
    }> ;
    network: {
      chain: string;
      chainId: string;
    };
    recipient: {
      name: string;
      company: any;
    };
    invoiceDetails: any;
  };
  signature: {
    type: string;
    targetHash: string;
    proof: any[];
    merkleRoot: string;
  };
}

const generateHash = (data: any): string => {
  const jsonString = JSON.stringify(data, Object.keys(data).sort());
  console.log("Generating hash for data:", jsonString);

  const wordArray = CryptoJS.SHA3(jsonString, { outputLength: 256 });
  const hash = wordArray.toString(CryptoJS.enc.Hex);
  console.log("Generated hash:", hash);

  return hash;
};

const generateSalt = (): string => {
  return crypto.randomUUID();
};

const saltData = (data: any): any => {
  console.log("Starting data salting process with:", data);

  if (Array.isArray(data)) {
    return data.map(item => saltData(item));
  }

  if (typeof data === 'object' && data !== null) {
    const salted: any = {};
    const orderedKeys = [
      'id',
      '$template',
      'issuers',
      'recipient',
      'network',
      'invoiceDetails',
      ...Object.keys(data).filter(key =>
        !['id', '$template', 'issuers', 'recipient', 'network', 'invoiceDetails'].includes(key)
      )
    ].filter(key => key in data);

    for (const key of orderedKeys) {
      if (data[key] === null || data[key] === undefined) {
        salted[key] = data[key];
      } else if (typeof data[key] === 'object') {
        salted[key] = saltData(data[key]);
      } else {
        const salt = generateSalt();
        const value = data[key].toString();
        const type = typeof data[key];
        salted[key] = `${salt}:${type}:${value}`;
      }
    }
    console.log("Salted data result:", salted);
    return salted;
  }

  return data;
};

export const wrapDocument = (rawDocument: any): WrappedDocument => {
  console.log("Starting document wrapping process with raw document:", rawDocument);

  if (!rawDocument.id || !rawDocument.$template) {
    console.error("Document missing required fields:", rawDocument);
    throw new Error("Document must have id and $template fields");
  }

  // Create a deep copy and ensure correct property order
  const orderedDocument = {
    version: rawDocument.version,
    data: saltData({
      id: rawDocument.id,
      $template: rawDocument.$template,
      issuers: rawDocument.issuers,
      recipient: rawDocument.recipient,
      network: rawDocument.network,
      invoiceDetails: rawDocument.invoiceDetails
    }),
    signature: {
      type: "SHA3MerkleProof",
      targetHash: "",
      proof: [],
      merkleRoot: ""
    }
  };

  console.log("Document prepared with ordered properties:", orderedDocument);

  // Generate the target hash from the salted data
  const targetHash = generateHash(orderedDocument.data);
  console.log("Generated target hash:", targetHash);

  // For single documents, merkle root is the same as target hash
  orderedDocument.signature.targetHash = targetHash;
  orderedDocument.signature.merkleRoot = targetHash;

  console.log("Final wrapped document structure:", orderedDocument);
  return orderedDocument;
};
