import React from "react";

export default function StatusBar() {
  return (
    <div className="h-7 px-4 flex items-center bg-neutral-900/20 border-t border-neutral-700/30 text-xs text-neutral-400">
      <span>Status: Ready</span>
      <span className="ml-auto">Ln 1, Col 1</span>
    </div>
  );
}
