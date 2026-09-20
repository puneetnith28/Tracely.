import { ethers } from "hardhat";

async function main() {
  console.log("Starting deployment...");

  // Get the contract factory
  const SupplyChainTrust = await ethers.getContractFactory("SupplyChainTrust");

  // Deploy the contract
  const contract = await SupplyChainTrust.deploy();

  // Wait for the deployment to finish
  await contract.waitForDeployment();

  const targetAddress = await contract.getAddress();
  console.log(`✅ SupplyChainTrust deployed successfully to: ${targetAddress}`);
}

// Execute the main function
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
