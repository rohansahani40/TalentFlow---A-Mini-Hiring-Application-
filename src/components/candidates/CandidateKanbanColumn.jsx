// /components/candidates/CandidateKanbanColumn.jsx
import { useDroppable } from "@dnd-kit/core";
import { DraggableCandidateCard } from "./DraggableCandidateCard";

export default function CandidateKanbanColumn({ stage, label, color, candidates, onStageChange }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  const getColorClasses = (color) => {
    switch (color) {
      case 'blue': return 'border-blue-500 bg-blue-900/20';
      case 'yellow': return 'border-yellow-500 bg-yellow-900/20';
      case 'purple': return 'border-purple-500 bg-purple-900/20';
      case 'green': return 'border-green-500 bg-green-900/20';
      case 'emerald': return 'border-emerald-500 bg-emerald-900/20';
      case 'red': return 'border-red-500 bg-red-900/20';
      default: return 'border-gray-500 bg-gray-800';
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      className={`bg-gray-800 text-gray-100 p-4 rounded-lg border-2 transition-all duration-200 min-h-[500px] w-full ${
        isOver ? getColorClasses(color) : 'border-gray-700'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">{label || stage}</h2>
        <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
          {candidates.length}
        </span>
      </div>
      
      <div className="space-y-3 overflow-y-auto max-h-[600px]">
        {candidates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-sm">No candidates</p>
          </div>
        ) : (
          candidates.map((c) => (
            <div key={c.id} className="mb-3">
              <DraggableCandidateCard candidate={c} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
