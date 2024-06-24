<template>
  <ul class="tab">
    <li
      v-for="(tab, i) in props.tabs"
      :key="i"
      @click="tabClick(i)"
      :class="{ active: currentTab === i }"
    >
      {{ tab }}
    </li>
    <slot />
  </ul>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
  tabs: {
    type: Array,
    required: true
  }
});

const currentTab = ref(0);

const emit = defineEmits(['tabClick']);

const tabClick = (i: number) => {
  currentTab.value = i;
  emit('tabClick', currentTab.value);
};
</script>

<style lang="scss" scoped>
.tab {
  display: flex;
  align-items: center;

  > li {
    cursor: pointer;
  }
}
</style>
