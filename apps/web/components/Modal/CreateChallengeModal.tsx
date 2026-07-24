import { useForm } from "@tanstack/react-form";
import React, { useEffect, useState } from "react";
import { FieldError } from "../FieldError";
import Input from "../Input";
import Button from "../Button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { env } from "../../config/env";

interface SubmissionResultModalProps {
  contestId: string;
  isOpen: boolean;
  onClose: () => void;
  onCreated: (contestId: string) => void;
}

const CreateChallengeModal = ({
  isOpen,
  onClose,
  contestId,
  onCreated,
}: SubmissionResultModalProps) => {
  const [loading, setLoading] = useState(false);

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
      notionDocId: "",
      challengePrompt: "",
      index: "",
      maxPoints: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setLoading(true);
        const response = await axios.post(`${env.BACKEND_URL}/contest/`);
      } catch (error) {}
    },
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-zinc-900 border border-zinc-700 rounded-md shadow-2xl">
        <div className="flex flex-col items-center justify-center p-4">
          <div className="text-3xl font-semibold text-center mb-4">
            Create Challenges
          </div>
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <form.Field name="title">
                {(field) => (
                  <>
                    <Input
                      label="Challenge Title"
                      placeholder="Do some challenges"
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
              <form.Field name="notionDocId">
                {(field) => (
                  <>
                    <Input
                      label="Enter your problem ID"
                      placeholder="Notion page id "
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
              <div className="flex items-center justify-center gap-4">
                <form.Field name="maxPoints">
                  {(field) => (
                    <>
                      <Input
                        label="Points"
                        placeholder="Enter points"
                        type="number"
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
                <form.Field name="index">
                  {(field) => (
                    <>
                      <Input
                        label="Challenge number"
                        placeholder="Enter challenge number"
                        type="number"
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
              <form.Field name="challengePrompt">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold">Enter Submission prompt</label>
                    <textarea
                      placeholder="Prompt to check the solution of challenge"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-10 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 min-h-30 outline-none"
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
              </form.Field>
              <Button type="submit" className="mt-2 h-11 w-full rounded-lg">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Create Challenge"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChallengeModal;
