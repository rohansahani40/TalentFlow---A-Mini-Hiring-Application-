// /components/common/Loader.jsx
export default function Loader({ text = "Loading..." }) {
  return (
    <div className="p-4 text-center text-gray-300">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
      <p className="text-sm">{text}</p>
    </div>
  );
}
