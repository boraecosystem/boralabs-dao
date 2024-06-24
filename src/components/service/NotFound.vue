<template>
  <main>
    <div class="not-found">
      <strong>404</strong>
      <p>Page not found</p>
      <span>Could you please check and try again?</span>
      <UiButton to="/" name="Go Back Home" size="md" />
    </div>
  </main>
</template>

<script lang="ts" setup>
import UiButton from '@/components/ui/UiButton.vue';
</script>

<style lang="scss" scoped>
main {
  background: {
    image: url(#{$imgPath}/bg-top.webp);
    repeat: no-repeat;
    size: auto 1480px;
    position: 50% 0;
  }
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 100px 0 200px;

  &::before {
    content: '';
    @include img('img-no-data.webp', 200, 200);
  }

  > strong {
    @include TB(96);
  }

  > p {
    margin-top: 30px;
    @include TB(40);
  }

  > span {
    margin-top: 10px;
  }

  .btn {
    margin-top: 50px;
    background-color: $purple-a;
    box-shadow: 0px 3px 0px 0px #955fd8;
  }
}
</style>
