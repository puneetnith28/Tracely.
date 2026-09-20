import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const contractAddress = process.env.VITE_CONTRACT_ADDRESS;
  const userAddress = "0x5A0E743d25Dd32314FefAB7F928b7cac79978110";

  if (!contractAddress) {
    console.error("VITE_CONTRACT_ADDRESS not found in .env");
    return;
  }

  console.log(`Connecting to contract at: ${contractAddress}`);
  console.log(`Authorizing user: ${userAddress}`);

  const SupplyChainTrust = await ethers.getContractAt("SupplyChainTrust", contractAddress);

  try {
    const tx = await SupplyChainTrust.setUserAuthorization(userAddress, true);
    console.log(`Transaction sent: ${tx.hash}`);
    await tx.wait();
    console.log("User authorized successfully!");
  } catch (error: any) {
    if (error.message.includes("Only owner can call this function")) {
      console.error("ERROR: Current PRIVATE_KEY is not the owner of this contract.");
      process.exit(1);
    } else {
      console.error("An error occurred:", error.message);
      process.exit(1);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
