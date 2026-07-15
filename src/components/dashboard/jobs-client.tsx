"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, Edit2, Trash2, ShieldAlert, SlidersHorizontal, ChevronLeft, ChevronRight, Briefcase } from "lucide-react";
import { JobStatus, JobType, WorkMode } from "@prisma/client";
import { deleteJobAction, toggleJobStatusAction } from "@/app/actions/jobs";
import { toast } from "@/lib/toast";
import { JobFormDialog } from "./job-form-dialog";
import { cn } from "@/lib/utils";

interface JobClientProps {
  initialJobs: {
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
    _count: {
      applications: number;
    };
  }[];
}

const ITEMS_PER_PAGE = 8;

export function JobsClient({ initialJobs }: JobClientProps) {
  const [jobs, setJobs] = useState(initialJobs);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [modeFilter, setModeFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  // Dialog control states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<typeof initialJobs[0] | null>(null);

  // Handle client-side filtering and search
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.department.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || job.status === statusFilter;
      const matchesType = typeFilter === "ALL" || job.type === typeFilter;
      const matchesMode = modeFilter === "ALL" || job.workMode === modeFilter;

      return matchesSearch && matchesStatus && matchesType && matchesMode;
    });
  }, [jobs, search, statusFilter, typeFilter, modeFilter]);

  // Handle pagination calculation
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE) || 1;
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  const handleCreateClick = () => {
    setJobToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (job: typeof initialJobs[0]) => {
    setJobToEdit(job);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job posting? This will remove all related candidate applications.")) {
      return;
    }
    try {
      await deleteJobAction(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      toast.success("Job posting deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete job posting");
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: JobStatus) => {
    const nextStatus = currentStatus === JobStatus.ACTIVE ? JobStatus.CLOSED : JobStatus.ACTIVE;
    try {
      await toggleJobStatusAction(id, nextStatus);
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, status: nextStatus } : j))
      );
      toast.success(`Job status updated to ${nextStatus}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update job status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
            Workspace Job Boards
          </h2>
          <p className="text-muted-foreground text-sm">
            Create active recruitment listings, adjust categories, and track candidate counts.
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/95 transition-colors gap-2 cursor-pointer shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Create Posting
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
            placeholder="Search jobs by title, department, location..."
            className="w-full h-9 rounded-md border border-border bg-zinc-950/40 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters:
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 rounded-md border border-border bg-zinc-950 px-2 text-xs text-foreground outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            {Object.values(JobStatus).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 rounded-md border border-border bg-zinc-950 px-2 text-xs text-foreground outline-none cursor-pointer"
          >
            <option value="ALL">All Types</option>
            {Object.values(JobType).map((t) => (
              <option key={t} value={t}>{t.replace("_", " ")}</option>
            ))}
          </select>

          {/* Mode Filter */}
          <select
            value={modeFilter}
            onChange={(e) => {
              setModeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 rounded-md border border-border bg-zinc-950 px-2 text-xs text-foreground outline-none cursor-pointer"
          >
            <option value="ALL">All Modes</option>
            {Object.values(WorkMode).map((m) => (
              <option key={m} value={m}>{m.replace("_", " ")}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table listings */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-zinc-900/10 text-muted-foreground font-semibold">
                <th className="px-6 py-3.5">Job Title</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Work Config</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-center">Applicants</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground border-b border-border/10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mx-auto mb-4">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <p className="font-semibold text-foreground">No matching jobs found</p>
                    <p className="text-[11px] text-muted-foreground mt-1 max-w-xs mx-auto">
                      Adjust your filters or query settings, or create a new job posting to populate this directory.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-border/40 hover:bg-zinc-900/10 dark:hover:bg-zinc-800/10 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {job.title}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {job.department}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {job.location}
                    </td>
                    <td className="px-6 py-4 space-x-1.5">
                      <span className="inline-flex items-center rounded-full bg-zinc-900 border border-border px-2 py-0.5 text-[10px] text-foreground">
                        {job.type.replace("_", " ")}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-zinc-900 border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                        {job.workMode.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold border",
                          job.status === JobStatus.ACTIVE && "bg-green-500/10 border-green-500/20 text-green-400",
                          job.status === JobStatus.DRAFT && "bg-amber-500/10 border-amber-500/20 text-amber-400",
                          job.status === JobStatus.CLOSED && "bg-zinc-500/10 border-zinc-500/20 text-muted-foreground"
                        )}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-foreground">
                      {job._count.applications}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleStatusToggle(job.id, job.status)}
                        className="inline-flex h-7 px-2.5 items-center justify-center rounded border border-border/40 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-900/20 transition-colors cursor-pointer"
                      >
                        {job.status === JobStatus.ACTIVE ? "Pause" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleEditClick(job)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded border border-border/40 text-muted-foreground hover:text-foreground hover:bg-zinc-900/20 transition-colors cursor-pointer"
                        aria-label="Edit job"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(job.id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded border border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        aria-label="Delete job"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {filteredJobs.length > ITEMS_PER_PAGE && (
          <div className="flex h-12 items-center justify-between px-6 border-t border-border/40 bg-zinc-900/5">
            <span className="text-[11px] text-muted-foreground">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredJobs.length)} of{" "}
              {filteredJobs.length} postings
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
      <JobFormDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          // Simple client refresh/sync
          // In actual apps, revalidatePath updates layout server-side,
          // but we can query again or trigger route refresh!
          window.location.reload();
        }}
        jobToEdit={jobToEdit}
      />
    </div>
  );
}
