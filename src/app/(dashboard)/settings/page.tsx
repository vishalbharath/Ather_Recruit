import * as React from "react";
import { Settings, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
            Workspace Settings
          </h2>
          <p className="text-muted-foreground text-sm">
            Configure system configurations, custom roles, and webhooks.
          </p>
        </div>
        <button
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/95 transition-colors gap-2 cursor-pointer"
          disabled
        >
          <Save className="h-4 w-4" /> Save changes
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 text-center border-dashed">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mx-auto">
          <Settings className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-foreground">Standard Configurations</h3>
        <p className="mt-2 text-xs text-muted-foreground max-w-sm mx-auto">
          Manage workspace settings, assign Recruiter/Hiring Manager roles, link Clerk API hooks, and update system rules.
        </p>
      </div>
    </div>
  );
}
