import { z } from "zod";
import { ApplicationStatus } from "@prisma/client";

export const candidateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
  resumeUrl: z.string().url("Must be a valid URL link to resume"),
  portfolioUrl: z.string().url("Invalid portfolio URL").optional().or(z.literal("")),
  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  jobId: z.string().uuid("Must select a valid job opening"),
  experience: z.string().min(1, "Experience details required"),
  skills: z.string().min(1, "At least one skill tag required"),
  rating: z.number().min(1).max(5).default(3),
  initialNote: z.string().optional(),
  status: z.nativeEnum(ApplicationStatus).default(ApplicationStatus.APPLIED),
});

export type CandidateInput = z.infer<typeof candidateSchema>;
