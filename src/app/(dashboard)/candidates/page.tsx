import * as React from "react";
import prisma from "@/lib/prisma";
import { getActiveWorkspace } from "@/lib/roles";
import { redirect } from "next/navigation";
import { CandidatesClient } from "@/components/dashboard/candidates-client";
import { JobStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function CandidatesPage() {
  const workspace = await getActiveWorkspace();
  if (!workspace) {
    redirect("/sign-in");
  }

  const { organization } = workspace;

  // Query candidates scoped to active organization
  const candidates = await prisma.candidate.findMany({
    where: {
      organizationId: organization.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      applications: {
        include: {
          job: true,
          notes: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  // Query jobs to supply candidate target selectors in form dialog
  const jobs = await prisma.job.findMany({
    where: {
      organizationId: organization.id,
      status: JobStatus.ACTIVE,
    },
    select: {
      id: true,
      title: true,
      department: true,
    },
  });

  return <CandidatesClient initialCandidates={candidates} jobs={jobs} />;
}
