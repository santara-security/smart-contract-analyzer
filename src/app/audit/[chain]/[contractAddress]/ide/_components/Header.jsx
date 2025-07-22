import React, { useState } from "react";

export default function Header({ filename = "Example.sol", code = "" }) {
  const [copied, setCopied] = useState(false);

  // Copy code to clipboard
  const handleCopy = async () => {
    if (navigator?.clipboard) {
      await navigator.clipboard.writeText(code || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  // Download code as file
  const handleDownload = () => {
    const blob = new Blob([code || ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "code.txt";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/20 border-b border-neutral-700/30">
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-neutral-200">{filename}</span>
        <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full text-xs border border-blue-500/30 ml-2">Solidity</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          className={`p-1 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50 rounded transition-colors`}
          title="Copy code"
          onClick={handleCopy}
        >
          {copied ? (
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" /><rect x="3" y="3" width="13" height="13" rx="2" /></svg>
          )}
        </button>
        <button
          className="p-1 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50 rounded transition-colors"
          title="Download code"
          onClick={handleDownload}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14m7-7H5" /><path d="M12 19l-7-7h14z" /></svg>
        </button>
      </div>
    </div>
  );
}
