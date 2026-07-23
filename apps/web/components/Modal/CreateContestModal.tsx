import { ContestData, ContestFormInput, ContestSchema } from "@repo/zodschema";
import { useForm } from "@tanstack/react-form";
import React, { useEffect } from "react";
import Input from "../Input";
import Button from "../Button";
import { FieldError } from "../FieldError";
import { toast } from "sonner";
import axios from "axios";
import { env } from "../../config/env";

interface SubmissionResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated:() => void
}

const CreateContestModal = ({
  isOpen,
  onClose,
  onCreated
}: SubmissionResultModalProps) => {

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const form = useForm({
    defaultValues: {
      title: "",
      startTime: "",
      endTime: "",
    } satisfies ContestFormInput,
    onSubmit: async ({ value }) => {
      const parsed = ContestSchema.safeParse(value);

      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message ?? "Invalid contest data");
        return;
      }

      const contestData: ContestData = parsed.data;

      try {
        const response = await axios.post(
          `${env.BACKEND_URL}/contest/createContest`,
          contestData,
          {
            withCredentials: true,
          },
        );

        if (response.data.success) {
          toast.success("Contest created");
          onCreated()
        } else {
          toast.error(response.data.error);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.error || "Something went wrong");
        } else {
          toast.error("Something went wrong");
        }
      }
    },
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-4 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center justify-center p-4">
          <div className="text-3xl font-semibold text-center mb-4">
            Create Contest
          </div>
          <div>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              {/* Title */}
              <form.Field name="title">
                {(field) => (
                  <>
                    <Input
                      label="Contest Title"
                      placeholder="Weekly Backend Challenge"
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-10 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                    />
                    <FieldError
                      errors={
                        field.state.meta.errors.filter(
                          (e) => e !== undefined,
                        ) as (string | { message: string })[]
                      }
                    />
                  </>
                )}
              </form.Field>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <form.Field name="startTime">
                  {(field) => (
                    <>
                      <Input
                        label="Starts"
                        type="datetime-local"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="h-10 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                      />
                      <FieldError
                        errors={
                          field.state.meta.errors.filter(
                            (e) => e !== undefined,
                          ) as (string | { message: string })[]
                        }
                      />
                    </>
                  )}
                </form.Field>

                <form.Field name="endTime">
                  {(field) => (
                    <>
                      <Input
                        label="Ends"
                        type="datetime-local"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="h-10 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                      />
                      <FieldError
                        errors={
                          field.state.meta.errors.filter(
                            (e) => e !== undefined,
                          ) as (string | { message: string })[]
                        }
                      />
                    </>
                  )}
                </form.Field>
              </div>

              <Button type="submit" className="mt-2 h-11 w-full rounded-lg">
                Create Contest
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestModal;
