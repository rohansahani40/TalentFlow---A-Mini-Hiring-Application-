// /src/hooks/useAssessments.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assessmentsApi } from "../api/assessmentsApi";

export function useAssessments(jobId) {
  return useQuery({
    queryKey: ["assessments", jobId],
    queryFn: () => assessmentsApi.getAssessmentsByJob(jobId),
    enabled: !!jobId,
    staleTime: 30000,
  });
}

export function useCreateAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assessment) => assessmentsApi.createAssessment(assessment),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["assessments", data.jobId]);
    },
  });
}

export function useUpdateAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updated }) => assessmentsApi.updateAssessment(id, updated),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["assessments", data.jobId]);
    },
  });
}


