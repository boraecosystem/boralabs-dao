import { computed, ref } from 'vue';

export const useTab = (_tabs: string[]) => {
  const tabs = _tabs;
  const currentIndex = ref(0);
  const currentTab = computed(() => tabs[currentIndex.value]);
  const tabClick = (i: number) => {
    currentIndex.value = i;
  };

  return {
    tabs,
    currentIndex,
    currentTab,
    tabClick
  };
};
