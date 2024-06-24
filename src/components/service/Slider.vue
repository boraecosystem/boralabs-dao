<template>
  <div class="slider">
    <div class="slider-wrapper">
      <img
        v-for="slide in props.slides"
        :key="slide"
        :src="slide"
        alt="agenda image"
        width="930"
        height="400"
        class="slider-slide"
        :style="{ transform: `translateY(-${currentIndex * 100}%)` }"
      />
    </div>

    <div class="slider-button">
      <button type="button" @click="goPrev" aria-label="previous" />
      <button type="button" @click="goNext" aria-label="next" />
      <div class="slider-button-bg" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
  slides: {
    type: Array<string>,
    required: true
  }
});

const currentIndex = ref(0);
const goNext = () => {
  currentIndex.value = (currentIndex.value + 1) % props.slides.length;
};
const goPrev = () => {
  currentIndex.value = (currentIndex.value - 1 + props.slides.length) % props.slides.length;
};
</script>

<style lang="scss" scoped>
.slider {
  position: relative;
  width: 930px;
  height: 400px;
  margin: 0 auto;
  box-shadow: 0px 30px 40px 0px rgba(0, 0, 0, 0.4);

  &-wrapper {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  &-slide {
    width: 100%;
    height: 100%;
    object-fit: cover;
    @include hover(all);
  }

  &-button {
    position: absolute;
    top: 50%;
    right: -65px;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    width: 130px;
    height: 130px;

    > button {
      height: 65px;

      &:first-of-type {
        &:hover ~ .slider-button-bg {
          background-image: url(#{$imgPath}/btn-up.webp);
        }
      }

      &:last-of-type {
        &:hover ~ .slider-button-bg {
          background-image: url(#{$imgPath}/btn-down.webp);
        }
      }
    }

    &-bg {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      @include img('btn-pink.webp', 130, 130);
      @include hover(all);
      backdrop-filter: blur(12.5px);
    }
  }
}
</style>
