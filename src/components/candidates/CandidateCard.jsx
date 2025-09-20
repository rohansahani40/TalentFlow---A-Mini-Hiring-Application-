// /components/candidates/CandidateCard.jsx
import { Link } from "react-router-dom";

export default function CandidateCard({ candidate }) {
  const getStageColor = (stage) => {
    switch (stage?.toLowerCase()) {
      case 'applied': return 'bg-blue-600 text-white';
      case 'screening': return 'bg-yellow-600 text-white';
      case 'interview': return 'bg-purple-600 text-white';
      case 'offer': return 'bg-green-600 text-white';
      case 'hired': return 'bg-emerald-600 text-white';
      case 'rejected': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <Link
      to={`/candidates/${candidate.id}`}
      className="block p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:border-gray-600 transition-all duration-200 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {candidate.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                {candidate.name}
              </h3>
              <p className="text-sm text-gray-400 truncate">
                {candidate.email}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStageColor(candidate.stage)}`}>
            {candidate.stage}
          </span>
          <div className="text-gray-500 group-hover:text-gray-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
