<template>
  <component :is="type" :to="to" :class="['btn', size ? 'btn-' + size : '']">
    {{ name }}
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const props = defineProps<{
  to?: string;
  name: string;
  size?: string;
}>();

const type = ref('button');

const changeType = () => {
  type.value = props.to ? 'router-link' : 'button';
};

onMounted(() => changeType());
</script>

<style lang="scss" scoped>
.btn {
  position: relative;
  @include flex-center;
  height: 48px;
  padding: 0 40px;
  background: $primary;
  box-shadow: 0px 3px 0px 0px #009a8c;
  font-size: 16px;
  font-family: PM;
  color: #000;
  line-height: 1;
  @include hover(all);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(#000, 0.1);
    opacity: 0;
    @include hover(opacity);
  }

  &:hover {
    &::after {
      opacity: 1;
    }
  }

  &:disabled {
    background-color: #304356;
    box-shadow: 0px 4px 0px 0px #243546;
    color: $color;
    pointer-events: none;
  }

  // size
  &-md {
    height: 64px;
    font-size: 18px;
  }

  &-lg {
    height: 84px;
    font-size: 32px;
  }
}
</style>
