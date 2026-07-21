"use client";
import { Group, Panel, Separator } from "react-resizable-panels";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import axios from "axios";
import { env } from "../../../../config/env";
import { toast } from "sonner";
import { useParams } from "next/navigation";

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
  const [problemData, setProblemData] = useState<Problem>();
  const [code, setCode] = useState("// write your solution here\n");
  const [language, setLanguage] = useState("typescript");
  const [loading, setLoading] = useState(true);

  const getProblem = async ({ challengeId }: { challengeId: string }) => {
    try {
      const response = await axios.get<GetProblemResponse>(
        `${env.BACKEND_URL}/contest/challenge/${challengeId}/problem`,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setProblemData(response.data.problem);
        console.log(response.data.problem);
        console.log(problemData);
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
    console.log("problemData updated:", problemData);
  }, []);

  useEffect(() => {
    console.log("problemData is now:", problemData);
  }, [problemData]);

  async function handleSubmit() {
    const res = await fetch(`/api/challenge/${challengeId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submission: code }),
    });
    const data = await res.json();
    // show result — toast, side panel, whatever fits your UI
  }

  return (
    <div className="bg-gray-800">
      <div className="mt-16">
        <Group orientation="horizontal" className="min-h-screen">
          {/* Left: problem statement */}
          <Panel defaultSize={40} minSize={30}>
            <div className="h-full overflow-y-auto p-6 bg-zinc-900">
              {loading ? (
                <p>Loading problem...</p>
              ) : (
                <div className="h-full overflow-y-auto p-6 bg-white dark:bg-zinc-900">
                  <div className="flex flex-col items-start justify-between mb-4">
                    <div className="flex items-center justify-around w-full mb-4">
                      <h1 className="text-xl font-semibold">
                        Challenge:  {problemData?.title}
                      </h1>
                      <span className="text-sm text-zinc-500">
                        Total points:  {problemData?.maxPoints} pts
                      </span>
                    </div>
                    <div className="text-md  font-medium max-w-none">
                      <ReactMarkdown>
                        {problemData?.problemStatement}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Panel>

          <Separator className="w-1 bg-zinc-200 dark:bg-zinc-700 hover:bg-blue-500 transition-colors cursor-col-resize" />

          {/* Right: editor */}
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
                  Submit
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
  );
}

export default ChallengePage;
