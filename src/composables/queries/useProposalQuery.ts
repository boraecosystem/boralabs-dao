import { useQuery } from '@tanstack/vue-query';
import { ethers } from 'ethers';
import { ref } from 'vue';
import ERC20Service from '@/services/contracts/erc20.service';
import DaoService from '@/services/dao.service';
import { PROPOSAL_KEY } from '@/constants/query-key';

export const useProposalQuery = (proposalId: string) => {
  const incentive = ref(5);
  const totalVoteSupply = ref(0);

  const getProposal = async () => {
    const daoApi = new DaoService();
    const voteTokenContract = new ERC20Service(import.meta.env.VITE_DAO_VOTE_TOKEN);
    const result = await daoApi.getProposal(proposalId);
    totalVoteSupply.value =
      result.state === 'PENDING' ? 0 : Number(ethers.formatEther(result.totalSupply));
    if (result.scenarioType === 3) {
      const calldata = result.calldatas[0];
      const decodeData = voteTokenContract.decodeFunctionData('transferFrom', calldata);
      incentive.value = Number(ethers.formatEther(decodeData[2]));
    }

    return result;
  };

  const { data: proposal, isPending: isProposalPending } = useQuery({
    queryKey: [PROPOSAL_KEY, proposalId],
    queryFn: getProposal,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 3000
  });

  return {
    isProposalPending,
    proposal,
    incentive,
    totalVoteSupply
  };
};
