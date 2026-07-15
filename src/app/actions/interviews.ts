"use server";

import prisma from "@/lib/prisma";
import { getActiveWorkspace } from "@/lib/roles";
import { interviewSchema, InterviewInput } from "@/lib/validators/interview";
import { InterviewStatus, NotificationType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createInterviewAction(input: InterviewInput) {
  const workspace = await getActiveWorkspace();
  if (!workspace) throw new Error("Unauthorized");

  const { user, organization } = workspace;

  const data = interviewSchema.parse(input);

  // Retrieve candidate details to customize notification messages
  const app = await prisma.application.findUnique({
    where: { id: data.applicationId },
    include: { candidate: true },
  });

  if (!app) throw new Error("Target candidate application not found");

  // Create Interview
  const interview = await prisma.interview.create({
    data: {
      applicationId: data.applicationId,
      title: data.title,
      scheduledAt: new Date(data.scheduledAt),
      duration: data.duration,
      type: data.type,
      videoLink: data.videoLink || null,
      status: data.status,
    },
  });

  // Assign Interviewers relations
  const interviewerPromises = data.interviewerIds.map(async (interviewerId) => {
    // Connect relation
    await prisma.interviewInterviewer.create({
      data: {
        interviewId: interview.id,
        userId: interviewerId,
      },
    });

    // Create Notification reminder
    await prisma.notification.create({
      data: {
        userId: interviewerId,
        type: NotificationType.INTERVIEW_SCHEDULED,
        title: "New Interview Scheduled",
        message: `You have been assigned to: "${data.title}" with candidate ${app.candidate.name} on ${new Date(data.scheduledAt).toLocaleString()}`,
        link: "/interviews",
      },
    });
  });

  await Promise.all(interviewerPromises);

  // Log Activity
  await prisma.activityLog.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      action: "INTERVIEW_CREATED",
      details: `Scheduled interview "${data.title}" for candidate: ${app.candidate.name}`,
    },
  });

  revalidatePath("/interviews");
  revalidatePath("/overview");
  return { success: true, interview };
}

export async function updateInterviewStatusAction(id: string, status: InterviewStatus) {
  const workspace = await getActiveWorkspace();
  if (!workspace) throw new Error("Unauthorized");

  const { user, organization } = workspace;

  const interview = await prisma.interview.update({
    where: { id },
    data: { status },
    include: {
      application: {
        include: { candidate: true },
      },
    },
  });

  await prisma.activityLog.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      action: "INTERVIEW_STATUS_UPDATED",
      details: `Updated interview status for ${interview.application.candidate.name} to ${status}`,
    },
  });

  revalidatePath("/interviews");
  revalidatePath("/overview");
  return { success: true, interview };
}

export async function deleteInterviewAction(id: string) {
  const workspace = await getActiveWorkspace();
  if (!workspace) throw new Error("Unauthorized");

  const { user, organization } = workspace;

  const interview = await prisma.interview.delete({
    where: { id },
    include: {
      application: {
        include: { candidate: true },
      },
    },
  });

  await prisma.activityLog.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      action: "INTERVIEW_DELETED",
      details: `Deleted scheduled interview for candidate: ${interview.application.candidate.name}`,
    },
  });

  revalidatePath("/interviews");
  revalidatePath("/overview");
  return { success: true };
}
