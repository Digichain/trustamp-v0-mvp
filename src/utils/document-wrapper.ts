import CryptoJS from 'crypto-js';

interface WrappedDocument {
  version: string;
  data: any;
  signature: {
    type: string;
    targetHash: string;
    proof: any[];
    merkleRoot: string;
  };
}

const generateHash = (data: any): string => {
  const jsonString = JSON.stringify(data);
  const wordArray = CryptoJS.SHA3(jsonString, { outputLength: 256 });
  return '0x' + wordArray.toString(CryptoJS.enc.Hex);
};

const generateSalt = (): string => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0].toString(36);
};

const saltData = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(item => saltData(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const salted: any = {};
    for (const key in data) {
      if (data[key] === null || data[key] === undefined) {
        salted[key] = data[key];
      } else if (typeof data[key] === 'string') {
        salted[key] = `${generateSalt()}:string:${data[key]}`;
      } else if (typeof data[key] === 'number') {
        salted[key] = `${generateSalt()}:number:${data[key]}`;
      } else if (typeof data[key] === 'boolean') {
        salted[key] = `${generateSalt()}:boolean:${data[key]}`;
      } else if (typeof data[key] === 'object') {
        salted[key] = saltData(data[key]);
      } else {
        salted[key] = data[key];
      }
    }
    return salted;
  }
  
  return data;
};

export const wrapDocument = (rawDocument: any): WrappedDocument => {
  // Ensure the document has the required OpenAttestation structure
  const documentWithTemplate = {
    ...rawDocument,
    $template: {
      name: "INVOICE",
      type: "EMBEDDED_RENDERER",
      url: "https://generic-templates.openattestation.com"
    }
  };

  // Salt the data according to OpenAttestation format
  const saltedData = saltData(documentWithTemplate);
  
  // Generate the target hash using SHA3
  const targetHash = generateHash(saltedData);
  
  // Create the wrapped document with merkle root
  const wrappedDoc: WrappedDocument = {
    version: "https://schema.openattestation.com/2.0/schema.json",
    data: saltedData,
    signature: {
      type: "SHA3MerkleProof",
      targetHash,
      proof: [],
      merkleRoot: targetHash // For single documents, merkleRoot is the same as targetHash
    }
  };

  console.log("Wrapped document:", wrappedDoc);
  console.log("Merkle root:", wrappedDoc.signature.merkleRoot);
  return wrappedDoc;
};