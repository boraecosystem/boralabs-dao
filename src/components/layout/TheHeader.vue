<template>
  <header :class="{ scrolled: isScrolled }">
    <h1>
      <router-link to="/">
        <img :src="logo" alt="boralabs" width="112" height="21" />
      </router-link>
    </h1>
    <SignBtn />
  </header>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import SignBtn from '@/components/service/SignBtn.vue';
import logo from '@/assets/images/svg/ic-logo.svg';

const getScrollY = ref(window.scrollY);

window.addEventListener('scroll', () => {
  getScrollY.value = window.scrollY;
});

const isScrolled = computed(() => {
  return getScrollY.value > 50;
});
</script>

<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 5;
  height: $header;
  min-width: $max;
  padding: 0 96px;
  background-color: transparent;
  transition: all 0.3s;

  &.scrolled {
    background-color: rgba(#000, 0.4);
    backdrop-filter: blur(12.5px);
  }

  a {
    display: flex;
    align-items: center;
  }

  img {
    width: 112px;
    height: 21px;
  }
}
</style>
