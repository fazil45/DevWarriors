"use client";
import axios from "axios";
import { Loader2, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { env } from "../config/env";
import { toast } from "sonner";
import OtpInput from "./OTPInput";
import { useEffect, useState } from "react";

export default function OTPVerificationCard() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const RESEND_TIMER = 30;
  const [isActive, setIsActive] = useState(true);
  const [resendTimeLeft, setResendTimeLeft] = useState(RESEND_TIMER);
  const isButtonDisabled = resendTimeLeft > 0;

  useEffect(() => {
    if (!isActive || resendTimeLeft <= 0) return;

    const resendTimerId = setInterval(() => {
      setResendTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(resendTimerId);
  }, [resendTimeLeft, isActive]);

  const handleOtpVerification = async (otp: string) => {
    try {
      setLoading(true);
      const response = await axios.post(`${env.BACKEND_URL}/user/verify-otp`, {
        email,
        otp,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/signin");
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${env.BACKEND_URL}/user/resend-otp`, {
        email,
      });

      if (response.data.success) {
        setResendTimeLeft(RESEND_TIMER);
        setIsActive(true);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  console.log(email);
  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
        <div className="w-full max-w-md rounded-md border border-neutral-700 bg-neutral-900 p-8 shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/15">
              <ShieldCheck className="h-8 w-8 text-orange-400" />
            </div>

            <h1 className="text-2xl font-bold text-white">Verify your email</h1>

            <p className="mt-2 text-center text-sm text-neutral-400">
              We've sent a 6-digit verification code to
            </p>

            <p className="mt-1 font-medium text-orange-400">{email}</p>
          </div>

          {/* OTP Inputs */}
          <div className="mt-8 flex justify-center gap-3">
            <OtpInput onComplete={(otp) => handleOtpVerification(otp)} />
          </div>

          <button className="mt-8 w-full rounded-xl bg-linear-to-r from-orange-500 to-orange-400 py-3 font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/20">
            {loading ?  <Loader2 className="w-4 h-4 animate-spin"/> :"Verify OTP"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-400">Didn't receive the code?</p>

            <button
              onClick={resendOtp}
              className={`mt-2 text-sm font-medium  transition ${isButtonDisabled ? "cursor-none text-red-400" : "cursor-pointer text-orange-400"}`}
            >
              Resend OTP <span>{resendTimeLeft}s</span>
            </button>
          </div>
        </div>
      </div>
  );
}
