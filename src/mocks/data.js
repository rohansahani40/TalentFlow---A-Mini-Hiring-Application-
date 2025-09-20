// /mocks/data.js
import { nanoid } from "nanoid";

export const candidates = Array.from({ length: 1000 }).map((_, i) => {
  const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
  return {
    id: nanoid(),
    name: `Candidate ${i + 1}`,
    email: `candidate${i + 1}@mail.com`,
    stage: stages[Math.floor(Math.random() * stages.length)],
    timeline: [
      {
        stage: "applied",
        date: new Date().toISOString(),
      },
    ],
  };
});
