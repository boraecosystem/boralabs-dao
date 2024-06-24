/// <reference types="vite/client" />

interface ImportMetaEnv {
  // DAO API
  readonly VITE_DAO_API_URL: string;
  readonly VITE_BORALABS_API_URL: string;

  // CHAIN INFO
  readonly VITE_DAO_CHAIN_ID: number;
  readonly VITE_DAO_CHAIN_NAME: string;
  readonly VITE_DAO_RPC_URL: string;
  readonly VITE_DAO_EXPLORER_URL: string;

  // CONTRACT INFO
  readonly VITE_DAO_VOTE_TOKEN: string;
  readonly VITE_DAO_PLUS_TOKEN: string;
  readonly VITE_DAO_GOVERNANCE: string;
  readonly VITE_DAO_MULTI_CALL3: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}
