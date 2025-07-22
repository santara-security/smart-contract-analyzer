import React from "react";

export default function EditorTabs({ tabs = ["Example.sol"], activeTab = 0, onTabClick, onTabClose }) {
  return (
    <div className="flex items-center gap-1 px-3 py-1 bg-neutral-900/20 backdrop-blur-md rounded-t-lg shadow border-b border-neutral-700/30">
      {tabs.map((tab, idx) => (
        <div
          key={tab + idx}
          className={`flex items-center group relative`}
          style={{
            minWidth: "90px",
            maxWidth: "180px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          <button
            className={`px-3 py-1.5 font-medium text-xs rounded-lg transition-colors duration-200 border ${activeTab === idx
              ? "bg-blue-600 text-white border-blue-500/30 shadow"
              : "bg-neutral-700/50 text-neutral-300 border-transparent hover:bg-neutral-700 hover:text-neutral-200"}
              `}
            style={{
              width: "100%",
              textAlign: "left"
            }}
            onClick={() => onTabClick && onTabClick(idx)}
            title={tab}
          >
            {tab}
          </button>
          {tabs.length > 1 && (
            <button
              className="ml-[-28px] mr-1 p-1 text-neutral-400 hover:text-red-400 hover:bg-neutral-700/50 rounded-full transition-colors absolute right-0 top-1/2 -translate-y-1/2 z-10"
              title="Close tab"
              onClick={(e) => {
                e.stopPropagation();
                onTabClose && onTabClose(idx);
              }}
            >
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l8 8M6 14L14 6" /></svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
