import React from "react";
import EditorTabs from "./EditorTabs";
import Header from "./Header";

export default function Editor({ code, filename, tabs = ["Example.sol"], activeTab = 0, onTabClick, onTabClose }) {
  return (
    <div className="flex-1 bg-neutral-900/20 bg-opacity-50 backdrop-blur-md rounded-lg shadow border border-neutral-700/30 m-6 p-0 flex flex-col min-h-0">
      <EditorTabs
        tabs={tabs.map(f => f.split("/").pop())}
        activeTab={activeTab}
        onTabClick={onTabClick}
        onTabClose={onTabClose}
      />
      <div className="px-4 pt-2 pb-1 border-b border-neutral-700/30 flex items-center justify-between">
        <Header filename={filename || "Example.sol"} code={code} />
      </div>
      <div className="flex-1 p-3 overflow-auto">
        <pre className="bg-neutral-700/50 px-3 py-2 rounded-lg text-xs font-mono text-neutral-200 whitespace-pre-wrap border border-neutral-600/30 shadow-inner">
          {code}
        </pre>
      </div>
    </div>
  );
}
