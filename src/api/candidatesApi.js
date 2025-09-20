// /api/candidatesApi.js
export const candidatesApi = {
  async getCandidates({ search = "", stage = "", jobId = "" }) {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (stage) params.set("stage", stage);
    if (jobId) params.set("jobId", jobId);
    
    const res = await fetch(`/candidates?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch candidates");
    return res.json();
  },

  async getCandidateById(id) {
    const res = await fetch(`/candidates/${id}`);
    if (!res.ok) throw new Error("Failed to fetch candidate");
    return res.json();
  },

  async getCandidateTimeline(id) {
    const res = await fetch(`/candidates/${id}/timeline`);
    if (!res.ok) throw new Error("Failed to fetch timeline");
    return res.json();
  },
  async updateCandidateStage(id, stage) {
  const res = await fetch(`/candidates/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stage }),
  });
  if (!res.ok) throw new Error("Failed to update stage");
  return res.json();
},

};
