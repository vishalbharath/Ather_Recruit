"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema, JobInput } from "@/lib/validators/job";
import { JobStatus, JobType, WorkMode } from "@prisma/client";
import { X, Loader2 } from "lucide-react";
import { createJobAction, updateJobAction } from "@/app/actions/jobs";
import { toast } from "@/lib/toast";

interface JobFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jobToEdit?: {
    id: string;
    title: string;
    department: string;
    location: string;
    type: JobType;
    workMode: WorkMode;
    description: string;
    requirements: string;
    salaryMin: number | null;
    salaryMax: number | null;
    currency: string;
    status: JobStatus;
  } | null;
}

export function JobFormDialog({ isOpen, onClose, jobToEdit }: JobFormDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobInput>({
    resolver: zodResolver(jobSchema) as any,
    defaultValues: {
      title: "",
      department: "",
      location: "",
      type: JobType.FULL_TIME,
      workMode: WorkMode.REMOTE,
      description: "",
      requirements: "",
      salaryMin: null,
      salaryMax: null,
      currency: "USD",
      status: JobStatus.DRAFT,
    },
  });

  // Reset values when editing target updates
  useEffect(() => {
    if (jobToEdit) {
      reset({
        title: jobToEdit.title,
        department: jobToEdit.department,
        location: jobToEdit.location,
        type: jobToEdit.type,
        workMode: jobToEdit.workMode,
        description: jobToEdit.description,
        requirements: jobToEdit.requirements,
        salaryMin: jobToEdit.salaryMin,
        salaryMax: jobToEdit.salaryMax,
        currency: jobToEdit.currency,
        status: jobToEdit.status,
      });
    } else {
      reset({
        title: "",
        department: "",
        location: "",
        type: JobType.FULL_TIME,
        workMode: WorkMode.REMOTE,
        description: "",
        requirements: "",
        salaryMin: null,
        salaryMax: null,
        currency: "USD",
        status: JobStatus.DRAFT,
      });
    }
  }, [jobToEdit, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (values: JobInput) => {
    setSubmitting(true);
    try {
      if (jobToEdit) {
        await updateJobAction(jobToEdit.id, values);
        toast.success("Job posting updated successfully");
      } else {
        await createJobAction(values);
        toast.success("Job posting created successfully");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save job posting");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border w-full max-w-2xl rounded-2xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border/40">
          <h3 className="text-sm font-semibold text-foreground tracking-tight font-display">
            {jobToEdit ? "Edit Job Posting" : "Create New Job Posting"}
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Job Title</label>
              <input
                type="text"
                {...register("title")}
                className="w-full h-9 rounded-md border border-border bg-zinc-950 px-3 text-xs text-foreground outline-none focus:border-primary transition-colors"
                placeholder="e.g. Staff Software Engineer"
              />
              {errors.title && <p className="text-[10px] text-destructive mt-1">{errors.title.message}</p>}
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Department</label>
              <input
                type="text"
                {...register("department")}
                className="w-full h-9 rounded-md border border-border bg-zinc-950 px-3 text-xs text-foreground outline-none focus:border-primary transition-colors"
                placeholder="e.g. Engineering"
              />
              {errors.department && <p className="text-[10px] text-destructive mt-1">{errors.department.message}</p>}
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Location</label>
              <input
                type="text"
                {...register("location")}
                className="w-full h-9 rounded-md border border-border bg-zinc-950 px-3 text-xs text-foreground outline-none focus:border-primary transition-colors"
                placeholder="e.g. San Francisco, CA"
              />
              {errors.location && <p className="text-[10px] text-destructive mt-1">{errors.location.message}</p>}
            </div>

            {/* Work Mode */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Work Mode</label>
              <select
                {...register("workMode")}
                className="w-full h-9 rounded-md border border-border bg-zinc-955 px-2 text-xs text-foreground outline-none focus:border-primary transition-colors bg-zinc-950"
              >
                {Object.values(WorkMode).map((m) => (
                  <option key={m} value={m}>{m.replace("_", " ")}</option>
                ))}
              </select>
            </div>

            {/* Job Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Job Type</label>
              <select
                {...register("type")}
                className="w-full h-9 rounded-md border border-border bg-zinc-955 px-2 text-xs text-foreground outline-none focus:border-primary transition-colors bg-zinc-950"
              >
                {Object.values(JobType).map((t) => (
                  <option key={t} value={t}>{t.replace("_", " ")}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</label>
              <select
                {...register("status")}
                className="w-full h-9 rounded-md border border-border bg-zinc-955 px-2 text-xs text-foreground outline-none focus:border-primary transition-colors bg-zinc-950"
              >
                {Object.values(JobStatus).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Salary Range Min */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Salary Min (Annual)</label>
              <input
                type="number"
                {...register("salaryMin", { valueAsNumber: true })}
                className="w-full h-9 rounded-md border border-border bg-zinc-955 px-3 text-xs text-foreground outline-none focus:border-primary transition-colors bg-zinc-955"
                placeholder="e.g. 120000"
              />
            </div>

            {/* Salary Range Max */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Salary Max (Annual)</label>
              <input
                type="number"
                {...register("salaryMax", { valueAsNumber: true })}
                className="w-full h-9 rounded-md border border-border bg-zinc-955 px-3 text-xs text-foreground outline-none focus:border-primary transition-colors bg-zinc-955"
                placeholder="e.g. 160000"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Job Description</label>
            <textarea
              rows={4}
              {...register("description")}
              className="w-full rounded-md border border-border bg-zinc-950 p-3 text-xs text-foreground outline-none focus:border-primary transition-colors resize-none"
              placeholder="Provide a detailed description of the role, team, and duties..."
            />
            {errors.description && <p className="text-[10px] text-destructive mt-1">{errors.description.message}</p>}
          </div>

          {/* Requirements */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Key Requirements</label>
            <textarea
              rows={4}
              {...register("requirements")}
              className="w-full rounded-md border border-border bg-zinc-955 p-3 text-xs text-foreground outline-none focus:border-primary transition-colors resize-none bg-zinc-900/10"
              placeholder="List core tech stack, experiences, credentials, and skills..."
            />
            {errors.requirements && <p className="text-[10px] text-destructive mt-1">{errors.requirements.message}</p>}
          </div>

          {/* Actions Footer */}
          <div className="flex h-16 items-center justify-end px-6 border-t border-border/40 gap-3 pt-6">
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
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/95 transition-colors gap-2 cursor-pointer shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Posting"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
