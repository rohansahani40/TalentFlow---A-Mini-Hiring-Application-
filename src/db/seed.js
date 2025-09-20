// /src/db/seed.js
import { db, seedJobs, seedCandidates, resetCandidates } from "./db";

export async function seedAll() {
  await seedJobs();
  await seedCandidates(); // Seed candidates only if database is empty (preserves existing data)

  const assessmentsCount = await db.assessments.count();
  if (assessmentsCount === 0) {
    const exampleQuestions = Array.from({ length: 10 }).map((_, i) => ({
      id: i + 1,
      type: i % 5 === 0 ? "single" : i % 5 === 1 ? "multi" : i % 5 === 2 ? "text" : i % 5 === 3 ? "number" : "file",
      title: `Question ${i + 1}`,
      required: i % 3 === 0,
      options: ["A", "B", "C", "D"],
      min: 0,
      max: 10,
      maxLength: 200,
      condition: null,
    }));

    await db.assessments.bulkAdd([
      { jobId: 1, title: "Frontend Basics Quiz", questions: exampleQuestions },
      { jobId: 1, title: "React Advanced Quiz", questions: exampleQuestions },
      { jobId: 2, title: "Backend Fundamentals", questions: exampleQuestions },
    ]);
  }
}


