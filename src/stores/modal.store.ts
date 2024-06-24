import { defineStore } from 'pinia';
import { ref } from 'vue';

type ModalType = {
  isShow: boolean;
  type: 'success' | 'failure' | 'loading';
  desc?: string;
  func?: () => any | Promise<any> | Function;
};

export const useModalStore = defineStore('modal', () => {
  const modalInfo = ref<ModalType>();
  function setModalInfo(modalValue: ModalType | undefined) {
    modalInfo.value = modalValue;
  }

  return { modalInfo, setModalInfo };
});
