"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ApplicationStatus } from "@prisma/client";
import { updateApplicationStageAction } from "@/app/actions/candidates";
import { toast } from "@/lib/toast";
import { CandidateDrawer } from "./candidate-drawer";
import { Star, Clock, User, ArrowLeft, MoveRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PipelineBoardProps {
  job: {
    id: string;
    title: string;
    department: string;
    location: string;
  };
  initialApplications: any[];
}

const COLUMNS = [
  { status: ApplicationStatus.APPLIED, label: "Applied", color: "border-t-blue-500 text-blue-400" },
  { status: ApplicationStatus.SCREENING, label: "Screening", color: "border-t-amber-500 text-amber-400" },
  { status: ApplicationStatus.INTERVIEW, label: "Interview", color: "border-t-indigo-500 text-indigo-400" },
  { status: ApplicationStatus.OFFER, label: "Offer", color: "border-t-teal-500 text-teal-400" },
  { status: ApplicationStatus.HIRED, label: "Hired", color: "border-t-green-500 text-green-400" },
  { status: ApplicationStatus.REJECTED, label: "Rejected", color: "border-t-zinc-500 text-muted-foreground" },
];

export function PipelineBoard({ job, initialApplications }: PipelineBoardProps) {
  const [applications, setApplications] = useState(initialApplications);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Drawer overlays state
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Group applications by status stage
  const columnsData = useMemo(() => {
    const groups: Record<ApplicationStatus, any[]> = {
      [ApplicationStatus.APPLIED]: [],
      [ApplicationStatus.SCREENING]: [],
      [ApplicationStatus.INTERVIEW]: [],
      [ApplicationStatus.OFFER]: [],
      [ApplicationStatus.HIRED]: [],
      [ApplicationStatus.REJECTED]: [],
    };

    applications.forEach((app) => {
      const status = app.status as ApplicationStatus;
      if (groups[status]) {
        groups[status].push(app);
      }
    });

    return groups;
  }, [applications]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggingId(id);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: ApplicationStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;

    const sourceApp = applications.find((app) => app.id === id);
    if (!sourceApp || sourceApp.status === targetStatus) return;

    const previousStatus = sourceApp.status;

    // 1. Optimistic Update on Client State
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: targetStatus } : app))
    );

    // 2. Perform Database Mutation
    try {
      await updateApplicationStageAction(id, targetStatus);
      toast.success(`Moved candidate to ${targetStatus}`);
    } catch (err: any) {
      // 3. Rollback Client State on Error
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: previousStatus } : app))
      );
      toast.error(err.message || "Failed to update candidate stage");
    }
  };

  const handleCardClick = (app: any) => {
    // Format candidate record payload to bind properly with the slide-over drawer
    const formattedCandidate = {
      id: app.candidate.id,
      name: app.candidate.name,
      email: app.candidate.email,
      phone: app.candidate.phone,
      resumeUrl: app.candidate.resumeUrl,
      portfolioUrl: app.candidate.portfolioUrl,
      linkedinUrl: app.candidate.linkedinUrl,
      createdAt: app.candidate.createdAt,
      metadata: app.candidate.metadata,
      applications: [
        {
          id: app.id,
          status: app.status,
          job: { title: job.title, department: job.department },
          notes: app.notes || [],
        },
      ],
    };
    setSelectedCandidate(formattedCandidate);
    setIsDrawerOpen(true);
  };

  const handleDrawerStageUpdate = (candidateId: string, nextStage: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.candidateId === candidateId ? { ...app, status: nextStage } : app))
    );
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Title bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-4 flex-shrink-0">
        <div className="space-y-1">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to job boards
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
            {job.title}
          </h2>
          <p className="text-muted-foreground text-xs">
            {job.department} &bull; {job.location} &bull; Pipeline Board
          </p>
        </div>
      </div>

      {/* Kanban Grid Container */}
      <div className="flex-1 overflow-x-auto pb-4 w-full">
        <div className="flex gap-4 min-w-[1200px] h-[calc(100vh-240px)]">
          {COLUMNS.map((col) => {
            const list = columnsData[col.status] || [];
            return (
              <div
                key={col.status}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.status)}
                className="w-1/6 min-w-[200px] bg-zinc-950/20 border border-border/40 rounded-xl flex flex-col h-full overflow-hidden"
              >
                {/* Column Title Header */}
                <div className={cn("px-4 py-3 border-t-2 flex items-center justify-between flex-shrink-0 bg-zinc-950/40 border-b border-border/40", col.color)}>
                  <span className="text-xs font-semibold uppercase tracking-wider">{col.label}</span>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[10px] border border-border text-foreground font-bold">
                    {list.length}
                  </span>
                </div>

                {/* Draggable items stack */}
                <div className="flex-1 overflow-y-auto p-2.5 space-y-3 bg-zinc-950/5">
                  <AnimatePresence initial={false}>
                    {list.map((app) => {
                      const rating = app.candidate.metadata?.rating || 3;
                      const skills = app.candidate.metadata?.skills || [];
                      return (
                        <motion.div
                          key={app.id}
                          layoutId={app.id}
                          draggable
                          onDragStart={(e: any) => handleDragStart(e, app.id)}
                          onDragEnd={handleDragEnd as any}
                          onClick={() => handleCardClick(app)}
                          className={cn(
                            "relative overflow-hidden rounded-lg border border-border bg-card p-3.5 hover:border-primary/50 transition-all cursor-grab active:cursor-grabbing shadow-sm flex flex-col gap-2.5 hover:shadow-md",
                            draggingId === app.id && "opacity-40"
                          )}
                          whileHover={{ scale: 1.01 }}
                        >
                          {/* Card Name */}
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-foreground text-xs leading-none tracking-tight">
                              {app.candidate.name}
                            </span>
                            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/25 text-primary text-[9px] font-bold">
                              {app.candidate.name.charAt(0)}
                            </div>
                          </div>

                          {/* Skills pill tags */}
                          {skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {skills.slice(0, 2).map((skill: string) => (
                                <span
                                  key={skill}
                                  className="inline-flex items-center rounded bg-primary/5 border border-primary/15 px-1.5 py-0.5 text-[9px] text-primary"
                                >
                                  {skill}
                                </span>
                              ))}
                              {skills.length > 2 && (
                                <span className="inline-flex items-center text-[9px] text-muted-foreground px-1">
                                  +{skills.length - 2}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Star rating & Relative sourced date */}
                          <div className="flex items-center justify-between text-[9px] text-muted-foreground mt-1">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "h-2.5 w-2.5",
                                    i < rating ? "fill-yellow-500 text-yellow-500" : "text-zinc-700"
                                  )}
                                />
                              ))}
                            </div>
                            <span className="flex items-center gap-0.5 font-medium">
                              <Clock className="h-3 w-3" /> {new Date(app.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {list.length === 0 && (
                    <div className="h-full border border-dashed border-border/20 rounded-lg flex items-center justify-center p-4 text-center">
                      <span className="text-[10px] text-muted-foreground/60 leading-relaxed font-light">
                        Drag candidates here
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Drawer Slide-over */}
      <CandidateDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          // Sync with page data
          window.location.reload();
        }}
        candidate={selectedCandidate}
        onStageUpdated={handleDrawerStageUpdate}
      />
    </div>
  );
}
