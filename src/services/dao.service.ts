import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { ethers } from 'ethers';
import type { ProposalType, ProposalPageType, VoteType, VotePageType } from '@/types/dao.type';

type ProposalResponseType = {
  id: number;
  title: string;
  description?: string;
  targets: any[];
  values: any[];
  calldatas: any[];
  tx_hash: string;
  scenario_type: number;
  total_supply: number;
  total_voting_power: number;
  start_date: string;
  end_date: string;
  proposer: string;
  state: any;
  block_number: number;
  proposal_id: string;
};

type VoteResponseType = {
  id: number;
  proposal_id: string;
  walletAddress: string;
  votingPower: string;
  status: number;
  txhash: string;
  created_at: string;
};

type PageResponseType = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export default class DaoService {
  private $api: AxiosInstance;

  constructor() {
    this.$api = axios.create({
      baseURL: `${import.meta.env.VITE_DAO_API_URL}`
    });
  }

  private unpackResponse<T>(response: AxiosResponse): T {
    if (response.data) {
      return response.data;
    }
    return {} as T;
  }

  async getProposals(page = 1, state?: string): Promise<ProposalPageType> {
    const params = {
      page,
      state: state?.toLowerCase()
    };

    if (state === 'ALL') delete params.state;

    const res = this.unpackResponse<{
      data: Array<ProposalResponseType>;
      paginator: PageResponseType;
    }>(
      await this.$api.get(`/proposals`, {
        params
      })
    );

    return {
      items: res.data.map((item) => {
        return this.convertProposalResponseType(item);
      }),
      currentPage: page,
      totalPage: res.paginator.totalPage,
      count: res.paginator.total
    };
  }

  async getProposal(proposalId: string) {
    const { data } = this.unpackResponse<{ data: ProposalResponseType }>(
      await this.$api.get(`/proposals/${proposalId}`)
    );
    return this.convertProposalResponseType(data);
  }

  async getVotes(reqParams: {
    page: number;
    status?: number;
    proposalId: string;
  }): Promise<VotePageType> {
    const { page, status, proposalId } = reqParams;
    const params = {
      page,
      status
    };

    if (status! < 0) delete params.status;

    const { data, paginator } = this.unpackResponse<{
      data: { items: Array<VoteResponseType> };
      paginator: PageResponseType;
    }>(
      await this.$api.get(`/proposals/${proposalId}/votes`, {
        params
      })
    );

    return {
      items: data.items.map((item) => {
        return this.convertVoteResponseType(item);
      }),
      currentPage: page,
      totalPage: paginator.totalPage
    };
  }

  async postVote(proposalId: string) {
    await this.$api.post(`/proposals/${proposalId}/votes`);
  }

  async getNewId(): Promise<number> {
    const res = await this.$api.get(`/proposals/latest-id`);
    return res.data.data.next_id;
  }

  async postProposal(proposal: {
    title: string;
    scenario_type: number;
    targets: string[];
    calldatas: string[];
    proposal_id: string;
    values: string[];
    total_supply: string;
    description?: string;
  }) {
    const proposalInfo = { ...proposal };

    await this.$api.post('/proposals', {
      ...proposalInfo
    });
  }

  private convertProposalResponseType(res: ProposalResponseType): ProposalType {
    const {
      id,
      title,
      description,
      targets,
      values,
      calldatas,
      tx_hash,
      scenario_type,
      total_supply,
      total_voting_power,
      start_date,
      end_date,
      proposer,
      state,
      block_number,
      proposal_id
    } = res;
    return {
      id,
      title,
      description,
      targets,
      values,
      calldatas,
      txHash: tx_hash,
      scenarioType: scenario_type,
      totalSupply: total_supply,
      totalVotingPower: total_voting_power,
      startDate: start_date,
      endDate: end_date,
      proposer,
      state: state.toUpperCase(),
      blockNumber: block_number,
      proposalId: proposal_id
    };
  }

  private convertVoteResponseType(res: VoteResponseType): VoteType {
    const { id, proposal_id, walletAddress, votingPower, status, txhash, created_at } = res;
    return {
      id,
      proposalId: proposal_id,
      address: walletAddress,
      votingPower: Number(ethers.formatEther(votingPower)),
      status: status === 0 ? 'No' : status === 1 ? 'Yes' : 'Abstain',
      txHash: txhash,
      createdAt: created_at
    };
  }
}
