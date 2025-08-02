import React, { useEffect, useRef } from "react";
import EditorTabs from "./EditorTabs";
import Header from "./Header";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import hljsDefineSolidity from "highlightjs-solidity";
import "highlight.js/styles/monokai-sublime.css";

// Register languages
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljsDefineSolidity(hljs);

function detectLanguage(filename) {
  if (!filename) return "json";
  if (filename.endsWith(".sol")) return "solidity";
  if (filename.endsWith(".js")) return "javascript";
  if (filename.endsWith(".json")) return "json";
  // Add more as needed
  return "json";
}

export default function Editor({
  code,
  filename,
  tabs = ["Example.sol"],
  activeTab = 0,
  onTabClick,
  onTabClose,
}) {
  const codeRef = useRef(null);
  const language = detectLanguage(filename);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  return (
    <div className="flex-1 bg-neutral-900/20 bg-opacity-50 backdrop-blur-md rounded-lg shadow border border-neutral-700/30 m-6 pb-8 flex flex-col min-h-0">
      <EditorTabs
        tabs={tabs.map((f) => f.split("/").pop())}
        activeTab={activeTab}
        onTabClick={onTabClick}
        onTabClose={onTabClose}
      />
      <div className="px-4 pt-2 pb-1 border-b border-neutral-700/30 flex items-center justify-between">
        <Header filename={filename || "Example.sol"} code={code} />
      </div>
      <div className="flex-1 p-3 overflow-auto">
        <pre className="bg-neutral-700/50 px-3 py-2 rounded-lg text-xs font-mono text-neutral-200 whitespace-pre-wrap border border-neutral-600/30 shadow-inner">
          <code
            ref={codeRef}
            className={`hljs language-${language} flex flex-col`}
            style={{ counterReset: "line" }}
          >
            {code.split("\n").map((line, idx) => (
              <div key={idx} className="flex">
                <span
                  className="editor-line-number select-none pr-4 text-right"
                  style={{ minWidth: "2.5em", userSelect: "none" }}
                >
                  {idx + 1}
                </span>
                <span className="flex-1 whitespace-pre-wrap">
                  {line || "\u200b"}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
      {/* Ensure line numbers are not affected by hljs theme */}
      <style>{`
        .editor-line-number, .editor-line-number * {
          color: #a3a3a3 !important;
          background: none !important;
        }
      `}</style>
    </div>
  );
}
