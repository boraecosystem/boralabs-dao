<template>
  <dialog
    ref="modalRef"
    :class="{
      failure: modalStore.modalInfo?.type === 'failure',
      loading: modalStore.modalInfo?.type === 'loading'
    }"
  >
    <template v-if="modalStore.modalInfo?.type === 'loading'">
      <strong>Transaction In Progress</strong>
      <img :src="spinner" alt="spinner " />
      <p v-html="modalStore.modalInfo?.desc" />
    </template>
    <template v-else>
      <strong>{{ modalStore.modalInfo?.type === 'success' ? 'SUCCESS' : 'FAILED' }}</strong>
      <p v-html="modalStore.modalInfo?.desc" />
      <form method="dialog">
        <UiButton name="OK" @click="closeModal" />
      </form>
    </template>
  </dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import UiButton from '@/components/ui/UiButton.vue';
import { useModalStore } from '@/stores/modal.store';
import spinner from '@/assets/images/svg/spinner.svg';

const modalStore = useModalStore();

const modalRef = ref<HTMLDialogElement>();

const preventDialogClose = (e: any) => {
  if (e.key === 'Escape') {
    e.preventDefault();
  }
};

watch(
  () => modalStore.modalInfo?.isShow,
  () => {
    if (modalStore.modalInfo?.isShow) {
      modalRef.value?.showModal();
      document.body.classList.add('hidden');
    } else {
      modalRef.value?.close();
      document.body.classList.remove('hidden');
    }
  }
);

async function closeModal() {
  if (modalStore.modalInfo?.func) {
    await modalStore.modalInfo?.func();
  }
  modalStore.setModalInfo(undefined);
}

onMounted(() => {
  window.addEventListener('keydown', preventDialogClose);
});

onUnmounted(() => {
  window.removeEventListener('keydown', preventDialogClose);
});
</script>

<style lang="scss" scoped>
dialog {
  overflow: visible;
  width: 530px;
  background-color: transparent;
  border: none;
  color: $color;
  font-size: 24px;
  padding: 60px 40px;
  text-align: center;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background-color: #102335;
    transform: skew(-7deg);
  }

  &::after {
    border: 10px solid #08b8ab;
  }

  &::backdrop {
    background-color: rgba(#000, 0.8);
  }

  > strong {
    display: flex;
    flex-direction: column;
    align-items: center;
    @include TM(40);
    color: $primary;

    &::before {
      content: '';
      @include svg(warning, 60, 60, $primary);
      margin-bottom: 30px;
    }
  }

  > p {
    margin-top: 12px;
    font-size: 24px;
  }

  .btn {
    width: 160px;
    margin: 0 auto;
    margin-top: 40px;
  }

  &.failure {
    &::after {
      border-color: #b1384e;
    }

    > strong {
      color: #b1384e;

      &::before {
        @include svg(warning, 60, 60, #b1384e);
      }
    }

    .btn {
      background-color: #b1384e;
      box-shadow: 0px 3px 0px 0px #8f2a3c;
    }
  }

  &.loading {
    &::after {
      border-color: $purple-b;
    }

    > strong {
      color: $color;
      font-size: 25px;

      &::before {
        display: none;
      }
    }

    img {
      width: 40px;
      height: 40px;
      margin: 40px 0;
      animation: rotate 1.5s infinite;
    }

    > p {
      margin-top: 0;
      font-size: 16px;
      color: rgba($color, 0.5);
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
