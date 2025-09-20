// /pages/CandidatesList.jsx
import { useState, useRef, useDeferredValue } from "react";
import { useSearchParams } from "react-router-dom";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCandidates } from "../hooks/useCandidates";
import CandidateCard from "../components/candidates/CandidateCard";
import CandidateSearchBar from "../components/candidates/CandidateSearchBar";
import Loader from "../components/common/Loader";

export default function CandidatesList() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId") || "";
  
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [stage, setStage] = useState("");
  const deferredSearch = useDeferredValue(search);

  // Custom hook (abstracts react-query logic)
  const { data: candidates = [], isLoading, error } = useCandidates({
    search: deferredSearch,
    stage,
    jobId,
  });

  // Show search indicator when user is typing but debounced search hasn't triggered
  const isSearching = search !== deferredSearch;

  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: candidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // row height
    overscan: 10,
  });

  if (isLoading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Loader text="Loading candidates..." />
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-white mb-2">Failed to load candidates</h2>
        <p className="text-gray-400">Please try again later</p>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold">Candidates</h1>
          {candidates.length > 0 && (
            <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
              {candidates.length} applicant{candidates.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {jobId && (
          <div className="text-sm text-blue-400 bg-blue-900/20 px-3 py-1 rounded-full">
            Filtered by Job ID: {jobId}
          </div>
        )}
      </div>

      {/* Reusable search + filter */}
      <CandidateSearchBar
        search={input}
        onSearch={setInput}
        stage={stage}
        onStageChange={setStage}
        onSubmit={() => setSearch(input)}
      />

      {/* Search indicator */}
      {isSearching && (
        <div className="mb-2 text-sm text-gray-500">
          Searching...
        </div>
      )}

      {/* Virtualized scrollable list or empty state */}
      {candidates.length === 0 ? (
        <div className="h-[600px] flex items-center justify-center border rounded-md bg-gray-800">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Applicants Yet</h3>
            <p className="text-gray-400 mb-4">
              {jobId 
                ? "No candidates have applied for this job position yet." 
                : "No candidates found matching your criteria."
              }
            </p>
            {jobId && (
              <div className="text-sm text-gray-500">
                Job ID: {jobId}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          ref={parentRef}
          className="h-[600px] overflow-auto border rounded-md"
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
              width: "100%",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const candidate = candidates[virtualRow.index];
              return (
                <div
                  key={candidate.id}
                  className="absolute left-0 right-0 block"
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                    top: 0,
                  }}
                >
                  {/* Reusable card UI (contains its own Link) */}
                  <CandidateCard candidate={candidate} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
