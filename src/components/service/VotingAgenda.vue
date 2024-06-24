<template>
  <section class="inner">
    <div class="title">
      <strong>VOTING AGENDA</strong>
      <UiButton to="/create" name="Create Agenda" size="md" />
    </div>

    <Tab :tabs="tabs" @tab-click="tabClick" />

    <div v-if="hasProposals || isProposalListPending" class="card-list">
      <Card v-for="proposal in proposalList" :key="proposal.id" :proposal="proposal" />
    </div>
    <Empty v-else />

    <button
      v-if="hasNextProposal"
      @click="() => fetchNextProposal()"
      type="button"
      class="btn-more"
      aria-label="more"
      :disabled="isFetchingProposalNextPage"
    />
  </section>
</template>

<script lang="ts" setup>
import Card from '@/components/service/Card.vue';
import Empty from '@/components/service/Empty.vue';
import Tab from '@/components/ui/Tab.vue';
import UiButton from '@/components/ui/UiButton.vue';
import { useProposalListQuery } from '@/composables/queries/useProposalListQuery';
import { useTab } from '@/composables/useTab';
import { homeTabs } from '@/constants/tabs';

const { tabs, currentTab, tabClick } = useTab(homeTabs);
const {
  proposalList,
  hasNextProposal,
  hasProposals,
  isProposalListPending,
  isFetchingProposalNextPage,
  fetchNextProposal
} = useProposalListQuery(currentTab);
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 60px;

  > strong {
    @include TB(40);
    color: $purple-a;
  }

  .btn {
    background-color: $purple-a;
    box-shadow: 0px 3px 0px 0px #955fd8;

    &::before {
      content: '';
      @include img('svg/ic-docs.svg', 24, 24);
      margin-right: 6px;
    }
  }
}

.tab {
  justify-content: space-between;
  width: 100%;
  height: 72px;
  border-bottom: 3px solid $primary;

  > :deep(li) {
    @include flex-center;
    width: 25%;
    height: 100%;
    padding: 0 10px;
    background-color: #003e3e;
    font-size: 24px;
    font-family: PM;
    color: $color;
    @include hover(all);

    &:hover {
      background-color: #005047;
    }

    &.active {
      background-color: $primary;
      color: #000;
    }
  }
}

.card-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px 24px;
  width: 100%;
  margin-top: 60px;
  min-height: 526px;
}

.btn-more {
  position: relative;
  @include flex-center;
  width: 40px;
  height: 40px;
  margin: 86px auto 0;
  background: {
    image: url(#{$imgPath}/svg/ic-plus.svg);
    repeat: no-repeat;
    size: 40px;
    position: 50%;
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: -604px;
    display: block;
    width: 588px;
    height: 1px;
    background: {
      image: linear-gradient(to right, #607d97 50%, transparent 50%);
      size: 8px 100%;
    }
  }

  &::before {
    margin-right: 16px;
  }

  &::after {
    left: unset;
    right: -604px;
    margin-left: 16px;
  }
}
</style>
