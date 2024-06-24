import { Contract, ethers } from 'ethers';
import type { IContractFunction } from '@/types/common.type';

export default abstract class ContractBaseService {
  protected abi: any;
  protected contract: Contract;
  protected address: string;
  protected iContract: ethers.Interface;

  protected constructor(params: { provider: ethers.Provider; address: string; abi: any }) {
    const { provider, address, abi } = params;
    this.abi = abi;
    this.address = address;
    this.contract = new Contract(address, abi, provider);
    this.iContract = new ethers.Interface(abi);
  }

  public getCallData(func: string, args: any[]): IContractFunction {
    const encoded = this.iContract.encodeFunctionData(func, args);
    return {
      ref: this,
      func,
      callData: [this.address, encoded],
      callData3: [this.address, true, encoded]
    };
  }

  public decodeFunctionData(func: string, byteData: any) {
    return this.iContract.decodeFunctionData(func, byteData);
  }

  public decodeResult(func: string, byteData: any) {
    return this.iContract.decodeFunctionResult(func, byteData)[0];
  }

  public decodeResultAll(func: string, byteData: any) {
    return this.iContract.decodeFunctionResult(func, byteData);
  }

  public decodeFunctionResult(func: string, byteData: any) {
    return this.iContract.decodeFunctionResult(func, byteData);
  }

  protected static getJsonRpcProvider() {
    return new ethers.JsonRpcProvider(import.meta.env.VITE_DAO_RPC_URL);
  }
}
