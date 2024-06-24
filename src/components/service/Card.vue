<template>
  <div class="card">
    <div class="card-visual">
      <img :src="cardImg" alt="agenda image" width="612" height="280" />
      <span class="badge" :class="{ 'badge-closed': isClosed }">
        {{ proposal.state }}
      </span>
    </div>
    <div class="card-info">
      <strong>
        {{ proposal.title }}
      </strong>
      <p class="font-wad">
        {{ proposal.txHash }}
        <button
          type="button"
          class="btn-copy"
          @click="() => clickCopy(proposal.txHash)"
          :class="{ checked: isCopy }"
        >
          copy
        </button>
      </p>
      <dl>
        <dt>Voting Result</dt>
        <dd class="gradient">
          <div class="gradient-bg" />
          <div class="gradient-color" :style="{ width: `${proposalVoteRatio}%` }" />
        </dd>
        <dt>Voting Period</dt>
        <dd>
          {{ proposalPeriod }}
        </dd>
      </dl>
      <UiButton :to="`/proposals/${proposal.proposalId}`" name="Vote" size="md" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type PropType, computed } from 'vue';
import UiButton from '@/components/ui/UiButton.vue';
import { useCopy } from '@/composables/useCopy';
import { formatDate } from '@/utils/format';
import { getScenarioInfo } from '@/utils/scenario';
import type { ProposalType } from '@/types/dao.type';

const props = defineProps({
  proposal: {
    type: Object as PropType<ProposalType>,
    required: true
  }
});

const { isCopy, clickCopy } = useCopy();

const cardImg = computed(() => {
  return getScenarioInfo(props.proposal.scenarioType).images[0];
});
const isClosed = computed(() => {
  return props.proposal.state === 'CLOSED' ? true : false;
});
const proposalPeriod = computed(() => {
  return `${formatDate(props.proposal.startDate)} ~ ${formatDate(props.proposal.endDate)}`;
});
const proposalVoteRatio = computed(() => {
  if (props.proposal.totalSupply === 0) return 0;
  return (props.proposal.totalVotingPower / props.proposal.totalSupply) * 100;
});
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  max-width: 612px;

  &-visual {
    position: relative;

    > img {
      object-fit: cover;
    }
  }

  &-info {
    padding: 38px 35px;
    background-color: #402c58;

    > strong {
      display: block;
      padding-bottom: 25px;
      border-bottom: 1px solid #5c437a;
      font-size: 30px;
      font-family: PB;
      line-height: 1;
    }

    > p {
      display: flex;
      align-items: center;
      margin-top: 12px;
      font-size: 12px;
      line-height: 1;
      color: $purple-a;

      > button {
        @include svg(copy, 30, 32, $purple-a);
        background-size: 10px 12px;

        &.checked {
          @include svg(checked, 30, 32, $purple-a);
          background-size: 10px 12px;
        }
      }
    }
  }

  dl {
    display: grid;
    grid-template-columns: 3fr 7fr;
    gap: 20px;
    margin-top: 20px;

    dt,
    dd {
      font-size: 14px;
      font-family: PM;
      color: #d2b0fd;
    }

    dd {
      font-family: PR;
    }
  }

  .gradient {
    position: relative;
    width: 100%;

    &-bg {
      width: 100%;
      height: 20px;
      transform: skew(-23deg);
      background: #202424;
    }

    &-color {
      position: absolute;
      top: 0;
      left: 0;
      height: 20px;
      background: linear-gradient(180deg, #03dac6 0%, rgba(3, 218, 198, 0) 100%),
        linear-gradient(270deg, #ed24ff 0%, #fcb141 49.5%, #00f0ff 100%);
      transform: skew(-23deg);
    }
  }

  .btn {
    width: 100%;
    margin-top: 30px;
    background: $purple-b;
    box-shadow: 0px 4px 0px 0px #5101c4;
    color: $color;
  }
}
</style>
