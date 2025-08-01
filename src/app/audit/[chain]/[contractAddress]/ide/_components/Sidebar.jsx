import React from "react";

export default function Sidebar({ tree, expandedFolders, onToggle, selectedFile, onSelect, width, allFolderPaths = [], onToggleAll, allOpen }) {
  // Recursive render
  const renderTree = (nodes, parentPath = "") =>
    nodes.map((node) => {
      const path = parentPath ? `${parentPath}/${node.name}` : node.name;
      if (node.type === "folder") {
        const expanded = expandedFolders.has(path);
        return (
          <div key={path} className="w-full">
            <button
              className="flex items-center w-full px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-700/30 rounded transition-colors"
              onClick={() => onToggle(path)}
              title={expanded ? "Collapse" : "Expand"}
            >
              <span className="mr-1">
                {expanded ? (
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="none"><path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" /></svg>
                ) : (
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="none"><path d="M8 6l4 4-4 4" stroke="currentColor" strokeWidth="2" /></svg>
                )}
              </span>
              <span className="font-mono">{node.name}</span>
            </button>
            {expanded && (
              <div className="ml-4 border-l border-neutral-700/30 pl-2">
                {renderTree(node.children, path)}
              </div>
            )}
          </div>
        );
      }
      // File
      return (
        <button
          key={path}
          className={`flex items-center w-full px-2 py-1 text-xs font-mono rounded transition-colors ${selectedFile === path ? "bg-blue-600/20 text-blue-400" : "text-neutral-200 hover:bg-neutral-700/30"}`}
          onClick={() => onSelect(path)}
          title={node.name}
        >
          <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="none"><rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" /></svg>
          {node.name}
        </button>
      );
    });

  return (
    <aside
      style={{ width, display: 'flex', flexDirection: 'column', minHeight: '100%' }}
      className="bg-neutral-900/20 backdrop-blur-md border-r border-neutral-700/30"
    >
      <div className="flex-1 overflow-auto pb-12">{renderTree(tree)}</div>
      <div
        className="mt-2 flex justify-center sticky bottom-0 bg-black/80 py-3 px-4"
        style={{ zIndex: 10 }}
      >
        <button
          className="px-2 py-1 text-xs bg-blue-700/30 text-blue-200 rounded hover:bg-blue-700/50"
          onClick={onToggleAll}
          disabled={allFolderPaths.length === 0}
        >{allOpen ? "Close All Folder" : "Open All Folder"}</button>
      </div>
    </aside>
  );
}
