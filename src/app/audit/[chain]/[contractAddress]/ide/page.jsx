"use client";
import React, { useEffect } from "react";

import { useState, useRef } from "react";
import Sidebar from "./_components/Sidebar";
import Editor from "./_components/Editor";
import StatusBar from "./_components/StatusBar";
import IDELayout from "./_components/IDELayout";

// Helper to build tree from fileContents keys
// Helper to build tree from fileContents keys
function buildTreeFromFiles(files) {
  const root = {};
  for (const filePath of Object.keys(files)) {
    const parts = filePath.split("/");
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        // file
        if (!current.children) current.children = [];
        current.children.push({ type: "file", name: part });
      } else {
        // folder
        let folder = current.children?.find(
          (c) => c.type === "folder" && c.name === part
        );
        if (!folder) {
          folder = { type: "folder", name: part, children: [] };
          if (!current.children) current.children = [];
          current.children.push(folder);
        }
        current = folder;
      }
    }
  }

  return root.children || [];
}
// fileContents will be fetched from API

const IDE = ({ params }) => {
  const [resolvedParams, setResolvedParams] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [openTabs, setOpenTabs] = useState(["contracts/Token.sol"]);
  const [activeTab, setActiveTab] = useState(0);
  const [sidebarWidth, setSidebarWidth] = useState("15vw");
  const [fileContents, setFileContents] = useState({});
  const sidebarRef = useRef(null);
  const isDragging = useRef(false);

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
      // resolvedParams?.chain, resolvedParams?.contractAddress
      if (resolved?.contractAddress) {
        // Find the contract folder using the existing API
        const folderRes = await fetch(
          `/api/find-contract-folders?contractAddress=${resolved.contractAddress}`
        );
        const folderData = await folderRes.json();
        if (folderData.matches && folderData.matches.length > 0) {
          const contractFolder = folderData.matches[0];
          // Fetch file contents from the new API
          const filesRes = await fetch(
            `/api/find-contract-files?contractFolder=${contractFolder}`
          );
          const filesData = await filesRes.json();
          setFileContents(filesData.fileContents || {});
        }
      }
    };
    resolveParams();
  }, [params]);

  // Auto-select first available file after fileContents loads
  useEffect(() => {
    const fileKeys = Object.keys(fileContents);
    if (
      fileKeys.length > 0 &&
      openTabs.length === 1 &&
      !fileContents[openTabs[0]]
    ) {
      setOpenTabs([fileKeys[0]]);
      setActiveTab(0);
    }
  }, [fileContents]);

  const handleToggle = (folder) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folder)) next.delete(folder);
      else next.add(folder);
      return next;
    });
  };

  // When a file is selected from the tree, add to tabs and switch to it
  const handleSelect = (file) => {
    setOpenTabs((prevTabs) => {
      if (prevTabs.includes(file)) {
        setActiveTab(prevTabs.indexOf(file));
        return prevTabs;
      }
      setActiveTab(prevTabs.length);
      return [...prevTabs, file];
    });
  };

  // Drag logic
  const onMouseDown = (e) => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
  };
  const onMouseMove = (e) => {
    if (isDragging.current) {
      setSidebarWidth(Math.max(120, e.clientX));
    }
  };
  const onMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = "";
  };

  // Attach drag listeners
  React.useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  });

  // Build tree from fileContents
  const tree = buildTreeFromFiles(fileContents);

  // Helper to get all folder paths from tree
  function getAllFolderPaths(nodes, parentPath = "") {
    let paths = [];
    for (const node of nodes) {
      if (node.type === "folder") {
        const path = parentPath ? `${parentPath}/${node.name}` : node.name;
        paths.push(path);
        if (node.children) {
          paths = paths.concat(getAllFolderPaths(node.children, path));
        }
      }
    }
    return paths;
  }
  const allFolderPaths = getAllFolderPaths(tree);

  // Open all folders
  const allOpen =
    allFolderPaths.length > 0 &&
    allFolderPaths.every((f) => expandedFolders.has(f));
  const handleToggleAll = () => {
    if (allOpen) {
      setExpandedFolders(new Set());
    } else {
      setExpandedFolders(new Set(allFolderPaths));
    }
  };

  // Tab close handler
  const handleTabClose = (idx) => {
    setOpenTabs((prevTabs) => {
      if (prevTabs.length === 1) return prevTabs; // Prevent closing last tab
      const newTabs = prevTabs.filter((_, i) => i !== idx);
      // Adjust activeTab
      if (activeTab > idx) {
        setActiveTab(activeTab - 1);
      } else if (activeTab === idx) {
        setActiveTab(Math.max(0, idx - 1));
      }
      return newTabs;
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col" style={{ minHeight: '100vh', minWidth: '100vw' }}>
      {/* IDE Header */}
      <header className="bg-neutral-900/20 backdrop-blur-md px-6 py-4 flex items-center border-b border-neutral-800/30">
        <h1 className="text-xl font-bold text-neutral-200 tracking-tight">IDE Beta</h1>
      </header>
      {/* Main IDE Layout */}
      <div className="flex-1 flex flex-col min-h-0">
        <IDELayout
          sidebar={
            <Sidebar
              tree={tree}
              expandedFolders={expandedFolders}
              onToggle={handleToggle}
              selectedFile={openTabs[activeTab]}
              onSelect={handleSelect}
              width={sidebarWidth}
              style={{
                width: sidebarWidth,
                minWidth: sidebarWidth,
                maxWidth: sidebarWidth,
              }}
              allFolderPaths={allFolderPaths}
              onToggleAll={handleToggleAll}
              allOpen={allOpen}
            />
          }
          sidebarResizer={
            <div
              ref={sidebarRef}
              onMouseDown={onMouseDown}
              style={{ width: 6, cursor: "col-resize", zIndex: 20 }}
              className="bg-neutral-700/30 hover:bg-blue-600/30 transition-colors h-full"
            />
          }
        >
          <div className="flex flex-col flex-1 min-h-0" style={{ height: "100%" }}>
            <div className="flex-1 min-h-0" style={{ overflowY: "auto" }}>
              <Editor
                code={fileContents[openTabs[activeTab]] || "// File not found"}
                filename={openTabs[activeTab]?.split("/").pop()}
                tabs={openTabs}
                activeTab={activeTab}
                onTabClick={setActiveTab}
                onTabClose={handleTabClose}
              />
            </div>
            <StatusBar />
          </div>
        </IDELayout>
      </div>
    </div>
  );
};

export default IDE;
