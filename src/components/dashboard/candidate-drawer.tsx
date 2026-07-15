"use client";

import React, { useState } from "react";
import { X, Calendar, Mail, Phone, ExternalLink, MessageSquare, Star, Plus, Shield, CheckCircle2 } from "lucide-react";
import { ApplicationStatus } from "@prisma/client";
import { updateApplicationStageAction, addCandidateNoteAction } from "@/app/actions/candidates";
import { toast } from "@/lib/toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CandidateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    resumeUrl: string;
    portfolioUrl: string | null;
    linkedinUrl: string | null;
    createdAt: string;
    metadata: any;
    applications: {
      id: string;
      status: ApplicationStatus;
      job: { title: string; department: string };
      notes: {
        id: string;
        content: string;
        createdAt: string;
        user: { name: string };
      }[];
    }[];
  } | null;
  onStageUpdated: (candidateId: string, nextStage: ApplicationStatus) => void;
}

export function CandidateDrawer({ isOpen, onClose, candidate, onStageUpdated }: CandidateDrawerProps) {
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [updatingStage, setUpdatingStage] = useState(false);

  // Maintain local state for notes list so user sees their new notes instantly
  const [notes, setNotes] = useState<any[]>([]);

  // Sync notes when candidate target changes
  React.useEffect(() => {
    if (candidate && candidate.applications[0]) {
      setNotes(candidate.applications[0].notes || []);
    } else {
      setNotes([]);
    }
  }, [candidate]);

  if (!isOpen || !candidate) return null;

  const app = candidate.applications[0];
  const meta = candidate.metadata || {};
  const skills = Array.isArray(meta.skills) ? meta.skills : [];
  const experience = meta.experience || "No experience summary provided.";
  const rating = meta.rating || 3;

  const handleStageChange = async (nextStage: ApplicationStatus) => {
    if (!app) return;
    setUpdatingStage(true);
    try {
      await updateApplicationStageAction(app.id, nextStage);
      onStageUpdated(candidate.id, nextStage);
      toast.success(`Moved candidate stage to ${nextStage}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update pipeline stage");
    } finally {
      setUpdatingStage(false);
    }
  };

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !app) return;
    setAddingNote(true);
    try {
      const res = await addCandidateNoteAction(app.id, newNote.trim());
      if (res.success && res.note) {
        setNotes((prev) => [res.note, ...prev]);
        setNewNote("");
        toast.success("Note added successfully");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit note");
    } finally {
      setAddingNote(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/50 backdrop-blur-xs">
      {/* Click outside backdrop dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Body */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative z-10 w-full max-w-lg bg-card border-l border-border h-full flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border/40 flex-shrink-0 bg-zinc-950/20">
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight font-display">
              Candidate Dossier
            </h3>
            <p className="text-[10px] text-muted-foreground">ID: {candidate.id.substring(0, 8)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Dossier Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Candidate Primary Info Card */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight font-display">{candidate.name}</h2>
              <p className="text-xs text-primary font-medium mt-1">
                Applying for: {app?.job?.title || "Unknown Position"}
              </p>
            </div>

            {/* Stars rating */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < rating ? "fill-yellow-500 text-yellow-500" : "text-zinc-700"
                  )}
                />
              ))}
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider ml-2">
                Overall score: {rating}/5
              </span>
            </div>

            {/* Stage Status dropdown */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Pipeline Stage status
              </label>
              <select
                disabled={updatingStage || !app}
                value={app?.status || ApplicationStatus.APPLIED}
                onChange={(e) => handleStageChange(e.target.value as ApplicationStatus)}
                className="h-9 w-full rounded-md border border-border bg-zinc-950 px-2 text-xs text-foreground outline-none cursor-pointer focus:border-primary transition-colors disabled:opacity-50"
              >
                {Object.values(ApplicationStatus).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <hr className="border-border/40" />

          {/* Contact coordinates */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Contact details</h4>
            <div className="grid gap-3 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="text-foreground">{candidate.email}</span>
              </div>
              {candidate.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span className="text-foreground">{candidate.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Applied: {new Date(candidate.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Attachments buttons */}
            <div className="flex flex-wrap gap-2 mt-4 pt-2">
              <a
                href={candidate.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 px-3 items-center justify-center rounded border border-border bg-zinc-900/10 text-xs text-foreground hover:bg-zinc-900/20 dark:hover:bg-zinc-800/40 transition-colors gap-1.5 cursor-pointer"
              >
                View Resume <ExternalLink className="h-3 w-3" />
              </a>
              {candidate.portfolioUrl && (
                <a
                  href={candidate.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 px-3 items-center justify-center rounded border border-border bg-zinc-900/10 text-xs text-foreground hover:bg-zinc-900/20 dark:hover:bg-zinc-800/40 transition-colors gap-1.5 cursor-pointer"
                >
                  Portfolio <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {candidate.linkedinUrl && (
                <a
                  href={candidate.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 px-3 items-center justify-center rounded border border-border bg-zinc-900/10 text-xs text-foreground hover:bg-zinc-900/20 dark:hover:bg-zinc-800/40 transition-colors gap-1.5 cursor-pointer"
                >
                  LinkedIn <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          <hr className="border-border/40" />

          {/* Candidate Profile Details */}
          <div className="space-y-4">
            {/* Skills */}
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {skills.length === 0 ? (
                  <span className="text-xs text-muted-foreground">No tags specified</span>
                ) : (
                  skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] text-primary"
                    >
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Experience Summary</h4>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {experience}
              </p>
            </div>
          </div>

          <hr className="border-border/40" />

          {/* Recruiter Evaluation Notes Thread */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" /> Team Discussion & Notes ({notes.length})
            </h4>

            {/* Form editor */}
            <form onSubmit={handleNoteSubmit} className="space-y-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Submit an evaluation summary or action item..."
                rows={3}
                className="w-full rounded-md border border-border bg-zinc-950 p-3 text-xs text-foreground outline-none focus:border-primary transition-colors resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={addingNote || !newNote.trim()}
                  className="inline-flex h-8 px-3 items-center justify-center rounded bg-primary text-xs font-medium text-primary-foreground hover:bg-primary/95 transition-colors gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="h-3.5 w-3.5" /> Post Comment
                </button>
              </div>
            </form>

            {/* Notes List */}
            <div className="space-y-3 pt-2">
              {notes.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No reviews recorded yet.</p>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="bg-zinc-950/40 border border-border/40 rounded-lg p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="font-semibold text-foreground">{note.user?.name || "System"}</span>
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed break-words">{note.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
