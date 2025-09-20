// /src/components/common/Modal.jsx
export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-gray-100 rounded shadow-lg w-96 p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}


