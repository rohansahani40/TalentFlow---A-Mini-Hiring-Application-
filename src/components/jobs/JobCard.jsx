export default function JobCard({ job, onToggle }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-600 text-white';
      case 'archived': return 'bg-gray-600 text-white';
      case 'draft': return 'bg-yellow-600 text-white';
      case 'closed': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return '🟢';
      case 'archived': return '📁';
      case 'draft': return '📝';
      case 'closed': return '🔒';
      default: return '❓';
    }
  };

  return (
    <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 hover:border-gray-600 transition-all duration-200 group">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              💼
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                {job.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-400">#{job.slug || job.id}</span>
                {job.tags && job.tags.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500">•</span>
                    <span className="text-xs text-gray-500">
                      {job.tags.length} tag{job.tags.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getStatusIcon(job.status)}</span>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
              {job.status}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(job);
            }}
            className={`px-3 py-1 text-xs font-medium rounded transition-all duration-200 ${
              job.status === "active" 
                ? "bg-orange-600 hover:bg-orange-700 text-white" 
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {job.status === "active" ? "Archive" : "Unarchive"}
          </button>
        </div>
      </div>
      
      {job.tags && job.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {job.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-700 text-gray-400 rounded-full">
              +{job.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
