<template>
  <main :class="['bg-create', { 'bg-detail': proposal?.scenarioType === 3 }]">
    <section class="agenda inner">
      <h2>AGENDA DETAIL</h2>

      <Slider :slides="scenarioInfo.images" />
      <span class="badge" :class="{ 'badge-closed': proposalState === 'CLOSED' }">
        {{ proposalState }}
      </span>
      <p class="agenda-title">
        {{ proposal?.title }}
      </p>
      <p class="agenda-info" v-html="scenarioInfo.desc" />

      <div v-if="proposal?.scenarioType === 3" class="reward-value" ref="rewardRef">
        <p>{{ rewardNumber }}<span>PLUS</span></p>
      </div>

      <!-- skeleton -->
      <div v-if="isGovernorContractPending || isProposalPending" class="skeleton-buttons">
        <span />
        <span />
        <span />
      </div>
      <div v-else class="agenda-buttons">
        <template v-if="proposalState !== 'SUCCEEDED'">
          <UiButton
            name="Yes"
            size="lg"
            @click="
              handleAuth({
                cb: {
                  func: () => castVote({ proposalId, support: 1 })
                },
                checkDelegated: true
              })
            "
            :disabled="proposalState !== 'ACTIVE'"
          >
            <span>{{ yes }} ({{ calculateVotePercentage(yes, totalVoteSupply) }}%)</span>
          </UiButton>
          <UiButton
            name="No"
            size="lg"
            @click="
              handleAuth({
                cb: {
                  func: () => castVote({ proposalId, support: 0 })
                },
                checkDelegated: true
              })
            "
            :disabled="proposalState !== 'ACTIVE'"
          >
            <span>{{ no }} ({{ calculateVotePercentage(no, totalVoteSupply) }}%)</span>
          </UiButton>
          <UiButton
            name="Abstain"
            size="lg"
            @click="
              handleAuth({
                cb: {
                  func: () => castVote({ proposalId, support: 2 })
                },
                checkDelegated: true
              })
            "
            :disabled="proposalState !== 'ACTIVE'"
            class="btn-abstain"
          >
            <span>{{ abstain }} ({{ calculateVotePercentage(abstain, totalVoteSupply) }}%)</span>
          </UiButton>
        </template>
        <UiButton
          v-else
          @click="
            handleAuth({
              cb: {
                func: () => executeProposal(proposal!)
              },
              checkDelegated: true
            })
          "
          name="Execute"
          size="lg"
          class="btn-executed"
        >
          <!-- <span>"Yes"</span> -->
        </UiButton>
      </div>

      <dl class="voting-info">
        <dt>Voting Period</dt>
        <dd v-if="!isProposalPending">
          {{ proposalPeriod }}
        </dd>
        <dt>Proposed by</dt>
        <dd v-if="!isProposalPending" class="font-wad">
          {{ truncate(proposal?.proposer!) }}
          <button
            type="button"
            @click="clickCopy(proposal?.proposer!)"
            :class="{ checked: isCopy }"
          >
            copy
          </button>
        </dd>
      </dl>

      <div class="agenda-result">
        <h3>VOTE RESULT</h3>

        <!-- skeleton -->
        <div v-if="isGovernorContractPending || isProposalPending" class="skeleton-result" />

        <div v-else class="bar">
          <p class="bar-total">
            {{ totalVotes }}
            <span>
              / {{ totalVoteSupply }} ({{ calculateVotePercentage(totalVotes, totalVoteSupply) }}%)
            </span>
          </p>
          <div class="bar-fill">
            <span class="bar-blue" v-for="i in yesBarNumber" :key="i" />
            <span class="bar-pink" v-for="i in noBarNumber" :key="i" />
            <span class="bar-yellow" v-for="i in abstainBarNumber" :key="i" />
            <span class="bar-white" v-for="i in emptyBarNumber" :key="i" />
          </div>
          <span class="bar-minimum">Minimum 10%</span>
          <div class="bar-numbers">
            <p>
              Yes<span>{{ yes }} ({{ calculateVotePercentage(yes, totalVoteSupply) }}%)</span>
            </p>
            <p>
              No<span>{{ no }} ({{ calculateVotePercentage(no, totalVoteSupply) }}%)</span>
            </p>
            <p>
              Abstain<span
                >{{ abstain }} ({{ calculateVotePercentage(abstain, totalVoteSupply) }}%)</span
              >
            </p>
          </div>
        </div>
      </div>

      <div v-if="!!proposal?.description" class="agenda-desc">
        <h3>DESCRIPTION</h3>
        <div class="box">
          <p>
            {{ proposal.description }}
          </p>
        </div>
      </div>

      <div class="agenda-table">
        <h3>GOVERNANCE COUNCIL</h3>
        <Tab :tabs="tabs" @tab-click="tabClick" />

        <table>
          <col :style="{ width: '12%' }" />
          <col />
          <col />
          <col />
          <col :style="{ width: '14%' }" />
          <thead>
            <tr>
              <th scope="col">Status</th>
              <th scope="col">Wallet Address</th>
              <th scope="col">Voting Power</th>
              <th scope="col">Vote Tx</th>
              <th scope="col">Weight</th>
            </tr>
          </thead>
          <tbody v-if="hasVote || isVoteListPending">
            <tr v-for="vote in voteTable" :key="vote.id">
              <td>
                {{ vote.status }}
              </td>
              <td class="address">
                <a
                  :href="`https://scope.boraportal.cc/address/${vote.address}`"
                  target="_blank"
                  class="font-wad"
                >
                  {{ truncate(vote.address) }}
                </a>
              </td>
              <td>
                {{ vote.votingPower }}
              </td>
              <td class="address">
                <a
                  :href="`https://scope.boraportal.cc/tx/${vote.txHash}`"
                  target="_blank"
                  class="font-wad"
                >
                  {{ truncate(vote.txHash) }}
                </a>
              </td>
              <td>{{ `${vote.weight}%` }}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="5">
                <Empty />
              </td>
            </tr>
          </tbody>
        </table>

        <Pagination
          v-if="hasNextVote"
          v-model="voteCurrentPage"
          :total-page="voteList?.totalPage!"
        />
      </div>
    </section>

    <p class="warning">
      The content submitted for the Agenda is for testing purposes only and represents a
      hypothetical virtual service.
      <br />It is entirely unrelated to the actual services provided by METABORA.
    </p>
  </main>
