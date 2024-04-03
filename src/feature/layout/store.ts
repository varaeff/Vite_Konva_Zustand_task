import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Layout = {
  leftWidth: number;
  setLeftWidth: (width: number) => void;
  isLeftOpen: boolean;
  setIsLeftOpen: (isLeftOpen: boolean) => void;
};

export const useLayout = create<Layout>()(
  persist(
    (set) => ({
      isLeftOpen: true,
      setIsLeftOpen: (isLeftOpen: boolean) => set({ isLeftOpen }),
      leftWidth: 200,
      setLeftWidth: (width: number) => set({ leftWidth: width }),
    }),
    {
      name: "layout",
    }
  )
);
