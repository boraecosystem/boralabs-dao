import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { ethers } from 'ethers';
import { useAuthStore } from '@/stores/auth.store';
import { useModalStore } from '@/stores/modal.store';
import GovernorService from '@/services/contracts/governor.service';
import WalletService from '@/services/wallet.service';
import { waitTxHash } from '@/utils/blockchain';
import { GOVERNOR_CONTRACT_KEY } from '@/constants/query-key';
import type { ProposalType } from '@/types/dao.type';

export const useExecuteProposalMutatation = () => {
  const governorContract = new GovernorService(import.meta.env.VITE_DAO_GOVERNANCE);
  const authStore = useAuthStore();
  const { setModalInfo } = useModalStore();
  const queryClient = useQueryClient();
  const { mutate: executeProposal } = useMutation({
    mutationFn: async (proposal: ProposalType) => {
      setModalInfo({
        type: 'loading',
        isShow: true,
        desc: 'It can take up to 10 minutes depending<br /> on the status of the blockchain network.<br /> Please do not leave this page or close the browser.'
      });
      const wallet = new WalletService(authStore.authInfo?.rdns!);
      const w3p = await wallet.getWeb3Provider();
      const signer = await w3p.getSigner();
      const executeTx = await governorContract.execute(
        proposal.targets,
        proposal.values,
        proposal.calldatas,
        ethers.id(proposal.title),
        signer
      );
      await waitTxHash(executeTx);
    },
    onSuccess: () => {
      setModalInfo({
        type: 'success',
        isShow: true,
        desc: 'Your execute was successfully completed.'
      });
      queryClient.invalidateQueries({ queryKey: [GOVERNOR_CONTRACT_KEY] });
    },
    onError: () => {
      setModalInfo({
        type: 'failure',
        isShow: true,
        desc: 'Your execute was not successfully completed.'
      });
    }
  });

  return {
    executeProposal
  };
};
