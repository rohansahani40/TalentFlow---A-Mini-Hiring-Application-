import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, useDeferredValue } from "react";
import { Link } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import JobForm from "../components/jobs/JobForm";
import Loader from "../components/common/Loader";

async function fetchJobs({ queryKey }) {
  const [_key, { search, status, tags, page, pageSize }] = queryKey;
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  if (tags && tags.length) params.set("tags", tags.join(","));
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  const res = await fetch(`/jobs?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

async function createJob(newJob) {
  const res = await fetch("/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newJob),
  });
  if (!res.ok) throw new Error("Failed to create job");
  return res.json();
}

async function updateJobOrder({ id, newOrder }) {
  const res = await fetch(`/jobs/${id}/reorder`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newOrder }),
  });
  if (!res.ok) throw new Error("Failed to reorder");
  return res.json();
}

async function updateJobStatus({ id, status }) {
  const res = await fetch(`/jobs/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}

async function updateJob({ id, updates }) {
  const res = await fetch(`/jobs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update job");
  return res.json();
}

async function deleteJob(id) {
  const res = await fetch(`/jobs/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete job");
  return res.json();
}

function SortableItem({ job, onToggle, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 hover:border-gray-600 transition-all duration-200 group mb-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-gray-400 cursor-grab hover:bg-gray-500 transition-colors"
              {...listeners}
              aria-label="drag"
            >
              ⠿
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              💼
            </div>
            <div className="flex-1 min-w-0">
              <Link to={`/jobs/${job.id}`} className="block hover:bg-gray-700 rounded p-2 -m-2 transition-colors">
                <h3 className="font-semibold text-white truncate group-hover:text-blue-300 transition-colors cursor-pointer">
                  {job.title}
                </h3>
              </Link>
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
              onEdit(job);
            }}
            className="px-3 py-1 text-xs font-medium rounded bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
          >
            Edit
          </button>
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(job);
            }}
            className="px-3 py-1 text-xs font-medium rounded bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
          >
            Delete
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
    </li>
  );
}

