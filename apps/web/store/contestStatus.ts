import { create } from "zustand";

type ContestStatus = {
  submittedContests: Record<string, boolean>;
  setSubmitted: (contestId: string, value: boolean) => void;
  isContestSubmitted: (contestId: string) => boolean;
};

export const useContestStatus = create<ContestStatus>((set, get) => ({
  submittedContests: {},
  setSubmitted: (contestId, value) =>
    set((state) => ({
      submittedContests: { ...state.submittedContests, [contestId]: value },
    })),
  isContestSubmitted: (contestId) => !!get().submittedContests[contestId],
}));