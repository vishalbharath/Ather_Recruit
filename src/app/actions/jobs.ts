"use server";

import prisma from "@/lib/prisma";
import { getActiveWorkspace } from "@/lib/roles";
import { jobSchema, JobInput } from "@/lib/validators/job";
import { JobStatus, OrgRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createJobAction(input: JobInput) {
  const workspace = await getActiveWorkspace();
  if (!workspace) throw new Error("Unauthorized");

  const { user, organization, role } = workspace;

  if (role === OrgRole.HIRING_MANAGER) {
    throw new Error("Hiring Managers lack clearance to post new job listings.");
  }

  const data = jobSchema.parse(input);

  const job = await prisma.job.create({
    data: {
      organizationId: organization.id,
      title: data.title,
      department: data.department,
      location: data.location,
      type: data.type,
      workMode: data.workMode,
      description: data.description,
      requirements: data.requirements,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      currency: data.currency,
      status: data.status,
      recruiterId: user.id,
      hiringManagerId: user.id,
    },
  });

  await prisma.activityLog.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      action: "JOB_CREATED",
      details: `Created job posting: ${data.title} (${data.department})`,
    },
  });

  revalidatePath("/dashboard/jobs");
  return { success: true, job };
}

export async function updateJobAction(id: string, input: JobInput) {
  const workspace = await getActiveWorkspace();
  if (!workspace) throw new Error("Unauthorized");

  const { user, organization, role } = workspace;
  if (role === OrgRole.HIRING_MANAGER) {
    throw new Error("Hiring Managers lack clearance to edit job listings.");
  }

  const data = jobSchema.parse(input);

  const job = await prisma.job.update({
    where: { id },
    data: {
      title: data.title,
      department: data.department,
      location: data.location,
      type: data.type,
      workMode: data.workMode,
      description: data.description,
      requirements: data.requirements,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      currency: data.currency,
      status: data.status,
    },
  });

  await prisma.activityLog.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      action: "JOB_UPDATED",
      details: `Updated job posting: ${data.title}`,
    },
  });

  revalidatePath("/dashboard/jobs");
  return { success: true, job };
}

export async function deleteJobAction(id: string) {
  const workspace = await getActiveWorkspace();
  if (!workspace) throw new Error("Unauthorized");

  const { user, organization, role } = workspace;
  if (role === OrgRole.HIRING_MANAGER) {
    throw new Error("Hiring Managers lack clearance to delete job listings.");
  }

  const job = await prisma.job.delete({
    where: { id },
  });

  await prisma.activityLog.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      action: "JOB_DELETED",
      details: `Deleted job posting: ${job.title}`,
    },
  });

  revalidatePath("/dashboard/jobs");
  return { success: true };
}

export async function toggleJobStatusAction(id: string, status: JobStatus) {
  const workspace = await getActiveWorkspace();
  if (!workspace) throw new Error("Unauthorized");

  const { user, organization, role } = workspace;
  if (role === OrgRole.HIRING_MANAGER) {
    throw new Error("Hiring Managers lack clearance to alter job status.");
  }

  const job = await prisma.job.update({
    where: { id },
    data: { status },
  });

  await prisma.activityLog.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      action: "JOB_STATUS_UPDATED",
      details: `Set status of job ${job.title} to ${status}`,
    },
  });

  revalidatePath("/dashboard/jobs");
  return { success: true, job };
}
