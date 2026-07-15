import { z } from "zod";

export const profileSettingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional().nullable(),
});

export const orgSettingsSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
});

export const notificationPreferencesSchema = z.object({
  emailDigest: z.boolean().default(true),
  interviewReminders: z.boolean().default(true),
  candidateAlerts: z.boolean().default(true),
});

export type ProfileSettingsInput = z.infer<typeof profileSettingsSchema>;
export type OrgSettingsInput = z.infer<typeof orgSettingsSchema>;
export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>;
