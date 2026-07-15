"use server";

import prisma from "@/lib/prisma";
import { getActiveWorkspace } from "@/lib/roles";
import {
  profileSettingsSchema,
  orgSettingsSchema,
  notificationPreferencesSchema,
  ProfileSettingsInput,
  OrgSettingsInput,
  NotificationPreferencesInput,
} from "@/lib/validators/settings";
import { OrgRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateProfileSettingsAction(input: ProfileSettingsInput) {
  const workspace = await getActiveWorkspace();
  if (!workspace) throw new Error("Unauthorized");

  const { user } = workspace;
  const data = profileSettingsSchema.parse(input);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: data.name,
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateOrganizationSettingsAction(input: OrgSettingsInput) {
  const workspace = await getActiveWorkspace();
  if (!workspace) throw new Error("Unauthorized");

  const { user, organization, role } = workspace;

  if (role === OrgRole.HIRING_MANAGER) {
    throw new Error("Hiring Managers are not permitted to change organization details");
  }

  const data = orgSettingsSchema.parse(input);

  await prisma.organization.update({
    where: { id: organization.id },
    data: {
      name: data.name,
    },
  });

  await prisma.activityLog.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      action: "ORG_UPDATED",
      details: `Updated workspace organization name to: ${data.name}`,
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateNotificationSettingsAction(input: NotificationPreferencesInput) {
  const workspace = await getActiveWorkspace();
  if (!workspace) throw new Error("Unauthorized");

  const { user } = workspace;
  const data = notificationPreferencesSchema.parse(input);

  // Update notification preferences inside user metadata
  const currentMeta = (user.metadata as Record<string, any>) || {};
  await prisma.user.update({
    where: { id: user.id },
    data: {
      metadata: {
        ...currentMeta,
        notificationPreferences: data,
      },
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}
