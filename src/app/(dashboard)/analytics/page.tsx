import * as React from "react";
import { TrendingUp, RefreshCw } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
            Recruitment Analytics
          </h2>
          <p className="text-muted-foreground text-sm">
            Evaluate time-to-hire speeds, source conversion rates, and metrics.
          </p>
        </div>
        <button
          className="inline-flex h-9 items-center justify-center rounded-lg border border-border/40 bg-zinc-900/10 text-muted-foreground hover:text-foreground transition-colors gap-2 cursor-pointer"
          disabled
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 text-center border-dashed">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mx-auto">
          <TrendingUp className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-foreground">Waiting for recruitment history</h3>
        <p className="mt-2 text-xs text-muted-foreground max-w-sm mx-auto">
          Analytics tables require candidate advancement history logs. As candidates migrate across pipeline columns, charts will populate.
        </p>
      </div>
    </div>
  );
}
