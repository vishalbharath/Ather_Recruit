"use server";

import prisma from "@/lib/prisma";
import { getActiveWorkspace } from "@/lib/roles";

export interface SearchResultItem {
  id: string;
  title: string; // Display title
  subtitle: string; // Sub-label
  link: string; // Target URL
  type: "job" | "candidate" | "interview";
}

export interface SearchResults {
  jobs: SearchResultItem[];
  candidates: SearchResultItem[];
  interviews: SearchResultItem[];
}

export async function globalSearchAction(query: string): Promise<SearchResults> {
  const defaultResult: SearchResults = { jobs: [], candidates: [], interviews: [] };
  
  if (!query || query.trim().length < 2) {
    return defaultResult;
  }

  const workspace = await getActiveWorkspace();
  if (!workspace) return defaultResult;

  const { organization } = workspace;
  const searchTerm = query.trim().toLowerCase();

  // 1. Search Jobs
  const jobs = await prisma.job.findMany({
    where: {
      organizationId: organization.id,
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { department: { contains: searchTerm, mode: "insensitive" } },
        { location: { contains: searchTerm, mode: "insensitive" } },
      ],
    },
    take: 5,
  });

  const jobResults: SearchResultItem[] = jobs.map((j) => ({
    id: j.id,
    title: j.title,
    subtitle: `${j.department} • ${j.location}`,
    link: `/dashboard/jobs/${j.id}`,
    type: "job",
  }));

  // 2. Search Candidates
  const candidates = await prisma.candidate.findMany({
    where: {
      organizationId: organization.id,
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
        { phone: { contains: searchTerm, mode: "insensitive" } },
      ],
    },
    take: 5,
  });

  const candidateResults: SearchResultItem[] = candidates.map((c) => ({
    id: c.id,
    title: c.name,
    subtitle: c.email,
    link: `/dashboard/candidates`, // Opens directory where they can view details
    type: "candidate",
  }));

  // 3. Search Interviews
  const interviews = await prisma.interview.findMany({
    where: {
      application: {
        job: {
          organizationId: organization.id,
        },
      },
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { application: { candidate: { name: { contains: searchTerm, mode: "insensitive" } } } },
      ],
    },
    take: 5,
    include: {
      application: {
        include: { candidate: true },
      },
    },
  });

  const interviewResults: SearchResultItem[] = interviews.map((i) => ({
    id: i.id,
    title: i.title,
    subtitle: `Candidate: ${i.application.candidate.name} • ${new Date(i.scheduledAt).toLocaleDateString()}`,
    link: `/dashboard/interviews`,
    type: "interview",
  }));

  return {
    jobs: jobResults,
    candidates: candidateResults,
    interviews: interviewResults,
  };
}
