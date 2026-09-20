import * as fs from 'fs';
import * as path from 'path';
import solc from 'solc';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  console.log("Starting raw deployment...");

  const contractPath = path.resolve(__dirname, 'contracts', 'SupplyChainTrust.sol');
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
    output.errors.forEach((err: any) => {
      console.error(err.formattedMessage);
      if (err.severity === 'error') hasError = true;
    });
    if (hasError) throw new Error("Compilation failed");
  }

  const contractOutput = output.contracts['SupplyChainTrust.sol']['SupplyChainTrust'];
  const abi = contractOutput.abi;
  const bytecode = contractOutput.evm.bytecode.object;

  const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org";
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
