"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { interviewSchema, InterviewInput } from "@/lib/validators/interview";
import { InterviewType, InterviewStatus } from "@prisma/client";
import { X, Loader2 } from "lucide-react";
import { createInterviewAction } from "@/app/actions/interviews";
import { toast } from "@/lib/toast";

interface InterviewFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: { id: string; name: string; jobTitle: string }[];
  teamMembers: { id: string; name: string }[];
}

export function InterviewFormDialog({ isOpen, onClose, candidates, teamMembers }: InterviewFormDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<InterviewInput>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      applicationId: "",
      title: "",
      scheduledAt: "",
      duration: 45,
      type: InterviewType.VIDEO,
      videoLink: "",
      interviewerIds: [],
      status: InterviewStatus.SCHEDULED,
    },
  });

  const selectedInterviewerIds = watch("interviewerIds") || [];

  if (!isOpen) return null;

  const onSubmit = async (values: InterviewInput) => {
    setSubmitting(true);
    try {
      await createInterviewAction(values);
      toast.success("Interview scheduled successfully");
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to schedule interview");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInterviewerToggle = (id: string) => {
    const current = [...selectedInterviewerIds];
    if (current.includes(id)) {
      setValue(
        "interviewerIds",
        current.filter((item) => item !== id)
      );
    } else {
      setValue("interviewerIds", [...current, id]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border w-full max-w-xl rounded-2xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border/40 flex-shrink-0">
          <h3 className="text-sm font-semibold text-foreground tracking-tight font-display">
            Schedule Interview Slot
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Candidate Selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Target Candidate</label>
            <select
              {...register("applicationId")}
              className="w-full h-9 rounded-md border border-border bg-zinc-950 px-2 text-xs text-foreground outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="">Select Candidate...</option>
              {candidates.map((cand) => (
                <option key={cand.id} value={cand.id}>
                  {cand.name} - ({cand.jobTitle})
                </option>
              ))}
            </select>
            {errors.applicationId && <p className="text-[10px] text-destructive mt-1">{errors.applicationId.message}</p>}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Interview Title</label>
            <input
              type="text"
              {...register("title")}
              className="w-full h-9 rounded-md border border-border bg-zinc-955 px-3 text-xs text-foreground outline-none focus:border-primary transition-colors bg-zinc-950"
              placeholder="e.g. Technical Coding Round / Culture Screen"
            />
            {errors.title && <p className="text-[10px] text-destructive mt-1">{errors.title.message}</p>}
          </div>

          {/* Grid fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Scheduled Date & Time */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Date & Time</label>
              <input
                type="datetime-local"
                {...register("scheduledAt")}
                className="w-full h-9 rounded-md border border-border bg-zinc-955 px-3 text-xs text-foreground outline-none focus:border-primary transition-colors bg-zinc-950"
              />
              {errors.scheduledAt && <p className="text-[10px] text-destructive mt-1">{errors.scheduledAt.message}</p>}
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Duration (Minutes)</label>
              <select
                {...register("duration", { valueAsNumber: true })}
                className="w-full h-9 rounded-md border border-border bg-zinc-955 px-2 text-xs text-foreground outline-none focus:border-primary transition-colors bg-zinc-950 cursor-pointer"
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes</option>
                <option value={90}>90 Minutes</option>
              </select>
            </div>

            {/* Interview Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Interview Format</label>
              <select
                {...register("type")}
                className="w-full h-9 rounded-md border border-border bg-zinc-955 px-2 text-xs text-foreground outline-none focus:border-primary transition-colors bg-zinc-950 cursor-pointer"
              >
                {Object.values(InterviewType).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Meeting Link */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Video Meeting URL (Optional)</label>
              <input
                type="text"
                {...register("videoLink")}
                className="w-full h-9 rounded-md border border-border bg-zinc-955 px-3 text-xs text-foreground outline-none focus:border-primary transition-colors bg-zinc-950"
                placeholder="e.g. https://meet.google.com/..."
              />
              {errors.videoLink && <p className="text-[10px] text-destructive mt-1">{errors.videoLink.message}</p>}
            </div>
          </div>

          {/* Interviewer Selector (Checkbox tags list) */}
          <div className="space-y-2">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Assign Interviewers</label>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-zinc-950/40 border border-border rounded-lg">
              {teamMembers.map((member) => {
                const isSelected = selectedInterviewerIds.includes(member.id);
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => handleInterviewerToggle(member.id)}
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary font-semibold"
                        : "bg-zinc-900/10 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {member.name}
                  </button>
                );
              })}
            </div>
            {errors.interviewerIds && <p className="text-[10px] text-destructive">{errors.interviewerIds.message}</p>}
          </div>

          {/* Actions Footer */}
          <div className="flex h-16 items-center justify-end px-6 border-t border-border/40 gap-3 pt-4 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-zinc-900/10 px-4 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-900/20 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/95 transition-colors gap-2 cursor-pointer shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Booking...
                </>
              ) : (
                "Book Interview"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
