import React from "react";

export default function IDELayout({ children, sidebar, sidebarResizer }) {
  return (
    <div className="flex min-h-screen bg-transparent z-10 px-0 py-0 max-w-none">
      {sidebar}
      {sidebarResizer}
      <main className="flex-1 flex flex-col bg-transparent px-0 py-0">
        {children}
      </main>
    </div>
  );
}
