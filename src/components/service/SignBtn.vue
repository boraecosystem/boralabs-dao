<template>
  <UiButton v-if="!isAuth" name="Sign in" @click="() => handleAuth({ checkDelegated: false })" />

  <div v-else class="after-signin">
    <!-- skeleton -->
    <div v-if="isTokenInfoPending" class="btn-mint skeleton-tokens" />
    <button v-else type="button" class="btn-mint">
      <span>
        {{ `${voteTokenInfo?.balance} ${voteTokenInfo?.symbol}` }}<span class="line" />
        {{ `${plusTokenInfo?.balance} ${plusTokenInfo?.symbol}` }}
      </span>
      <span
        @click="() => handleAuth({ cb: { func: mintToken }, checkDelegated: true })"
        class="hover"
      >
        Go to Mint
      </span>
    </button>
    <button type="button" @click="disconnectAuth" class="btn-signout">
      <span class="font-wad">{{ truncate(authInfo!.address) }}</span>
      <span class="hover">Sign out</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import UiButton from '@/components/ui/UiButton.vue';
import { useMintTokenMutation } from '@/composables/mutations/useMintTokenMutation';
import { useTokenInfoQuery } from '@/composables/queries/useTokenInfoQuery';
import { useAuth } from '@/composables/useAuth';
import { useAuthStore } from '@/stores/auth.store';
import { truncate } from '@/utils/format';

const { handleAuth, disconnectAuth } = useAuth();
const { isAuth, authInfo } = storeToRefs(useAuthStore());
const { voteTokenInfo, plusTokenInfo, isTokenInfoPending } = useTokenInfoQuery();
const { mintToken } = useMintTokenMutation();
</script>

<style lang="scss" scoped>
.btn {
  &::before {
    content: '';
    @include img('svg/ic-wallet.svg', 24, 24);
    margin-right: 6px;
  }
}

.after-signin {
  display: flex;
  align-items: center;

  > button {
    position: relative;
    width: 220px;
    height: 48px;
    background-color: rgba(25, 22, 28, 0.5);
    border: 1px solid #535a60;
    color: $primary;
    font-size: 16px;
    transition:
      background-color 0.3s,
      color 0.3s,
      box-shadow 0.3s;

    &:hover {
      background-color: $primary;
      color: #000;
      border: none;
      box-shadow: 0px 3px 0px 0px #009a8c;

      > span {
        opacity: 0;
      }
      .hover {
        opacity: 1;
      }
    }

    > span {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%);
      opacity: 1;
      @include flex-center;
      width: 100%;
      height: 100%;

      &.hover {
        opacity: 0;
      }
    }
  }

  .btn-mint {
    margin-right: 15px;

    .line {
      display: inline-block;
      width: 1px;
      height: 20px;
      background-color: #afb4b8;
      margin: 0 12px;
    }

    .hover {
      &::before {
        content: '';
        @include img('svg/ic-mint.svg', 24, 24);
        margin-right: 6px;
      }
    }
  }

  .skeleton-tokens {
    width: 220px;
    height: 48px;
    @include skeleton;
  }

  .btn-signout {
    span {
      &::before {
        content: '';
        @include img('svg/ic-metamask.svg', 24, 24);
        margin-right: 10px;
      }
    }

    .hover {
      &::before {
        @include img('svg/ic-signout.svg', 24, 24);
        margin-right: 6px;
      }
    }
  }
}
</style>
