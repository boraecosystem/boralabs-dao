import type { EIP1193Provider } from 'mipd';
import type ContractBaseService from '@/services/contracts/contractbase.service';

declare global {
  interface Window {
    ethereum: EIP1193Provider;
  }
}

export type Page<T> = {
  items: Array<T>;
  currentPage: number;
  totalPage: number;
  count?: number;
};

export interface IContractFunction {
  ref: ContractBaseService;
  func: string;
  callData: [target: string, callData: string];
  callData3: [target: string, allowFailure: boolean, callData: string];
}
