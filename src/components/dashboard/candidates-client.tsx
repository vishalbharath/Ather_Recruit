"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, Eye, Trash2, Edit2, SlidersHorizontal, ChevronLeft, ChevronRight, Users, Star } from "lucide-react";
import { ApplicationStatus } from "@prisma/client";
import { deleteCandidateAction } from "@/app/actions/candidates";
import { toast } from "@/lib/toast";
import { CandidateFormDialog } from "./candidate-form-dialog";
import { CandidateDrawer } from "./candidate-drawer";
import { cn } from "@/lib/utils";

interface CandidateClientProps {
  initialCandidates: any[];
  jobs: { id: string; title: string; department: string }[];
}

const ITEMS_PER_PAGE = 8;

export function CandidatesClient({ initialCandidates, jobs }: CandidateClientProps) {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState<string>("ALL");
  const [stageFilter, setStageFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  // Dialog and Drawer states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [candidateToEdit, setCandidateToEdit] = useState<any | null>(null);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);

  // Filter candidates list
  const filteredCandidates = useMemo(() => {
    return candidates.filter((cand) => {
      const meta = cand.metadata || {};
      const skills = Array.isArray(meta.skills) ? meta.skills.join(" ") : "";
      
      const matchesSearch =
        cand.name.toLowerCase().includes(search.toLowerCase()) ||
        cand.email.toLowerCase().includes(search.toLowerCase()) ||
        skills.toLowerCase().includes(search.toLowerCase());

      const app = cand.applications[0];
      const matchesJob = jobFilter === "ALL" || app?.jobId === jobFilter;
      const matchesStage = stageFilter === "ALL" || app?.status === stageFilter;

      return matchesSearch && matchesJob && matchesStage;
    });
  }, [candidates, search, jobFilter, stageFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE) || 1;
  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCandidates.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCandidates, currentPage]);

  const handleRegisterClick = () => {
    setCandidateToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, cand: any) => {
    e.stopPropagation();
    setCandidateToEdit(cand);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this candidate dossier? This will remove all applications and notes.")) {
      return;
    }
    try {
      await deleteCandidateAction(id);
      setCandidates((prev) => prev.filter((c) => c.id !== id));
      toast.success("Candidate dossier deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete candidate");
    }
  };

  const handleRowClick = (cand: any) => {
    setSelectedCandidate(cand);
    setIsDrawerOpen(true);
  };

  const handleStageUpdated = (candidateId: string, nextStage: ApplicationStatus) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const updatedApps = c.applications.map((a: any) => ({ ...a, status: nextStage }));
          return { ...c, applications: updatedApps };
        }
        return c;
      })
    );
    // Sync the active drawer data
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate((prev: any) => ({
        ...prev,
        applications: prev.applications.map((a: any) => ({ ...a, status: nextStage })),
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
            Candidate Directory
          </h2>
          <p className="text-muted-foreground text-sm">
            Search, filter, and review profiles of all job applicants in your workspace.
          </p>
        </div>
        <button
          onClick={handleRegisterClick}
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/95 transition-colors gap-2 cursor-pointer shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Add Candidate
        </button>
      </div>

      {/* Filter and Search grid */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-card border border-border p-4 rounded-xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search candidates by name, email, skills..."
            className="w-full h-9 rounded-md border border-border bg-zinc-950/40 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters:
          </div>

          {/* Job Filter */}
          <select
            value={jobFilter}
            onChange={(e) => {
              setJobFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 rounded-md border border-border bg-zinc-950 px-2 text-xs text-foreground outline-none cursor-pointer max-w-[180px] truncate"
          >
            <option value="ALL">All Jobs</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>

          {/* Stage Filter */}
          <select
            value={stageFilter}
            onChange={(e) => {
              setStageFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 rounded-md border border-border bg-zinc-950 px-2 text-xs text-foreground outline-none cursor-pointer"
          >
            <option value="ALL">All Stages</option>
            {Object.values(ApplicationStatus).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table directories */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto w-full font-medium">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-zinc-900/10 text-muted-foreground font-semibold">
                <th className="px-6 py-3.5">Candidate Name</th>
                <th className="px-6 py-3.5">Applied Role</th>
                <th className="px-6 py-3.5">Pipeline Stage</th>
                <th className="px-6 py-3.5 text-center">Score Card</th>
                <th className="px-6 py-3.5">Contact Email</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCandidates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground border-b border-border/10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mx-auto mb-4">
                      <Users className="h-6 w-6" />
                    </div>
                    <p className="font-semibold text-foreground">No candidates registered</p>
                    <p className="text-[11px] text-muted-foreground mt-1 max-w-xs mx-auto">
                      Adjust your filter configurations or add a new candidate dossier to launch reviews.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedCandidates.map((cand) => {
                  const app = cand.applications[0];
                  const meta = cand.metadata || {};
                  const rating = meta.rating || 3;
                  return (
                    <tr
                      key={cand.id}
                      onClick={() => handleRowClick(cand)}
                      className="border-b border-border/40 hover:bg-zinc-900/10 dark:hover:bg-zinc-800/10 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar Circle */}
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs">
                            {cand.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-foreground">{cand.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {app?.job?.title || "Unknown Position"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold border",
                            app?.status === ApplicationStatus.HIRED && "bg-green-500/10 border-green-500/20 text-green-400",
                            app?.status === ApplicationStatus.OFFER && "bg-blue-500/10 border-blue-500/20 text-blue-450 text-blue-400",
                            app?.status === ApplicationStatus.REJECTED && "bg-red-500/10 border-red-500/20 text-red-400",
                            app?.status === ApplicationStatus.INTERVIEW && "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
                            (app?.status === ApplicationStatus.SCREENING || app?.status === ApplicationStatus.APPLIED) && "bg-amber-500/10 border-amber-500/20 text-amber-400"
                          )}
                        >
                          {app?.status || "APPLIED"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-3 w-3",
                                i < rating ? "fill-yellow-500 text-yellow-500" : "text-zinc-700"
                              )}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {cand.email}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(cand);
                          }}
                          className="inline-flex h-7 w-7 items-center justify-center rounded border border-border/40 text-muted-foreground hover:text-foreground hover:bg-zinc-900/20 transition-colors cursor-pointer"
                          aria-label="View candidate"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleEditClick(e, cand)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded border border-border/40 text-muted-foreground hover:text-foreground hover:bg-zinc-900/20 transition-colors cursor-pointer"
                          aria-label="Edit candidate"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(e, cand.id)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded border border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                          aria-label="Delete candidate"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {filteredCandidates.length > ITEMS_PER_PAGE && (
          <div className="flex h-12 items-center justify-between px-6 border-t border-border/40 bg-zinc-900/5">
            <span className="text-[11px] text-muted-foreground">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredCandidates.length)} of{" "}
              {filteredCandidates.length} profiles
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-border/40 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-border/40 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Dialog Form */}
      <CandidateFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          window.location.reload();
        }}
        jobs={jobs}
        candidateToEdit={candidateToEdit}
      />

      {/* Slide-over Drawer Panel */}
      <CandidateDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          // Reload page to reflect changed notes/stages on exit
          window.location.reload();
        }}
        candidate={selectedCandidate}
        onStageUpdated={handleStageUpdated}
      />
    </div>
  );
}
