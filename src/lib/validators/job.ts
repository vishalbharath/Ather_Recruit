import { z } from "zod";
import { JobType, WorkMode, JobStatus } from "@prisma/client";

export const jobSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  department: z.string().min(2, "Department must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  type: z.nativeEnum(JobType),
  workMode: z.nativeEnum(WorkMode),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.string().min(10, "Requirements must be at least 10 characters"),
  salaryMin: z.number().nullable().optional(),
  salaryMax: z.number().nullable().optional(),
  currency: z.string().max(3).default("USD"),
  status: z.nativeEnum(JobStatus).default(JobStatus.DRAFT),
});

export type JobInput = z.infer<typeof jobSchema>;
