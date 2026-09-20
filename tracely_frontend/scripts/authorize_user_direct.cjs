const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  const contractAddress = process.env.VITE_CONTRACT_ADDRESS;
  const userAddress = "0x5A0E743d25Dd32314FefAB7F928b7cac79978110";
  const rpcUrl = "https://ethereum-sepolia-rpc.publicnode.com";
  const privateKey = process.env.PRIVATE_KEY;

  if (!contractAddress || !rpcUrl || !privateKey) {
    console.error("Missing required environment variables");
    return;
  }

  console.log(`Connecting to network: ${rpcUrl}`);
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log(`Using wallet: ${wallet.address}`);
  console.log(`Target contract: ${contractAddress}`);

  const abi = [
    "function setUserAuthorization(address user, bool authorized) external",
    "function isUserAuthorized(address user) external view returns (bool)",
    "function owner() external view returns (address)"
  ];

  const contract = new ethers.Contract(contractAddress, abi, wallet);

  try {
    // Check owner first
    const owner = await contract.owner();
    console.log(`Contract owner is: ${owner}`);
    
    if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
      console.error(`ERROR: Wallet ${wallet.address} is not the owner (${owner}).`);
      process.exit(1);
    }

    console.log(`Authorizing ${userAddress}...`);
    const tx = await contract.setUserAuthorization(userAddress, true);
    console.log(`Transaction sent: ${tx.hash}`);
    await tx.wait();
    console.log("User authorized successfully!");
  } catch (error) {
    console.error("An error occurred:", error.message);
    process.exit(1);
  }
}

main();
