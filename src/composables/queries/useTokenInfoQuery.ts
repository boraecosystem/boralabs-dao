import { useQuery } from '@tanstack/vue-query';
import { ethers } from 'ethers';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import ERC20Service from '@/services/contracts/erc20.service';
import Multicall3Service from '@/services/contracts/multicall3.service';
import { TOKEN_INFO_KEY } from '@/constants/query-key';

export const useTokenInfoQuery = () => {
  const voteTokenContract = new ERC20Service(import.meta.env.VITE_DAO_VOTE_TOKEN);
  const plusTokenContract = new ERC20Service(import.meta.env.VITE_DAO_PLUS_TOKEN);
  const multicall3Contract = new Multicall3Service(import.meta.env.VITE_DAO_MULTI_CALL3);
  const { isAuth, authInfo } = storeToRefs(useAuthStore());
  const { data: tokens, isPending: isTokenInfoPending } = useQuery({
    queryKey: [TOKEN_INFO_KEY, isAuth],
    queryFn: async () => {
      const cds = [
        voteTokenContract.getCallData('balanceOf', [authInfo.value!.address]),
        voteTokenContract.getCallData('symbol', []),
        voteTokenContract.getCallData('mintMap', [authInfo.value!.address]),
        plusTokenContract.getCallData('balanceOf', [authInfo.value!.address]),
        plusTokenContract.getCallData('symbol', [])
      ];
      const calls = await multicall3Contract.readCalls(cds);

      return {
        voteToken: {
          balance: ethers.formatEther(calls[0][0]),
          symbol: calls[1][0],
          isMinted: calls[2][0]
        },
        plusToken: {
          balance: ethers.formatEther(calls[3][0]),
          symbol: calls[4][0],
          isMinted: false
        }
      };
    },
    staleTime: 5000,
    enabled: isAuth,
    retry: false,
    refetchOnWindowFocus: false
  });
  const voteTokenInfo = computed(() => {
    return tokens.value?.voteToken;
  });
  const plusTokenInfo = computed(() => {
    return tokens.value?.plusToken;
  });

  return {
    voteTokenInfo,
    plusTokenInfo,
    isTokenInfoPending
  };
};
