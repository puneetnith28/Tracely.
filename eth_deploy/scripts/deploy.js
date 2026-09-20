const fs = require('fs');
const path = require('path');
const solc = require('solc');
const { ethers } = require('ethers');
require('dotenv').config();

async function main() {
  console.log("Starting raw deployment...");

  const contractPath = path.resolve(__dirname, '..', 'contracts', 'SupplyChainTrust.sol');
  const source = fs.readFileSync(contractPath, 'utf8');

  console.log("Compiling contract...");
  const input = {
    language: 'Solidity',
    sources: {
      'SupplyChainTrust.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode.object'],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  
  if (output.errors) {
    let hasError = false;
    output.errors.forEach((err) => {
      console.error(err.formattedMessage);
      if (err.severity === 'error') hasError = true;
    });
    if (hasError) throw new Error("Compilation failed");
  }

  const contractOutput = output.contracts['SupplyChainTrust.sol']['SupplyChainTrust'];
  const abi = contractOutput.abi;
  const bytecode = contractOutput.evm.bytecode.object;

  const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
  let privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) throw new Error("Private key missing");
  
  privateKey = privateKey.replace(/['"]/g, '').trim();
  if (!privateKey.startsWith('0x')) {
    privateKey = '0x' + privateKey;
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);

  console.log("Deploying contract to Base Sepolia...");
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`✅ SupplyChainTrust deployed successfully to: ${address}`);
}

main().catch(console.error);
