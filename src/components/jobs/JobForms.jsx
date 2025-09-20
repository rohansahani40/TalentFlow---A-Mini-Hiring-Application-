import { useState } from "react";
import Button from "../common/Button";

export default function JobForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    experienceLevel: "",
    salaryRange: "",
    location: "",
    tags: ""
  });

  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    onSubmit({
      title: formData.title,
      description: formData.description,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      experienceLevel: formData.experienceLevel,
      salaryRange: formData.salaryRange,
      location: formData.location,
      slug: formData.title.toLowerCase().replace(/\s+/g, "-"),
      status: "active",
      order: Date.now(),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      skills: "",
      experienceLevel: "",
      salaryRange: "",
      location: "",
      tags: ""
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Job Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Job Title *</label>
        <input
          className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Senior React Developer"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
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
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>

      {/* Skills Required */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Skills Required</label>
        <input
          className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., React, Node.js, TypeScript, AWS (comma-separated)"
          value={formData.skills}
          onChange={(e) => handleChange('skills', e.target.value)}
        />
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Experience Level</label>
        <select
          className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.experienceLevel}
          onChange={(e) => handleChange('experienceLevel', e.target.value)}
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
          value={formData.salaryRange}
          onChange={(e) => handleChange('salaryRange', e.target.value)}
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
        <input
          className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., New York, NY or Remote"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
        <input
          className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Full-time, Remote, Benefits (comma-separated)"
          value={formData.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button 
          type="button" 
          onClick={onCancel} 
          className="px-6 py-2 bg-gray-700 text-white hover:bg-gray-600 rounded-lg transition-colors"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
        >
          Create Job
        </Button>
      </div>
    </form>
  );
}
