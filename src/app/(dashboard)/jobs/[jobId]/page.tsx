import * as React from "react";
import prisma from "@/lib/prisma";
import { getActiveWorkspace } from "@/lib/roles";
import { redirect, notFound } from "next/navigation";
import { PipelineBoard } from "@/components/dashboard/pipeline-board";

export const dynamic = "force-dynamic";

interface JobDetailPageProps {
  params: Promise<{
    jobId: string;
  }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const workspace = await getActiveWorkspace();
  if (!workspace) {
    redirect("/sign-in");
  }

  const { organization } = workspace;
  const { jobId } = await params;

  // Retrieve Job and associated applications details scoped to current active organization
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
    include: {
      applications: {
        include: {
          candidate: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!job || job.organizationId !== organization.id) {
    notFound();
  }

  return <PipelineBoard job={job} initialApplications={job.applications} />;
}
