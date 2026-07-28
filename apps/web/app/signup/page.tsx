"use client";
import { Suspense } from "react";
import SignUpForm from "../../components/SignForm";

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-white">
          Loading...
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
