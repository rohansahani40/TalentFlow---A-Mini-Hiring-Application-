// /pages/CandidateDetail.jsx
import { useParams, Link } from "react-router-dom";
import { useCandidate, useCandidateTimeline } from "../hooks/useCandidates";
import { useJob } from "../hooks/useJobs";
import { useState } from "react";
import Notes from "../components/common/Notes.jsx";
import Loader from "../components/common/Loader";

export default function CandidateDetail() {
  const { id } = useParams();
  const { data: candidate, isLoading, error } = useCandidate(id);
  const { data: timeline = [], isLoading: loadingTimeline } = useCandidateTimeline(id);
  const { data: job, isLoading: loadingJob } = useJob(candidate?.jobId);
  const [notes, setNotes] = useState([]);
  const mentionSuggestions = ["Alex", "Jordan", "Taylor", "Sam", "Casey"];

  const getStageColor = (stage) => {
    switch (stage?.toLowerCase()) {
      case 'applied': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'screening': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'interview': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'offer': return 'bg-green-100 text-green-800 border-green-200';
      case 'hired': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader text="Loading candidate details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-white mb-2">Failed to load candidate</h2>
          <p className="text-gray-400">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">👤</div>
          <h2 className="text-xl font-semibold text-white mb-2">Candidate not found</h2>
          <p className="text-gray-400">The candidate you're looking for doesn't exist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {candidate.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{candidate.name}</h1>
              <p className="text-lg text-gray-300 mb-3">{candidate.email}</p>
              <div className="flex items-center space-x-4">
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStageColor(candidate.stage)}`}>
                  {candidate.stage}
                </span>
                <span className="text-sm text-gray-400">
                  Candidate ID: #{candidate.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Job Information Section */}
        {candidate?.jobId && (
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-purple-900 rounded-lg flex items-center justify-center">
                <span className="text-purple-400 text-lg">💼</span>
              </div>
              <h2 className="text-xl font-semibold text-white">Applied Job</h2>
            </div>
            
            {loadingJob ? (
              <div className="text-center py-4">
                <Loader text="Loading job details..." />
              </div>
            ) : job ? (
              <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        job.status === 'active' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-600 text-white'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                      {job.description || 'No description available'}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.skills?.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                          {skill}
                        </span>
                      ))}
                      {job.skills?.length > 3 && (
                        <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded">
                          +{job.skills.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      {job.location && (
                        <span className="flex items-center">
                          📍 {job.location}
                        </span>
                      )}
                      {job.salaryRange && (
                        <span className="flex items-center">
                          💰 {job.salaryRange}
                        </span>
                      )}
                      {job.experienceLevel && (
                        <span className="flex items-center">
                          👤 {job.experienceLevel}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="ml-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors flex items-center"
                  >
                    View Job
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-gray-500 text-4xl mb-2">❓</div>
                <p className="text-gray-400">Job information not found</p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timeline Section */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 text-lg">📅</span>
              </div>
              <h2 className="text-xl font-semibold text-white">Stage Timeline</h2>
            </div>
            
            {loadingTimeline ? (
              <div className="text-center py-8">
                <Loader text="Loading timeline..." />
              </div>
            ) : timeline.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 text-4xl mb-2">📋</div>
                <p className="text-gray-400">No timeline events yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {timeline.map((item, i) => (
                  <div key={i} className="flex items-start space-x-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{item.event}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-green-900 rounded-lg flex items-center justify-center">
                <span className="text-green-400 text-lg">📝</span>
              </div>
              <h2 className="text-xl font-semibold text-white">Notes</h2>
            </div>
            
            <div className="mb-6">
              <Notes
                suggestions={mentionSuggestions}
                onAdd={(text) => setNotes((prev) => [{ text, at: new Date().toISOString() }, ...prev])}
              />
            </div>
            
            {notes.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 text-4xl mb-2">💭</div>
                <p className="text-gray-400">No notes added yet</p>
                <p className="text-sm text-gray-500 mt-1">Add your first note above</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((n, idx) => (
                  <div key={idx} className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-blue-400 text-xs">👤</span>
                        </div>
                        <span className="text-sm font-medium text-gray-300">You</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(n.at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-white">{n.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
