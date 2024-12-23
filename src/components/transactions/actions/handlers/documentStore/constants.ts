import { ethers } from "ethers";

// Role constants from the contract
export const ISSUER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ISSUER_ROLE"));
export const REVOKER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("REVOKER_ROLE"));

// Complete ABI from all three contracts combined
export const DOCUMENT_STORE_ABI = [
  // Constructor
  "constructor(string _name, address owner)",
  
  // Access Control Functions
  "function hasRole(bytes32 role, address account) public view returns (bool)",
  "function getRoleAdmin(bytes32 role) public view returns (bytes32)",
  "function grantRole(bytes32 role, address account)",
  "function revokeRole(bytes32 role, address account)",
  "function renounceRole(bytes32 role, address account)",
  
  // Document Store Functions
  "function issue(bytes32 document)",
  "function bulkIssue(bytes32[] documents)",
  "function revoke(bytes32 document) returns (bool)",
  "function bulkRevoke(bytes32[] documents)",
  "function isIssued(bytes32 document) public view returns (bool)",
  "function isRevoked(bytes32 document) public view returns (bool)",
  "function getIssuedBlock(bytes32 document) public view returns (uint256)",
  "function isIssuedBefore(bytes32 document, uint256 blockNumber) public view returns (bool)",
  "function isRevokedBefore(bytes32 document, uint256 blockNumber) public view returns (bool)",
  "function name() public view returns (string)",
  "function version() public view returns (string)",
  
  // Events
  "event DocumentIssued(bytes32 indexed document)",
  "event DocumentRevoked(bytes32 indexed document)",
  "event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)",
  "event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)"
];

