import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { Signer } from 'ethers';
import { useTokenInfoQuery } from '@/composables/queries/useTokenInfoQuery';
import { useAuthStore } from '@/stores/auth.store';
import { useModalStore } from '@/stores/modal.store';
import ERC20Service from '@/services/contracts/erc20.service';
import WalletService from '@/services/wallet.service';
import { waitTxHash } from '@/utils/blockchain';
import { TOKEN_INFO_KEY } from '@/constants/query-key';

export const useMintTokenMutation = () => {
  const voteTokenContract = new ERC20Service(import.meta.env.VITE_DAO_VOTE_TOKEN);
  const plusTokenContract = new ERC20Service(import.meta.env.VITE_DAO_PLUS_TOKEN);
  const { setModalInfo } = useModalStore();
  const authStore = useAuthStore();

  const { voteTokenInfo } = useTokenInfoQuery();
  async function mintVoteToken(signer: Signer) {
    if (voteTokenInfo.value?.isMinted) {
      console.error('Already minted vote token');
      return;
    }
    const tx = await voteTokenContract.mint(signer);
    await waitTxHash(tx);
  }

  async function mintDailyToken(signer: Signer) {
    const tx = await plusTokenContract.mint(signer);
    await waitTxHash(tx);
  }

  const queryClient = useQueryClient();
  const { mutate: mintToken } = useMutation({
    mutationFn: async () => {
      setModalInfo({
        isShow: true,
        type: 'loading'
      });
      const wallet = new WalletService(authStore.authInfo?.rdns!);
      const w3p = await wallet.getWeb3Provider();
      const signer = await w3p.getSigner();
      await mintVoteToken(signer);
      await mintDailyToken(signer);
    },
    onSuccess: () => {
      setModalInfo({
        isShow: true,
        type: 'success'
      });
      queryClient.invalidateQueries({ queryKey: [TOKEN_INFO_KEY] });
    },
    onError: () => {
      setModalInfo({
        isShow: true,
        type: 'failure'
      });
    }
  });

  return {
    mintToken
  };
};
