import { useQuery } from '@tanstack/vue-query';
import { computed, ref, type Ref } from 'vue';
import DaoService from '@/services/dao.service';
import { VOTE_PAGE_KEY } from '@/constants/query-key';

export const useVotePageQuery = (proposalId: string, currentTabIdx: Ref<number>) => {
  // All - currentTabIdx: 0, voteStatusIdx: -1
  // Yes - currentTabIdx: 1, voteStatusIdx: 1
  // No - currentTabIdx: 2, voteStatusIdx: 0
  // Abstain - currentTabIdx: 3, voteStatusIdx: 2
  const voteStatusIdx = computed(() => {
    switch (currentTabIdx.value) {
      case 1:
        return 1;
      case 2:
        return 0;
      case 3:
        return 2;
      default:
        return -1;
    }
  });

  const daoApi = new DaoService();
  const voteCurrentPage = ref(1);
  const { data: voteList, isPending: isVoteListPending } = useQuery({
    queryKey: [VOTE_PAGE_KEY, voteCurrentPage, voteStatusIdx, proposalId],
    queryFn: async () => {
      return await daoApi.getVotes({
        page: voteCurrentPage.value,
        status: voteStatusIdx.value,
        proposalId
      });
    },
    retry: false
  });

  const hasVote = computed(() => {
    if (!voteList.value) return false;
    return voteList.value?.items!.length === 0 ? false : true;
  });
  const hasNextVote = computed(() => {
    if (!voteList.value) return false;
    return voteList.value?.totalPage === 1 ? false : true;
  });

  return {
    voteCurrentPage,
    voteList,
    isVoteListPending,
    hasVote,
    hasNextVote
  };
};
