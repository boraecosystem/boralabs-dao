import { useQuery } from '@tanstack/vue-query';
import { ethers } from 'ethers';
import { computed } from 'vue';
import GovernorService from '@/services/contracts/governor.service';
import Multicall3Service from '@/services/contracts/multicall3.service';
import { GOVERNOR_CONTRACT_KEY } from '@/constants/query-key';
import { PROPOSALSTATETYPE } from '@/types/dao.type';

export const useGovernorContractQuery = (proposalId: string) => {
  const governorContract = new GovernorService(import.meta.env.VITE_DAO_GOVERNANCE);
  const mulitcall3Contract = new Multicall3Service(import.meta.env.VITE_DAO_MULTI_CALL3);

  const { data, isPending: isGovernorContractPending } = useQuery({
    queryKey: [GOVERNOR_CONTRACT_KEY, proposalId],
    queryFn: async () => {
      const cds = [
        governorContract.getCallData('state', [proposalId]),
        governorContract.getCallData('proposalVotes', [proposalId])
      ];
      const res = await mulitcall3Contract.readCalls(cds);
      return {
        state: res[0][0],
        proposalVotes: res[1]
      };
    },
    retry: false,
    refetchOnWindowFocus: false
  });

  const proposalDisplayStateMap = new Map([
    ['PENDING', 'PENDING'],
    ['ACTIVE', 'ACTIVE'],
    ['CANCELED', 'CLOSED'],
    ['DEFEATED', 'CLOSED'],
    ['SUCCEEDED', 'SUCCEEDED'],
    ['QUEUED', 'CLOSED'],
    ['EXPIRED', 'CLOSED'],
    ['EXECUTED', 'EXECUTED']
  ]);

  const proposalState = computed(() => {
    return proposalDisplayStateMap.get(PROPOSALSTATETYPE[data.value?.state]) || '';
  });
  const yes = computed(() => {
    return Number(ethers.formatEther(data.value?.proposalVotes[1]));
  });
  const no = computed(() => {
    return Number(ethers.formatEther(data.value?.proposalVotes[0]));
  });
  const abstain = computed(() => {
    return Number(ethers.formatEther(data.value?.proposalVotes[2]));
  });
  const totalVotes = computed(() => yes.value + no.value + abstain.value);

  return {
    isGovernorContractPending,
    proposalState,
    yes,
    no,
    abstain,
    totalVotes
  };
};
