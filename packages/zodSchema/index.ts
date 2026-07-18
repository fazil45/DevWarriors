import z from "zod";

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
  contestStartTime: z.int(),
  contestEndTime: z.int(),
});

export const ChallengeSchema = z.object({
  title: z.string().nonempty("Required"),
  notionDocId: z.string().nonempty("Required"),
  contestId: z.string().nonempty("Required"),
  maxPoints: z.number(),
  index: z.number(),
});

export const contestSubmissionParamSchema = z.object({
  contestId: z.string().nonempty("Required"),
  challengeId: z.string().nonempty("Required"),
});

export const contestSubmissionBodySchema = z.object({
  points: z.number(),
  submission: z.string().nonempty("Required"),
});
