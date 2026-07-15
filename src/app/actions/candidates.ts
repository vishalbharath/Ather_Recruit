"use server";

import prisma from "@/lib/prisma";
import { getActiveWorkspace } from "@/lib/roles";
import { candidateSchema, CandidateInput } from "@/lib/validators/candidate";
import { ApplicationStatus, OrgRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createCandidateAction(input: CandidateInput) {
  const workspace = await getActiveWorkspace();
  if (!workspace) throw new Error("Unauthorized");

  const { user, organization } = workspace;

  const data = candidateSchema.parse(input);

  // Check if candidate email already exists in this organization
  const existing = await prisma.candidate.findFirst({
    where: {
      organizationId: organization.id,
      email: data.email,
    },
  });

  if (existing) {
    throw new Error(`Candidate with email ${data.email} already exists in your workspace.`);
  }

  // Create Candidate
  const candidate = await prisma.candidate.create({
    data: {
      organizationId: organization.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      resumeUrl: data.resumeUrl,
      portfolioUrl: data.portfolioUrl,
      linkedinUrl: data.linkedinUrl,
      metadata: {
        skills: data.skills.split(",").map((s) => s.trim()).filter(Boolean),
        experience: data.experience,
        rating: data.rating,
      },
    },
  });

  // Create Application
  const application = await prisma.application.create({
    data: {
      jobId: data.jobId,
      candidateId: candidate.id,
      status: data.status,
    },
  });

  // Create initial Note if provided
  if (data.initialNote) {
    await prisma.candidateNote.create({
      data: {
        applicationId: application.id,
        userId: user.id,
        content: data.initialNote,
      },
    });
  }

  // Log Activity
  await prisma.activityLog.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      action: "CANDIDATE_CREATED",
      details: `Registered candidate: ${data.name} for Job Opening`,
    },
  });

  revalidatePath("/candidates");
  revalidatePath("/overview");
  return { success: true, candidate };
}

export async function updateCandidateAction(id: string, input: CandidateInput) {
  const workspace = await getActiveWorkspace();
  if (!workspace) throw new Error("Unauthorized");

  const { user, organization } = workspace;
  const data = candidateSchema.parse(input);

  // Find candidate
  const candidate = await prisma.candidate.findUnique({
    where: { id },
    include: { applications: true },
  });

  if (!candidate || candidate.organizationId !== organization.id) {
    throw new Error("Candidate profile not found");
  }

  // Update Candidate details
  await prisma.candidate.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      resumeUrl: data.resumeUrl,
      portfolioUrl: data.portfolioUrl,
      linkedinUrl: data.linkedinUrl,
      metadata: {
        skills: data.skills.split(",").map((s) => s.trim()).filter(Boolean),
        experience: data.experience,
        rating: data.rating,
      },
    },
  });

  // Update application job link and status
  const mainApp = candidate.applications[0];
  if (mainApp) {
    await prisma.application.update({
      where: { id: mainApp.id },
      data: {
        jobId: data.jobId,
        status: data.status,
      },
    });
  }

  await prisma.activityLog.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      action: "CANDIDATE_UPDATED",
      details: `Updated details for candidate: ${data.name}`,
    },
  });

  revalidatePath("/candidates");
  return { success: true };
}

export async function deleteCandidateAction(id: string) {
  const workspace = await getActiveWorkspace();
  if (!workspace) throw new Error("Unauthorized");

  const { user, organization, role } = workspace;

  if (role !== OrgRole.OWNER && role !== OrgRole.ADMIN) {
    throw new Error("Only workspace Owners or Admins are authorized to permanently delete candidate records.");
  }

  const candidate = await prisma.candidate.delete({
    where: { id },
  });

  await prisma.activityLog.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      action: "CANDIDATE_DELETED",
      details: `Deleted candidate folder: ${candidate.name}`,
    },
  });

  revalidatePath("/candidates");
  revalidatePath("/overview");
  return { success: true };
}

export async function updateApplicationStageAction(applicationId: string, status: ApplicationStatus) {
  const workspace = await getActiveWorkspace();
  if (!workspace) throw new Error("Unauthorized");

  const { user, organization } = workspace;

  const app = await prisma.application.update({
    where: { id: applicationId },
    data: { status },
    include: { candidate: true },
  });

  await prisma.activityLog.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      action: "CANDIDATE_STAGE_CHANGED",
      details: `Moved candidate ${app.candidate.name} stage status to ${status}`,
    },
  });

  revalidatePath("/candidates");
  revalidatePath("/overview");
  return { success: true, app };
}

export async function addCandidateNoteAction(applicationId: string, content: string) {
  const workspace = await getActiveWorkspace();
  if (!workspace) throw new Error("Unauthorized");

  const { user, organization } = workspace;

  const note = await prisma.candidateNote.create({
    data: {
      applicationId,
      userId: user.id,
      content,
    },
    include: {
      user: true,
    },
  });

  await prisma.activityLog.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      action: "NOTE_ADDED",
      details: `Added review comments to application dossier`,
    },
  });

  revalidatePath("/candidates");
  return { success: true, note };
}
