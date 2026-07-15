import * as React from "react";
import prisma from "@/lib/prisma";
import { getActiveWorkspace } from "@/lib/roles";
import { redirect } from "next/navigation";
import { JobsClient } from "@/components/dashboard/jobs-client";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const workspace = await getActiveWorkspace();
  if (!workspace) {
    redirect("/sign-in");
  }

  const { organization } = workspace;

  // Retrieve all jobs belonging to the current active workspace organization
  const jobs = await prisma.job.findMany({
    where: {
      organizationId: organization.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  return <JobsClient initialJobs={jobs} />;
}
