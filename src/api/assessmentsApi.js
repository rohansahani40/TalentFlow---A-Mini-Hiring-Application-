// /src/api/assessmentsApi.js
export const assessmentsApi = {
  async getAssessmentsByJob(jobId) {
    const res = await fetch(`/assessments/${jobId}`);
    if (!res.ok) throw new Error("Failed to fetch assessments");
    return res.json();
  },

  async createAssessment(assessment) {
    const res = await fetch(`/assessments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assessment),
    });
    if (!res.ok) throw new Error("Failed to create assessment");
    return res.json();
  },

  async updateAssessment(id, updated) {
    const res = await fetch(`/assessments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (!res.ok) throw new Error("Failed to update assessment");
    return res.json();
  },
};


