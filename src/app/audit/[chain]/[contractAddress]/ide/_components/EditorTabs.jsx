import React from "react";

export default function EditorTabs({ tabs = ["Example.sol"], activeTab = 0, onTabClick }) {
  return (
    <div className="flex items-center gap-1 px-4 py-1 bg-neutral-900/20 border-b border-neutral-700/30">
      {tabs.map((tab, idx) => (
        <button
          key={tab}
          className={`px-3 py-1.5 font-medium text-xs rounded-lg ${activeTab === idx ? "bg-blue-600 text-white" : "bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-200"}`}
          onClick={() => onTabClick && onTabClick(idx)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
