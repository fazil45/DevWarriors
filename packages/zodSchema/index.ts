import z from "zod/v4";

export const UserSignUpSchema = z.object({
  firstName: z
    .string()
    .min(3, "Minimum 3 characters required")
    .nonempty("Required"),
  lastName: z.string().optional(),
  username: z.string().nonempty("Required"),
  email: z.string().email().nonempty("Required"),
  password: z
    .string()
    .min(6, "Minimum 6 character required")
    .nonempty("Required"),
  role: z.enum(["CREATOR", "DEVELOPER"]),
});

export const OTPVerificationSchema = z.object({
  email: z.email().nonempty("Required"),
  otp: z.string().nonempty("Required"),
});

export const LoginSchema = z.object({
  email: z.string().email().nonempty("Required"),
  password: z
    .string()
    .min(6, "Minimum 6 character required")
    .nonempty("Required"),
});

export const ContestSchema = z.object({
  title: z.string().nonempty("Required"),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});

export type ContestFormInput = z.input<typeof ContestSchema>;
export type ContestData = z.infer<typeof ContestSchema>;  

export const ChallengeSchema = z.object({
  title: z.string().nonempty("Required"),
  notionDocId: z.string().nonempty("Required"),
  contestId: z.string().nonempty("Required"),
  challengePrompt:z.string().nonempty(""),
  maxPoints: z.number(),
  index: z.number(),
});

export const contestSubmissionParamSchema = z.object({
  contestId: z.string().nonempty("Required"),
  challengeId: z.string().nonempty("Required"),
});

export const contestIdParams = z.object({
  contestId:z.string().nonempty("Required")
})

export const ChallengeParamsSchema = z.object({
  challengeId: z.string(),
});

export const LeaderboardSchema = z.object({
  contestId:z.string().nonempty("Required")
})
