"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { candidateSchema, CandidateInput } from "@/lib/validators/candidate";
import { ApplicationStatus } from "@prisma/client";
import { X, Loader2 } from "lucide-react";
import { createCandidateAction, updateCandidateAction } from "@/app/actions/candidates";
import { toast } from "@/lib/toast";

interface CandidateFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: { id: string; title: string; department: string }[];
  candidateToEdit?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    resumeUrl: string;
    portfolioUrl: string | null;
    linkedinUrl: string | null;
    metadata: any;
    applications: { jobId: string; status: ApplicationStatus }[];
  } | null;
}

export function CandidateFormDialog({ isOpen, onClose, jobs, candidateToEdit }: CandidateFormDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CandidateInput>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      resumeUrl: "",
      portfolioUrl: "",
      linkedinUrl: "",
      jobId: "",
      experience: "",
      skills: "",
      rating: 3,
      initialNote: "",
      status: ApplicationStatus.APPLIED,
    },
  });

  // Reset fields when editing changes
  useEffect(() => {
    if (candidateToEdit) {
      const meta = candidateToEdit.metadata || {};
      const skillsArray = Array.isArray(meta.skills) ? meta.skills.join(", ") : "";
      reset({
        name: candidateToEdit.name,
        email: candidateToEdit.email,
        phone: candidateToEdit.phone || "",
        resumeUrl: candidateToEdit.resumeUrl,
        portfolioUrl: candidateToEdit.portfolioUrl || "",
        linkedinUrl: candidateToEdit.linkedinUrl || "",
        jobId: candidateToEdit.applications[0]?.jobId || "",
        experience: meta.experience || "",
        skills: skillsArray,
        rating: meta.rating || 3,
        initialNote: "",
        status: candidateToEdit.applications[0]?.status || ApplicationStatus.APPLIED,
      });
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        resumeUrl: "",
        portfolioUrl: "",
        linkedinUrl: "",
        jobId: jobs[0]?.id || "",
        experience: "",
        skills: "",
        rating: 3,
        initialNote: "",
        status: ApplicationStatus.APPLIED,
      });
    }
  }, [candidateToEdit, reset, isOpen, jobs]);

  if (!isOpen) return null;

  const onSubmit = async (values: CandidateInput) => {
    setSubmitting(true);
    try {
      if (candidateToEdit) {
        await updateCandidateAction(candidateToEdit.id, values);
        toast.success("Candidate dossier updated successfully");
      } else {
        await createCandidateAction(values);
        toast.success("Candidate registered successfully");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save candidate");
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
            {candidateToEdit ? "Edit Candidate Dossier" : "Register New Candidate"}
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
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Candidate Name</label>
              <input
                type="text"
                {...register("name")}
                className="w-full h-9 rounded-md border border-border bg-zinc-950 px-3 text-xs text-foreground outline-none focus:border-primary transition-colors"
                placeholder="e.g. Alex Mercer"
              />
              {errors.name && <p className="text-[10px] text-destructive mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                {...register("email")}
                className="w-full h-9 rounded-md border border-border bg-zinc-950 px-3 text-xs text-foreground outline-none focus:border-primary transition-colors"
                placeholder="e.g. alex.mercer@gmail.com"
              />
              {errors.email && <p className="text-[10px] text-destructive mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Phone Number</label>
              <input
                type="text"
                {...register("phone")}
                className="w-full h-9 rounded-md border border-border bg-zinc-950 px-3 text-xs text-foreground outline-none focus:border-primary transition-colors"
                placeholder="e.g. +1 (555) 123-4567"
              />
            </div>

            {/* Applied Job Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Target Job Opening</label>
              <select
                {...register("jobId")}
                className="w-full h-9 rounded-md border border-border bg-zinc-950 px-2 text-xs text-foreground outline-none focus:border-primary transition-colors cursor-pointer"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>{j.title} ({j.department})</option>
                ))}
              </select>
              {errors.jobId && <p className="text-[10px] text-destructive mt-1">{errors.jobId.message}</p>}
            </div>

            {/* Pipeline Stage */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Pipeline Stage</label>
              <select
                {...register("status")}
                className="w-full h-9 rounded-md border border-border bg-zinc-955 px-2 text-xs text-foreground outline-none focus:border-primary transition-colors bg-zinc-950 cursor-pointer"
              >
                {Object.values(ApplicationStatus).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Overall Rating (1-5)</label>
              <select
                {...register("rating", { valueAsNumber: true })}
                className="w-full h-9 rounded-md border border-border bg-zinc-955 px-2 text-xs text-foreground outline-none focus:border-primary transition-colors bg-zinc-950 cursor-pointer"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num} Star{num > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>

            {/* Resume URL */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Resume Document Link</label>
              <input
                type="text"
                {...register("resumeUrl")}
                className="w-full h-9 rounded-md border border-border bg-zinc-950 px-3 text-xs text-foreground outline-none focus:border-primary transition-colors"
                placeholder="e.g. https://storage.googleapis.com/resumes/alex-mercer.pdf"
              />
              {errors.resumeUrl && <p className="text-[10px] text-destructive mt-1">{errors.resumeUrl.message}</p>}
            </div>

            {/* Portfolio URL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Portfolio Link (Optional)</label>
              <input
                type="text"
                {...register("portfolioUrl")}
                className="w-full h-9 rounded-md border border-border bg-zinc-950 px-3 text-xs text-foreground outline-none focus:border-primary transition-colors"
                placeholder="e.g. https://portfolio.com"
              />
            </div>

            {/* LinkedIn URL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">LinkedIn Link (Optional)</label>
              <input
                type="text"
                {...register("linkedinUrl")}
                className="w-full h-9 rounded-md border border-border bg-zinc-950 px-3 text-xs text-foreground outline-none focus:border-primary transition-colors"
                placeholder="e.g. https://linkedin.com/in/alexmercer"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Skills & Core Tech Stack (Comma separated)</label>
            <input
              type="text"
              {...register("skills")}
              className="w-full h-9 rounded-md border border-border bg-zinc-950 px-3 text-xs text-foreground outline-none focus:border-primary transition-colors"
              placeholder="e.g. React, TypeScript, GraphQL, Rust"
            />
            {errors.skills && <p className="text-[10px] text-destructive mt-1">{errors.skills.message}</p>}
          </div>

          {/* Experience */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Experience Summary</label>
            <textarea
              rows={3}
              {...register("experience")}
              className="w-full rounded-md border border-border bg-zinc-950 p-3 text-xs text-foreground outline-none focus:border-primary transition-colors resize-none"
              placeholder="e.g. 5+ years of software design leading frontend rebuilds at Stripe and Linear..."
            />
            {errors.experience && <p className="text-[10px] text-destructive mt-1">{errors.experience.message}</p>}
          </div>

          {/* Initial Note (only visible when creating) */}
          {!candidateToEdit && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Internal Recruiter Note (Optional)</label>
              <textarea
                rows={3}
                {...register("initialNote")}
                className="w-full rounded-md border border-border bg-zinc-950 p-3 text-xs text-foreground outline-none focus:border-primary transition-colors resize-none"
                placeholder="Review assessments, concerns, or background check parameters..."
              />
            </div>
          )}

          {/* Actions Footer */}
          <div className="flex h-16 items-center justify-end px-6 border-t border-border/40 gap-3 pt-6 font-medium">
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
                "Save Candidate"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
