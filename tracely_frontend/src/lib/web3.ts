import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, NETWORKS, SUPPORTED_NETWORKS } from './contracts';

// Types
export interface Batch {
  id: string;
  productName: string;
  sku: string;
  origin: string;
  createdAt: string; // ISO string
  firstViewBaseline: string;
  secondViewBaseline: string;
  creator: string;
  exists: boolean;
}

export interface BatchEvent {
  id: number;
  actor: string;
  role: string;
  timestamp: number;
  note: string;
  firstViewImage: string;
  secondViewImage: string;
  eventHash: string;
  loggedBy: string;
}

export interface ContractInfo {
  name: string;
  version: string;
  contractOwner: string;
  totalBatchesCount: number;
  nextEventIdValue: number;
}

// Web3 Provider Management
export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;

  async connectWallet(): Promise<string> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask or compatible wallet not found');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create provider
      this.provider = new ethers.BrowserProvider(window.ethereum);
      
      // Get signer
      this.signer = await this.provider.getSigner();
      
      // Ensure contract address is a valid checksummed address (prevents ENS resolution)
      // Use the first address in the array for general contract interactions
      const primaryAddress = Array.isArray(CONTRACT_ADDRESS) ? CONTRACT_ADDRESS[0] : CONTRACT_ADDRESS;
      let contractAddress: string;
      try {
        contractAddress = ethers.getAddress(primaryAddress);
      } catch {
        contractAddress = primaryAddress;
      }
      
      this.contract = new ethers.Contract(contractAddress, CONTRACT_ABI, this.signer);
      
      // Get address directly without ENS resolution
      const address = await this.signer.getAddress();
      
      // Check if we're on the correct network
      await this.checkNetwork();
      
      return address;
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  }

  async checkNetwork(): Promise<void> {
    if (!this.provider) return;

    const network = await this.provider.getNetwork();
    const targetChainId = parseInt(NETWORKS.SEPOLIA.chainId, 16);
    
    if (network.chainId !== BigInt(targetChainId)) {
      await this.switchToSepolia();
    }
  }

  async switchToSepolia(): Promise<void> {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORKS.SEPOLIA.chainId }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        await this.addSepoliaNetwork();
      } else {
        throw switchError;
      }
    }
  }

  private async addSepoliaNetwork(): Promise<void> {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: NETWORKS.SEPOLIA.chainId,
          chainName: NETWORKS.SEPOLIA.chainName,
          rpcUrls: NETWORKS.SEPOLIA.rpcUrls,
          blockExplorerUrls: NETWORKS.SEPOLIA.blockExplorerUrls,

          nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
          },
        },
      ],
    });
  }

  async getConnectedAddress(): Promise<string | null> {
    if (!this.signer) return null;
    return await this.signer.getAddress();
  }

  async isUserAuthorized(address: string): Promise<boolean> {
    if (!this.contract || !this.signer) throw new Error('Contract not initialized');
    
    const normalizedAddress = ethers.isAddress(address) 
      ? ethers.getAddress(address) 
      : address;

    // Developer / Always Authorized addresses (for testing and quick setup)
    const ALWAYS_AUTHORIZED = [
      "0x63cFf573E735fC70d048D0819Be0796E565e010b", // User's Current Wallet
      "0x4664CF917157735081c3ba095733a85ade5beb0f"  // Creator/Owner
    ];

    if (ALWAYS_AUTHORIZED.some(addr => addr.toLowerCase() === normalizedAddress.toLowerCase())) {
      return true;
    }

    const addresses = Array.isArray(CONTRACT_ADDRESS) ? CONTRACT_ADDRESS : [CONTRACT_ADDRESS];
    
    // Check authorization across all provided contract addresses
    for (const contractAddr of addresses) {
      try {
        const contract = new ethers.Contract(contractAddr, CONTRACT_ABI, this.signer);
        const authorized = await contract.authorizedUsers(normalizedAddress);
        if (authorized) return true;
      } catch (err) {
        console.error(`Error checking auth for contract ${contractAddr}:`, err);
      }
    }
    
    return false;
  }

  // Contract Functions
  async createBatch(
    batchId: string,
    productName: string,
    sku: string,
    origin: string,
    firstViewBaseline: string,
    secondViewBaseline: string
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.createBatch(
      batchId,
      productName,
      sku,
      origin,
      firstViewBaseline,
      secondViewBaseline
    );
  }

  async getBatch(batchId: string): Promise<Batch> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const batch = await this.contract.getBatch(batchId);
    
    return {
      id: batch.id,
      productName: batch.productName,
      sku: batch.sku,
      origin: batch.origin,
      createdAt: new Date(Number(batch.createdAt) * 1000).toISOString(),
      firstViewBaseline: batch.firstViewBaseline,
      secondViewBaseline: batch.secondViewBaseline,
      creator: batch.creator,
      exists: batch.exists
    };
  }

  async getAllBatchIds(): Promise<string[]> {
    if (!this.contract) throw new Error('Contract not initialized');
    return await this.contract.getAllBatchIds();
  }

  async getBatchEvents(batchId: string): Promise<BatchEvent[]> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const events = await this.contract.getBatchEvents(batchId);
    
    return events.map((event: any) => ({
      id: Number(event.id),
      actor: event.actor,
      role: event.role,
      timestamp: Number(event.timestamp),
      note: event.note,
      firstViewImage: event.firstViewImage,
      secondViewImage: event.secondViewImage,
      eventHash: event.eventHash,
      loggedBy: event.loggedBy
    }));
  }

  async getContractInfo(): Promise<ContractInfo> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const info = await this.contract.getContractInfo();
    
    return {
      name: info.name,
      version: info.version,
      contractOwner: info.contractOwner,
      totalBatchesCount: Number(info.totalBatchesCount),
      nextEventIdValue: Number(info.nextEventIdValue)
    };
  }

  async logEvent(
    batchId: string,
    actor: string,
    role: string,
    note: string,
    firstViewImage: string,
    secondViewImage: string,
    eventHash: string
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.logEvent(
      batchId,
      actor,
      role,
      note,
      firstViewImage,
      secondViewImage,
      eventHash
    );
  }

  // Utility functions
  async waitForTransaction(tx: ethers.ContractTransactionResponse): Promise<ethers.TransactionReceipt | null> {
    if (!this.provider) throw new Error('Provider not initialized');
    return await tx.wait();
  }

  disconnect(): void {
    this.provider = null;
    this.signer = null;
    this.contract = null;
  }
}

// Global instance
export const web3Service = new Web3Service();

// Declare window.ethereum for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
