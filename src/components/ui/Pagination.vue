<template>
  <ul class="pagination">
    <li>
      <button @click="moveToFirstPage" type="button" class="first" :disabled="page < 2">
        <span>first</span>
      </button>
    </li>
    <li>
      <button @click="() => changePage(page - 1)" type="button" class="prev" :disabled="page < 2">
        <span>prev</span>
      </button>
    </li>
    <li v-for="i in totalPage" :key="i">
      <a @click="() => changePage(i)" :class="{ active: page === i }">{{ i }}</a>
    </li>
    <li>
      <button
        @click="() => changePage(page + 1)"
        type="button"
        class="next"
        :disabled="page >= totalPage"
      >
        <span>next</span>
      </button>
    </li>
    <li>
      <button @click="moveToLastPage" type="button" class="last" :disabled="page >= totalPage">
        <span>last</span>
      </button>
    </li>
  </ul>
</template>

<script lang="ts" setup>
const page = defineModel<number>({ required: true });
const props = defineProps({
  totalPage: {
    type: Number,
    required: true
  }
});
const changePage = (val: number) => {
  page.value = val;
};
const moveToFirstPage = () => {
  page.value = 1;
};
const moveToLastPage = () => {
  page.value = props.totalPage;
};
</script>

<style lang="scss" scoped>
.pagination {
  @include flex-center;
  width: 100%;
  height: 40px;
  margin-top: 40px;

  button {
    @include flex-center;
    width: 40px;
    height: 40px;
    margin: 0 4px;
    background-color: transparent;
    border: 1px solid #535a60;
    border-radius: 4px;
    @include hover(background-color);

    span {
      @include svg(arrow-double, 28, 28, $color);
    }

    &:hover {
      &:enabled {
        background: rgba(83, 90, 96, 0.4);
      }
    }

    &:disabled {
      span {
        @include svg(arrow-double, 28, 28, #535a60);
      }
    }

    &.first {
      span {
        transform: rotate(180deg);
      }
    }

    &.next {
      margin-left: 28px;

      span {
        @include svg(arrow, 28, 28, $color);
      }

      &:disabled {
        span {
          @include svg(arrow, 28, 28, #535a60);
        }
      }
    }

    &.prev {
      margin-right: 28px;

      span {
        @include svg(arrow, 28, 28, $color);
        transform: rotate(180deg);
      }

      &:disabled {
        span {
          @include svg(arrow, 28, 28, #535a60);
        }
      }
    }

    &:disabled {
      cursor: default;
    }
  }

  a {
    @include flex-center;
    padding: 12px;
    color: #535a60;
    @include hover(color);

    &:hover {
      color: #8b9195;
    }

    &.active {
      color: $color;
    }
  }
}
</style>
