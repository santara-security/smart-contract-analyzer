'use client';
export const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors cursor-pointer ${
      active
        ? "bg-blue-600 text-white"
        : "bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-200"
    }`}
  >
    {children}
  </button>
);

export default TabButton;