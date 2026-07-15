"use client";

import * as React from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  organizationName: string;
}

export function DashboardShell({
  children,
  user,
  organizationName,
}: DashboardShellProps) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar navigation */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main workspace area */}
      <div className="flex flex-1 flex-col overflow-hidden h-full">
        {/* Top Header navbar */}
        <Header organizationName={organizationName} />

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mx-auto max-w-7xl w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
