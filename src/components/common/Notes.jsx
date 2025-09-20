import { useMemo, useState } from "react";

export default function Notes({ onAdd, suggestions = [] }) {
  const [text, setText] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);

  const query = useMemo(() => {
    const atIndex = text.lastIndexOf("@");
    if (atIndex === -1) return "";
    const after = text.slice(atIndex + 1);
    if (/\s/.test(after)) return "";
    return after.toLowerCase();
  }, [text]);

  const filtered = useMemo(() => {
    if (!query) return [];
    return suggestions.filter((name) => name.toLowerCase().includes(query));
  }, [suggestions, query]);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd?.(trimmed);
    setText("");
    setShowSuggest(false);
  }

  function insertMention(name) {
    const atIndex = text.lastIndexOf("@");
    if (atIndex === -1) return;
    const before = text.slice(0, atIndex + 1);
    // Replace partial with full name and add trailing space
    setText(before + name + " " );
    setShowSuggest(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 relative">
      <textarea
        className="border p-2 w-full"
        placeholder="Add a note... Use @ to mention"
        value={text}
        onChange={(e) => { setText(e.target.value); setShowSuggest(true); }}
      />
      {showSuggest && filtered.length > 0 && (
        <div className="absolute z-10 bg-white border rounded shadow p-2 max-h-40 overflow-auto">
          {filtered.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => insertMention(name)}
              className="block w-full text-left px-2 py-1 hover:bg-gray-100"
            >
              @{name}
            </button>
          ))}
        </div>
      )}
      <button type="submit" className="px-3 py-1 bg-gray-200 rounded">Add Note</button>
    </form>
  );
}


