// /src/mocks/handlers.js
import { http, HttpResponse } from "msw";
import { db } from "../db/db";
import { simulateNetwork } from "./utils";

export const handlers = [
  
  // util local to this module for consistent stage handling
  // maps historical values to canonical lowercase values used in UI
  // "screening" -> "screen", "interview" -> "tech"
  // leaves others lowercased
  
  // ---- JOBS ----
  http.get("/jobs", async ({ request }) => {
    try {
      await simulateNetwork();
      const url = new URL(request.url);
      const search = (url.searchParams.get("search") || "").toLowerCase();
      const status = url.searchParams.get("status") || "";
      const tagsParam = url.searchParams.get("tags") || ""; // comma-separated
      const page = Number(url.searchParams.get("page") || 1);
      const pageSize = Number(url.searchParams.get("pageSize") || 10);

      const all = await db.jobs.toArray();

      let filtered = all;
      if (search) {
        filtered = filtered.filter((j) => j.title.toLowerCase().includes(search));
      }
      if (status) {
        filtered = filtered.filter((j) => j.status === status);
      }
      if (tagsParam) {
        const tags = tagsParam.split(",").map((t) => t.trim()).filter(Boolean);
        if (tags.length) {
          filtered = filtered.filter((j) => (j.tags || []).some((t) => tags.includes(t)));
        }
      }

      // Sort by order asc by default
      filtered.sort((a, b) => (a.order || 0) - (b.order || 0));

      const total = filtered.length;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const items = filtered.slice(start, end);

      return HttpResponse.json({ items, total, page, pageSize }, { status: 200 });
    } catch (e) {
      return HttpResponse.json({ message: "Failed to load jobs" }, { status: 500 });
    }
  }),

  // Get a single job
  http.get("/jobs/:id", async ({ params }) => {
    try {
      await simulateNetwork();
      const job = await db.jobs.get(Number(params.id));
      if (!job) return HttpResponse.json({ message: "Not found" }, { status: 404 });
      return HttpResponse.json(job, { status: 200 });
    } catch {
      return HttpResponse.json({ message: "Failed to load job" }, { status: 500 });
    }
  }),

  // Update a job
  http.put("/jobs/:id", async ({ params, request }) => {
    try {
      await simulateNetwork();
      const id = Number(params.id);
      const updates = await request.json();
      const current = await db.jobs.get(id);
      if (!current) return HttpResponse.json({ message: "Not found" }, { status: 404 });
      await db.jobs.update(id, updates);
      const saved = await db.jobs.get(id);
      return HttpResponse.json(saved, { status: 200 });
    } catch {
      return HttpResponse.json({ message: "Failed to update job" }, { status: 500 });
    }
  }),

  http.post("/jobs", async ({ request }) => {
    try {
      await simulateNetwork();
      const data = await request.json();
      const id = await db.jobs.add(data);
      const job = await db.jobs.get(id);
      return HttpResponse.json(job, { status: 201 });
    } catch {
      return HttpResponse.json({ message: "Failed to create job" }, { status: 500 });
    }
  }),

  http.patch("/jobs/:id/reorder", async ({ params, request }) => {
    try {
      await simulateNetwork();
      const { id } = params;
      const { newOrder } = await request.json();

      const job = await db.jobs.get(Number(id));
      if (!job) return HttpResponse.json({ message: "Not found" }, { status: 404 });

      await db.jobs.update(Number(id), { order: newOrder });
      return HttpResponse.json({ ...job, order: newOrder }, { status: 200 });
    } catch {
      return HttpResponse.json({ message: "Reorder failed" }, { status: 500 });
    }
  }),

  http.patch("/jobs/:id/status", async ({ params, request }) => {
    try {
      await simulateNetwork();
      const { id } = params;
      const { status } = await request.json();

      const job = await db.jobs.get(Number(id));
      if (!job) return HttpResponse.json({ message: "Not found" }, { status: 404 });

      await db.jobs.update(Number(id), { status });
      return HttpResponse.json({ ...job, status }, { status: 200 });
    } catch {
      return HttpResponse.json({ message: "Failed to update status" }, { status: 500 });
    }
  }),

  // Delete a job
  http.delete("/jobs/:id", async ({ params }) => {
    try {
      await simulateNetwork();
      const { id } = params;
      
      const job = await db.jobs.get(Number(id));
      if (!job) return HttpResponse.json({ message: "Not found" }, { status: 404 });

      await db.jobs.delete(Number(id));
      return HttpResponse.json({ message: "Job deleted successfully" }, { status: 200 });
    } catch {
      return HttpResponse.json({ message: "Failed to delete job" }, { status: 500 });
    }
  }),

  // ---- CANDIDATES ----
  http.get("/candidates", async ({ request }) => {
    try {
      await simulateNetwork();
      const url = new URL(request.url);
      const search = url.searchParams.get("q") || "";
      const stageParam = (url.searchParams.get("stage") || "").toLowerCase();
      const jobIdParam = url.searchParams.get("jobId") || "";

      let candidates = await db.candidates.toArray();

      // Apply filters
      if (search) {
        candidates = candidates.filter(
          (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (stageParam) {
        candidates = candidates.filter((c) => {
          const s = String(c.stage || "").toLowerCase();
          const canonical = s === "screening" ? "screen" : s === "interview" ? "tech" : s;
        
          return canonical === stageParam;
        });
      }
      if (jobIdParam) {
        candidates = candidates.filter((c) => c.jobId === Number(jobIdParam));
      }

      return HttpResponse.json(candidates, { status: 200 });
    } catch (e) {
      return HttpResponse.json({ message: "Failed to load candidates" }, { status: 500 });
    }
  }),

  // Get candidate detail
  http.get("/candidates/:id", async ({ params }) => {
    try {
      await simulateNetwork();
      const { id } = params;
      const candidate = await db.candidates.get(Number(id));
      if (!candidate) return HttpResponse.json({ message: "Not found" }, { status: 404 });
      return HttpResponse.json(candidate, { status: 200 });
    } catch (e) {
      return HttpResponse.json({ message: "Failed to load candidate" }, { status: 500 });
    }
  }),

  // ✅ Update candidate stage
  http.patch("/candidates/:id", async ({ params, request }) => {
    try {
      await simulateNetwork();
      const { id } = params;
      let { stage } = await request.json();
      // normalize incoming stage to canonical values
      stage = String(stage || "").toLowerCase();
      if (stage === "screening") stage = "screen";
      if (stage === "interview") stage = "tech";

      const candidate = await db.candidates.get(Number(id));
      if (!candidate) return HttpResponse.json({ message: "Not found" }, { status: 404 });

      await db.candidates.update(Number(id), { stage });

      // Add to timeline
      await db.timelines.add({
        candidateId: Number(id),
        event: `Moved to ${stage}`,
        createdAt: new Date().toISOString(),
      });

      return HttpResponse.json({ ...candidate, stage }, { status: 200 });
    } catch (e) {
      return HttpResponse.json({ message: "Failed to update candidate" }, { status: 500 });
    }
  }),

  // Get candidate timeline
  http.get("/candidates/:id/timeline", async ({ params }) => {
    try {
      await simulateNetwork();
      const { id } = params;
      const items = await db.timelines
        .where("candidateId")
        .equals(Number(id))
        .toArray();
      return HttpResponse.json(items, { status: 200 });
    } catch (e) {
      return HttpResponse.json({ message: "Failed to load timeline" }, { status: 500 });
    }
  }),

  // ---- ASSESSMENTS ----
  // Get all assessments for a job
  http.get("/assessments/:jobId", async ({ params }) => {
    try {
      await simulateNetwork();
      const { jobId } = params;
      const assessments = await db.assessments
        .where({ jobId: Number(jobId) })
        .toArray();
      return HttpResponse.json(assessments, { status: 200 });
    } catch {
      return HttpResponse.json({ message: "Failed to load assessments" }, { status: 500 });
    }
  }),

  // Create a new assessment
  http.post("/assessments", async ({ request }) => {
    try {
      await simulateNetwork();
      const assessment = await request.json();
      const id = await db.assessments.add(assessment);
      return HttpResponse.json({ ...assessment, id }, { status: 201 });
    } catch {
      return HttpResponse.json({ message: "Failed to create assessment" }, { status: 500 });
    }
  }),

  // Update an assessment
  http.put("/assessments/:id", async ({ params, request }) => {
    try {
      await simulateNetwork();
      const { id } = params;
      const updated = await request.json();
      await db.assessments.update(Number(id), updated);
      return HttpResponse.json({ ...updated, id: Number(id) }, { status: 200 });
    } catch {
      return HttpResponse.json({ message: "Failed to update assessment" }, { status: 500 });
    }
  }),

  // Submit assessment responses
  http.post("/assessments/:jobId/submit", async ({ params, request }) => {
    try {
      await simulateNetwork();
      const { jobId } = params;
      const { assessmentId, candidateId, answers } = await request.json();
      
      const submission = {
        jobId: Number(jobId),
        assessmentId: Number(assessmentId),
        candidateId: Number(candidateId),
        answers,
        submittedAt: new Date().toISOString(),
      };
      
      const id = await db.submissions.add(submission);
      return HttpResponse.json({ ...submission, id }, { status: 201 });
    } catch {
      return HttpResponse.json({ message: "Failed to submit assessment" }, { status: 500 });
    }
  }),
];
