import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

type AuthType = {
  address: string;
  wallet: string;
  rdns: string;
};

export const useAuthStore = defineStore(
  'auth',
  () => {
    const authInfo = ref<AuthType>();
    const isAuth = computed(() => {
      return authInfo.value ? true : false;
    });
    function setAuthInfo(authValue: AuthType | undefined) {
      authInfo.value = authValue;
    }

    return { authInfo, isAuth, setAuthInfo };
  },
  {
    persist: [
      {
        paths: ['authInfo'],
        storage: sessionStorage
      }
    ]
  }
);
