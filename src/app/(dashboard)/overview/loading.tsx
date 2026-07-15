import React from "react";

export default function OverviewLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-zinc-800/60 rounded-lg" />
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
            <div className="h-8 w-16 bg-zinc-800/80 rounded-lg" />
            <div className="h-3 w-32 bg-zinc-800/40 rounded" />
          </div>
        ))}
      </div>

      {/* Primary Charts Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-48 bg-zinc-800/60" />
              <div className="h-3 w-64 bg-zinc-800/40" />
            </div>
            <div className="h-4 w-20 bg-zinc-800/40" />
          </div>
          <div className="h-72 w-full bg-zinc-800/10 rounded-lg border border-border/40" />
        </div>

        <div className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <div className="h-4 w-40 bg-zinc-800/60" />
            <div className="h-3 w-48 bg-zinc-800/40" />
          </div>
          <div className="h-36 w-36 rounded-full border-8 border-zinc-800/20 mx-auto flex items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-zinc-800/40" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 bg-zinc-800/30 rounded" />
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2 space-y-6">
          <div className="h-4 w-48 bg-zinc-800/60" />
          <div className="h-64 w-full bg-zinc-800/10 rounded-lg border border-border/40" />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="h-4 w-40 bg-zinc-800/60" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-2">
                  <div className="h-6 w-6 bg-zinc-800/40 rounded" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 w-28 bg-zinc-800/60" />
                    <div className="h-2.5 w-36 bg-zinc-800/40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
