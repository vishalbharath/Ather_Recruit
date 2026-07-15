import { z } from "zod";
import { InterviewType, InterviewStatus } from "@prisma/client";

export const interviewSchema = z.object({
  applicationId: z.string().uuid("Must select a valid candidate application"),
  title: z.string().min(2, "Interview title must be at least 2 characters"),
  scheduledAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Must select a valid date and time",
  }),
  duration: z.number().min(15, "Duration must be at least 15 minutes").default(45),
  type: z.nativeEnum(InterviewType).default(InterviewType.VIDEO),
  videoLink: z.string().url("Must be a valid meeting URL").optional().or(z.literal("")),
  interviewerIds: z.array(z.string().uuid()).min(1, "Assign at least one interviewer"),
  status: z.nativeEnum(InterviewStatus).default(InterviewStatus.SCHEDULED),
});

export type InterviewInput = z.infer<typeof interviewSchema>;
