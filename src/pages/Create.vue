<template>
  <main class="bg-create">
    <section class="agenda inner">
      <h2>CREATE AGENDA</h2>
      <div class="agenda-number">
        <span :class="{ pink: scenarioType === 1 }">01</span>
        <span :class="{ pink: scenarioType === 2 }">02</span>
        <span :class="{ pink: scenarioType === 3 }">03</span>
      </div>

      <Tab :tabs="tabs" @tab-click="tabClick" />

      <div class="agenda-content">
        <Slider :slides="scenarioInfo.images" />
        <p class="agenda-info" v-html="scenarioInfo.desc" />

        <div v-if="currentIndex === 2" class="agenda-reward">
          <input type="radio" id="five" name="reward" value="5" v-model="incentive" />
          <label for="five">
            <strong>5<span>PLUS</span></strong>
          </label>
          <input type="radio" id="ten" name="reward" value="10" v-model="incentive" />
          <label for="ten">
            <strong>10<span>PLUS</span></strong>
          </label>
          <input type="radio" id="fifteen" name="reward" value="15" v-model="incentive" />
          <label for="fifteen">
            <strong>15<span>PLUS</span></strong>
          </label>
          <input type="radio" id="twenty" name="reward" value="20" v-model="incentive" />
          <label for="twenty">
            <strong>20<span>PLUS</span></strong>
          </label>
        </div>
      </div>

      <dl class="voting-info">
        <dt>Voting Delay</dt>
        <dd>5 minutes</dd>
        <dt>Voting Period</dt>
        <dd>{{ calculatedPeriod }}</dd>
      </dl>

      <textarea
        placeholder="Feel free to craft an introduction for the Agenda."
        v-model="description"
      />
      <p class="error-msg">
        Please note that profanity and derogatory language are prohibited in submissions.
      </p>

      <UiButton
        name="Create"
        size="lg"
        @click="
          () =>
            handleAuth({
              cb: { func: () => createProposal(scenarioType) },
              checkDelegated: true
            })
        "
        :disabled="!isValidDescription || isMutateProposalPending"
      />
    </section>

    <p class="warning">
      The content submitted for the Agenda is for testing purposes only and represents a
      hypothetical virtual service.
      <br />It is entirely unrelated to the actual services provided by METABORA.
    </p>
  </main>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import Slider from '@/components/service/Slider.vue';
import Tab from '@/components/ui/Tab.vue';
import UiButton from '@/components/ui/UiButton.vue';
import { useCreateProposalMutation } from '@/composables/mutations/useCreateProposalMutation';
import { useAuth } from '@/composables/useAuth';
import { useTab } from '@/composables/useTab';
import { calculateVotingPeriod } from '@/utils/format';
import { getScenarioInfo } from '@/utils/scenario';
import { createTabs } from '@/constants/tabs';

const { handleAuth } = useAuth();
const { tabs, currentIndex, tabClick } = useTab(createTabs);
const scenarioType = computed(() => currentIndex.value + 1);
const scenarioInfo = computed(() => getScenarioInfo(scenarioType.value));
const { description, incentive, isValidDescription, isMutateProposalPending, createProposal } =
  useCreateProposalMutation();
const { calculatedStartTime, calculatedEndTime } = calculateVotingPeriod();
const calculatedPeriod = computed(() => {
  return `${calculatedStartTime.value} ~ ${calculatedEndTime.value}`;
});
</script>

