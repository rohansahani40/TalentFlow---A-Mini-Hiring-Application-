// /components/assessments/QuestionEditor.jsx
export default function QuestionEditor({ question, onChange }) {
  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Question Text
        </label>
        <input
          type="text"
          value={question.label}
          onChange={(e) => onChange({ label: e.target.value })}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter your question..."
        />
      </div>
      
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Type
          </label>
          <select
            value={question.type}
            onChange={(e) => onChange({ type: e.target.value })}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="shortText">Short Text</option>
            <option value="longText">Long Text</option>
            <option value="singleChoice">Single Choice</option>
            <option value="multiChoice">Multi Choice</option>
            <option value="numeric">Numeric</option>
            <option value="file">File Upload</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`required-${question.id}`}
            checked={question.required}
            onChange={(e) => onChange({ required: e.target.checked })}
            className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-600 rounded focus:ring-blue-500"
          />
          <label htmlFor={`required-${question.id}`} className="ml-2 text-sm text-gray-300">
            Required
          </label>
        </div>
      </div>
    </div>
  );
}
