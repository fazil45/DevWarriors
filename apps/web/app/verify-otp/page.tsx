"use client";
import { Suspense } from "react";
import OTPVerificationCard from "../../components/OtpForm";

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-white">
          Loading...
        </div>
      }
    >
      <OTPVerificationCard />
    </Suspense>
  );
}
