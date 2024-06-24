import { useInfiniteQuery } from '@tanstack/vue-query';
import { computed, ref, type Ref } from 'vue';
import DaoService from '@/services/dao.service';
import { PROPOSAL_LIST_KEY } from '@/constants/query-key';

export const useProposalListQuery = (tab: Ref<string> = ref('')) => {
  const daoApi = new DaoService();
  const {
    data: proposals,
    hasNextPage: hasNextProposal,
    fetchNextPage: fetchNextProposal,
    isPending: isProposalListPending,
    isFetchingNextPage: isFetchingProposalNextPage
  } = useInfiniteQuery({
    queryKey: [PROPOSAL_LIST_KEY, tab],
    queryFn: async ({ pageParam }) => {
      return await daoApi.getProposals(pageParam, tab.value);
    },
    initialPageParam: 1,
    getNextPageParam: (page) => {
      if (page!.currentPage >= page!.totalPage) return null;
      return page!.currentPage + 1;
    },
    getPreviousPageParam: (page) => page!.currentPage - 1,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 3000
  });
  const proposalList = computed(() => {
    return proposals.value?.pages.flatMap((proposalPage) => {
      return proposalPage.items;
    });
  });
  const hasProposals = computed(() => {
    if (!proposalList.value) return false;
    return proposalList.value.length === 0 ? false : true;
  });

  return {
    proposalList,
    hasNextProposal,
    hasProposals,
    isProposalListPending,
    isFetchingProposalNextPage,
    fetchNextProposal
  };
};
