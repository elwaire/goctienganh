"use client";

import { useState } from "react";
import { Header, Sidebar } from "@/components/layouts";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
      />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full p-4 lg:p-8 ">{children}</div>
        </main>
      </div>
    </div>
  );
}
