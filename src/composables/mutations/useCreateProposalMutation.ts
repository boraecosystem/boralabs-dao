import { useMutation } from '@tanstack/vue-query';
import { ethers } from 'ethers';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useModalStore } from '@/stores/modal.store';
import ERC20Service from '@/services/contracts/erc20.service';
import GovernorService from '@/services/contracts/governor.service';
import WalletService from '@/services/wallet.service';
import { waitTxHash } from '@/utils/blockchain';
import {
  getProposalCallData,
  getProposalId,
  getProposalTitle,
  postProposalInfo
} from '@/utils/proposal';
import { isTokenApproval } from '@/utils/scenario';
import type { IGovernorTxParams } from '@/types/governor.type';

export const useCreateProposalMutation = () => {
  const description = ref('');
  const incentive = ref<string>('5');
  const isValidDescription = computed(
    () =>
      description.value.length === 0 ||
      (description.value.length >= 10 && description.value.length <= 300)
  );

  const router = useRouter();
  const returnToHome = () => {
    router.push({ name: 'home' });
  };

  const postCreateProposal = async (scenarioType: number) => {
    if (!isValidDescription.value) throw new Error('Invalid description');

    try {
      const walletService = new WalletService('io.metamask');
      const voteTokenContract = new ERC20Service(import.meta.env.VITE_DAO_VOTE_TOKEN);
      const governorContract = new GovernorService(import.meta.env.VITE_DAO_GOVERNANCE);
      const txParams = ref<IGovernorTxParams>({
        targets: [import.meta.env.VITE_DAO_PLUS_TOKEN],
        values: [0],
        calldatas: [],
        descriptionHash: ''
      });
      const w3p = await walletService.getWeb3Provider();
      const signer = await w3p.getSigner();
      const [proposalTitle, proposalCallData] = await Promise.all([
        getProposalTitle(scenarioType),
        getProposalCallData(scenarioType, incentive.value)
      ]);
      txParams.value.calldatas = [proposalCallData];
      txParams.value.descriptionHash = proposalTitle;

      if (isTokenApproval(scenarioType)) {
        const plusTokenContract = new ERC20Service(import.meta.env.VITE_DAO_PLUS_TOKEN);
        const approveTx = await plusTokenContract.approve(
          import.meta.env.VITE_DAO_GOVERNANCE,
          String(ethers.parseUnits(incentive.value)),
          signer
        );
        await waitTxHash(approveTx);
      }

      const proposeTx = await governorContract.propose(
        txParams.value.targets,
        txParams.value.values,
        txParams.value.calldatas,
        txParams.value.descriptionHash,
        signer
      );
      const [proposalId, voteTotalSupply] = await Promise.all([
        getProposalId(txParams.value),
        await voteTokenContract.totalSupply()
      ]);
      postProposalInfo({
        proposalTitle,
        calldata: txParams.value.calldatas,
        proposalId: String(proposalId),
        type: scenarioType,
        voteTotalSupply,
        desc: description.value
      });
      await waitTxHash(proposeTx);
    } catch (e) {
      console.error('Failed to create proposal', { e });
      throw new Error('Failed to create proposal');
    }
  };

  const { setModalInfo } = useModalStore();
  const { mutate: createProposal, isPending: isMutateProposalPending } = useMutation({
    mutationFn: async (scenarioType: number) => {
      setModalInfo({
        type: 'loading',
        isShow: true,
        desc: 'It can take up to 3 minutes depending<br />on the status of the blockchain network.<br /> Please do not leave this page or close the browser.'
      });
      await postCreateProposal(scenarioType);
    },
    onSuccess: () => {
      setModalInfo({
        type: 'success',
        isShow: true,
        desc: 'Your Agenda has been successfully registered.',
        func: returnToHome
      });
    },
    onError: () => {
      setModalInfo({
        type: 'failure',
        isShow: true,
        desc: 'Your Agenda was not successfully registered.'
      });
    }
  });

  return {
    description,
    incentive,
    isValidDescription,
    isMutateProposalPending,
    createProposal
  };
};