</template>

<script lang="ts" setup>
import { useIntersectionObserver } from '@vueuse/core';
import { computed, ref, watch, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import Empty from '@/components/service/Empty.vue';
import Slider from '@/components/service/Slider.vue';
import Pagination from '@/components/ui/Pagination.vue';
import Tab from '@/components/ui/Tab.vue';
import UiButton from '@/components/ui/UiButton.vue';
import { useCastVoteMutation } from '@/composables/mutations/useCastVoteMutation';
import { useExecuteProposalMutatation } from '@/composables/mutations/useExecuteProposalMutation';
import { useGovernorContractQuery } from '@/composables/queries/useGovernorContractQuery';
import { useProposalQuery } from '@/composables/queries/useProposalQuery';
import { useVotePageQuery } from '@/composables/queries/useVotePageQuery';
import { useAuth } from '@/composables/useAuth';
import { useCopy } from '@/composables/useCopy';
import { useTab } from '@/composables/useTab';
import { formatDate, truncate } from '@/utils/format';
import { calculateVotePercentage } from '@/utils/proposal';
import { getScenarioInfo } from '@/utils/scenario';
import { voteTableTabs } from '@/constants/tabs';

const { handleAuth } = useAuth();
const route = useRoute();
const proposalId = String(route.params.id);
const { isCopy, clickCopy } = useCopy();
const { isProposalPending, proposal, incentive, totalVoteSupply } = useProposalQuery(proposalId);
const scenarioInfo = computed(() => getScenarioInfo(proposal.value?.scenarioType!));
const proposalPeriod = computed(
  () => `${formatDate(proposal.value?.startDate!)} ~ ${formatDate(proposal.value?.endDate!)}`
);
const { isGovernorContractPending, proposalState, yes, no, abstain, totalVotes } =
  useGovernorContractQuery(proposalId);
const { executeProposal } = useExecuteProposalMutatation();
const { tabs, currentIndex, tabClick } = useTab(voteTableTabs);
const { voteCurrentPage, voteList, isVoteListPending, hasVote, hasNextVote } = useVotePageQuery(
  proposalId,
  currentIndex
);
const { castVote } = useCastVoteMutation();
const voteTable = computed(() => {
  return voteList.value?.items.map((vote) => {
    return {
      ...vote,
      weight: ((vote.votingPower / totalVoteSupply.value) * 100).toFixed(2)
    };
  });
});
const noBarNumber = computed(
  () => Math.round(Number(calculateVotePercentage(no.value, totalVoteSupply.value)) / 2) || 0
);
const yesBarNumber = computed(
  () => Math.round(Number(calculateVotePercentage(yes.value, totalVoteSupply.value)) / 2) || 0
);
const abstainBarNumber = computed(
  () => Math.round(Number(calculateVotePercentage(abstain.value, totalVoteSupply.value)) / 2) || 0
);
const emptyBarNumber = computed(
  () => 50 - (noBarNumber.value + yesBarNumber.value + abstainBarNumber.value)
);
const rewardAnimate = (incentive: Ref<number>) => {
  const rewardRef = ref<HTMLDivElement>();
  const rewardRefIsVisible = ref(false);
  const rewardNumber = ref(0);
  useIntersectionObserver(rewardRef, ([{ isIntersecting }]) => {
    rewardRefIsVisible.value = isIntersecting;
  });
  watch(rewardRefIsVisible, (newValue) => {
    if (newValue) {
      const intervalId = setInterval(() => {
        if (rewardNumber.value < incentive.value) {
          rewardNumber.value += 1;
        } else {
          clearInterval(intervalId);
        }
      }, 70);
    }
  });

  return {
    rewardRef,
    rewardNumber
  };
};
const { rewardRef, rewardNumber } = rewardAnimate(incentive);
</script>

<style lang="scss" scoped>
main {
  background-color: #081726;

  h3 {
    @include TB(40);
    color: $purple-a;
  }
}
.slider {
  width: 1084px;
  height: 466px;
}

.badge {
  top: 516px;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  height: 64px;
  font-size: 24px;
}

.agenda {
  background: {
    image: url(#{$imgPath}/bg-detail.webp);
    repeat: no-repeat;
    size: auto 660px;
    position: 50% 0;
  }

  &-title {
    display: block;
    margin-top: 70px;
    font-size: 52px;
    font-family: PM;
    font-weight: 500;
    text-align: center;
  }

  &-info {
    @include flex-center;
    height: 135px;
    margin-top: 28px;
    font-size: 24px;
    line-height: 1.4;
    text-align: center;
  }

  .reward-value {
    position: relative;
    width: 100%;
    height: 100px;
    margin-top: 50px;
    background: {
      image: url(#{$imgPath}/img-reward.webp);
      size: contain;
      position: 50%;
    }

    > p {
      position: absolute;
      top: 50%;
      right: 345px;
      transform: translateY(-50%);
      @include TB(61);
      background: linear-gradient(180deg, #ee2eff 0%, #ddecff 50%, #03dac6 100%);
      background-clip: text;
      color: transparent;
      text-align: right;
    }
  }

  &-buttons {
    @include flex-center;
    margin-top: 80px;
  }

  .voting-info {
    dt,
    dd {
      width: 203px;
      padding: 0 30px;

      &:nth-child(2) {
        width: 605px;
      }

      &:nth-child(3) {
        width: 185px;
      }

      &:last-child {
        display: flex;
        align-items: center;
        width: 255px;
      }
    }

    button {
      @include svg(copy, 34, 38, #d2b0fd);
      background-size: 16px 20px;

      &.checked {
        @include svg(checked, 34, 38, #d2b0fd);
        background-size: 16px 20px;
      }
    }
  }

  &-result {
    margin-top: 200px;
  }

  .bar {
    position: relative;
    width: 100%;
    margin-top: 25px;

    &-total {
      position: absolute;
      top: -45px;
      right: 0;
      font-family: PM;
      color: $purple-a;

      > span {
        color: #5f4876;
      }
    }

    &-fill {
      display: grid;
      grid-template-columns: repeat(50, 1fr);
      gap: 0 5px;
      width: calc(100% - 25px);
      height: 72px;
      margin: 0 auto;
    }

    &-blue,
    &-pink,
    &-yellow,
    &-white {
      border: 1px solid #e0e0e0;
      transform: skew(-20deg);
    }

    &-blue {
      background-color: rgba(0, 240, 255, 0.7);
      border-color: #00f0ff;
    }

    &-pink {
      background-color: rgba(255, 88, 228, 0.7);
      border-color: #ff58e4;
    }

    &-yellow {
      background-color: rgba(252, 177, 65, 0.7);
      border-color: #fcb141;
    }

    &-minimum {
      position: absolute;
      top: 75px;
      left: 10px;
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
      width: 98px;
      height: 40px;
      font-size: 14px;

      &::before {
        content: '';
        position: absolute;
        top: 5px;
        left: 3px;
        width: 100%;
        height: 100%;
        border: {
          width: 0 1px 1px 0;
          style: solid;
          color: $color;
        }
        transform: skew(-20deg);
      }
    }

    &-numbers {
      display: flex;
      justify-content: space-between;
      margin-top: 85px;

      > p {
        position: relative;
        z-index: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 398px;
        height: 41px;
        padding: 0 40px;
        color: #01eefd;
        font-size: 24px;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          z-index: -1;
          @include img('rect-blue.webp', 398, 41);
        }

        &:nth-child(2) {
          color: #ff58e4;

          &::before {
            @include img('rect-pink.webp', 398, 41);
          }
        }

        &:last-child {
          color: #fcb141;

          &::before {
            @include img('rect-yellow.webp', 398, 41);
          }
        }
      }
    }
  }

  &-desc {
    margin-top: 90px;

    .box {
      overflow-y: auto;
      width: 100%;
      height: 240px;
      margin-top: 25px;
      padding: 30px;
      background-color: #2a2234;
      border-top: 1px solid #5c437a;
      border-bottom: 1px solid #5c437a;
      line-height: 1.4;
    }
  }

  &-table {
    position: relative;
    margin-top: 90px;
  }
  .tab {
    position: absolute;
    top: 5px;
    right: 0;

    > :deep(li) {
      @include flex-center;
      width: 90px;
      height: 30px;
      border: 2px solid transparent;
      border-radius: 15px;
      color: #535a60;
      font-size: 14px;
      font-family: PM;
      @include hover(all);

      &:hover {
        color: $purple-a;
      }

      &.active {
        border-color: $purple-a;
        color: $purple-a;
      }
    }
  }

  table {
    width: 100%;
    margin-top: 25px;
    text-align: center;
    font-size: 16px;

    thead {
      th {
        height: 48px;
        padding: 0 10px;
        background-color: #2a2234;
        border-top: 1px solid #5c437a;
        border-bottom: 1px solid #5c437a;
        color: #d2b0fd;
        font-family: PM;
        font-weight: 500;
      }
    }

    tbody {
      width: 100%;

      td {
        height: 56px;
        padding: 0 10px;
        border-bottom: 1px solid #24313d;
      }
    }

    .address {
      > a {
        display: inline-flex;
        align-items: center;
        height: 31px;
        padding: 0 24px;
        background-color: #003e3e;
        border-radius: 17px;
        @include hover(background-color);
        cursor: pointer;

        &:hover {
          background-color: #005047;
        }
      }
    }
  }
}

.btn {
  width: 401px;
  background-color: $purple-b;
  box-shadow: 0px 4px 0px 0px #5101c4;
  justify-content: space-between;
  margin-right: 22.5px;
  color: $color;

  &-abstain {
    background-color: #5b4875;
    box-shadow: 0px 4px 0px 0px #4d3c64;
    margin-right: 0;
  }

  > span {
    font-size: 16px;
    font-family: PM;
    opacity: 0.5;
  }

  &-executed {
    justify-content: center;
    background-color: #304356;
    box-shadow: 0px 4px 0px 0px #243546;

    > span {
      font-size: 32px;
    }
  }
}

.skeleton {
  &-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0 22.5px;
    margin-top: 80px;

    > span {
      width: 100%;
      height: 84px;
      @include skeleton;
    }
  }

  &-result {
    width: 100%;
    height: 198px;
    margin-top: 25px;
    @include skeleton;
  }
}
</style>
, ref, watch, type Refimport { useIntersectionObserver } from '@vueuse/core'; , ref, watch, type
Refimport { useIntersectionObserver } from '@vueuse/core';
