import { ref } from 'vue';

export const useCopy = () => {
  const isCopy = ref(false);
  const clickCopy = (text: string) => {
    window.navigator.clipboard.writeText(text);
    isCopy.value = true;
    setTimeout(() => (isCopy.value = false), 3000);
  };

  return {
    isCopy,
    clickCopy
  };
};