<style lang="scss" scoped>
.agenda {
  &-number {
    position: absolute;
    top: 135px;
    left: 126px;
    z-index: 1;

    > span {
      position: relative;
      display: block;
      margin-bottom: 30px;
      @include TB(76);
      line-height: 1;
      text-align: center;
      color: transparent;
      -webkit-text-stroke: 1px $primary;
      @include hover(all);

      &::after {
        content: '';
        opacity: 0;
        @include hover(all);
      }

      &.pink {
        color: #ff6cf4;
        -webkit-text-stroke: unset;

        &::after {
          content: '';
          opacity: 1;
          position: absolute;
          top: 50%;
          left: -93px;
          transform: translateY(-50%);
          width: 400px;
          height: 10px;
          background-color: #ff6cf4;
          transform: skew(-45deg);
        }
      }
    }
  }

  .tab {
    position: absolute;
    top: 568px;
    justify-content: space-between;
    width: 1248px;
    height: 92px;

    > :deep(li) {
      overflow: hidden;
      position: relative;
      width: 33.333333%;
      height: 100%;
      padding: 45px 30px 0;
      background-color: #090909;
      border: 0 solid $primary;
      border-bottom-width: 0px;
      font-size: 24px;
      font-family: PB;
      font-weight: 700;
      color: $primary;
      line-height: 1;
      transition:
        background-color 0.25s,
        border-bottom-width 0.1s 0.2s;

      &.active {
        background-color: $primary;
        color: #000;

        &:hover {
          &::after {
            content: none;
          }
        }
      }

      &::before {
        content: 'AGENDA 01';
        position: absolute;
        top: 20px;
        left: 30px;
        @include TM(15);
        font-weight: 500;
        color: #007d72;
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: $primary;
        transform: translateY(100%);
        transition: transform 0.3s;
      }

      &:not(.active):hover {
        border-bottom-width: 3px;

        &::after {
          transform: translateY(-100%);
        }
      }

      &:nth-child(2) {
        &::before {
          content: 'AGENDA 02';
        }
      }

      &:last-child {
        &::before {
          content: 'AGENDA 03';
        }
      }
    }
  }

  &-content {
    text-align: center;
  }

  &-info {
    margin-top: 280px;
    font-size: 32px;
    line-height: 1.4;
  }

  &-reward {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin-top: 130px;

    &::before {
      position: absolute;
      top: -50px;
      content: 'REWARDS';
      @include TB(122);
      text-align: center;
      color: transparent;
      letter-spacing: 42.7px;
      -webkit-text-stroke: 1px $purple-b;
    }

    input {
      display: none;

      &:checked + label {
        background-image: url(#{$imgPath}/btn-reward-checked.webp);
        filter: none;

        strong {
          background: linear-gradient(180deg, #ee2eff 0%, #ddecff 50%, #03dac6 100%);
          background-clip: text;
          color: transparent;
        }

        span {
          color: $primary;
        }
      }
    }

    label {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 294px;
      height: 340px;
      background: {
        image: url(#{$imgPath}/btn-reward.webp);
        repeat: no-repeat;
        size: cover;
        position: 50%;
      }
      color: #a479ff;
      @include hover(all);
      cursor: pointer;

      strong {
        @include TB(91);
        @include hover(all);
      }

      span {
        display: block;
        margin-top: 10px;
        @include TB(34);
        @include hover(all);
      }

      &:hover {
        background-image: url(#{$imgPath}/btn-reward-hover.webp);
        filter: drop-shadow(0px 0px 3px #01f0da);
      }
    }
  }

  textarea {
    width: 100%;
    height: 240px;
    margin-top: 80px;
    padding: 30px;
    border: 1px solid #404040;
    background-color: #000;
    line-height: 1.6;
    resize: none;
  }

  .error-msg {
    display: flex;
    align-items: center;
    margin-top: 15px;
    font-size: 16px;
    color: #ce1436;

    &::before {
      content: '';
      display: block;
      width: 24px;
      height: 24px;
      margin-right: 8px;
      background: {
        image: url(#{$imgPath}/svg/ic-error.svg);
        repeat: no-repeat;
        size: 24px;
        position: 50%;
      }
    }
  }
}

.btn {
  width: 400px;
  margin: 36px auto 0;
  background-color: $purple-a;
  box-shadow: 0px 4px 0px 0px #955fd8;
}
</style>
@/composables/proposal
