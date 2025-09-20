import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../db/db";
import QuestionEditor from "../components/assessments/QuestionEditor.jsx";
import QuestionPreview from "../components/assessments/QuestionPreview.jsx";

export default function AssessmentBuilder() {
  const { jobId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("Untitled Assessment");

  // Load draft on mount
  useEffect(() => {
    (async () => {
      const draft = await db.assessmentDrafts.get(jobId);
      if (draft) {
        setTitle(draft.title || "Untitled Assessment");
        setQuestions(draft.questions || []);
      }
    })();
  }, []);

  // Autosave draft
  useEffect(() => {
    const id = setTimeout(async () => {
      await db.assessmentDrafts.put({ jobId, title, questions });
    }, 300);
    return () => clearTimeout(id);
  }, [jobId, title, questions]);

  function addQuestion(type) {
    setQuestions((prev) => [
      ...prev,
      { id: Date.now(), type, label: "New Question", required: false },
    ]);
  }

  function updateQuestion(id, updated) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updated } : q))
    );
  }

  async function saveAssessment() {
    const payload = {
      jobId,
      title,
      questions,
    };

    const res = await fetch("/assessments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      alert("Failed to save assessment. Please try again.");
      return;
    }
    alert("Assessment saved!");
    // Clear draft after successful save
    await db.assessmentDrafts.delete(jobId);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Assessment Builder</h1>
          <p className="text-gray-400">Create and customize assessments for your job postings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side: editor */}
          <div className="space-y-6">
            {/* Assessment Title Card */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Assessment Details
              </h2>
              <input
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter assessment title..."
              />
            </div>

            {/* Question Types Card */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Add Questions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => addQuestion("shortText")}
                  className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
                >
                  <span className="text-sm font-medium">📝 Short Text</span>
                </button>
                <button
                  onClick={() => addQuestion("longText")}
                  className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
                >
                  <span className="text-sm font-medium">📄 Long Text</span>
                </button>
                <button
                  onClick={() => addQuestion("singleChoice")}
                  className="flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
                >
                  <span className="text-sm font-medium">🔘 Single Choice</span>
                </button>
                <button
                  onClick={() => addQuestion("multiChoice")}
                  className="flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
                >
                  <span className="text-sm font-medium">☑️ Multi Choice</span>
                </button>
                <button
                  onClick={() => addQuestion("numeric")}
                  className="flex items-center justify-center px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
                >
                  <span className="text-sm font-medium">🔢 Numeric</span>
                </button>
                <button
                  onClick={() => addQuestion("file")}
                  className="flex items-center justify-center px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
                >
                  <span className="text-sm font-medium">📎 File Upload</span>
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                Questions ({questions.length})
              </h3>
              <div className="space-y-4">
                {questions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500 text-lg mb-2">📋</div>
                    <p className="text-gray-400">No questions added yet</p>
                    <p className="text-gray-500 text-sm">Click the buttons above to add questions</p>
                  </div>
                ) : (
                  questions.map((q, index) => (
                    <div key={q.id} className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-blue-400">Question {index + 1}</span>
                        <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full">
                          {q.type}
                        </span>
                      </div>
                      <QuestionEditor
                        question={q}
                        onChange={(updated) => updateQuestion(q.id, updated)}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={saveAssessment}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 hover:scale-105 flex items-center"
              >
                <span className="mr-2">💾</span>
                Save Assessment
              </button>
            </div>
          </div>

          {/* Right side: live preview */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 sticky top-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                Live Preview
              </h2>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-600 min-h-[400px]">
                <QuestionPreview questions={questions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
