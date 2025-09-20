import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { candidatesApi } from "../api/candidatesApi";

export function useCandidates({ search = "", stage = "", jobId = "" }) {
  return useQuery({
    queryKey: ["candidates", { search, stage, jobId }],
    queryFn: () => candidatesApi.getCandidates({ search, stage, jobId }),
    keepPreviousData: true,
    staleTime: 30000,
  });
}

export function useCandidate(id) {
  return useQuery({
    queryKey: ["candidate", id],
    queryFn: () => candidatesApi.getCandidateById(id),
    enabled: !!id,
  });
}

export function useCandidateTimeline(id) {
  return useQuery({
    queryKey: ["candidateTimeline", id],
    queryFn: () => candidatesApi.getCandidateTimeline(id),
    enabled: !!id,
  });
}

// ✅ Mutation hook for updating stage (Kanban board)
export function useUpdateCandidateStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, stage }) => candidatesApi.updateCandidateStage(id, stage),
    onMutate: async ({ id, stage }) => {
      // Cancel ongoing fetches
      await queryClient.cancelQueries(["candidates"]);
      // Snapshot previous data
      const prev = queryClient.getQueryData(["candidates"]);

      // Optimistic update
      queryClient.setQueryData(["candidates"], (old = []) =>
        old.map((c) => (c.id === id ? { ...c, stage } : c))
      );

      return { prev };
    },
    onError: (_err, _vars, context) => {
      // Rollback if API fails
      if (context?.prev) {
        queryClient.setQueryData(["candidates"], context.prev);
      }
    },
    onSettled: () => {
      // Refetch candidates + timeline for consistency
      queryClient.invalidateQueries(["candidates"]);
      queryClient.invalidateQueries({ queryKey: ["candidateTimeline"] });
    },
  });
}
