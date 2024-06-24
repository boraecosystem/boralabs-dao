<template>
  <footer>
    <div class="left">
      <a href="https://www.boralabs.com" target="_blank">
        <img :src="logo" alt="boralabs" width="213" height="40" />
      </a>
      <a href="https://github.com/boraecosystem/boralabs-dao" target="_blank" class="github"
        >Github Address</a
      >
      <p>© METABORA SINGAPORE PTE. LTD. All Rights Reserved.</p>
    </div>
    <div class="right">
      <a href="https://www.boraportal.com" target="_blank">
        <img :src="bora" alt="bora" width="52" height="16" />
      </a>
      <a href="https://scope.boraportal.cc" target="_blank">
        <img :src="borascope" alt="bora" width="96" height="16" />
      </a>
      <a href="https://www.boralabs.com" target="_blank">
        <img :src="boralabs" alt="bora" width="87" height="16" />
      </a>
      <a href="https://www.boralabs.com/policy.html" target="_blank">Terms of Use</a>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import bora from '@/assets/images/svg/ic-bora.svg';
import boralabs from '@/assets/images/svg/ic-boralabs.svg';
import borascope from '@/assets/images/svg/ic-borascope.svg';
import logo from '@/assets/images/svg/ic-logo.svg';
</script>

<style lang="scss" scoped>
footer {
  display: flex;
  justify-content: space-between;
  height: 400px;
  padding: 60px 36px 90px 96px;
  background-color: #081018;

  .left {
    display: flex;
    flex-direction: column;

    .github {
      @include flex-center;
      width: 180px;
      height: 48px;
      margin-top: 24px;
      border: 1px solid #c9cacf;
      border-radius: 8px;
      color: #c9cacf;
    }

    > p {
      margin-top: 120px;
      align-self: flex-end;
      font-size: 12px;
      color: #63666a;
    }
  }

  .right {
    display: inline-flex;
    margin-top: 8px;

    > a {
      margin-right: 60px;
      font-size: 14px;
    }
  }
}
</style>
