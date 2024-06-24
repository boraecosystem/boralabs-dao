import { IERC20 } from '@/abis/erc20.abi';
import { Contract, type Signer } from 'ethers';
import ContractBaseService from '@/services/contracts/contractbase.service';

export default class ERC20Service extends ContractBaseService {
  protected contract: any;

  constructor(address: string) {
    const provider = ContractBaseService.getJsonRpcProvider();
    super({ provider, address, abi: IERC20 });
    this.contract = new Contract(address, IERC20, provider);
  }

  async approve(address: string, amount: string, signer: Signer) {
    return await this.contract.connect(signer).approve(address, amount);
  }

  async symbol(): Promise<string> {
    return await this.contract.symbol();
  }

  async totalSupply(): Promise<number> {
    return await this.contract.totalSupply();
  }

  async balanceOf(address: string) {
    return await this.contract.balanceOf(address);
  }

  async mint(signer: Signer) {
    return await this.contract.connect(signer).mint();
  }

  async mintMap(address: string) {
    return await this.contract.mintMap(address);
  }

  async delegate(delegatee: string, signer: Signer) {
    return await this.contract.connect(signer).delegate(delegatee);
  }

  async delegates(account: string) {
    return await this.contract.delegates(account);
  }

  async getPastTotalSupply(timepoint: number) {
    return await this.contract.getPastTotalSupply(timepoint);
  }
}
