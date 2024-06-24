import type { Page } from './common.type';

export type ProposalType = {
  id: number;
  title: string;
  description?: string;
  targets: any[];
  values: any[];
  calldatas: any[];
  txHash: string;
  scenarioType: number;
  totalSupply: number;
  totalVotingPower: number;
  startDate: string;
  endDate: string;
  proposer: string;
  state: ProposalStateType;
  blockNumber: number;
  proposalId: string;
};

export type ProposalPageType = Page<ProposalType>;

export type ProposalStateType = 'ACTIVE' | 'CLOSED' | 'PENDING';

export type VoteType = {
  id: number;
  proposalId: string;
  address: string;
  votingPower: number;
  status: string;
  txHash: string;
  createdAt: string;
  weight?: string | number;
};

export type VotePageType = Page<VoteType>;

export enum PROPOSALSTATETYPE {
  PENDING,
  ACTIVE,
  CANCELED,
  DEFEATED,
  SUCCEEDED,
  QUEUED,
  EXPIRED,
  EXECUTED
}
