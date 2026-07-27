import { create } from "zustand";

type ModalState = {
  showSideBar: boolean;
  setShowSideBar: () => void;
};

export const useSideBar = create<ModalState>((set) => ({
  showSideBar: false,
  setShowSideBar: () => set((state) => ({ showSideBar: !state.showSideBar })),
}));
