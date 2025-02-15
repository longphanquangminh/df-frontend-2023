export default function BookButton({ isNegative, onClick, className, children }) {
  const confliction = isNegative ? "bg-transparent text-gray-500 hover:text-black" : "bg-pink-600 hover:bg-pink-500 text-white";

  return (
    <button
      type='button'
      onClick={onClick}
      className={`flex justify-center items-center px-9 py-3 border-0 rounded-lg cursor-pointer duration-300 h-10 ${confliction} ${className}`}
    >
      {children}
    </button>
  );
}
