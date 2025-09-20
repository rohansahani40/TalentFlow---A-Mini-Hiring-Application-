// /src/hooks/useJobs.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsApi } from "../api/jobsApi";

export function useJobs(params) {
  const { search = "", status = "", tags = [], page = 1, pageSize = 10 } = params || {};
  return useQuery({
    queryKey: ["jobs", { search, status, tags, page, pageSize }],
    queryFn: () => jobsApi.getJobs({ search, status, tags, page, pageSize }),
    keepPreviousData: true,
    staleTime: 30000,
  });
}

export function useJob(id) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => jobsApi.getJobById(id),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (job) => jobsApi.createJob(job),
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }) => jobsApi.updateJob(id, updates),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries(["jobs"]);
      queryClient.invalidateQueries(["job", id]);
    },
  });
}

export function useUpdateJobStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => jobsApi.updateJobStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries(["jobs"]);
      const previous = queryClient.getQueryData(["jobs"]);
      queryClient.setQueryData(["jobs"], (old) => {
        if (!old?.items) return old;
        return { ...old, items: old.items.map((j) => (j.id === id ? { ...j, status } : j)) };
      });
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["jobs"], ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["jobs"]);
    },
  });
}

export function useReorderJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newOrder }) => jobsApi.reorderJob(id, newOrder),
    onMutate: async ({ id, newOrder }) => {
      await queryClient.cancelQueries(["jobs"]);
      const previous = queryClient.getQueryData(["jobs"]);
      queryClient.setQueryData(["jobs"], (old) => {
        if (!old?.items) return old;
        return {
          ...old,
          items: old.items
            .map((j) => (j.id === id ? { ...j, order: newOrder } : j))
            .sort((a, b) => (a.order || 0) - (b.order || 0)),
        };
      });
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["jobs"], ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["jobs"]);
    },
  });
}


