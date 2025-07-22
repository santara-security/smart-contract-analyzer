import React from "react";
import EditorTabs from "./EditorTabs";
import Header from "./Header";

export default function Editor({ code, filename }) {
  return (
    <div className="flex-1 bg-neutral-900/20 bg-opacity-50 backdrop-blur-md rounded-lg shadow-lg m-6 p-0 flex flex-col min-h-0">
      <EditorTabs tabs={[filename || "Example.sol"]} activeTab={0} />
      <Header filename={filename || "Example.sol"} />
      <div className="flex-1 p-3 overflow-auto">
        <pre className="bg-neutral-700/50 px-2 py-2 rounded text-xs font-mono text-neutral-200 whitespace-pre-wrap">
          {code}
        </pre>
      </div>
    </div>
  );
}
