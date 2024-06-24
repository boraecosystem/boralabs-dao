import { ethers } from 'ethers';

export const waitTxHash = async (receipt: ethers.TransactionReceipt) => {
  const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_DAO_RPC_URL);
  await provider.waitForTransaction(receipt.hash);
};