export default function JobsList() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [tagsInput, setTagsInput] = useState(""); // applied
  const [tagsDraft, setTagsDraft] = useState(""); // typing buffer
  const tags = useMemo(
    () => tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    [tagsInput]
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const deferredSearch = useDeferredValue(search);
  const jobsKey = useMemo(() => ["jobs", { search: deferredSearch, status, tags, page, pageSize }], [deferredSearch, status, tags, page, pageSize]);

  const { data, isLoading, error } = useQuery({
    queryKey: jobsKey,
    queryFn: fetchJobs,
    keepPreviousData: true,
  });

  const jobs = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const createMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
  });

  const reorderMutation = useMutation({
    mutationFn: updateJobOrder,
    onMutate: async (_vars) => {
      await queryClient.cancelQueries({ queryKey: ["jobs"] });
      const prevJobs = queryClient.getQueryData(jobsKey);
      return { prevJobs };
    },
    onError: (_err, _vars, context) => {
      if (context?.prevJobs) {
        queryClient.setQueryData(jobsKey, context.prevJobs);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
  });

  const statusMutation = useMutation({
    mutationFn: updateJobStatus,
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["jobs"] });
      const prevJobs = queryClient.getQueryData(jobsKey);
      queryClient.setQueryData(jobsKey, (old) => {
        if (!old || !Array.isArray(old.items)) return old;
        return {
          ...old,
          items: old.items.map((j) => (j.id === id ? { ...j, status } : j)),
        };
      });
      return { prevJobs };
    },
    onError: (err, vars, context) => {
      if (context?.prevJobs) {
        queryClient.setQueryData(jobsKey, context.prevJobs);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
  });

  const updateMutation = useMutation({
    mutationFn: updateJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
  });

  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState("");
  const [editJob, setEditJob] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSkills, setEditSkills] = useState("");
  const [editExperienceLevel, setEditExperienceLevel] = useState("");
  const [editSalaryRange, setEditSalaryRange] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editTags, setEditTags] = useState("");
  const [jobToDelete, setJobToDelete] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  if (isLoading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Loader text="Loading jobs..." />
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-white mb-2">Failed to load jobs</h2>
        <p className="text-gray-400">Please try again later</p>
      </div>
    </div>
  );


  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = jobs.findIndex((j) => j.id === active.id);
    const newIndex = jobs.findIndex((j) => j.id === over.id);
    const newJobs = arrayMove(jobs, oldIndex, newIndex);

    // Optimistic UI reorder (current page only)
    queryClient.setQueryData(jobsKey, (old) => {
      if (!old || !Array.isArray(old.items)) return old;
      return { ...old, items: newJobs };
    });

    // Persist changes
    newJobs.forEach((job, idx) => {
      reorderMutation.mutate({ id: job.id, newOrder: idx + 1 });
    });
  }

  function handleToggle(job) {
    const newStatus = job.status === "active" ? "archived" : "active";
    console.log("Toggling job", job.id, "from", job.status, "to", newStatus);
    statusMutation.mutate({ id: job.id, status: newStatus });
  }

  function openEdit(job) {
    setEditJob(job);
    setEditTitle(job.title || "");
    setEditDescription(job.description || "");
    setEditSkills((job.skills || []).join(", "));
    setEditExperienceLevel(job.experienceLevel || "");
    setEditSalaryRange(job.salaryRange || "");
    setEditLocation(job.location || "");
    setEditTags((job.tags || []).join(", "));
  }

  function handleEditSave() {
    if (!editJob) return;
    const trimmed = editTitle.trim();
    if (!trimmed) {
      setFormError("Title is required");
      return;
    }
    const slug = trimmed.toLowerCase().replace(/\s+/g, "-");
    const slugTaken = jobs.some((j) => j.slug === slug && j.id !== editJob.id);
    if (slugTaken) {
      setFormError("Slug must be unique (title already used)");
      return;
    }
    setFormError("");
    
    const skillsArray = editSkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const tagsArray = editTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    
    const updates = {
      title: trimmed,
      slug,
      description: editDescription.trim(),
      skills: skillsArray,
      experienceLevel: editExperienceLevel,
      salaryRange: editSalaryRange.trim(),
      location: editLocation.trim(),
      tags: tagsArray,
    };
    
    updateMutation.mutate(
      { id: editJob.id, updates },
      {
        onSuccess: () => {
          setEditJob(null);
          setFormError("");
        },
        onError: (error) => {
          setFormError(error.message || "Failed to update job");
        },
      }
    );
  }

  function handleDelete(job) {
    setJobToDelete(job);
  }

  function confirmDelete() {
    if (jobToDelete) {
      deleteMutation.mutate(jobToDelete.id, {
        onSuccess: () => {
          setJobToDelete(null);
        },
      });
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Jobs</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          + New Job
        </button>
      </div>

      <div className="flex gap-2 mb-2">
        <input
          className="border border-gray-600 bg-gray-900 text-gray-100 p-2 flex-1"
          placeholder="Search title"
          value={input}
          onChange={(e) => { setInput(e.target.value); }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearch(input);
              setPage(1);
            }
          }}
        />
        <button
          onClick={() => { setSearch(input); setPage(1); }}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>
        <select
          className="border border-gray-600 bg-gray-900 text-gray-100 p-2"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
        >
          <option value="">All status</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
        <input
          className="border border-gray-600 bg-gray-900 text-gray-100 p-2"
          placeholder="Tags (comma-separated)"
          value={tagsDraft}
          onChange={(e) => { setTagsDraft(e.target.value); }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setTagsInput(tagsDraft);
              setPage(1);
            }
          }}
        />
        <button
          onClick={() => { setTagsInput(tagsDraft); setPage(1); }}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Apply
        </button>
        <select
          className="border border-gray-600 bg-gray-900 text-gray-100 p-2"
          value={pageSize}
          onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {(search !== deferredSearch || tagsDraft !== tagsInput) && (
        <div className="mb-4 text-sm text-gray-500">Filtering...</div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={jobs.map((j) => j.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-2">
            {jobs.map((job) => (
              <div key={job.id} onDoubleClick={() => openEdit(job)}>
                <SortableItem job={job} onToggle={handleToggle} onEdit={openEdit} onDelete={handleDelete} />
              </div>
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <div className="flex items-center justify-between mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white"
        >
          Prev
        </button>
        <span>
          Page {page} / {totalPages} ({total} total)
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white"
        >
          Next
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 text-gray-100 p-6 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Create New Job</h2>
            <JobForm
              onSubmit={(jobData) => {
                createMutation.mutate(jobData, {
                  onSuccess: () => {
                    setShowModal(false);
                    setFormError("");
                  },
                  onError: (error) => {
                    setFormError(error.message || "Failed to create job");
                  }
                });
              }}
              onCancel={() => {
                setShowModal(false);
                setFormError("");
              }}
            />
            {formError && (
              <p className="text-red-400 text-sm mt-4 text-center">{formError}</p>
            )}
          </div>
        </div>
      )}

      {editJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 text-gray-100 p-6 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Job</h2>
            
            <form onSubmit={(e) => { e.preventDefault(); handleEditSave(); }} className="space-y-4">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Job Title *</label>
                <input
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Senior React Developer"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Job Description</label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                  rows="4"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>

              {/* Skills Required */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skills Required</label>
                <input
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., React, Node.js, TypeScript, AWS (comma-separated)"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                />
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Experience Level</label>
                <select
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editExperienceLevel}
                  onChange={(e) => setEditExperienceLevel(e.target.value)}
                >
                  <option value="">Select experience level</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior Level (6-10 years)</option>
                  <option value="lead">Lead/Principal (10+ years)</option>
                </select>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Salary Range</label>
                <input
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., $80,000 - $120,000"
                  value={editSalaryRange}
                  onChange={(e) => setEditSalaryRange(e.target.value)}
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., New York, NY or Remote"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                <input
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Full-time, Remote, Benefits (comma-separated)"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                />
              </div>

              {/* Error Message */}
              {formError && (
                <p className="text-red-400 text-sm text-center">{formError}</p>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setEditJob(null); setFormError(""); }}
                  className="px-6 py-2 bg-gray-700 text-white hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {jobToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 text-gray-100 p-6 rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">⚠️</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Delete Job</h2>
                <p className="text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-2">Are you sure you want to delete this job?</p>
              <div className="bg-gray-700 rounded-lg p-3">
                <h3 className="font-semibold text-white">{jobToDelete.title}</h3>
                <p className="text-sm text-gray-400">#{jobToDelete.slug || jobToDelete.id}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setJobToDelete(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete Job"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
