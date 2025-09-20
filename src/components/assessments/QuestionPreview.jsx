// /components/assessments/QuestionPreview.jsx
export default function QuestionPreview({ questions }) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 text-lg">No questions added yet</p>
        <p className="text-gray-500 text-sm mt-1">Add questions from the editor panel</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-white">Preview</h3>
        <p className="text-sm text-gray-400">{questions.length} question{questions.length !== 1 ? 's' : ''}</p>
      </div>
      
      {questions.map((q, index) => (
        <div key={q.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-800">{q.label}</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                Q{index + 1}
              </span>
              {q.required && (
                <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                  Required
                </span>
              )}
            </div>
          </div>
          
          {q.type === "shortText" && (
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-800" 
              placeholder="Enter your answer..."
              disabled 
            />
          )}
          {q.type === "longText" && (
            <textarea 
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-800" 
              rows="3"
              placeholder="Enter your answer..."
              disabled 
            />
          )}
          {q.type === "singleChoice" && (
            <select className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-800" disabled>
              <option>Select an option...</option>
              <option>Option A</option>
              <option>Option B</option>
              <option>Option C</option>
            </select>
          )}
          {q.type === "multiChoice" && (
            <div className="space-y-2">
              {['Option A', 'Option B', 'Option C'].map((option, idx) => (
                <label key={idx} className="flex items-center">
                  <input type="checkbox" className="mr-2" disabled />
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            </div>
          )}
          {q.type === "numeric" && (
            <input 
              type="number" 
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-800" 
              placeholder="Enter a number..."
              disabled 
            />
          )}
          {q.type === "file" && (
            <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
              <p className="text-gray-600">Click to upload file</p>
              <input type="file" className="hidden" disabled />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
