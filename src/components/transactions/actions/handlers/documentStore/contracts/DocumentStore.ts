// Contract ABI definition
export const DOCUMENT_STORE_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getMerkleRoot",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "merkleRoot",
        "type": "string"
      }
    ],
    "name": "isMerkleRootIssued",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "merkleRoot",
        "type": "string"
      }
    ],
    "name": "safeMint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Contract bytecode
export const DOCUMENT_STORE_BYTECODE = "0x608060405234801561001057600080fd5b50336040518060400160405280600d81526020017f446f63756d656e7453746f7265000000000000000000000000000000000000008152506040518060400160405280600381526020017f444f430000000000000000000000000000000000000000000000000000000000815250815f90816200008e919062000455565b508060019081620000a0919062000455565b5050505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160362000116575f6040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016200010d91906200057c565b60405180910390fd5b62000127816200012e60201b60201c565b5062000597565b5f60065f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160065f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f60028204905060018216806200026d57607f821691505b60208210810362000283576200028262000228565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f60088302620002e77fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620002aa565b620002f38683620002aa565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f6200033d6200033762000331846200030b565b62000314565b6200030b565b9050919050565b5f819050919050565b62000358836200031d565b62000370620003678262000344565b848454620002b6565b825550505050565b5f90565b6200038662000378565b620003938184846200034d565b505050565b5b81811015620003ba57620003ae5f826200037c565b60018101905062000399565b5050565b601f8211156200040957620003d38162000289565b620003de846200029b565b81016020851015620003ee578190505b62000406620003fd856200029b565b83018262000398565b50505b505050565b5f82821c905092915050565b5f6200042b5f19846008026200040e565b1980831691505092915050565b5f6200044583836200041a565b9150826002028217905092915050565b6200046082620001f1565b67ffffffffffffffff8111156200047c576200047b620001fb565b5b62000488825462000255565b62000495828285620003be565b5f60209050601f831160018114620004cb575f8415620004b6578287015190505b620004c2858262000438565b86555062000531565b601f198416620004db8662000289565b5f5b828110156200050457848901518255600182019150602085019450602081019050620004dd565b8683101562000524578489015162000520601f8916826200041a565b8355505b6001600288020188555050505b505050505050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f620005648262000539565b9050919050565b620005768162000558565b82525050565b5f602082019050620005915f8301846200056b565b92915050565b61262080620005a55f395ff3fe608060405234801561000f575f80fd5b506004361061011f575f3560e01c806370b7dc5d116100ab578063b88d4fde1161006f578063b88d4fde14610317578063c87b56dd14610333578063d204c45e14610363578063e985e9c51461037f578063f2fde38b146103af5761011f565b806370b7dc5d14610285578063715018a6146102b55780638da5cb5b146102bf57806395d89b41146102dd578063a22cb465146102fb5761011f565b80630aab8ba5116100f25780630aab8ba5146101bd57806323b872dd146101ed57806342842e0e146102095780636352211e1461022557806370a08231146102555761011f565b806301ffc9a71461012357806306fdde0314610153578063081812fc14610171578063095ea7b3146101a1575b5f80fd5b61013d60048036038101906101389190611a92565b6103cb565b60405161014a9190611ad7565b60405180910390f35b61015b6104ac565b6040516101689190611b7a565b60405180910390f35b61018b60048036038101906101869190611bcd565b61053b565b6040516101989190611c37565b60405180910390f35b6101bb60048036038101906101b69190611c7a565b610556565b005b6101d760048036038101906101d29190611bcd565b61056c565b6040516101e49190611b7a565b60405180910390f35b61020760048036038101906102029190611cb8565b61060d565b005b610223600480360381019061021e9190611cb8565b61070c565b005b61023f600480360381019061023a9190611bcd565b61072b565b60405161024c9190611c37565b60405180910390f35b61026f600480360381019061026a9190611d08565b61073c565b60405161027c9190611d42565b60405180910390f35b61029f600480360381019061029a9190611e87565b6107f2565b6040516102ac9190611ad7565b60405180910390f35b6102bd6108d5565b005b6102c76108e8565b6040516102d49190611c37565b60405180910390f35b6102e5610910565b6040516102f29190611b7a565b60405180910390f35b61031560048036038101906103109190611ef8565b6109a0565b005b610331600480360381019061032c9190611fd4565b6109b6565b005b61034d60048036038101906103489190611bcd565b6109db565b60405161035a9190611b7a565b60405180910390f35b61037d60048036038101906103789190612054565b610a41565b005b610399600480360381019061039491906120ae565b610a90565b6040516103a69190611ad7565b60405180910390f35b6103c960048036038101906103c49190611d08565b610b1e565b005b5f7f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061049557507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b806104a557506104a482610ba2565b5b9050919050565b60605f80546104ba90612119565b80601f01602080910402602001604051908101604052809291908181526020018280546104e690612119565b80156105315780601f1061050857610100808354040283529160200191610531565b820191905f5260205f20905b81548152906001019060200180831161051457829003601f168201915b5050505050905090565b5f61054582610c0b565b5061054f82610c91565b9050919050565b6105688282610563610cca565b610cd1565b5050565b606060075f8381526020019081526020015f20805461058a90612119565b80601f01602080910402602001604051908101604052809291908181526020018280546105b690612119565b80156106015780601f106105d857610100808354040283529160200191610601565b820191905f5260205f20905b8154815290600101906020018083116105e457829003601f168201915b50505050509050919050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361067d575f6040517f64a0ae920000000000000000000000000000000000000000000000000000000081526004016106749190611c37565b60405180910390fd5b5f610690838361068b610cca565b610ce3565b90508373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610706578382826040517f64283d7b0000000000000000000000000000000000000000000000000000000081526004016106fd93929190612149565b60405180910390fd5b50505050565b61072683838360405180602001604052805f8152506109b6565b505050565b5f61073582610c0b565b9050919050565b5f8073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036107ad575f6040517f89c62b640000000000000000000000000000000000000000000000000000000081526004016107a49190611c37565b60405180910390fd5b60035f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b5f805f90505b6008548110156108cb575f60075f8381526020019081526020015f20805461081f90612119565b80601f016020809104026020016040519081016040528092919081815260200182805461084b90612119565b80156108965780601f1061086d57610100808354040283529160200191610896565b820191905f5260205f20905b81548152906001019060200180831161087957829003601f168201915b5050505050905083805190602001208180519060200120036108bd576001925050506108d0565b5080806001019150506107f8565b505f90505b919050565b6108dd610eee565b6108e65f610f75565b565b5f60065f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60606001805461091f90612119565b80601f016020809104026020016040519081016040528092919081815260200182805461094b90612119565b80156109965780601f1061096d57610100808354040283529160200191610996565b820191905f5260205f20905b81548152906001019060200180831161097957829003601f168201915b5050505050905090565b6109b26109ab610cca565b8383611038565b5050565b6109c184848461060d565b6109d56109cc610cca565b858585856111a1565b50505050565b60606109e682610c0b565b505f6109f061134d565b90505f815111610a0e5760405180602001604052805f815250610a39565b80610a1884611363565b604051602001610a299291906121b8565b6040516020818303038152906040525b915050919050565b610a49610eee565b5f60085f815480929190610a5c90612208565b9190505590508160075f8381526020019081526020015f209081610a8091906123ec565b50610a8b838261142d565b505050565b5f60055f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16905092915050565b610b26610eee565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610b96575f6040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401610b8d9190611c37565b60405180910390fd5b610b9f81610f75565b50565b5f7f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b5f80610c168361144a565b90505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610c8857826040517f7e273289000000000000000000000000000000000000000000000000000000008152600401610c7f9190611d42565b60405180910390fd5b80915050919050565b5f60045f8381526020019081526020015f205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b5f33905090565b610cde8383836001611483565b505050565b5f80610cee8461144a565b90505f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614610d2f57610d2e818486611642565b5b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610dba57610d6e5f855f80611483565b600160035f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825403925050819055505b5f73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614610e3957600160035f8773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8460025f8681526020019081526020015f205f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4809150509392505050565b610ef6610cca565b73ffffffffffffffffffffffffffffffffffffffff16610f146108e8565b73ffffffffffffffffffffffffffffffffffffffff1614610f7357610f37610cca565b6040517f118cdaa7000000000000000000000000000000000000000000000000000000008152600401610f6a9190611c37565b60405180910390fd5b565b5f60065f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160065f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036110a857816040517f5b08ba1800000000000000000000000000000000000000000000000000000000815260040161109f9190611c37565b60405180910390fd5b8060055f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31836040516111949190611ad7565b60405180910390a3505050565b5f8373ffffffffffffffffffffffffffffffffffffffff163b1115611346578273ffffffffffffffffffffffffffffffffffffffff1663150b7a02868685856040518563ffffffff1660e01b81526004016111ff949392919061250d565b6020604051808303815f875af192505050801561123a57506040513d601f19601f82011682018060405250810190611237919061256b565b60015b6112bb573d805f8114611268576040519150601f19603f3d011682016040523d82523d5f602084013e61126d565b606091505b505f8151036112b357836040517f64a0ae920000000000000000000000000000000000000000000000000000000081526004016112aa9190611c37565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161461134457836040517f64a0ae9200000000000000000000000000000000000000000000000000000000815260040161133b9190611c37565b60405180910390fd5b505b5050505050565b606060405180602001604052805f815250905090565b60605f600161137184611705565b0190505f8167ffffffffffffffff81111561138f5761138e611d63565b5b6040519080825280601f01601f1916602001820160405280156113c15781602001600182028036833780820191505090505b5090505f82602001820190505b600115611422578080600190039150507f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a858161141757611416612596565b5b0494505f85036113ce575b819350505050919050565b611446828260405180602001604052805f815250611856565b5050565b5f60025f8381526020019081526020015f205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b80806114bb57505f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b156115ed575f6114ca84610c0b565b90505f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415801561153457508273ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614155b801561154757506115458184610a90565b155b1561158957826040517fa9fbf51f0000000000000000000000000000000000000000000000000000000081526004016115809190611c37565b60405180910390fd5b81156115eb57838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45b505b8360045f8581526020019081526020015f205f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050565b61164d838383611879565b611700575f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036116c157806040517f7e2732890000000000000000000000000000000000000000000000000000000081526004016116b89190611d42565b60405180910390fd5b81816040517f177e802f0000000000000000000000000000000000000000000000000000000081526004016116f79291906125c3565b60405180910390fd5b505050565b5f805f90507a184f03e93ff9f4daa797ed6e38ed64bf6a1f0100000000000000008310611761577a184f03e93ff9f4daa797ed6e38ed64bf6a1f010000000000000000838161175757611756612596565b5b0492506040810190505b6d04ee2d6d415b85acef8100000000831061179e576d04ee2d6d415b85acef8100000000838161179457611793612596565b5b0492506020810190505b662386f26fc1000083106117cd57662386f26fc1000083816117c3576117c2612596565b5b0492506010810190505b6305f5e10083106117f6576305f5e10083816117ec576117eb612596565b5b0492506008810190505b612710831061181b57612710838161181157611810612596565b5b0492506004810190505b6064831061183e576064838161183457611833612596565b5b0492506002810190505b600a831061184d576001810190505b80915050919050565b6118608383611939565b61187461186b610cca565b5f8585856111a1565b505050565b5f8073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415801561193057508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614806118f157506118f08484610a90565b5b8061192f57508273ffffffffffffffffffffffffffffffffffffffff1661191783610c91565b73ffffffffffffffffffffffffffffffffffffffff16145b5b90509392505050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036119a9575f6040517f64a0ae920000000000000000000000000000000000000000000000000000000081526004016119a09190611c37565b60405180910390fd5b5f6119b583835f610ce3565b90505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614611a27575f6040517f73c6ac6e000000000000000000000000000000000000000000000000000000008152600401611a1e9190611c37565b60405180910390fd5b505050565b5f604051905090565b5f80fd5b5f80fd5b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b611a7181611a3d565b8114611a7b575f80fd5b50565b5f81359050611a8c81611a68565b92915050565b5f60208284031215611aa757611aa6611a35565b5b5f611ab484828501611a7e565b91505092915050565b5f8115159050919050565b611ad181611abd565b82525050565b5f602082019050611aea5f830184611ac8565b92915050565b5f81519050919050565b5f82825260208201905092915050565b5f5b83811015611b27578082015181840152602081019050611b0c565b5f8484015250505050565b5f601f19601f8301169050919050565b5f611b4c82611af0565b611b568185611afa565b9350611b66818560208601611b0a565b611b6f81611b32565b840191505092915050565b5f6020820190508181035f830152611b928184611b42565b905092915050565b5f819050919050565b611bac81611b9a565b8114611bb6575f80fd5b50565b5f81359050611bc781611ba3565b92915050565b5f60208284031215611be257611be1611a35565b5b5f611bef84828501611bb9565b91505092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f611c2182611bf8565b9050919050565b611c3181611c17565b82525050565b5f602082019050611c4a5f830184611c28565b92915050565b611c5981611c17565b8114611c63575f80fd5b50565b5f81359050611c7481611c50565b92915050565b5f8060408385031215611c9057611c8f611a35565b5b5f611c9d85828601611c66565b9250506020611cae85828601611bb9565b9150509250929050565b5f805f60608486031215611ccf57611cce611a35565b5b5f611cdc86828701611c66565b9350506020611ced86828701611c66565b9250506040611cfe86828701611bb9565b9150509250925092565b5f60208284031215611d1d57611d1c611a35565b5b5f611d2a84828501611c66565b91505092915050565b611d3c81611b9a565b82525050565b5f602082019050611d555f830184611d33565b92915050565b5f80fd5b5f80fd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b611d9982611b32565b810181811067ffffffffffffffff82111715611db857611db7611d63565b5b80604052505050565b5f611dca611a2c565b9050611dd68282611d90565b919050565b5f67ffffffffffffffff821115611df557611df4611d63565b5b611dfe82611b32565b9050602081019050919050565b828183375f83830152505050565b5f611e2b611e2684611ddb565b611dc1565b905082815260208101848484011115611e4757611e46611d5f565b5b611e52848285611e0b565b509392505050565b5f82601f830112611e6e57611e6d611d5b565b5b8135611e7e848260208601611e19565b91505092915050565b5f60208284031215611e9c57611e9b611a35565b5b5f82013567ffffffffffffffff811115611eb957611eb8611a39565b5b611ec584828501611e5a565b91505092915050565b611ed781611abd565b8114611ee1575f80fd5b50565b5f81359050611ef281611ece565b92915050565b5f8060408385031215611f0e57611f0d611a35565b5b5f611f1b85828601611c66565b9250506020611f2c85828601611ee4565b9150509250929050565b5f67ffffffffffffffff821115611f5057611f4f611d63565b5b611f5982611b32565b9050602081019050919050565b5f611f78611f7384611f36565b611dc1565b905082815260208101848484011115611f9457611f93611d5f565b5b611f9f848285611e0b565b509392505050565b5f82601f830112611fbb57611fba611d5b565b5b8135611fcb848260208601611f66565b91505092915050565b5f805f8060808587031215611fec57611feb611a35565b5b5f611ff987828801611c66565b945050602061200a87828801611c66565b935050604061201b87828801611bb9565b925050606085013567ffffffffffffffff81111561203c5761203b611a39565b5b61204887828801611fa7565b91505092959194509250565b5f806040838503121561206a57612069611a35565b5b5f61207785828601611c66565b925050602083013567ffffffffffffffff81111561209857612097611a39565b5b6120a485828601611e5a565b9150509250929050565b5f80604083850312156120c4576120c3611a35565b5b5f6120d185828601611c66565b92505060206120e285828601611c66565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061213057607f821691505b602082108103612143576121426120ec565b5b50919050565b5f60608201905061215c5f830186611c28565b6121696020830185611d33565b6121766040830184611c28565b949350505050565b5f81905092915050565b5f61219282611af0565b61219c818561217e565b93506121ac818560208601611b0a565b80840191505092915050565b5f6121c38285612188565b91506121cf8284612188565b91508190509392505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61221282611b9a565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203612244576122436121db565b5b600182019050919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f60088302620002e77fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82612270565b6122b58683612270565b95508019841693508086168417925050509392505050565b5f819050919050565b5f6122f06122eb6122e684611b9a565b6122cd565b611b9a565b9050919050565b5f819050919050565b612309836122d6565b61231d612315826122f7565b84845461227c565b825550505050565b5f90565b612331612325565b61233c818484612300565b505050565b5b8181101561235f576123545f82612329565b600181019050612342565b5050565b601f8211156123a4576123758161224f565b61237e84612261565b8101602085101561238d578190505b6123a161239985612261565b830182612341565b50505b505050565b5f82821c905092915050565b5f6123c45f19846008026123a9565b1980831691505092915050565b5f6123dc83836123b5565b9150826002028217905092915050565b6123f582611af0565b67ffffffffffffffff81111561240e5761240d611d63565b5b6124188254612119565b612423828285612363565b5f60209050601f831160018114612454575f8415612442578287015190505b61244c85826123d1565b8655506124b3565b601f1984166124628661224f565b5f5b8281101561248957848901518255600182019150602085019450602081019050612464565b868310156124a657848901516124a2601f8916826123b5565b8355505b6001600288020188555050505b505050505050565b5f81519050919050565b5f82825260208201905092915050565b5f6124df826124bb565b6124e981856124c5565b93506124f9818560208601611b0a565b61250281611b32565b840191505092915050565b5f6080820190506125205f830187611c28565b61252d6020830186611c28565b61253a6040830185611d33565b818103606083015261254c81846124d5565b905095945050505050565b5f8151905061256581611a68565b92915050565b5f602082840312156125805761257f611a35565b5b5f61258d84828501612557565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601260045260245ffd5b5f6040820190506125d65f830185611c28565b6125e36020830184611d33565b939250505056fea2646970667358221220e93be3ca67aad89dd8edb196c5906541856295b66f2d693f0aeda18c71d4e45764736f6c63430008160033";