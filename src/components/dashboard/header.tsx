"use client";

import * as React from "react";
import { UserButton } from "@clerk/nextjs";
import { Bell, Search } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { usePathname } from "next/navigation";

interface HeaderProps {
  organizationName?: string;
}

export function Header({ organizationName }: HeaderProps) {
  const pathname = usePathname();
  
  // Create simple breadcrumb label from route
  const getBreadcrumbLabel = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length <= 1) return "Dashboard";
    const segment = segments[1];
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border/40 bg-background/80 px-6 backdrop-blur-md">
      {/* Left Area: Breadcrumbs / Title */}
      <div className="flex items-center gap-3">
        {organizationName && (
          <>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-zinc-900/10 dark:bg-zinc-800/20 border border-border/40 px-2 py-0.5 rounded-md">
              {organizationName}
            </span>
            <span className="text-muted-foreground/30 text-xs font-light">/</span>
          </>
        )}
        <h1 className="text-sm font-medium text-foreground tracking-tight">
          {getBreadcrumbLabel()}
        </h1>
      </div>

      {/* Right Area: Search, Notify, Theme, Profile */}
      <div className="flex items-center gap-4">
        {/* Search input mock */}
        <div className="relative hidden md:flex items-center w-64">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search... (Cmd+K)"
            disabled
            className="w-full h-9 rounded-md border border-border/40 bg-zinc-900/10 dark:bg-zinc-800/10 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground outline-none cursor-not-allowed"
          />
        </div>

        {/* Notifications mock button */}
        <button
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/40 bg-zinc-900/10 text-muted-foreground hover:bg-zinc-900/20 dark:hover:bg-zinc-800/40 hover:text-foreground transition-colors cursor-pointer"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4" />
          {/* Unread marker red dot */}
          <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-destructive" />
        </button>

        {/* Theme Selector Toggle */}
        <ThemeToggle />

        {/* Profile Avatar & Actions Button */}
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "h-9 w-9 rounded-full border border-border/40",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
