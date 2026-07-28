"use client";
import React, { Suspense, use, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios, { Axios } from "axios";
import { useForm } from "@tanstack/react-form";
import { UserSignUpSchema } from "@repo/zodschema";
import { env } from "../../config/env";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { toast } from "sonner";
import { FieldError } from "../../components/FieldError";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!role) {
    return toast.error("Choose your role");
  }

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      console.log("first");
      const email = value.email;
      const firstName = value.firstName;
      const lastName = value.lastName;
      const username = value.username;
      const password = value.password;

      try {
        setLoading(true);
        const response = await axios.post(`${env.BACKEND_URL}/user/signup`, {
          email,
          password,
          firstName,
          lastName,
          username,
          role: role?.toUpperCase(),
        });

        if (response.data.success) {
          toast.success(response.data.message);
          router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
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
    },
    onSubmitInvalid: () => {
      toast.error("Please fix the highlighted fields.");
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md rounded-md border border-neutral-700 bg-neutral-900 p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            {`Create your account as ${role}`}
          </h1>
          <div>
            <Suspense fallback={<div>Loading...</div>}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <form.Field
                  name="firstName"
                  validators={{
                    onChange: UserSignUpSchema.shape.firstName,
                  }}
                  children={(field) => (
                    <div>
                      <Input
                        label="FirstName"
                        placeholder="Enter Firstname"
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <FieldError
                        errors={
                          field.state.meta.errors.filter(
                            (e) => e !== undefined,
                          ) as (string | { message: string })[]
                        }
                      />
                    </div>
                  )}
                />
                <form.Field
                  name="lastName"
                  validators={{
                    onChange: UserSignUpSchema.shape.lastName.unwrap(),
                  }}
                  children={(field) => (
                    <div>
                      <Input
                        label="Lastname"
                        placeholder="Enter Lastname"
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <FieldError
                        errors={
                          field.state.meta.errors.filter(
                            (e) => e !== undefined,
                          ) as (string | { message: string })[]
                        }
                      />
                    </div>
                  )}
                />
              </div>
              <div>
                <form.Field
                  name="username"
                  validators={{
                    onChange: UserSignUpSchema.shape.username,
                    onChangeAsyncDebounceMs: 500,
                    onChangeAsync: async ({ value }) => {
                      const res = await axios.get(
                        `${env.BACKEND_URL}/user/checkUsername`,
                        {
                          params: { username: value },
                        },
                      );

                      if (!res.data.available) {
                        return "username already taken";
                      }

                      return undefined;
                    },
                  }}
                  children={(field) => (
                    <div>
                      <Input
                        label="Username"
                        placeholder="Enter username"
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      {field.state.meta.isValidating && (
                        <p className="text-sm text-orange-400">
                          Checking username...
                        </p>
                      )}
                      {!field.state.meta.isValidating &&
                        field.state.value.length >= 3 &&
                        field.state.meta.errors.length === 0 && (
                          <p className="text-sm text-green-500">
                            ✓ Username available
                          </p>
                        )}
                    </div>
                  )}
                />
              </div>
              <div>
                <form.Field
                  name="email"
                  validators={{
                    onChange: UserSignUpSchema.shape.email,
                  }}
                  children={(field) => (
                    <div>
                      <Input
                        label="Email"
                        placeholder="Enter email"
                        type="email"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <FieldError
                        errors={
                          field.state.meta.errors.filter(
                            (e) => e !== undefined,
                          ) as (string | { message: string })[]
                        }
                      />
                    </div>
                  )}
                />
              </div>
              <div>
                <form.Field
                  name="password"
                  validators={{
                    onChange: UserSignUpSchema.shape.password,
                  }}
                  children={(field) => (
                    <div>
                      <Input
                        label="Password"
                        placeholder="Enter password"
                        type="password"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <FieldError
                        errors={
                          field.state.meta.errors.filter(
                            (e) => e !== undefined,
                          ) as (string | { message: string })[]
                        }
                      />
                    </div>
                  )}
                />
              </div>
              <div className="w-full">
                <Button className="w-full mt-2" type="submit">
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Signup"
                  )}
                </Button>
              </div>
            </form>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
