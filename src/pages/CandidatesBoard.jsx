// /pages/CandidatesBoard.jsx
import { DndContext, closestCenter } from "@dnd-kit/core";
import { useCandidates, useUpdateCandidateStage } from "../hooks/useCandidates";
import CandidateKanbanColumn from "../components/candidates/CandidateKanbanColumn";
import Loader from "../components/common/Loader";

const STAGES = [
  { value: "applied", label: "Applied", color: "blue" },
  { value: "screen", label: "Screening", color: "yellow" },
  { value: "tech", label: "Tech Interview", color: "purple" },
  { value: "offer", label: "Offer", color: "green" },
  { value: "hired", label: "Hired", color: "emerald" },
  { value: "rejected", label: "Rejected", color: "red" },
];

function normalizeStage(stage) {
  if (!stage) return "";
  const s = String(stage).toLowerCase();
  if (s === "screening") return "screen";
  if (s === "interview") return "tech";
  return s;
}

export default function CandidatesBoard() {
  const { data: candidates = [], isLoading, error } = useCandidates({});
  const updateStage = useUpdateCandidateStage();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader text="Loading candidates..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-white mb-2">Failed to load candidates</h2>
          <p className="text-gray-400">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Candidate Kanban Board</h1>
        <p className="text-gray-400">Drag candidates between stages to update their status</p>
      </div>
      
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map(({ value, label, color }) => (
            <div key={value} className="flex-shrink-0 w-80">
              <CandidateKanbanColumn
                stage={value}
                label={label}
                color={color}
                candidates={candidates.filter((c) => normalizeStage(c.stage) === value)}
                onStageChange={(id, newStage) => updateStage.mutate({ id, stage: newStage })}
              />
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const candidateId = active.id;
    const newStage = over.id; // column id uses lowercase value
    updateStage.mutate({ id: candidateId, stage: newStage });
  }
}
