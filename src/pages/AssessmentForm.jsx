import { useState, useEffect } from "react";
import { validateAnswers } from "../components/assessments/validation.js";

export default function AssessmentForm({ jobId = 1 }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadAssessment() {
      const res = await fetch(`/assessments/${jobId}`);
      const assessments = await res.json();
      if (assessments.length > 0) {
        setQuestions(assessments[0].questions); // just grab first for now
      }
    }
    loadAssessment();
  }, [jobId]);

  function handleChange(id, value) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validate answers
    const validationErrors = validateAnswers(questions, answers);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return; // Don't submit if there are errors
    }
    
    // Submit to API
    try {
      const res = await fetch(`/assessments/${jobId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: questions[0]?.id || 1, // Use first assessment for now
          candidateId: 1, // Mock candidate ID
          answers,
        }),
      });
      
      if (res.ok) {
        alert("Assessment submitted successfully!");
        setAnswers({}); // Clear form
      } else {
        alert("Failed to submit assessment. Please try again.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to submit assessment. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Assessment</h1>
      {questions.map((q) => {
        const isHidden = q.showIf && q.showIf.questionId && answers[q.showIf.questionId] !== q.showIf.equals;
        if (isHidden) return null;
        return (
        <div key={q.id} className="border border-gray-700 bg-gray-800 text-gray-100 p-2 rounded">
          <label className="block font-medium mb-1">
            {q.label}
            {q.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          {errors[q.id] && (
            <p className="text-red-400 text-sm mb-2">{errors[q.id]}</p>
          )}
          {q.type === "shortText" && (
            <input
              type="text"
              className="border border-gray-600 bg-gray-900 text-gray-100 p-2 w-full"
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
            />
          )}
          {q.type === "longText" && (
            <textarea
              className="border border-gray-600 bg-gray-900 text-gray-100 p-2 w-full"
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
            />
          )}
          {q.type === "singleChoice" && (
            <select
              className="border border-gray-600 bg-gray-900 text-gray-100 p-2 w-full"
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
            >
              <option value="">Select...</option>
              <option value="Option A">Option A</option>
              <option value="Option B">Option B</option>
            </select>
          )}
          {q.type === "multiChoice" && (
            <div className="space-y-1">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={(answers[q.id] || []).includes("Option A")}
                  onChange={(e) => {
                    const current = answers[q.id] || [];
                    const updated = e.target.checked
                      ? [...current, "Option A"]
                      : current.filter(v => v !== "Option A");
                    handleChange(q.id, updated);
                  }}
                />
                Option A
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={(answers[q.id] || []).includes("Option B")}
                  onChange={(e) => {
                    const current = answers[q.id] || [];
                    const updated = e.target.checked
                      ? [...current, "Option B"]
                      : current.filter(v => v !== "Option B");
                    handleChange(q.id, updated);
                  }}
                />
                Option B
              </label>
            </div>
          )}
          {q.type === "numeric" && (
            <input
              type="number"
              className="border border-gray-600 bg-gray-900 text-gray-100 p-2 w-full"
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
            />
          )}
          {q.type === "file" && (
            <input
              type="file"
              className="border border-gray-600 bg-gray-900 text-gray-100 p-2 w-full"
              onChange={(e) => handleChange(q.id, e.target.files[0]?.name || "")}
            />
          )}
        </div>
      )})}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
