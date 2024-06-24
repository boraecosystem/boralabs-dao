import { useQueryClient, useMutation } from '@tanstack/vue-query';
import { useAuthStore } from '@/stores/auth.store';
import { useModalStore } from '@/stores/modal.store';
import GovernorService from '@/services/contracts/governor.service';
import DaoService from '@/services/dao.service';
import WalletService from '@/services/wallet.service';
import { waitTxHash } from '@/utils/blockchain';
import { GOVERNOR_CONTRACT_KEY } from '@/constants/query-key';

export const useCastVoteMutation = () => {
  const daoApi = new DaoService();
  const governorContract = new GovernorService(import.meta.env.VITE_DAO_GOVERNANCE);
  const authStore = useAuthStore();
  const { setModalInfo } = useModalStore();
  const queryClient = useQueryClient();
  const { mutate: castVote } = useMutation({
    mutationFn: async (params: { proposalId: string; support: number }) => {
      const { proposalId, support } = params;
      setModalInfo({
        type: 'loading',
        isShow: true,
        desc: 'It can take up to 10 minutes depending<br /> on the status of the blockchain network.<br /> Please do not leave this page or close the browser.'
      });
      const wallet = new WalletService(authStore.authInfo?.rdns!);
      const w3p = await wallet.getWeb3Provider();
      const signer = await w3p.getSigner();
      const postVoteTx = await governorContract.castVote(proposalId, support, signer);
      daoApi.postVote(proposalId);
      await waitTxHash(postVoteTx);
    },
    onSuccess: () => {
      setModalInfo({
        type: 'success',
        isShow: true,
        desc: 'Your vote was successfully completed.'
      });
      queryClient.invalidateQueries({
        queryKey: [GOVERNOR_CONTRACT_KEY]
      });
    },
    onError: () => {
      setModalInfo({
        type: 'failure',
        isShow: true,
        desc: 'Your vote was not successfully completed.'
      });
    }
  });

  return {
    castVote
  };
};
