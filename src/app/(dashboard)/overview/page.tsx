import * as React from "react";
import { Users, Briefcase, Calendar, ArrowUpRight, Clock, Star } from "lucide-react";

export default function OverviewPage() {
  return (
    <div className="space-y-8">
      {/* Greetings section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground font-display">
          Welcome back, Recruiter
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Here is what is happening with your hiring pipeline today.
        </p>
      </div>

      {/* Metric cards grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1 */}
        <div className="rounded-xl border border-border bg-card p-6 relative overflow-hidden transition-all hover:border-primary/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Candidates
            </span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-foreground">1,248</span>
            <span className="text-xs font-medium text-green-500 flex items-center">
              +12% <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">From LinkedIn & Referral channels</p>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl border border-border bg-card p-6 relative overflow-hidden transition-all hover:border-primary/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Job Openings
            </span>
            <Briefcase className="h-4 w-4 text-accent" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-foreground">18</span>
            <span className="text-xs font-medium text-muted-foreground">Across 4 departments</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">6 roles in Engineering, 4 in Product</p>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl border border-border bg-card p-6 relative overflow-hidden transition-all hover:border-primary/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Scheduled Interviews
            </span>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-foreground">8</span>
            <span className="text-xs font-medium text-yellow-500">For today</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Next up: Technical Screening at 2:00 PM</p>
        </div>
      </div>

      {/* Split layout: analytics funnel placeholder & timeline */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Funnel Chart Placeholder */}
        <div className="rounded-xl border border-border bg-card p-6 md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              Recruitment Conversion Funnel
            </h3>
            <span className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
              View Analytics
            </span>
          </div>
          
          <div className="h-64 w-full rounded-lg border border-border/40 bg-zinc-950/40 flex flex-col items-center justify-center p-6 text-center border-dashed">
            <div className="text-xs text-muted-foreground max-w-xs">
              Interactive Funnel Conversion statistics (Recharts layout) will render here once data models are bound.
            </div>
          </div>
        </div>

        {/* Right Side: Timeline Upcoming Events */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <h3 className="text-sm font-semibold text-foreground tracking-tight">
            Upcoming Interviews
          </h3>
          
          <div className="space-y-4">
            {/* Timeline item 1 */}
            <div className="flex items-start gap-4 text-xs">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
                <Clock className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">14:00 - Technical Interview</p>
                <p className="text-muted-foreground">Alex Mercer (Senior React Dev)</p>
                <p className="text-[11px] text-primary hover:underline cursor-pointer">Join Meet Link</p>
              </div>
            </div>

            {/* Timeline item 2 */}
            <div className="flex items-start gap-4 text-xs">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-green-500/10 border border-green-500/20 text-green-500">
                <Star className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">15:30 - Culture Fit Sync</p>
                <p className="text-muted-foreground">Sarah Connor (Product Design)</p>
                <p className="text-[11px] text-primary hover:underline cursor-pointer">Open Candidate Profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
