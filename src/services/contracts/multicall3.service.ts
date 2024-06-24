import { IMultiCall3 } from '@/abis/multicall.abi';
import { Contract } from 'ethers';
import type { Signer } from 'ethers';
import ContractBaseService from '@/services/contracts/contractbase.service';
import type { IContractFunction } from '@/types/common.type';

export default class Multicall3Service extends ContractBaseService {
  protected contract: any;

  constructor(address: string) {
    const provider = ContractBaseService.getJsonRpcProvider();
    super({ provider, address, abi: IMultiCall3 });
    this.contract = new Contract(address, IMultiCall3, provider);
  }

  async readCalls(callData: IContractFunction[]): Promise<any[]> {
    const aggrArgs = callData.map((icf) => icf.callData);
    const res = await this.contract.aggregate.staticCall(aggrArgs);
    const returnData = [];
    for (let i = 0; i < callData.length; i++) {
      returnData.push(callData[i].ref.decodeFunctionResult(callData[i].func, res.returnData[i]));
    }
    return returnData;
  }

  async writeCalls(callData: IContractFunction[], signer: Signer) {
    const aggrArgs = callData.map((icf) => icf.callData3);
    return await this.contract.connect(signer).aggregate3(aggrArgs);
  }
}
