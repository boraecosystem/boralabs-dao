import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth.store';
import { useModalStore } from '@/stores/modal.store';
import ERC20Service from '@/services/contracts/erc20.service';
import GasService from '@/services/gas.service';
import WalletService from '@/services/wallet.service';
import { waitTxHash } from '@/utils/blockchain';

export const useAuth = () => {
  const gasAPi = new GasService();
  const { isAuth, authInfo } = storeToRefs(useAuthStore());
  const { setAuthInfo } = useAuthStore();

  const handleAuth = async (options?: {
    cb?:
      | {
          func: (...args: any) => any | Promise<any>;
          args?: any[] | undefined;
        }
      | undefined;
    checkDelegated?: boolean;
  }) => {
    const { cb, checkDelegated } = options ?? {};
    const wallet = new WalletService(authInfo.value?.rdns ?? 'io.metamask');

    try {
      const walletInfo = await wallet.getWalletInfo();
      if (authInfo.value?.address !== walletInfo.address) {
        disconnectAuth();
      }

      const currentChainId = await wallet.getChainId();
      if (currentChainId !== Number(import.meta.env.VITE_DAO_CHAIN_ID)) {
        await wallet.switchChain();
      }

      if (!isAuth.value) {
        await gasAPi.supportGas(walletInfo.address);
        await wallet.signMessage('Connect wallet to BORALABS DAO.');
        setAuthInfo(walletInfo);
      }

      if (checkDelegated) {
        const account = authInfo.value!.address;
        const erc20 = new ERC20Service(import.meta.env.VITE_DAO_VOTE_TOKEN);
        const delegatedAccount = await erc20.delegates(account);
        if (account !== delegatedAccount) {
          const modalStore = useModalStore();
          modalStore.setModalInfo({
            isShow: true,
            type: 'loading'
          });
          const w3p = await wallet.getWeb3Provider();
          const signer = await w3p.getSigner();
          const tx = await erc20.delegate(account, signer);
          try {
            await waitTxHash(tx);
            modalStore.setModalInfo({
              isShow: true,
              type: 'success'
            });
          } catch (e) {
            console.error('Failed to delegate token', { e });
            modalStore.setModalInfo({
              isShow: true,
              type: 'failure'
            });
          }
        }
      }

      if (cb && cb.func) {
        // @ts-ignore
        await cb.func.apply(this, cb.args);
      }
    } catch (e: any) {
      if (e.message.includes("reading 'provider'")) {
        if (confirm('Wallet installation is required to use this service.')) {
          window.location.href = 'https://metamask.io/download/';
        }
      }
    }
  };

  const disconnectAuth = () => {
    const wallet = new WalletService(authInfo.value?.rdns ?? 'io.metamask');
    wallet.disconnectWallet();
    setAuthInfo(undefined);
  };

  return {
    handleAuth,
    disconnectAuth
  };
};
