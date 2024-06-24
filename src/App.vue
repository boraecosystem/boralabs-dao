<script setup lang="ts">
import TheFooter from '@/components/layout/TheFooter.vue';
import TheHeader from '@/components/layout/TheHeader.vue';
import Modal from '@/components/ui/Modal.vue';
</script>

<template>
  <TheHeader />
  <RouterView />
  <TheFooter />
  <Modal />
</template>
