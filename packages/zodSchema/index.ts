import z, { email } from "zod"

export const UserSignUpSchema = z.object({
    firstName: z.string().min(3, "Minimum 3 characters required").nonempty("Required"),
    lastName: z.string().optional(),
    username:z.string().nonempty("Required"),
    email:z.string().email().nonempty("Required"),
    password:z.string().min(6, "Minimum 6 character required").nonempty("Required")
})

export const OTPVerificationSchema = z.object({
    email: z.string().email().nonempty("Required"),
    otp: z.string().nonempty("Required")
})

export const LoginSchema = z.object({
    email:z.string().email().nonempty("Required"),
    password:z.string().min(6, "Minimum 6 character required").nonempty("Required")
})