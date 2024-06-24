<template>
  <div class="empty">NO DATA</div>
</template>

<style lang="scss" scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 200px 0;
  border-bottom: 2px solid #24313d;
  @include TB(24);

  &::before {
    content: '';
    @include img('img-no-data.webp', 160, 160);
  }
}
</style>
