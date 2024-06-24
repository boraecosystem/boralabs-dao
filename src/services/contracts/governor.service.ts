import { IGovernor } from '@/abis/governor.abi';
import { Contract, type Signer } from 'ethers';
import ContractBaseService from '@/services/contracts/contractbase.service';

export default class GovernorService extends ContractBaseService {
  protected contract: any;

  constructor(address: string) {
    const provider = ContractBaseService.getJsonRpcProvider();
    super({ provider, address, abi: IGovernor });
    this.contract = new Contract(address, IGovernor, provider);
  }

  async name() {
    return await this.contract.name();
  }

  async clock() {
    return await this.contract.clock();
  }

  async votingDelay() {
    return await this.contract.votingDelay();
  }

  async votingPeriod() {
    return await this.contract.votingPeriod();
  }

  async proposalThreshold() {
    return await this.contract.proposalThreshold();
  }

  async state(proposalId: string): Promise<number> {
    return await this.contract.state(proposalId);
  }

  async proposalVotes(proposalId: string) {
    return await this.contract.proposalVotes(proposalId);
  }

  async castVote(proposalId: string, support: number, signer: Signer) {
    return await this.contract.connect(signer).castVote(proposalId, support);
  }

  async propose(
    targets: string[],
    values: number[],
    calldatas: string[],
    descriptionHash: string,
    signer: Signer
  ) {
    return await this.contract.connect(signer).propose(targets, values, calldatas, descriptionHash);
  }

  async execute(
    targets: string[],
    values: number[],
    calldatas: string[],
    descriptionHash: string,
    signer: Signer
  ) {
    return await this.contract.connect(signer).execute(targets, values, calldatas, descriptionHash);
  }

  async hashProposal(
    targets: string[],
    values: number[],
    calldatas: string[],
    descriptionHash: string
  ) {
    return await this.contract.hashProposal(targets, values, calldatas, descriptionHash);
  }
}
