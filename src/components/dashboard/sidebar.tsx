"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  Briefcase,
  Users,
  Calendar,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  Terminal
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const navItems = [
  { name: "Overview", href: "/dashboard/overview", icon: LayoutGrid },
  { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
  { name: "Candidates", href: "/dashboard/candidates", icon: Users },
  { name: "Interviews", href: "/dashboard/interviews", icon: Calendar },
  { name: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative z-20 flex flex-col border-r border-border/40 bg-card transition-all duration-300 ease-in-out h-full",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Brand logo container */}
      <div className="flex h-16 items-center px-4 border-b border-border/40 gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
          <Terminal className="h-5 w-5" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-foreground tracking-tight text-lg">
            Aether
          </span>
        )}
      </div>

      {/* Nav items list */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors gap-3 relative cursor-pointer",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-zinc-900/40 hover:text-foreground dark:hover:bg-zinc-800/40"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!collapsed && <span>{item.name}</span>}
              
              {/* Highlight bar for active tab */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button at bottom */}
      <div className="border-t border-border/40 p-4 flex justify-end">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 bg-zinc-900/10 text-muted-foreground hover:bg-zinc-900/20 dark:hover:bg-zinc-800/40 hover:text-foreground transition-colors cursor-pointer"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
