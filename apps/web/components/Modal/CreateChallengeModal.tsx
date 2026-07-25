import { useForm } from "@tanstack/react-form";
import React, { useEffect, useState } from "react";
import { FieldError } from "../FieldError";
import Input from "../Input";
import Button from "../Button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { env } from "../../config/env";
import { toast } from "sonner";

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
      difficulty: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const title = value.title;
        const notionDocId = value.notionDocId;
        const maxPoints = Number(value.maxPoints);
        const index = Number(value.index);
        const challengePrompt = value.challengePrompt;
        const difficulty = value.difficulty

        setLoading(true);
        const response = await axios.post(
          `${env.BACKEND_URL}/challenge/createChallenges`,
          {
            title,
            notionDocId,
            maxPoints,
            contestId,
            index,
            challengePrompt,
            difficulty
          },
          {
            withCredentials: true,
          },
        );

        if (response.data.success) {
          toast.success(response.data.message);
          onCreated(contestId);
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
              className="flex flex-col gap-2"
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
                      label="Notion Problem ID"
                      placeholder="Notion page id"
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

              <div className="grid grid-cols-3 gap-4">
                <form.Field name="maxPoints">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <Input
                        label="Points"
                        placeholder="e.g. 100"
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
                    </div>
                  )}
                </form.Field>

                <form.Field name="index">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <Input
                        label="Challenge #"
                        placeholder="e.g. 1"
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
                    </div>
                  )}
                </form.Field>

                <form.Field name="difficulty">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-zinc-300">
                        Difficulty
                      </label>
                      <select
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="h-10 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none"
                      >
                        <option
                          value=""
                          disabled
                          className="bg-zinc-800 text-zinc-200"
                        >
                          Select difficulty
                        </option>
                        <option value="EASY" className="bg-zinc-800 text-white">
                          Easy
                        </option>
                        <option
                          value="MEDIUM"
                          className="bg-zinc-800 text-white"
                        >
                          Medium
                        </option>
                        <option value="HARD" className="bg-zinc-800 text-white">
                          Hard
                        </option>
                      </select>
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
              </div>

              <form.Field name="challengePrompt">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-zinc-300">
                      Submission Prompt
                    </label>
                    <textarea
                      placeholder="Prompt to check the solution of challenge"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="min-h-28 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none resize-none"
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
