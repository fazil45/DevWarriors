"use client";
import { Group, Panel, Separator } from "react-resizable-panels";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import axios from "axios";
import { env } from "../../../../config/env";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import SubmissionResultModal, {
  SubmissionResult,
} from "../../../../components/Modal/ResultModal";
import { Loader2 } from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Problem {
  title: string;
  problemStatement: string;
  maxPoints: number;
}

interface GetProblemResponse {
  success: boolean;
  problem: Problem;
  error?: string;
}

function ChallengePage() {
  const params = useParams();
  const challengeId = params.challengeId as string;
  const contestId = params.contestId as string;
  const [problemData, setProblemData] = useState<Problem>();
  const [code, setCode] = useState("// write your solution here\n");
  const [language, setLanguage] = useState("typescript");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [result, setResult] = useState<SubmissionResult>();

  const getProblem = async ({ challengeId }: { challengeId: string }) => {
    try {
      const response = await axios.get<GetProblemResponse>(
        `${env.BACKEND_URL}/challenge/${challengeId}/problem`,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setProblemData(response.data.problem);
      } else {
        toast.error("Refresh again to get problem");
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

  useEffect(() => {
    getProblem({ challengeId });
  }, []);

  async function handleSubmit() {
    try {
      setSubmitLoading(true);

      const response = await axios.post(
        `${env.BACKEND_URL}/challenge/submit/${challengeId}`,
        {
          submission: code,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        toast.success("Challenge Submit successfully");
        console.log(response.data.result);
        setResult(response.data.result);
        console.log(result);
        setShowModal(true);
        console.log(showModal);
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
      setSubmitLoading(false);
    }
  }

  return (
    <div className="bg-gray-800">
      <div className="hidden lg:block">
        <div className="mt-16">
          {result && (
            <SubmissionResultModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              result={result}
            />
          )}

          <Group orientation="horizontal" className="min-h-screen">
            <Panel defaultSize={40} minSize={30}>
              <div className="h-full overflow-y-auto p-6 bg-zinc-900">
                {loading ? (
                  <SkeletonTheme baseColor="#262626" highlightColor="#404040">
                    <div className="mx-auto max-w-4xl rounded-md border p-6">
                      <div className="border-b border-neutral-700 grid grid-cols-2">
                        <div className="">
                          <Skeleton width={"50%"} className="mb-2" />
                          <Skeleton
                            width={"90%"}
                            height={26}
                            className="mb-2"
                          />
                        </div>
                        <div className="rounded-md px-2 py-3">
                          <Skeleton width={"50%"} height={16} />
                          <Skeleton width={"40%"} height={28} />
                        </div>
                      </div>
                      <div>
                        <Skeleton
                          width={"100%"}
                          height={"35%"}
                          className="my-4"
                        />
                        <Skeleton
                          width={"100%"}
                          height={"20%"}
                          className="mb-2"
                        />
                        <Skeleton
                          width={"100%"}
                          height={"20%"}
                          className="mb-2"
                        />
                      </div>
                    </div>
                  </SkeletonTheme>
                ) : (
                  <div className="h-full overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-6 overflow-hidden">
                    <div className="mx-auto max-w-4xl rounded-md border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-orange-500">
                            Coding Challenge
                          </p>

                          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            {problemData?.title}
                          </h1>
                        </div>

                        <div className="rounded-md border border-orange-200 bg-orange-50 px-2 py-3 dark:border-orange-900 dark:bg-orange-950/40">
                          <p className="text-xs uppercase tracking-wide text-orange-600 dark:text-orange-400">
                            Max Points
                          </p>
                          <p className="text-2xl font-bold text-orange-500 text-center">
                            {problemData?.maxPoints}
                          </p>
                        </div>
                      </div>
                      <div className="mt-8">
                        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                          Problem Statement
                        </h2>

                        <div className="prose prose-zinc max-w-none dark:prose-invert prose-pre:rounded-xl prose-pre:border prose-pre:border-zinc-700 prose-pre:bg-zinc-950 prose-code:text-orange-500 text-wrap ">
                          <ReactMarkdown
                            components={{
                              pre: ({ children }) => (
                                <pre className="overflow-x-auto whitespace-pre-wrap wrap-break-words rounded-lg bg-zinc-900 p-4">
                                  {children}
                                </pre>
                              ),
                            }}
                          >
                            {problemData?.problemStatement}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Panel>

            <Separator className="w-1 bg-zinc-200 dark:bg-zinc-700 hover:bg-blue-500 transition-colors cursor-col-resize" />
            <Panel defaultSize={60} minSize={30}>
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 mb-1 bg-zinc-700">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="text-sm border rounded border-orange-400 cursor-pointer outline-none px-2 py-1"
                  >
                    <option
                      className="bg-neutral-800 text-white"
                      value="javascript"
                    >
                      JavaScript
                    </option>
                    <option
                      className="bg-neutral-800 text-white"
                      value="python"
                    >
                      Python
                    </option>
                    <option
                      className="bg-neutral-800 text-white"
                      value="typescript"
                    >
                      TypeScript
                    </option>
                  </select>
                  <button
                    onClick={handleSubmit}
                    className="bg-orange-600 text-white text-sm px-4 py-1.5 rounded hover:bg-orange-700 cursor-pointer"
                  >
                    {submitLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin transition-all" />
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>

                <div className="flex-1">
                  <Editor
                    height="100%"
                    language={language}
                    value={code}
                    onChange={(value) => setCode(value ?? "")}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              </div>
            </Panel>
          </Group>
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="mt-16">
          {result && (
            <SubmissionResultModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              result={result}
            />
          )}

          <Group orientation="horizontal" className="min-h-screen">
            <Panel defaultSize={40} minSize={30}>
              <div className="h-full overflow-y-auto p-6 bg-zinc-900">
                {loading ? (
                  <SkeletonTheme baseColor="#262626" highlightColor="#404040">
                    <div className="mx-auto max-w-4xl rounded-md border p-6">
                      <div className="border-b border-neutral-700 grid grid-cols-2">
                        <div className="">
                          <Skeleton width={"50%"} className="mb-2" />
                          <Skeleton
                            width={"90%"}
                            height={26}
                            className="mb-2"
                          />
                        </div>
                        <div className="rounded-md px-2 py-3">
                          <Skeleton width={"50%"} height={16} />
                          <Skeleton width={"40%"} height={28} />
                        </div>
                      </div>
                      <div>
                        <Skeleton
                          width={"100%"}
                          height={"35%"}
                          className="my-4"
                        />
                        <Skeleton
                          width={"100%"}
                          height={"20%"}
                          className="mb-2"
                        />
                        <Skeleton
                          width={"100%"}
                          height={"20%"}
                          className="mb-2"
                        />
                      </div>
                    </div>
                  </SkeletonTheme>
                ) : (
                  <div className="h-full overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-6 overflow-hidden">
                    <div className="mx-auto max-w-4xl rounded-md border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-orange-500">
                            Coding Challenge
                          </p>

                          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            {problemData?.title}
                          </h1>
                        </div>

                        <div className="rounded-md border border-orange-200 bg-orange-50 px-2 py-3 dark:border-orange-900 dark:bg-orange-950/40">
                          <p className="text-xs uppercase tracking-wide text-orange-600 dark:text-orange-400">
                            Max Points
                          </p>
                          <p className="text-2xl font-bold text-orange-500 text-center">
                            {problemData?.maxPoints}
                          </p>
                        </div>
                      </div>
                      <div className="mt-8">
                        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                          Problem Statement
                        </h2>

                        <div className="prose prose-zinc max-w-none dark:prose-invert prose-pre:rounded-xl prose-pre:border prose-pre:border-zinc-700 prose-pre:bg-zinc-950 prose-code:text-orange-500 text-wrap ">
                          <ReactMarkdown
                            components={{
                              pre: ({ children }) => (
                                <pre className="overflow-x-auto whitespace-pre-wrap wrap-break-words rounded-lg bg-zinc-900 p-4">
                                  {children}
                                </pre>
                              ),
                            }}
                          >
                            {problemData?.problemStatement}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Panel>

            <Separator className="w-1 bg-zinc-200 dark:bg-zinc-700 hover:bg-blue-500 transition-colors cursor-col-resize" />
            <Panel defaultSize={60} minSize={30}>
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 mb-1 bg-zinc-700">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="text-sm border rounded border-orange-400 cursor-pointer outline-none px-2 py-1"
                  >
                    <option
                      className="bg-neutral-800 text-white"
                      value="javascript"
                    >
                      JavaScript
                    </option>
                    <option
                      className="bg-neutral-800 text-white"
                      value="python"
                    >
                      Python
                    </option>
                    <option
                      className="bg-neutral-800 text-white"
                      value="typescript"
                    >
                      TypeScript
                    </option>
                  </select>
                  <button
                    onClick={handleSubmit}
                    className="bg-orange-600 text-white text-sm px-4 py-1.5 rounded hover:bg-orange-700 cursor-pointer"
                  >
                    {submitLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin transition-all" />
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>

                <div className="flex-1">
                  <Editor
                    height="100%"
                    language={language}
                    value={code}
                    onChange={(value) => setCode(value ?? "")}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              </div>
            </Panel>
          </Group>
        </div>
      </div>
      <div className="block lg:hidden">
        <div className="mt-16">
          {result && (
            <SubmissionResultModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              result={result}
            />
          )}
          <div className="h-full overflow-y-auto p-6 bg-zinc-900">
            {loading ? (
              <SkeletonTheme baseColor="#262626" highlightColor="#404040">
                <div className="mx-auto max-w-4xl rounded-md border p-6">
                  <div className="border-b border-neutral-700 grid grid-cols-2">
                    <div className="">
                      <Skeleton width={"50%"} className="mb-2" />
                      <Skeleton width={"90%"} height={26} className="mb-2" />
                    </div>
                    <div className="rounded-md px-2 py-3">
                      <Skeleton width={"50%"} height={16} />
                      <Skeleton width={"40%"} height={28} />
                    </div>
                  </div>
                  <div>
                    <Skeleton width={"100%"} height={"35%"} className="my-4" />
                    <Skeleton width={"100%"} height={"20%"} className="mb-2" />
                    <Skeleton width={"100%"} height={"20%"} className="mb-2" />
                  </div>
                </div>
              </SkeletonTheme>
            ) : (
              <div className="h-full overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-6 overflow-hidden">
                <div className="mx-auto max-w-4xl rounded-md border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex lg:flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-orange-500">
                        Coding Challenge
                      </p>

                      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        {problemData?.title}
                      </h1>
                    </div>

                    <div className="rounded-md border border-orange-200 bg-orange-50 p-1 lg:px-2 lg:py-3 dark:border-orange-900 dark:bg-orange-950/40">
                      <p className="text-xs uppercase tracking-wide text-orange-600 dark:text-orange-400">
                        Max Points
                      </p>
                      <p className="text-md font-bold text-orange-500 text-center">
                        {problemData?.maxPoints}
                      </p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                      Problem Statement
                    </h2>

                    <div className="prose prose-zinc max-w-none dark:prose-invert prose-pre:rounded-xl prose-pre:border prose-pre:border-zinc-700 prose-pre:bg-zinc-950 prose-code:text-orange-500 text-wrap ">
                      <ReactMarkdown
                        components={{
                          pre: ({ children }) => (
                            <pre className="overflow-x-auto whitespace-pre-wrap wrap-break-words rounded-lg bg-zinc-900 p-4">
                              {children}
                            </pre>
                          ),
                        }}
                      >
                        {problemData?.problemStatement}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 mb-1 bg-zinc-700">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm border rounded border-orange-400 cursor-pointer outline-none px-2 py-1"
              >
                <option
                  className="bg-neutral-800 text-white"
                  value="javascript"
                >
                  JavaScript
                </option>
                <option className="bg-neutral-800 text-white" value="python">
                  Python
                </option>
                <option
                  className="bg-neutral-800 text-white"
                  value="typescript"
                >
                  TypeScript
                </option>
              </select>
              <button
                onClick={handleSubmit}
                className="bg-orange-600 text-white text-sm px-4 py-1.5 rounded hover:bg-orange-700 cursor-pointer"
              >
                {submitLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin transition-all" />
                ) : (
                  "Submit"
                )}
              </button>
            </div>

            <div className="h-[60vh] zlg:h-full">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value ?? "")}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChallengePage;
