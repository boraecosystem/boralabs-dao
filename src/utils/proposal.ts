import { ethers } from 'ethers';
import ERC20Service from '@/services/contracts/erc20.service';
import GovernorService from '@/services/contracts/governor.service';
import DaoService from '@/services/dao.service';
import WalletService from '@/services/wallet.service';
import { createTabs } from '@/constants/tabs';
import type { IGovernorTxParams } from '@/types/governor.type';

export const getProposalCallData = async (scenarioType: number, incentive: string) => {
  const walletService = new WalletService('io.metamask');
  const plusTokenContract = new ERC20Service(import.meta.env.VITE_DAO_PLUS_TOKEN);

  async function getPlusTokenTransferFromCallData(incentive: string) {
    return plusTokenContract.getCallData('transferFrom', [
      await walletService.getAddress(),
      import.meta.env.VITE_DAO_PLUS_TOKEN,
      ethers.parseEther(incentive)
    ]).callData[1];
  }
  async function getDummyCallData() {
    return plusTokenContract.getCallData('approve', [
      await walletService.getAddress(),
      ethers.parseEther('1')
    ]).callData[1];
  }

  return scenarioType === 3
    ? await getPlusTokenTransferFromCallData(incentive)
    : await getDummyCallData();
};

export const getProposalId = async (txParams: IGovernorTxParams) => {
  const governorContract = new GovernorService(import.meta.env.VITE_DAO_GOVERNANCE);
  return await governorContract.hashProposal(
    txParams.targets,
    txParams.values,
    txParams.calldatas,
    ethers.id(txParams.descriptionHash)
  );
};

export const getProposalTitle = async (scenarioType: number) => {
  const daoApi = new DaoService();
  const proposalId = await daoApi.getNewId();
  const scenarioTitle = createTabs[scenarioType - 1];
  return `${scenarioTitle}-${proposalId}`;
};

export const postProposalInfo = async (params: {
  proposalTitle: string;
  calldata: string[];
  proposalId: string;
  type: number;
  voteTotalSupply: number;
  desc?: string;
}) => {
  const daoApi = new DaoService();
  const { proposalTitle, calldata, proposalId, type, voteTotalSupply, desc } = params;
  const body = {
    title: proposalTitle,
    scenario_type: type,
    targets: [import.meta.env.VITE_DAO_PLUS_TOKEN],
    calldatas: calldata,
    proposal_id: proposalId,
    values: ['0'],
    total_supply: ethers.formatUnits(voteTotalSupply),
    description: desc
  };

  await daoApi.postProposal(body);
};

export const calculateVotePercentage = (target: number, total: number) => {
  if (total === 0) return 0;
  return ((target / total) * 100).toFixed(2);
};
