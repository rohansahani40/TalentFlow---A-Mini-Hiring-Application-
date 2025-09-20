// /components/candidates/CandidateSearchBar.jsx
export default function CandidateSearchBar({
  search,
  onSearch,
  stage,
  onStageChange,
  onSubmit,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    if (onSubmit) onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by name or email"
        className="border border-gray-600 bg-gray-900 text-gray-100 px-3 py-2 rounded w-1/2"
      />
      <select
        value={stage}
        onChange={(e) => onStageChange(e.target.value)}
        className="border border-gray-600 bg-gray-900 text-gray-100 px-3 py-2 rounded"
      >
        <option value="">All stages</option>
        <option value="applied">Applied</option>
        <option value="screen">Screening</option>
        <option value="tech">Tech Interview</option>
        <option value="offer">Offer</option>
        <option value="hired">Hired</option>
        <option value="rejected">Rejected</option>
      </select>
      <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">Search</button>
    </form>
  );
}
