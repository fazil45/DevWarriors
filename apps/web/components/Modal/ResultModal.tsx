"use client";
import { useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";

export interface SubmissionResult {
  codeQualityScore: number;
  correctnessScore: number;
  totalScore: number;
  reasoning: string;
}

interface SubmissionResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: SubmissionResult | null;
}

function SubmissionResultModal({
  isOpen,
  onClose,
  result,
}: SubmissionResultModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !result) return null;

  const percentage = Math.round((result.totalScore / 100) * 100);
  const scoreColor =
    percentage >= 80
      ? "text-green-400"
      : percentage >= 50
        ? "text-orange-400"
        : "text-red-400";
  const ringColor =
    percentage >= 80
      ? "stroke-green-400"
      : percentage >= 50
        ? "stroke-orange-400"
        : "stroke-red-400";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-4 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-semibold text-white">
              Submission Result
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score ring */}
        <div className="flex flex-col items-center py-6">
          <div className="relative w-28 h-28">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                strokeWidth="8"
                className="stroke-zinc-700"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                className={ringColor}
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 * (1 - percentage / 100)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold ${scoreColor}`}>
                {result.totalScore}
              </span>
              <span className="text-xs text-zinc-500">/ 100</span>
            </div>
          </div>
        </div>

        {/* Sub-scores, if provided */}
        {(result.codeQualityScore !== undefined ||
          result.correctnessScore !== undefined) && (
          <div className="grid grid-cols-2 gap-3 px-6 pb-4">
            {result.codeQualityScore !== undefined && (
              <div className="bg-zinc-800 rounded-lg px-4 py-3 text-center">
                <p className="text-xs text-zinc-500 mb-1">Code Quality</p>
                <p className="text-lg font-semibold text-white">
                  {result.codeQualityScore}/40
                </p>
              </div>
            )}
            {result.correctnessScore !== undefined && (
              <div className="bg-zinc-800 rounded-lg px-4 py-3 text-center">
                <p className="text-xs text-zinc-500 mb-1">Correctness</p>
                <p className="text-lg font-semibold text-white">
                  {result.correctnessScore}/60
                </p>
              </div>
            )}
          </div>
        )}

        {/* Reasoning */}
        <div className="px-6 pb-6">
          <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
            Feedback
          </p>
          <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
            {result.reasoning}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-700">
          <button
            onClick={onClose}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubmissionResultModal;
