import React from "react";

export default function Header({ filename = "Example.sol" }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/20 border-b border-neutral-700/30">
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-neutral-200">{filename}</span>
        <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full text-xs border border-blue-500/30 ml-2">Solidity</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-1 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50 rounded transition-colors" title="Save">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5v14" /></svg>
        </button>
        <button className="p-1 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50 rounded transition-colors" title="Settings">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 12 7.09V7a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09c0 .66.34 1.26.88 1.62z" /></svg>
        </button>
      </div>
    </div>
  );
}
