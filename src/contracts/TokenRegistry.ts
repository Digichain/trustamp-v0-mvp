export const TokenRegistryArtifact = {
  abi: [
    "constructor(string memory _name, string memory _symbol)",
    "function name() public view returns (string memory)",
    "function symbol() public view returns (string memory)",
    "function mint(address to, uint256 tokenId) public",
    "function ownerOf(uint256 tokenId) public view returns (address)",
    "function transferFrom(address from, address to, uint256 tokenId) public"
    [
    {
      "inputs": 
        [ 			
          { 				
            "internalType": "address",
            "name": "initialOwner",
            "type": "address"
          }
        ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    { 		
      "inputs":
        [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
      "name": "ERC721IncorrectOwner",
      "type": "error"
    },
    {
      "inputs":
        [
          {
            "internalType": "address",
            "name": "operator",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
      "name": "ERC721InsufficientApproval",
      "type": "error"
    },
    { 
      "inputs":
        [
          {
            "internalType": "address",
            "name": "approver",
            "type": "address"
          }
        ],
      "name": "ERC721InvalidApprover",
      "type": "error"
    },
    {
      "inputs":
        [
          {
            "internalType": "address",
            "name": "operator",
            "type": "address"
          }
        ],
      "name": "ERC721InvalidOperator",
      "type": "error"
    },
    {
      "inputs":
        [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
      "name": "ERC721InvalidOwner",
      "type": "error"
    },
    {
      "inputs":
        [
          {
            "internalType": "address",
            "name": "receiver",
            "type": "address"
          }
        ],
      "name": "ERC721InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [ 
        { 	
          "internalType": "address", 	
          "name": "sender", 			
          "type": "address" 	
        } 	
      ], 
      "name": "ERC721InvalidSender",
      "type": "error"
    }, 	
    {
      "inputs": [ 			
        { 
          "internalType": "uint256", 
          "name": "tokenId", 	
          "type": "uint256" 
        } 		
      ], 	
      "name": "ERC721NonexistentToken", 
      "type": "error" 
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
          "indexed": true, 				"internalType": "address", 				"name": "previousOwner", 				"type": "address" 			}, 			{ 				"indexed": true, 				"internalType": "address", 				"name": "newOwner", 				"type": "address" 			} 		], 		"name": "OwnershipTransferred", 		"type": "event" 	}, 	{ 		"anonymous": false, 		"inputs": [ 			{ 				"indexed": true, 				"internalType": "address", 				"name": "from", 				"type": "address" 			}, 			{ 				"indexed": true, 				"internalType": "address", 				"name": "to", 				"type": "address" 			}, 			{ 				"indexed": true, 				"internalType": "uint256", 				"name": "tokenId", 				"type": "uint256" 			} 		], 		"name": "Transfer", 		"type": "event" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "address", 				"name": "to", 				"type": "address" 			}, 			{ 				"internalType": "uint256", 				"name": "tokenId", 				"type": "uint256" 			} 		], 		"name": "approve", 		"outputs": [], 		"stateMutability": "nonpayable", 		"type": "function" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "address", 				"name": "owner", 				"type": "address" 			} 		], 		"name": "balanceOf", 		"outputs": [ 			{ 				"internalType": "uint256", 				"name": "", 				"type": "uint256" 			} 		], 		"stateMutability": "view", 		"type": "function" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "uint256", 				"name": "tokenId", 				"type": "uint256" 			} 		], 		"name": "getApproved", 		"outputs": [ 			{ 				"internalType": "address", 				"name": "", 				"type": "address" 			} 		], 		"stateMutability": "view", 		"type": "function" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "address", 				"name": "owner", 				"type": "address" 			}, 			{ 				"internalType": "address", 				"name": "operator", 				"type": "address" 			} 		], 		"name": "isApprovedForAll", 		"outputs": [ 			{ 				"internalType": "bool", 				"name": "", 				"type": "bool" 			} 		], 		"stateMutability": "view", 		"type": "function" 	}, 	{ 		"inputs": [], 		"name": "name", 		"outputs": [ 			{ 				"internalType": "string", 				"name": "", 				"type": "string" 			} 		], 		"stateMutability": "view", 		"type": "function" 	}, 	{ 		"inputs": [], 		"name": "owner", 		"outputs": [ 			{ 				"internalType": "address", 				"name": "", 				"type": "address" 			} 		], 		"stateMutability": "view", 		"type": "function" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "uint256", 				"name": "tokenId", 				"type": "uint256" 			} 		], 		"name": "ownerOf", 		"outputs": [ 			{ 				"internalType": "address", 				"name": "", 				"type": "address" 			} 		], 		"stateMutability": "view", 		"type": "function" 	}, 	{ 		"inputs": [], 		"name": "renounceOwnership", 		"outputs": [], 		"stateMutability": "nonpayable", 		"type": "function" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "address", 				"name": "to", 				"type": "address" 			}, 			{ 				"internalType": "uint256", 				"name": "tokenId", 				"type": "uint256" 			} 		], 		"name": "safeMint", 		"outputs": [], 		"stateMutability": "nonpayable", 		"type": "function" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "address", 				"name": "from", 				"type": "address" 			}, 			{ 				"internalType": "address", 				"name": "to", 				"type": "address" 			}, 			{ 				"internalType": "uint256", 				"name": "tokenId", 				"type": "uint256" 			} 		], 		"name": "safeTransferFrom", 		"outputs": [], 		"stateMutability": "nonpayable", 		"type": "function" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "address", 				"name": "from", 				"type": "address" 			}, 			{ 				"internalType": "address", 				"name": "to", 				"type": "address" 			}, 			{ 				"internalType": "uint256", 				"name": "tokenId", 				"type": "uint256" 			}, 			{ 				"internalType": "bytes", 				"name": "data", 				"type": "bytes" 			} 		], 		"name": "safeTransferFrom", 		"outputs": [], 		"stateMutability": "nonpayable", 		"type": "function" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "address", 				"name": "operator", 				"type": "address" 			}, 			{ 				"internalType": "bool", 				"name": "approved", 				"type": "bool" 			} 		], 		"name": "setApprovalForAll", 		"outputs": [], 		"stateMutability": "nonpayable", 		"type": "function" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "bytes4", 				"name": "interfaceId", 				"type": "bytes4" 			} 		], 		"name": "supportsInterface", 		"outputs": [ 			{ 				"internalType": "bool", 				"name": "", 				"type": "bool" 			} 		], 		"stateMutability": "view", 		"type": "function" 	}, 	{ 		"inputs": [], 		"name": "symbol", 		"outputs": [ 			{ 				"internalType": "string", 				"name": "", 				"type": "string" 			} 		], 		"stateMutability": "view", 		"type": "function" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "uint256", 				"name": "tokenId", 				"type": "uint256" 			} 		], 		"name": "tokenURI", 		"outputs": [ 			{ 				"internalType": "string", 				"name": "", 				"type": "string" 			} 		], 		"stateMutability": "view", 		"type": "function" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "address", 				"name": "from", 				"type": "address" 			}, 			{ 				"internalType": "address", 				"name": "to", 				"type": "address" 			}, 			{ 				"internalType": "uint256", 				"name": "tokenId", 				"type": "uint256" 			} 		], 		"name": "transferFrom", 		"outputs": [], 		"stateMutability": "nonpayable", 		"type": "function" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "address", 				"name": "newOwner", 				"type": "address" 			} 		], 		"name": "transferOwnership", 		"outputs": [], 		"stateMutability": "nonpayable", 		"type": "function" 	} ]
  ],
  bytecode: "0x608060405234801561000f575f80fd5b5060405161258338038061258383398181016040528101906100319190610266565b806040518060400160405280600781526020017f4d79546f6b656e000000000000000000000000000000000000000000000000008152506040518060400160405280600381526020017f4d544b0000000000000000000000000000000000000000000000000000000000815250815f90816100ac91906104cb565b5080600190816100bc91906104cb565b5050505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361012f575f6040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260040161012691906105a9565b60405180910390fd5b61013e8161014560201b60201c565b50506105c2565b5f60065f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160065f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6102358261020c565b9050919050565b6102458161022b565b811461024f575f80fd5b50565b5f815190506102608161023c565b92915050565b5f6020828403121561027b5761027a610208565b5b5f61028884828501610252565b91505092915050565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061030c57607f821691505b60208210810361031f5761031e6102c8565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026103817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610346565b61038b8683610346565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f6103cf6103ca6103c5846103a3565b6103ac565b6103a3565b9050919050565b5f819050919050565b6103e8836103b5565b6103fc6103f4826103d6565b848454610352565b825550505050565b5f90565b610410610404565b61041b8184846103df565b505050565b5b8181101561043e576104335f82610408565b600181019050610421565b5050565b601f8211156104835761045481610325565b61045d84610337565b8101602085101561046c578190505b61048061047885610337565b830182610420565b50505b505050565b5f82821c905092915050565b5f6104a35f1984600802610488565b1980831691505092915050565b5f6104bb8383610494565b9150826002028217905092915050565b6104d482610291565b67ffffffffffffffff8111156104ed576104ec61029b565b5b6104f782546102f5565b610502828285610442565b5f60209050601f831160018114610533575f8415610521578287015190505b61052b85826104b0565b865550610592565b601f19841661054186610325565b5f5b8281101561056857848901518255600182019150602085019450602081019050610543565b868310156105855784890151610581601f891682610494565b8355505b6001600288020188555050505b505050505050565b6105a38161022b565b82525050565b5f6020820190506105bc5f83018461059a565b92915050565b611fb4806105cf5f395ff3fe608060405234801561000f575f80fd5b5060043610610109575f3560e01c8063715018a6116100a0578063a22cb4651161006f578063a22cb465146102a1578063b88d4fde146102bd578063c87b56dd146102d9578063e985e9c514610309578063f2fde38b1461033957610109565b8063715018a61461023f5780638da5cb5b1461024957806395d89b4114610267578063a14481941461028557610109565b806323b872dd116100dc57806323b872dd146101a757806342842e0e146101c35780636352211e146101df57806370a082311461020f57610109565b806301ffc9a71461010d57806306fdde031461013d578063081812fc1461015b578063095ea7b31461018b575b5f80fd5b6101276004803603810190610122919061185f565b610355565b60405161013491906118a4565b60405180910390f35b610145610436565b604051610152919061192d565b60405180910390f35b61017560048036038101906101709190611980565b6104c5565b60405161018291906119ea565b60405180910390f35b6101a560048036038101906101a09190611a2d565b6104e0565b005b6101c160048036038101906101bc9190611a6b565b6104f6565b005b6101dd60048036038101906101d89190611a6b565b6105f5565b005b6101f960048036038101906101f49190611980565b610614565b60405161020691906119ea565b60405180910390f35b61022960048036038101906102249190611abb565b610625565b6040516102369190611af5565b60405180910390f35b6102476106db565b005b6102516106ee565b60405161025e91906119ea565b60405180910390f35b61026f610716565b60405161027c919061192d565b60405180910390f35b61029f600480360381019061029a9190611a2d565b6107a6565b005b6102bb60048036038101906102b69190611b38565b6107bc565b005b6102d760048036038101906102d29190611ca2565b6107d2565b005b6102f360048036038101906102ee9190611980565b6107f7565b604051610300919061192d565b60405180910390f35b610323600480360381019061031e9190611d22565b61085d565b60405161033091906118a4565b60405180910390f35b610353600480360381019061034e9190611abb565b6108eb565b005b5f7f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061041f57507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b8061042f575061042e8261096f565b5b9050919050565b60605f805461044490611d8d565b80601f016020809104026020016040519081016040528092919081815260200182805461047090611d8d565b80156104bb5780601f10610492576101008083540402835291602001916104bb565b820191905f5260205f20905b81548152906001019060200180831161049e57829003601f168201915b5050505050905090565b5f6104cf826109d8565b506104d982610a5e565b9050919050565b6104f282826104ed610a97565b610a9e565b5050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610566575f6040517f64a0ae9200000000000000000000000000000000000000000000000000000000815260040161055d91906119ea565b60405180910390fd5b5f6105798383610574610a97565b610ab0565b90508373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146105ef578382826040517f64283d7b0000000000000000000000000000000000000000000000000000000081526004016105e693929190611dbd565b60405180910390fd5b50505050565b61060f83838360405180602001604052805f8152506107d2565b505050565b5f61061e826109d8565b9050919050565b5f8073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610696575f6040517f89c62b6400000000000000000000000000000000000000000000000000000000815260040161068d91906119ea565b60405180910390fd5b60035f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b6106e3610cbb565b6106ec5f610d42565b565b5f60065f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60606001805461072590611d8d565b80601f016020809104026020016040519081016040528092919081815260200182805461075190611d8d565b801561079c5780601f106107735761010080835404028352916020019161079c565b820191905f5260205f20905b81548152906001019060200180831161077f57829003601f168201915b5050505050905090565b6107ae610cbb565b6107b88282610e05565b5050565b6107ce6107c7610a97565b8383610e22565b5050565b6107dd8484846104f6565b6107f16107e8610a97565b85858585610f8b565b50505050565b6060610802826109d8565b505f61080c611137565b90505f81511161082a5760405180602001604052805f815250610855565b806108348461114d565b604051602001610845929190611e2c565b6040516020818303038152906040525b915050919050565b5f60055f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16905092915050565b6108f3610cbb565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610963575f6040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260040161095a91906119ea565b60405180910390fd5b61096c81610d42565b50565b5f7f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b5f806109e383611217565b90505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610a5557826040517f7e273289000000000000000000000000000000000000000000000000000000008152600401610a4c9190611af5565b60405180910390fd5b80915050919050565b5f60045f8381526020019081526020015f205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b5f33905090565b610aab8383836001611250565b505050565b5f80610abb84611217565b90505f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614610afc57610afb81848661140f565b5b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610b8757610b3b5f855f80611250565b600160035f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825403925050819055505b5f73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614610c0657600160035f8773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8460025f8681526020019081526020015f205f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4809150509392505050565b610cc3610a97565b73ffffffffffffffffffffffffffffffffffffffff16610ce16106ee565b73ffffffffffffffffffffffffffffffffffffffff1614610d4057610d04610a97565b6040517f118cdaa7000000000000000000000000000000000000000000000000000000008152600401610d3791906119ea565b60405180910390fd5b565b5f60065f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160065f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b610e1e828260405180602001604052805f8152506114d2565b5050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610e9257816040517f5b08ba18000000000000000000000000000000000000000000000000000000008152600401610e8991906119ea565b60405180910390fd5b8060055f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051610f7e91906118a4565b60405180910390a3505050565b5f8373ffffffffffffffffffffffffffffffffffffffff163b1115611130578273ffffffffffffffffffffffffffffffffffffffff1663150b7a02868685856040518563ffffffff1660e01b8152600401610fe99493929190611ea1565b6020604051808303815f875af192505050801561102457506040513d601f19601f820116820180604052508101906110219190611eff565b60015b6110a5573d805f8114611052576040519150601f19603f3d011682016040523d82523d5f602084013e611057565b606091505b505f81510361109d57836040517f64a0ae9200000000000000000000000000000000000000000000000000000000815260040161109491906119ea565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161461112e57836040517f64a0ae9200000000000000000000000000000000000000000000000000000000815260040161112591906119ea565b60405180910390fd5b505b5050505050565b606060405180602001604052805f815250905090565b60605f600161115b846114f5565b0190505f8167ffffffffffffffff81111561117957611178611b7e565b5b6040519080825280601f01601f1916602001820160405280156111ab5781602001600182028036833780820191505090505b5090505f82602001820190505b60011561120c578080600190039150507f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a858161120157611200611f2a565b5b0494505f85036111b8575b819350505050919050565b5f60025f8381526020019081526020015f205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b808061128857505f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b156113ba575f611297846109d8565b90505f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415801561130157508273ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614155b80156113145750611312818461085d565b155b1561135657826040517fa9fbf51f00000000000000000000000000000000000000000000000000000000815260040161134d91906119ea565b60405180910390fd5b81156113b857838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45b505b8360045f8581526020019081526020015f205f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050565b61141a838383611646565b6114cd575f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361148e57806040517f7e2732890000000000000000000000000000000000000000000000000000000081526004016114859190611af5565b60405180910390fd5b81816040517f177e802f0000000000000000000000000000000000000000000000000000000081526004016114c4929190611f57565b60405180910390fd5b505050565b6114dc8383611706565b6114f06114e7610a97565b5f858585610f8b565b505050565b5f805f90507a184f03e93ff9f4daa797ed6e38ed64bf6a1f0100000000000000008310611551577a184f03e93ff9f4daa797ed6e38ed64bf6a1f010000000000000000838161154757611546611f2a565b5b0492506040810190505b6d04ee2d6d415b85acef8100000000831061158e576d04ee2d6d415b85acef8100000000838161158457611583611f2a565b5b0492506020810190505b662386f26fc1000083106115bd57662386f26fc1000083816115b3576115b2611f2a565b5b0492506010810190505b6305f5e10083106115e6576305f5e10083816115dc576115db611f2a565b5b0492506008810190505b612710831061160b57612710838161160157611600611f2a565b5b0492506004810190505b6064831061162e576064838161162457611623611f2a565b5b0492506002810190505b600a831061163d576001810190505b80915050919050565b5f8073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141580156116fd57508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614806116be57506116bd848461085d565b5b806116fc57508273ffffffffffffffffffffffffffffffffffffffff166116e483610a5e565b73ffffffffffffffffffffffffffffffffffffffff16145b5b90509392505050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603611776575f6040517f64a0ae9200000000000000000000000000000000000000000000000000000000815260040161176d91906119ea565b60405180910390fd5b5f61178283835f610ab0565b90505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146117f4575f6040517f73c6ac6e0000000000000000000000000000000000000000000000000000000081526004016117eb91906119ea565b60405180910390fd5b505050565b5f604051905090565b5f80fd5b5f80fd5b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b61183e8161180a565b8114611848575f80fd5b50565b5f8135905061185981611835565b92915050565b5f6020828403121561187457611873611802565b5b5f6118818482850161184b565b91505092915050565b5f8115159050919050565b61189e8161188a565b82525050565b5f6020820190506118b75f830184611895565b92915050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f6118ff826118bd565b61190981856118c7565b93506119198185602086016118d7565b611922816118e5565b840191505092915050565b5f6020820190508181035f83015261194581846118f5565b905092915050565b5f819050919050565b61195f8161194d565b8114611969575f80fd5b50565b5f8135905061197a81611956565b92915050565b5f6020828403121561199557611994611802565b5b5f6119a28482850161196c565b91505092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6119d4826119ab565b9050919050565b6119e4816119ca565b82525050565b5f6020820190506119fd5f8301846119db565b92915050565b611a0c816119ca565b8114611a16575f80fd5b50565b5f81359050611a2781611a03565b92915050565b5f8060408385031215611a4357611a42611802565b5b5f611a5085828601611a19565b9250506020611a618582860161196c565b9150509250929050565b5f805f60608486031215611a8257611a81611802565b5b5f611a8f86828701611a19565b9350506020611aa086828701611a19565b9250506040611ab18682870161196c565b9150509250925092565b5f60208284031215611ad057611acf611802565b5b5f611add84828501611a19565b91505092915050565b611aef8161194d565b82525050565b5f602082019050611b085f830184611ae6565b92915050565b611b178161188a565b8114611b21575f80fd5b50565b5f81359050611b3281611b0e565b92915050565b5f8060408385031215611b4e57611b4d611802565b5b5f611b5b85828601611a19565b9250506020611b6c85828601611b24565b9150509250929050565b5f80fd5b5f80fd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b611bb4826118e5565b810181811067ffffffffffffffff82111715611bd357611bd2611b7e565b5b80604052505050565b5f611be56117f9565b9050611bf18282611bab565b919050565b5f67ffffffffffffffff821115611c1057611c0f611b7e565b5b611c19826118e5565b9050602081019050919050565b828183375f83830152505050565b5f611c46611c4184611bf6565b611bdc565b905082815260208101848484011115611c6257611c61611b7a565b5b611c6d848285611c26565b509392505050565b5f82601f830112611c8957611c88611b76565b5b8135611c99848260208601611c34565b91505092915050565b5f805f8060808587031215611cba57611cb9611802565b5b5f611cc787828801611a19565b9450506020611cd887828801611a19565b9350506040611ce98782880161196c565b925050606085013567ffffffffffffffff811115611d0a57611d09611806565b5b611d1687828801611c75565b91505092959194509250565b5f8060408385031215611d3857611d37611802565b5b5f611d4585828601611a19565b9250506020611d5685828601611a19565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f6002820490506001821680611da457607f821691505b602082108103611db757611db6611d60565b5b50919050565b5f606082019050611dd05f8301866119db565b611ddd6020830185611ae6565b611dea60408301846119db565b949350505050565b5f81905092915050565b5f611e06826118bd565b611e108185611df2565b9350611e208185602086016118d7565b80840191505092915050565b5f611e378285611dfc565b9150611e438284611dfc565b91508190509392505050565b5f81519050919050565b5f82825260208201905092915050565b5f611e7382611e4f565b611e7d8185611e59565b9350611e8d8185602086016118d7565b611e96816118e5565b840191505092915050565b5f608082019050611eb45f8301876119db565b611ec160208301866119db565b611ece6040830185611ae6565b8181036060830152611ee08184611e69565b905095945050505050565b5f81519050611ef981611835565b92915050565b5f60208284031215611f1457611f13611802565b5b5f611f2184828501611eeb565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601260045260245ffd5b5f604082019050611f6a5f8301856119db565b611f776020830184611ae6565b939250505056fea2646970667358221220e4b21c949961422563a3471305a9d1b443eb681eac79ebcf5fbd0251baed0ec364736f6c634300081a0033"
};

export default TokenRegistryArtifact;
