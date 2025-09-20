// /components/candidates/DraggableCandidateCard.jsx
import { useDraggable } from "@dnd-kit/core";

export function DraggableCandidateCard({ candidate }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: candidate.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg shadow-sm cursor-grab hover:bg-gray-600 transition-all duration-200 w-full ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {candidate.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-white truncate text-sm">{candidate.name}</div>
          <div className="text-xs text-gray-400 truncate">{candidate.email}</div>
        </div>
      </div>
    </div>
  );
}
