// /pages/JobDetail.jsx
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { db } from "../db/db";
import Loader from "../components/common/Loader";

export default function JobDetail() {
  const { id } = useParams();

  const { data: job, isLoading, error } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => db.jobs.get(Number(id)),
    enabled: !!id,
  });

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

  if (isLoading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Loader text="Loading job details..." />
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-white mb-2">Error loading job</h2>
        <p className="text-gray-400">Please try again later</p>
      </div>
    </div>
  );
  if (!job) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-gray-500 text-6xl mb-4">📄</div>
        <h2 className="text-xl font-semibold text-white mb-2">Job not found</h2>
        <p className="text-gray-400">The job you're looking for doesn't exist</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/jobs" 
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors"
        >
          ← Back to Jobs
        </Link>

        {/* Job Header */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
              <div className="flex items-center space-x-4 text-gray-400">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {job.status}
                </span>
                <span className="flex items-center">
                  📍 {job.location || 'Not specified'}
                </span>
                <span className="flex items-center">
                  💰 {job.salaryRange || 'Not specified'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getStatusIcon(job.status)}</span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(job.status)}`}>
                {job.status}
              </span>
            </div>
          </div>

          {/* Tags */}
          {job.tags?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Job Description</h2>
              <p className="text-gray-300 leading-relaxed">
                {job.description || 'No description provided.'}
              </p>
            </div>

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Info */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Job Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-400">Experience Level</span>
                  <p className="text-white capitalize">{job.experienceLevel || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Location</span>
                  <p className="text-white">{job.location || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Salary Range</span>
                  <p className="text-white">{job.salaryRange || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Job ID</span>
                  <p className="text-white font-mono">#{job.id}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  to={`/candidates?jobId=${job.id}`}
                  className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg transition-colors"
                >
                  View Candidates
                </Link>
                <Link
                  to={`/assessments/${job.id}`}
                  className="block w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-center rounded-lg transition-colors"
                >
                  Create Assessment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
