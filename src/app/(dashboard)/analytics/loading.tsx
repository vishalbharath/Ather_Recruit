import React from "react";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-72 bg-zinc-800/60 rounded-lg" />
        <div className="h-4 w-96 bg-zinc-800/40 rounded-md" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 bg-zinc-800/60 rounded" />
              <div className="h-8 w-8 bg-zinc-800/40 rounded-lg" />
            </div>
            <div className="h-8 w-20 bg-zinc-800/80 rounded-lg" />
            <div className="h-3 w-32 bg-zinc-800/40 rounded" />
          </div>
        ))}
      </div>

      {/* Main Charts Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6 space-y-6">
            <div className="space-y-2">
              <div className="h-4.5 w-48 bg-zinc-800/60 rounded" />
              <div className="h-3 w-64 bg-zinc-800/40 rounded" />
            </div>
            <div className="h-64 w-full bg-zinc-800/10 rounded-lg border border-border/40" />
          </div>
        ))}

        {/* Pie widgets skeletons */}
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="h-4.5 w-40 bg-zinc-800/60 rounded" />
              <div className="h-3 w-48 bg-zinc-800/40 rounded" />
            </div>
            <div className="h-40 w-40 rounded-full border-8 border-zinc-800/20 mx-auto flex items-center justify-center">
              <div className="h-24 w-24 rounded-full bg-zinc-800/40" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-zinc-800/30 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
