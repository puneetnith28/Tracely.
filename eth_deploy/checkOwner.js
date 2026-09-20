const { ethers } = require("ethers");
const fs = require("fs");
const solc = require("solc");

async function main() {
  const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
  
  const contractAddress = "0x4664CF917157735081c3ba095733a85ade5beb0f";
  
  const source = fs.readFileSync("../tracely_frontend/contracts/SupplyChainTrust.sol", "utf8");
  const input = {
    language: "Solidity",
    sources: { "SupplyChainTrust.sol": { content: source } },
    settings: { outputSelection: { "*": { "*": ["abi"] } } }
  };
  const compiled = JSON.parse(solc.compile(JSON.stringify(input)));
  const abi = compiled.contracts["SupplyChainTrust.sol"]["SupplyChainTrust"].abi;

  const contract = new ethers.Contract(contractAddress, abi, provider);
  
  const owner = await contract.owner();
  console.log("Contract Owner:", owner);
  
  const walletToCheck = "0x63cF98183726B44329cFBE882d5D2b201419010b";
  const isAuth = await contract.isUserAuthorized(walletToCheck);
  console.log(`Is ${walletToCheck} authorized? : ${isAuth}`);
}
main().catch(console.error);
