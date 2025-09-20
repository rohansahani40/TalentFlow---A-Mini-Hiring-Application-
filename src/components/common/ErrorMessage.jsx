// /components/common/ErrorMessage.jsx
export default function ErrorMessage({ message = "Something went wrong" }) {
  return (
    <div className="p-4 text-center text-red-400">
      {message}
    </div>
  );
}
