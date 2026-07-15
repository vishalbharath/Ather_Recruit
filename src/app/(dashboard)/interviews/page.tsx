import * as React from "react";
import prisma from "@/lib/prisma";
import { getActiveWorkspace } from "@/lib/roles";
import { redirect } from "next/navigation";
import { InterviewsClient } from "@/components/dashboard/interviews-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Interview Schedule Calendar | Aether Recruiter Workspace",
  description: "Coordinate mock screening rounds, schedule panel interviews, and assign team managers.",
};

export default async function InterviewsPage() {
  const workspace = await getActiveWorkspace();
  if (!workspace) {
    redirect("/sign-in");
  }

  const { organization } = workspace;

  // Query interviews scoped to active organization
  const interviews = await prisma.interview.findMany({
    where: {
      application: {
        job: {
          organizationId: organization.id,
        },
      },
    },
    orderBy: {
      scheduledAt: "asc",
    },
    include: {
      application: {
        include: {
          candidate: true,
          job: true,
        },
      },
      interviewers: {
        include: {
          user: true,
        },
      },
    },
  });

  // Query candidate options (exclude Hired/Rejected for scheduling simplicity)
  const applications = await prisma.application.findMany({
    where: {
      job: {
        organizationId: organization.id,
      },
      status: {
        notIn: ["HIRED", "REJECTED"],
      },
    },
    select: {
      id: true,
      candidate: {
        select: {
          name: true,
        },
      },
      job: {
        select: {
          title: true,
        },
      },
    },
  });

  const candidatesPayload = applications.map((app) => ({
    id: app.id,
    name: app.candidate.name,
    jobTitle: app.job.title,
  }));

  // Query team members in organization to assign as interviewers
  const memberships = await prisma.membership.findMany({
    where: {
      organizationId: organization.id,
    },
    select: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const teamMembersPayload = memberships.map((m) => ({
    id: m.user.id,
    name: m.user.name,
  }));

  return (
    <InterviewsClient
      initialInterviews={interviews}
      candidates={candidatesPayload}
      teamMembers={teamMembersPayload}
    />
  );
}
