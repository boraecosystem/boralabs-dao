<template>
  <main>
    <section class="top">
      <h2><img :src="titleImg" alt="AROB DAO" width="897" height="70" /></h2>
      <p>
        <span>DAO is an organization that cannot be represented because it is</span>
        <span>not the responsibility of a specific entity and does not require</span>
        <span>separate orders or management.</span>
      </p>
    </section>

    <VotingAgenda />

    <p class="warning">
      The content submitted for the Agenda is for testing purposes only and represents a
      hypothetical virtual service.
      <br />It is entirely unrelated to the actual services provided by METABORA.
    </p>
  </main>
</template>

<script setup lang="ts">
import VotingAgenda from '@/components/service/VotingAgenda.vue';
import titleImg from '@/assets/images/txt-title.webp';
</script>

<style lang="scss" scoped>
main {
  h2 {
    opacity: 0;
    transform: scale(2);
    animation: show 1.7s forwards;
  }

  .top {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 314px 0 383px;
    text-align: center;

    > p {
      width: 681px;
      margin-top: 80px;
      font-size: 24px;
      line-height: 1.3;

      > span {
        display: block;
        opacity: 0;
        background: linear-gradient(180deg, #fff 0%, #e1faf9 79.31%);
        background-clip: text;
        color: transparent;
        transform: translateY(30px);
        animation: showup 1.2s forwards;
        animation-delay: 0.6s;

        &:nth-child(2) {
          background: linear-gradient(180deg, #c6f6f3 18.97%, #a8f1ec 79.31%);
          background-clip: text;
          animation-delay: 0.8s;
        }

        &:last-child {
          background: linear-gradient(180deg, #83ebe5 18.97%, #78e9e2 79.31%);
          background-clip: text;
          animation-delay: 1s;
        }
      }
    }
  }

  .agenda {
    height: 1600px;
  }
}

@keyframes show {
  from {
    opacity: 0;
    transform: scale(2);
    filter: blur(30px);
  }
  to {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
}

@keyframes showup {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
