"use server";

import prisma from "@/lib/prisma";
import { getActiveWorkspace } from "@/lib/roles";
import { revalidatePath } from "next/cache";

export async function getNotificationsAction() {
  const workspace = await getActiveWorkspace();
  if (!workspace) return { success: false, notifications: [] };

  const { user } = workspace;

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  // Calculate unread count
  const unreadCount = await prisma.notification.count({
    where: {
      userId: user.id,
      readAt: null,
    },
  });

  // Convert Date objects to ISO strings for client compatibility
  const formattedNotifications = notifications.map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    link: n.link,
    readAt: n.readAt ? n.readAt.toISOString() : null,
    createdAt: n.createdAt.toISOString(),
  }));

  return { success: true, notifications: formattedNotifications, unreadCount };
}

export async function markNotificationReadAction(id: string) {
  const workspace = await getActiveWorkspace();
  if (!workspace) throw new Error("Unauthorized");

  await prisma.notification.update({
    where: { id },
    data: {
      readAt: new Date(),
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function markAllNotificationsReadAction() {
  const workspace = await getActiveWorkspace();
  if (!workspace) throw new Error("Unauthorized");

  const { user } = workspace;

  await prisma.notification.updateMany({
    where: {
      userId: user.id,
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}
