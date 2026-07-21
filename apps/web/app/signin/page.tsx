"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "@tanstack/react-form";
import { UserSignUpSchema } from "@repo/zodschema";
import { env } from "../../config/env";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { toast } from "sonner";
import { FieldError } from "../../components/FieldError";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const Signin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const email = value.email;
      const password = value.password;

      try {
        setLoading(true);
        const response = await axios.post(`${env.BACKEND_URL}/user/signin`, {
          email,
          password,
        });

        queryClient.invalidateQueries({
          queryKey: ["current-user"],
        });

        if (response.data.success) {
          toast.success(response.data.message);
          router.push(`/dashboard`);
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
            {`Welcome to devWarriors`}
          </h1>
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
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
                    <div className="mb-8">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
