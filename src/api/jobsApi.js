// /src/api/jobsApi.js
export const jobsApi = {
  async getJobs({ search = "", status = "", tags = [], page = 1, pageSize = 10 }) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (tags && tags.length) params.set("tags", tags.join(","));
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));

    const res = await fetch(`/jobs?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch jobs");
    return res.json();
  },

  async getJobById(id) {
    const res = await fetch(`/jobs/${id}`);
    if (!res.ok) throw new Error("Failed to fetch job");
    return res.json();
  },

  async createJob(job) {
    const res = await fetch(`/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });
    if (!res.ok) throw new Error("Failed to create job");
    return res.json();
  },

  async updateJob(id, updates) {
    const res = await fetch(`/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update job");
    return res.json();
  },

  async updateJobStatus(id, status) {
    const res = await fetch(`/jobs/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update job status");
    return res.json();
  },

  async reorderJob(id, newOrder) {
    const res = await fetch(`/jobs/${id}/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newOrder }),
    });
    if (!res.ok) throw new Error("Failed to reorder job");
    return res.json();
  },
};


