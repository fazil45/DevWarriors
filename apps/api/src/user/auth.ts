import { type Response, CookieOptions, Request } from "express";
import {
  LoginSchema,
  OTPVerificationSchema,
  UserSignUpSchema,
} from "@repo/zodschema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma, prisma } from "@repo/db/client";
import { generateOTP } from "../utils/generateOtp";
import { hashOTP } from "../utils/hashOtp";
import { sendOtp } from "../utils/sendOtp";
import { JWT_SECRET } from "../config/index";
import { CookieOption } from "../config/cookie-config";

const HASHED_COUNT = 10;

export const register = async (req: Request, res: Response) => {
  const parsedSignupData = UserSignUpSchema.safeParse(req.body);

  if (!parsedSignupData.success) {
    return res.status(409).json({ success: false, error: "Invalid inputs" });
  }

  const { firstName, lastName, username, password, role } =
    parsedSignupData.data;
  const email = parsedSignupData.data.email.toLowerCase().trim();

  const checkUserExistAlready = await prisma.user.findUnique({
    where: { email },
  });

  if (checkUserExistAlready) {
    return res
      .status(409)
      .json({ success: false, error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, HASHED_COUNT);
  const otp = generateOTP();
  const otpHash = hashOTP(otp);

  try {
    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          firstName,
          lastName: lastName ? lastName : "",
          username,
          email,
          password: hashedPassword,
          role: role,
          emailVerified: false,
        },
      });

      await tx.oTPVerification.create({
        data: {
          userId: createdUser.id,
          otpHash,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      return createdUser;
    });

    await sendOtp(user.email, otp);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res
        .status(409)
        .json({ success: false, error: "Email already exists" });
    }

    return res
      .status(500)
      .json({ success: false, error: "Something went wrong" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const parsedOTPVerifyData = OTPVerificationSchema.safeParse(req.body);

  if (!parsedOTPVerifyData.success) {
    return res.status(409).json({ success: false, error: "Invalid inputs" });
  }

  const email = parsedOTPVerifyData.data.email.toLowerCase().trim();
  const otp = parsedOTPVerifyData.data.otp.trim();

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const verification = await prisma.oTPVerification.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!verification) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    const OTPExpiryTime = verification.expiresAt;

    if (OTPExpiryTime < new Date()) {
      return res.status(409).json({
        success: false,
        error: "OTP expire",
      });
    }

    const otpHash = hashOTP(otp);

    if (verification.attempts >= 5) {
      await prisma.user.delete({
        where: {
          email,
        },
      });

      return res.status(200).json({ success: false, error: "User deleted" });
    }

    if (verification.otpHash != otpHash) {
      await prisma.oTPVerification.update({
        where: {
          userId: user.id,
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
        },
      });

      await tx.oTPVerification.delete({
        where: { userId: user.id },
      });
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res
        .status(409)
        .json({ success: false, error: "Email already exists" });
    }

    return res
      .status(500)
      .json({ success: false, error: "Something went wrong" });
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;

    if (!email) {
      return res.status(403).json({ success: false, error: "invalid inputs" });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(403).json({ success: false, error: "user not found" });
    }

    const otp = generateOTP();

    await prisma.oTPVerification.upsert({
      where: {
        userId: user.id,
      },

      update: {
        otpHash: hashOTP(otp),
        attempts: 0,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },

      create: {
        userId: user.id,
        otpHash: hashOTP(otp),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendOtp(user.email, otp);

    return res.json({
      success: true,
      message: "OTP sent",
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res
        .status(409)
        .json({ success: false, error: "Email already exists" });
    }

    return res
      .status(500)
      .json({ success: false, error: "Something went wrong" });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const parsedLoginData = LoginSchema.safeParse(req.body);

    if (!parsedLoginData.success) {
      return res.status(409).json({ success: true, error: "Invalid input" });
    }

    const email = parsedLoginData.data.email.toLowerCase().trim();
    const password = parsedLoginData.data.password;

    const userExist = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!userExist) {
      return res
        .status(404)
        .json({ success: false, error: "Create an account" });
    }

    if (!userExist.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Verify your email first.",
      });
    }

    const hashedPassword = await bcrypt.compare(password, userExist.password);

    if (!hashedPassword) {
      return res.status(403).json({ success: false, error: "Invalid inputs" });
    }

    const token = jwt.sign({ id: userExist.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res
      .status(200)
      .cookie("token", token, CookieOption)
      .json({ success: true, message: "Login successfully" });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res
        .status(409)
        .json({ success: false, error: "Email already exists" });
    }

    return res
      .status(500)
      .json({ success: false, error: "Something went wrong" });
  }
};

export const checkUsername = async (req: Request, res: Response) => {
  try {
    const username = req.query.username as string;

    if (!username) {
      return res.status(400).json({
        available: false,
        message: "Username is required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    return res.status(200).json({
      available: !existingUser,
    });
  } catch {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
