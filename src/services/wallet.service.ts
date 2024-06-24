import { ethers } from 'ethers';
import { createStore } from 'mipd';

type IAuthInfo = {
  address: string;
  wallet: string;
  rdns: string;
};

export default class WalletService {
  private store;
  private provider;
  private w3p!: ethers.BrowserProvider;

  constructor(rdns: string) {
    this.store = createStore();
    this.provider = this.store.findProvider({ rdns });
  }

  async getWalletInfo(): Promise<IAuthInfo> {
    await this.checkInit();
    const address = await this.getAddress();
    return {
      address,
      wallet: this.provider!.info.name,
      rdns: this.provider!.info.rdns
    };
  }

  disconnectWallet(): void {
    this.store.destroy();
  }

  async sendTx(tx: ethers.TransactionRequest): Promise<string> {
    await this.checkInit();
    const signer = await this.w3p.getSigner();
    const txRes = await signer.sendTransaction(tx);
    await txRes.wait();
    return txRes.hash;
  }

  async signMessage(msg: string): Promise<string> {
    await this.checkInit();
    const signer = await this.w3p.getSigner();
    return await signer.signMessage(msg);
  }

  async getAddress(): Promise<string> {
    await this.checkInit();
    const signer = await this.w3p.getSigner();
    return await signer.getAddress();
  }

  async getChainId(): Promise<number> {
    await this.checkInit();
    return Number((await this.w3p.getNetwork()).chainId);
  }

  async switchChain() {
    await this.checkInit();
    const chainId = Number(import.meta.env.VITE_DAO_CHAIN_ID);
    try {
      await this.provider!.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
    } catch (e: any) {
      if (e.code === 4001) {
        throw new Error('Network switch request canceled');
      }
      if (e.code === 4902) {
        await this.provider!.provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              rpcUrls: [import.meta.env.VITE_DAO_RPC_URL],
              chainName: import.meta.env.VITE_DAO_CHAIN_NAME,
              blockExplorerUrls: [import.meta.env.VITE_DAO_EXPLORER_URL]
            }
          ]
        });
      }
    }
  }

  async getWeb3Provider() {
    await this.checkInit();
    return this.w3p;
  }

  private async init(): Promise<WalletService> {
    this.w3p = new ethers.BrowserProvider(this.provider!.provider);
    await this.provider!.provider.request({ method: 'eth_requestAccounts' });
    return this;
  }

  private async checkInit() {
    if (!this.w3p) {
      await this.init();
    }
  }
}
