"use client";

import React, { useState, useMemo } from "react";
import {
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  Phone,
  MapPin,
  Trash2,
  Check,
  XCircle,
  ExternalLink,
  Users,
} from "lucide-react";
import { InterviewStatus, InterviewType } from "@prisma/client";
import { updateInterviewStatusAction, deleteInterviewAction } from "@/app/actions/interviews";
import { toast } from "@/lib/toast";
import { InterviewFormDialog } from "./interview-form-dialog";
import { cn } from "@/lib/utils";

interface InterviewsClientProps {
  initialInterviews: any[];
  candidates: { id: string; name: string; jobTitle: string }[];
  teamMembers: { id: string; name: string }[];
}

export function InterviewsClient({ initialInterviews, candidates, teamMembers }: InterviewsClientProps) {
  const [interviews, setInterviews] = useState(initialInterviews);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Date constants
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helper calendar calculations
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 (Sunday) to 6 (Saturday)
  const totalDays = new Date(year, month + 1, 0).getDate();

  const calendarCells = useMemo(() => {
    const cells = [];
    
    // Fill leading empty cells from previous month
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ day: null, dateStr: "" });
    }
    
    // Fill calendar days
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = new Date(year, month, day).toISOString().split("T")[0];
      cells.push({ day, dateStr });
    }
    
    return cells;
  }, [year, month, firstDayIndex, totalDays]);

  // Group interviews by day string e.g. "2026-07-15"
  const interviewsByDay = useMemo(() => {
    const map: Record<string, any[]> = {};
    interviews.forEach((int) => {
      const dayKey = int.scheduledAt.split("T")[0];
      if (!map[dayKey]) map[dayKey] = [];
      map[dayKey].push(int);
    });
    return map;
  }, [interviews]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleStatusChange = async (id: string, nextStatus: InterviewStatus) => {
    try {
      await updateInterviewStatusAction(id, nextStatus);
      setInterviews((prev) =>
        prev.map((int) => (int.id === id ? { ...int, status: nextStatus } : int))
      );
      toast.success(`Slot updated to: ${nextStatus}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update slot status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to cancel and delete this interview slot?")) return;
    try {
      await deleteInterviewAction(id);
      setInterviews((prev) => prev.filter((int) => int.id !== id));
      toast.success("Interview slot deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove interview slot");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
            Interview Schedule
          </h2>
          <p className="text-muted-foreground text-sm">
            Coordinate interviewer sync slots, book technical screenings, and alert managers.
          </p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/95 transition-colors gap-2 cursor-pointer shadow-lg shadow-primary/20"
        >
          <CalendarPlus className="h-4 w-4" /> Book Interview
        </button>
      </div>

      {/* Main Grid: Calendar matrix vs. upcoming list */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Calendar widget */}
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground tracking-tight font-display">
              {monthName} {year}
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="inline-flex h-7 w-7 items-center justify-center rounded border border-border/40 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="inline-flex h-7 w-7 items-center justify-center rounded border border-border/40 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Calendar Table Matrix */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium pt-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-muted-foreground py-1 font-semibold">
                {day}
              </div>
            ))}

            {calendarCells.map((cell, idx) => {
              const dayInts = cell.dateStr ? interviewsByDay[cell.dateStr] || [] : [];
              const hasInterviews = dayInts.length > 0;
              const isToday = cell.dateStr === new Date().toISOString().split("T")[0];

              return (
                <div
                  key={idx}
                  className={cn(
                    "min-h-16 rounded-lg border border-border/20 p-1 flex flex-col justify-between relative transition-colors",
                    cell.day ? "bg-zinc-950/20" : "bg-transparent opacity-0 pointer-events-none",
                    isToday && "border-primary bg-primary/5",
                    hasInterviews && "hover:border-zinc-700 hover:bg-zinc-900/10"
                  )}
                >
                  <span
                    className={cn(
                      "text-[10px] self-start px-1.5 py-0.5 rounded",
                      isToday ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground"
                    )}
                  >
                    {cell.day}
                  </span>

                  {/* Indicator Dot/Badge */}
                  {hasInterviews && (
                    <div className="flex flex-col gap-1 w-full mt-1.5">
                      {dayInts.slice(0, 2).map((int) => (
                        <div
                          key={int.id}
                          className={cn(
                            "text-[8px] px-1.5 py-0.5 rounded truncate font-medium text-left leading-none border",
                            int.status === InterviewStatus.SCHEDULED && "bg-blue-500/10 border-blue-500/20 text-blue-400",
                            int.status === InterviewStatus.COMPLETED && "bg-green-500/10 border-green-500/20 text-green-400",
                            int.status === InterviewStatus.CANCELLED && "bg-zinc-500/10 border-zinc-500/20 text-muted-foregroundLine"
                          )}
                        >
                          {int.application?.candidate?.name || "Candidate"}
                        </div>
                      ))}
                      {dayInts.length > 2 && (
                        <span className="text-[7px] text-muted-foreground text-right px-1 font-semibold">
                          +{dayInts.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Timeline Upcoming slots */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight font-display">
              Upcoming Bookings
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              Active schedule lists in chronological order.
            </p>
          </div>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {interviews.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-12">
                No interview sessions booked. Click "Book Interview" above.
              </p>
            ) : (
              interviews.map((int) => {
                const date = new Date(int.scheduledAt);
                return (
                  <div
                    key={int.id}
                    className="border border-border/40 bg-zinc-950/20 rounded-xl p-4 text-xs space-y-3 relative overflow-hidden"
                  >
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-semibold border",
                          int.status === InterviewStatus.SCHEDULED && "bg-blue-500/10 border-blue-500/20 text-blue-400",
                          int.status === InterviewStatus.COMPLETED && "bg-green-500/10 border-green-500/20 text-green-400",
                          int.status === InterviewStatus.CANCELLED && "bg-zinc-500/10 border-zinc-500/20 text-muted-foreground"
                        )}
                      >
                        {int.status}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        {date.toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                    </div>

                    {/* Role / Candidate info */}
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {int.application?.candidate?.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {int.title} &bull; {int.application?.job?.title}
                      </p>
                    </div>

                    {/* Time & Meeting coords */}
                    <div className="grid gap-2 pt-1 border-t border-border/10 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>
                          {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ({int.duration}m)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {int.type === InterviewType.VIDEO ? (
                          <Video className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                        ) : int.type === InterviewType.PHONE ? (
                          <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                        ) : (
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        )}
                        <span className="capitalize">{int.type.toLowerCase()} format</span>
                        {int.videoLink && (
                          <a
                            href={int.videoLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline inline-flex items-center gap-0.5 ml-auto font-semibold"
                          >
                            Join <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Assigned Interviewers */}
                    {int.interviewers?.length > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Users className="h-3.5 w-3.5 flex-shrink-0 text-zinc-500" />
                        <span>Interviewers:</span>
                        <div className="flex flex-wrap gap-1 ml-1.5">
                          {int.interviewers.map((intvr: any) => (
                            <span
                              key={intvr.id}
                              className="bg-zinc-900 border border-border px-1.5 py-0.5 rounded text-[9px] text-foreground font-semibold"
                            >
                              {intvr.user.name.split(" ")[0]}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    {int.status === InterviewStatus.SCHEDULED && (
                      <div className="flex justify-end gap-2 pt-2 border-t border-border/10">
                        <button
                          onClick={() => handleStatusChange(int.id, InterviewStatus.COMPLETED)}
                          className="inline-flex h-7 px-2.5 items-center justify-center rounded border border-border/40 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-900/20 transition-colors cursor-pointer"
                        >
                          <Check className="h-3 w-3 mr-1 text-green-500" /> Complete
                        </button>
                        <button
                          onClick={() => handleStatusChange(int.id, InterviewStatus.CANCELLED)}
                          className="inline-flex h-7 px-2.5 items-center justify-center rounded border border-border/40 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-900/20 transition-colors cursor-pointer"
                        >
                          <XCircle className="h-3 w-3 mr-1 text-destructive" /> Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(int.id)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded border border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                          aria-label="Delete booking"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal Booking Form Dialog */}
      <InterviewFormDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          window.location.reload();
        }}
        candidates={candidates}
        teamMembers={teamMembers}
      />
    </div>
  );
}