export const DOCUMENT_STORE_BYTECODE = `0x608060405234801561000f575f80fd5b506040516124d13803806124d183398181016040528101906100319190610583565b610041828261004860201b60201c565b50506109bf565b5f60019054906101000a900460ff168061006c57505f8054906101000a900460ff16155b6100ab576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100a29061065d565b60405180910390fd5b5f8060019054906101000a900460ff1615905080156100f85760015f60016101000a81548160ff02191690831515021790555060015f806101000a81548160ff0219169083151502179055505b6101078261013b60201b60201c565b6101168361021e60201b60201c565b8015610136575f8060016101000a81548160ff0219169083151502179055505b505050565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036101a9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101a0906106c5565b60405180910390fd5b6101bb5f801b8261027660201b60201c565b6101eb7f114e74f6ea3bd819998f78687bfcb11b140da08e9b7d222fa9c1f1ba1f2aa1228261027660201b60201c565b61021b7fce3f34913921da558f105cefb578d87278debbbd073a8d552b5de0d168deee308261027660201b60201c565b50565b6040518060400160405280600581526020017f322e332e300000000000000000000000000000000000000000000000000000008152506002908161026291906108f0565b50806001908161027291906108f0565b5050565b610286828261028a60201b60201c565b5050565b61029a828261037160201b60201c565b61036d57600160695f8481526020019081526020015f205f015f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff0219169083151502179055506103126103d560201b60201c565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b5f60695f8481526020019081526020015f205f015f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16905092915050565b5f33905090565b5f604051905090565b5f80fd5b5f80fd5b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b61043b826103f5565b810181811067ffffffffffffffff8211171561045a57610459610405565b5b80604052505050565b5f61046c6103dc565b90506104788282610432565b919050565b5f67ffffffffffffffff82111561049757610496610405565b5b6104a0826103f5565b9050602081019050919050565b8281835e5f83830152505050565b5f6104cd6104c88461047d565b610463565b9050828152602081018484840111156104e9576104e86103f1565b5b6104f48482856104ad565b509392505050565b5f82601f8301126105105761050f6103ed565b5b81516105208482602086016104bb565b91505092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61055282610529565b9050919050565b61056281610548565b811461056c575f80fd5b50565b5f8151905061057d81610559565b92915050565b5f8060408385031215610599576105986103e5565b5b5f83015167ffffffffffffffff8111156105b6576105b56103e9565b5b6105c2858286016104fc565b92505060206105d38582860161056f565b9150509250929050565b5f82825260208201905092915050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c7265615f8201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b5f610647602e836105dd565b9150610652826105ed565b604082019050919050565b5f6020820190508181035f8301526106748161063b565b9050919050565b7f4f776e6572206973207a65726f000000000000000000000000000000000000005f82015250565b5f6106af600d836105dd565b91506106ba8261067b565b602082019050919050565b5f6020820190508181035f8301526106dc816106a3565b9050919050565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061073157607f821691505b602082108103610744576107436106ed565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026107a67fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8261076b565b6107b0868361076b565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f6107f46107ef6107ea846107c8565b6107d1565b6107c8565b9050919050565b5f819050919050565b61080d836107da565b610821610819826107fb565b848454610777565b825550505050565b5f90565b610835610829565b610840818484610804565b505050565b5b81811015610863576108585f8261082d565b600181019050610846565b5050565b601f8211156108a8576108798161074a565b6108828461075c565b81016020851015610891578190505b6108a561089d8561075c565b830182610845565b50505b505050565b5f82821c905092915050565b5f6108c85f19846008026108ad565b1980831691505092915050565b5f6108e083836108b9565b9150826002028217905092915050565b6108f9826106e3565b67ffffffffffffffff81111561091257610911610405565b5b61091c825461071a565b610927828285610867565b5f60209050601f831160018114610958575f8415610946578287015190505b61095085826108d5565b8655506109b7565b601f1984166109668661074a565b5f5b8281101561098d57848901518255600182019150602085019450602081019050610968565b868310156109aa57848901516109a6601f8916826108b9565b8355505b6001600288020188555050505b505050505050565b611b05806109cc5f395ff3fe608060405234801561000f575f80fd5b5060043610610140575f3560e01c806354fd4d50116100b65780638bc36c911161007a5780638bc36c911461039857806391d14854146103c8578063a217fddf146103f8578063b75c7dc614610416578063bf40b90414610446578063d547741f1461047657610140565b806354fd4d50146102f25780635a9e03ca146103105780637c4acabf146103405780637df208261461035e57806382aefa241461037a57610140565b80632f2ff15d116101085780632f2ff15d1461020e57806333358d2d1461022a578063339b6b391461025a57806336568abe1461028a5780634294857f146102a65780634ada8076146102d657610140565b806301ffc9a71461014457806306fdde03146101745780630f75e81f14610192578063163aa631146101ae578063248a9ca3146101de575b5f80fd5b61015e600480360381019061015991906111aa565b610492565b60405161016b91906111ef565b60405180910390f35b61017c61050b565b6040516101899190611278565b60405180910390f35b6101ac60048036038101906101a791906112cb565b610597565b005b6101c860048036038101906101c391906112cb565b610622565b6040516101d591906111ef565b60405180910390f35b6101f860048036038101906101f391906112cb565b61063f565b6040516102059190611305565b60405180910390f35b61022860048036038101906102239190611378565b61065c565b005b610244600480360381019061023f91906112cb565b610685565b60405161025191906113ce565b60405180910390f35b610274600480360381019061026f9190611411565b61069a565b60405161028191906111ef565b60405180910390f35b6102a4600480360381019061029f9190611378565b6106d5565b005b6102c060048036038101906102bb91906112cb565b610758565b6040516102cd91906111ef565b60405180910390f35b6102f060048036038101906102eb919061158f565b610775565b005b6102fa6107b4565b6040516103079190611278565b60405180910390f35b61032a60048036038101906103259190611411565b610840565b60405161033791906111ef565b60405180910390f35b61034861087b565b6040516103559190611305565b60405180910390f35b6103786004803603810190610373919061158f565b61089f565b005b6103826108de565b60405161038f9190611305565b60405180910390f35b6103b260048036038101906103ad91906112cb565b610902565b6040516103bf91906113ce565b60405180910390f35b6103e260048036038101906103dd9190611378565b610917565b6040516103ef91906111ef565b60405180910390f35b61040061097b565b60405161040d9190611305565b60405180910390f35b610430600480360381019061042b91906112cb565b610981565b60405161043d91906111ef565b60405180910390f35b610460600480360381019061045b91906112cb565b610a10565b60405161046d91906113ce565b60405180910390f35b610490600480360381019061048b9190611378565b610a74565b005b5f7f7965db0b000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161480610504575061050382610a9d565b5b9050919050565b6001805461051890611603565b80601f016020809104026020016040519081016040528092919081815260200182805461054490611603565b801561058f5780601f106105665761010080835404028352916020019161058f565b820191905f5260205f20905b81548152906001019060200180831161057257829003601f168201915b505050505081565b7f114e74f6ea3bd819998f78687bfcb11b140da08e9b7d222fa9c1f1ba1f2aa1226105c9816105c4610b06565b610b0d565b816105d381610622565b15610613576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161060a906116a3565b60405180910390fd5b61061c83610ba9565b50505050565b5f8060035f8481526020019081526020015f205414159050919050565b5f60695f8381526020019081526020015f20600101549050919050565b6106658261063f565b61067681610671610b06565b610b0d565b6106808383610c41565b505050565b6003602052805f5260405f205f915090505481565b5f8160045f8581526020019081526020015f2054111580156106cd57505f60045f8581526020019081526020015f205414155b905092915050565b6106dd610b06565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161461074a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161074190611731565b60405180910390fd5b6107548282610d1c565b5050565b5f8060045f8481526020019081526020015f205414159050919050565b7fce3f34913921da558f105cefb578d87278debbbd073a8d552b5de0d168deee306107a7816107a2610b06565b610b0d565b6107b082610df7565b5050565b600280546107c190611603565b80601f01602080910402602001604051908101604052809291908181526020018280546107ed90611603565b80156108385780601f1061080f57610100808354040283529160200191610838565b820191905f5260205f20905b81548152906001019060200180831161081b57829003601f168201915b505050505081565b5f8060035f8581526020019081526020015f20541415801561087357508160035f8581526020019081526020015f205411155b905092915050565b7fce3f34913921da558f105cefb578d87278debbbd073a8d552b5de0d168deee3081565b7f114e74f6ea3bd819998f78687bfcb11b140da08e9b7d222fa9c1f1ba1f2aa1226108d1816108cc610b06565b610b0d565b6108da82610e37565b5050565b7f114e74f6ea3bd819998f78687bfcb11b140da08e9b7d222fa9c1f1ba1f2aa12281565b6004602052805f5260405f205f915090505481565b5f60695f8481526020019081526020015f205f015f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16905092915050565b5f801b81565b5f7fce3f34913921da558f105cefb578d87278debbbd073a8d552b5de0d168deee306109b4816109af610b06565b610b0d565b826109be81610758565b156109fe576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109f5906117bf565b60405180910390fd5b610a0784610e77565b92505050919050565b5f81610a1b81610622565b610a5a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a519061184d565b60405180910390fd5b60035f8481526020019081526020015f2054915050919050565b610a7d8261063f565b610a8e81610a89610b06565b610b0d565b610a988383610d1c565b505050565b5f7f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b5f33905090565b610b178282610917565b610ba557610b3c8173ffffffffffffffffffffffffffffffffffffffff166014610f0f565b610b49835f1c6020610f0f565b604051602001610b5a929190611939565b6040516020818303038152906040526040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b9c9190611278565b60405180910390fd5b5050565b5f81610bb481610622565b15610bf4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610beb906116a3565b60405180910390fd5b4360035f8581526020019081526020015f2081905550827f01a1249f2caa0445b8391e02413d26f0d409dabe5330cd1d04d3d0801fc42db360405160405180910390a26001915050919050565b610c4b8282610917565b610d1857600160695f8481526020019081526020015f205f015f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff021916908315150217905550610cbd610b06565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b610d268282610917565b15610df3575f60695f8481526020019081526020015f205f015f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff021916908315150217905550610d98610b06565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b60405160405180910390a45b5050565b5f5b8151811015610e3357610e25828281518110610e1857610e17611972565b5b6020026020010151610e77565b508080600101915050610df9565b5050565b5f5b8151811015610e7357610e65828281518110610e5857610e57611972565b5b6020026020010151610ba9565b508080600101915050610e39565b5050565b5f81610e8281610758565b15610ec2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610eb9906117bf565b60405180910390fd5b4360045f8581526020019081526020015f2081905550827f7283b5ab9758f7fba773279e4fd50ea7b136bd1d8371dcae9c5ce529c55343d760405160405180910390a26001915050919050565b60605f6002836002610f2191906119cc565b610f2b9190611a0d565b67ffffffffffffffff811115610f4457610f43611453565b5b6040519080825280601f01601f191660200182016040528015610f765781602001600182028036833780820191505090505b5090507f3000000000000000000000000000000000000000000000000000000000000000815f81518110610fad57610fac611972565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690815f1a9053507f7800000000000000000000000000000000000000000000000000000000000000816001815181106110105761100f611972565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690815f1a9053505f600184600261104e91906119cc565b6110589190611a0d565b90505b60018111156110f7577f3031323334353637383961626364656600000000000000000000000000000000600f86166010811061109a57611099611972565b5b1a60f81b8282815181106110b1576110b0611972565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690815f1a905350600485901c9450806110f090611a40565b905061105b565b505f841461113a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161113190611ab1565b60405180910390fd5b8091505092915050565b5f604051905090565b5f80fd5b5f80fd5b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b61118981611155565b8114611193575f80fd5b50565b5f813590506111a481611180565b92915050565b5f602082840312156111bf576111be61114d565b5b5f6111cc84828501611196565b91505092915050565b5f8115159050919050565b6111e9816111d5565b82525050565b5f6020820190506112025f8301846111e0565b92915050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f61124a82611208565b6112548185611212565b9350611264818560208601611222565b61126d81611230565b840191505092915050565b5f6020820190508181035f8301526112908184611240565b905092915050565b5f819050919050565b6112aa81611298565b81146112b4575f80fd5b50565b5f813590506112c5816112a1565b92915050565b5f602082840312156112e0576112df61114d565b5b5f6112ed848285016112b7565b91505092915050565b6112ff81611298565b82525050565b5f6020820190506113185f8301846112f6565b92915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6113478261131e565b9050919050565b6113578161133d565b8114611361575f80fd5b50565b5f813590506113728161134e565b92915050565b5f806040838503121561138e5761138d61114d565b5b5f61139b858286016112b7565b92505060206113ac85828601611364565b9150509250929050565b5f819050919050565b6113c8816113b6565b82525050565b5f6020820190506113e15f8301846113bf565b92915050565b6113f0816113b6565b81146113fa575f80fd5b50565b5f8135905061140b816113e7565b92915050565b5f80604083850312156114275761142661114d565b5b5f611434858286016112b7565b9250506020611445858286016113fd565b9150509250929050565b5f80fd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b61148982611230565b810181811067ffffffffffffffff821117156114a8576114a7611453565b5b80604052505050565b5f6114ba611144565b90506114c68282611480565b919050565b5f67ffffffffffffffff8211156114e5576114e4611453565b5b602082029050602081019050919050565b5f80fd5b5f61150c611507846114cb565b6114b1565b9050808382526020820190506020840283018581111561152f5761152e6114f6565b5b835b81811015611558578061154488826112b7565b845260208401935050602081019050611531565b5050509392505050565b5f82601f8301126115765761157561144f565b5b81356115868482602086016114fa565b91505092915050565b5f602082840312156115a4576115a361114d565b5b5f82013567ffffffffffffffff8111156115c1576115c0611151565b5b6115cd84828501611562565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061161a57607f821691505b60208210810361162d5761162c6115d6565b5b50919050565b7f4572726f723a204f6e6c792068617368657320746861742068617665206e6f745f8201527f206265656e206973737565642063616e20626520697373756564000000000000602082015250565b5f61168d603a83611212565b915061169882611633565b604082019050919050565b5f6020820190508181035f8301526116ba81611681565b9050919050565b7f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e63655f8201527f20726f6c657320666f722073656c660000000000000000000000000000000000602082015250565b5f61171b602f83611212565b9150611726826116c1565b604082019050919050565b5f6020820190508181035f8301526117488161170f565b9050919050565b7f4572726f723a204861736820686173206265656e207265766f6b6564207072655f8201527f76696f75736c7900000000000000000000000000000000000000000000000000602082015250565b5f6117a9602783611212565b91506117b48261174f565b604082019050919050565b5f6020820190508181035f8301526117d68161179d565b9050919050565b7f4572726f723a204f6e6c792069737375656420646f63756d656e7420686173685f8201527f65732063616e206265207265766f6b6564000000000000000000000000000000602082015250565b5f611837603183611212565b9150611842826117dd565b604082019050919050565b5f6020820190508181035f8301526118648161182b565b9050919050565b5f81905092915050565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000005f82015250565b5f6118a960178361186b565b91506118b482611875565b601782019050919050565b5f6118c982611208565b6118d3818561186b565b93506118e3818560208601611222565b80840191505092915050565b7f206973206d697373696e6720726f6c65200000000000000000000000000000005f82015250565b5f61192360118361186b565b915061192e826118ef565b601182019050919050565b5f6119438261189d565b915061194f82856118bf565b915061195a82611917565b915061196682846118bf565b91508190509392505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603260045260245ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f6119d6826113b6565b91506119e1836113b6565b92508282026119ef816113b6565b91508282048414831517611a0657611a0561199f565b5b5092915050565b5f611a17826113b6565b9150611a22836113b6565b9250828201905080821115611a3a57611a3961199f565b5b92915050565b5f611a4a826113b6565b91505f8203611a5c57611a5b61199f565b5b600182039050919050565b7f537472696e67733a20686578206c656e67746820696e73756666696369656e745f82015250565b5f611a9b602083611212565b9150611aa682611a67565b602082019050919050565b5f6020820190508181035f830152611ac881611a8f565b905091905056fea2646970667358221220b92da52171589f1fdb4a1ec5bb57260ae1de1086b4cd338a998fdbcac3fa3bef64736f6c634300081a0033`;