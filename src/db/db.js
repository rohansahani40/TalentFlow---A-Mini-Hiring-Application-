// /src/db/db.js
import Dexie from "dexie";

export const db = new Dexie("talentflowDB");

// ✅ bump version to 6 to include new job fields
db.version(6).stores({
  jobs: "++id,slug,title,description,skills,experienceLevel,salaryRange,location,status,order,tags",
  candidates: "++id,name,email,jobId,stage",
  timelines: "++id,candidateId,event,createdAt",
  assessments: "++id,jobId,title,questions",
  submissions: "++id,jobId,assessmentId,candidateId,answers,submittedAt",
  assessmentDrafts: "jobId,title,questions",
});

// ---- Seeds ----

// Seed jobs
export async function seedJobs() {
  const count = await db.jobs.count();
  if (count === 0) {
    await db.jobs.bulkAdd([
      {
        title: "Frontend Engineer",
        slug: "frontend-engineer",
        description: "We are looking for a skilled Frontend Engineer to join our team. You will be responsible for building user-facing features and ensuring a great user experience.",
        skills: ["React", "TypeScript", "CSS", "HTML", "JavaScript"],
        experienceLevel: "mid",
        salaryRange: "$80,000 - $120,000",
        location: "San Francisco, CA",
        status: "active",
        order: 1,
        tags: ["react", "frontend", "full-time"],
      },
      {
        title: "Backend Engineer",
        slug: "backend-engineer",
        description: "Join our backend team to build scalable APIs and services. You will work with modern technologies and contribute to our microservices architecture.",
        skills: ["Node.js", "Python", "PostgreSQL", "AWS", "Docker"],
        experienceLevel: "senior",
        salaryRange: "$100,000 - $150,000",
        location: "Remote",
        status: "active",
        order: 2,
        tags: ["node", "backend", "remote"],
      },
    ]);
  }
}

// ✅ Reset and reseed candidates with deterministic data
export async function resetCandidates() {
  // Clear existing candidates and timelines
  await db.candidates.clear();
  await db.timelines.clear();
  
  const fakeStages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
  const availableJobs = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34];
  
  // Create deterministic candidates with fixed patterns
  const candidates = Array.from({ length: 1000 }).map((_, i) => {
    // Use deterministic assignment based on index
    const jobIndex = i % availableJobs.length;
    const stageIndex = i % fakeStages.length;
    
    return {
      name: `Candidate ${i + 1}`,
      email: `candidate${i + 1}@mail.com`,
      jobId: availableJobs[jobIndex],
      stage: fakeStages[stageIndex],
    };
  });

  const ids = await db.candidates.bulkAdd(candidates, { allKeys: true });

  // Add timeline entries with deterministic timestamps
  const now = Date.now();
  const timelines = ids.map((id, i) => ({
    candidateId: id,
    event: "Applied",
    createdAt: new Date(now - i * 1000 * 60).toISOString(),
  }));

  await db.timelines.bulkAdd(timelines);
}

// ✅ Seed candidates and their timelines with deterministic data
export async function seedCandidates() {
  const count = await db.candidates.count();
  if (count === 0) {
    const fakeStages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
    const availableJobs = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34];
    
    // Create deterministic candidates with fixed patterns
    const candidates = Array.from({ length: 1000 }).map((_, i) => {
      // Use deterministic assignment based on index
      const jobIndex = i % availableJobs.length;
      const stageIndex = i % fakeStages.length;
      
      return {
        name: `Candidate ${i + 1}`,
        email: `candidate${i + 1}@mail.com`,
        jobId: availableJobs[jobIndex],
        stage: fakeStages[stageIndex],
      };
    });

    const ids = await db.candidates.bulkAdd(candidates, { allKeys: true });

    // Add timeline entries with deterministic timestamps
    const now = Date.now();
    const timelines = ids.map((id, i) => ({
      candidateId: id,
      event: "Applied",
      createdAt: new Date(now - i * 1000 * 60).toISOString(),
    }));
    await db.timelines.bulkAdd(timelines);
  }
}
