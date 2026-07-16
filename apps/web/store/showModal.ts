import { create } from "zustand";

type ModalState = {
  showModal: boolean;
  setShowModal: () => void;
};

export const useModal = create<ModalState>((set) => ({
  showModal: false,
  setShowModal: () => set((state) => ({showModal: !state.showModal})),
}));
